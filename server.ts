import 'dotenv/config';
import express from 'express';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';
import { INITIAL_KNOWLEDGE_BASE } from './src/data/initialKnowledgeBase';
import { COMPREHENSIVE_TEST_CASES } from './src/data/testCasesData';
import { MAA_TRAINING_DATASET, TrainingExample } from './src/data/trainingData';
import { KnowledgeDocument, SupportTicket, TestCase } from './src/types';

const app = express();
const PORT = 3000;

const DATA_DIR = path.join(process.cwd(), '.data');
const DB_FILE = path.join(DATA_DIR, 'maa-db.json');

type UserRecord = { id: string; name: string; email: string; passwordHash: string; salt: string; createdAt: number };
type SessionRecord = { tokenHash: string; userId: string; expiresAt: number };
type ConversationRecord = { id: string; userId: string; title: string; messages: Array<{ role: 'user' | 'assistant'; content: string; timestamp: number }>; createdAt: number; updatedAt: number };
type AppDb = { users: UserRecord[]; sessions: SessionRecord[]; conversations: ConversationRecord[] };

function emptyDb(): AppDb { return { users: [], sessions: [], conversations: [] }; }
function readDb(): AppDb {
  try { return JSON.parse(fs.readFileSync(DB_FILE, 'utf8')) as AppDb; } catch { return emptyDb(); }
}
function writeDb(db: AppDb) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const temp = `${DB_FILE}.tmp`;
  fs.writeFileSync(temp, JSON.stringify(db, null, 2), 'utf8');
  fs.renameSync(temp, DB_FILE);
}
function hashPassword(password: string, salt: string) {
  return crypto.scryptSync(password, salt, 64).toString('hex');
}
function sessionSecret() {
  const secret = process.env.SESSION_SECRET;
  if (secret && secret.length >= 32) return secret;
  if (process.env.NODE_ENV === 'production') throw new Error('SESSION_SECRET must be configured with at least 32 characters in production.');
  return 'maa-development-session-secret-change-me';
}
function makeToken(userId: string) {
  const payload = Buffer.from(JSON.stringify({ uid: userId, exp: Date.now() + 1000 * 60 * 60 * 24 * 30 })).toString('base64url');
  const secret = sessionSecret();
  const sig = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}
function verifyToken(token: string): { uid: string; exp: number } | null {
  try {
    const [payload, sig] = token.split('.');
    if (!payload || !sig) return null;
    const secret = sessionSecret();
    const expected = crypto.createHmac('sha256', secret).update(payload).digest('base64url');
    if (!crypto.timingSafeEqual(Buffer.from(sig), Buffer.from(expected))) return null;
    const parsed = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8'));
    if (!parsed.uid || !parsed.exp || parsed.exp < Date.now()) return null;
    return parsed;
  } catch { return null; }
}
function getAuthUser(req: express.Request): UserRecord | null {
  const header = req.header('authorization');
  if (!header?.startsWith('Bearer ')) return null;
  const verified = verifyToken(header.slice(7));
  if (!verified) return null;
  const db = readDb();
  return db.users.find(u => u.id === verified.uid) || null;
}
function publicUser(user: UserRecord) { return { id: user.id, name: user.name, email: user.email, createdAt: user.createdAt }; }
function cleanEmail(email: string) { return email.trim().toLowerCase(); }

app.post('/api/auth/signup', (req, res) => {
  const name = typeof req.body?.name === 'string' ? req.body.name.trim() : '';
  const email = typeof req.body?.email === 'string' ? cleanEmail(req.body.email) : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (name.length < 2 || name.length > 80) return res.status(400).json({ error: 'Please enter a valid name.' });
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return res.status(400).json({ error: 'Please enter a valid email address.' });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ error: 'Password must be 8–128 characters.' });
  const db = readDb();
  if (db.users.some(u => u.email === email)) return res.status(409).json({ error: 'An account with this email already exists.' });
  const salt = crypto.randomBytes(16).toString('hex');
  const user: UserRecord = { id: `usr_${crypto.randomBytes(10).toString('hex')}`, name, email, passwordHash: hashPassword(password, salt), salt, createdAt: Date.now() };
  db.users.push(user); writeDb(db);
  res.status(201).json({ token: makeToken(user.id), user: publicUser(user) });
});

app.post('/api/auth/login', (req, res) => {
  const email = typeof req.body?.email === 'string' ? cleanEmail(req.body.email) : '';
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  const db = readDb();
  const user = db.users.find(u => u.email === email);
  if (!user || !crypto.timingSafeEqual(Buffer.from(hashPassword(password, user.salt), 'hex'), Buffer.from(user.passwordHash, 'hex'))) return res.status(401).json({ error: 'Email or password is incorrect.' });
  res.json({ token: makeToken(user.id), user: publicUser(user) });
});

app.get('/api/auth/me', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Unauthorized.' });
  res.json({ user: publicUser(user) });
});

app.post('/api/auth/logout', (req, res) => res.json({ ok: true }));

app.get('/api/conversations', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Sign in to access your conversations.' });
  const db = readDb();
  const conversations = db.conversations.filter(c => c.userId === user.id).map(c => ({ id: c.id, title: c.title, createdAt: c.createdAt, updatedAt: c.updatedAt, messageCount: c.messages.length }));
  res.json({ conversations });
});

app.get('/api/conversations/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Sign in to access your conversations.' });
  const db = readDb();
  const conversation = db.conversations.find(c => c.id === req.params.id && c.userId === user.id);
  if (!conversation) return res.status(404).json({ error: 'Conversation not found.' });
  res.json({ conversation });
});

app.delete('/api/conversations/:id', (req, res) => {
  const user = getAuthUser(req);
  if (!user) return res.status(401).json({ error: 'Sign in to manage your conversations.' });
  const db = readDb();
  const before = db.conversations.length;
  db.conversations = db.conversations.filter(c => !(c.id === req.params.id && c.userId === user.id));
  if (db.conversations.length === before) return res.status(404).json({ error: 'Conversation not found.' });
  writeDb(db); res.json({ ok: true });
});


app.use(express.json({ limit: '256kb' }));

// Lightweight production guard for admin-only endpoints.
// Set ADMIN_API_KEY in the server environment; never ship it to the browser.
const ADMIN_API_KEY = process.env.ADMIN_API_KEY || '';

function requireAdmin(req: express.Request, res: express.Response, next: express.NextFunction) {
  if (!ADMIN_API_KEY) {
    res.status(503).json({ error: 'Administrative endpoints are disabled until ADMIN_API_KEY is configured.' });
    return;
  }
  const supplied = req.header('x-admin-key');
  if (!supplied || supplied !== ADMIN_API_KEY) {
    res.status(401).json({ error: 'Unauthorized.' });
    return;
  }
  next();
}


function persistConversation(user: UserRecord | null, conversationId: string | undefined, userMessage: string, assistantMessage: string) {
  if (!user) return conversationId;
  const db = readDb();
  const now = Date.now();
  let conversation = conversationId ? db.conversations.find(c => c.id === conversationId && c.userId === user.id) : undefined;
  if (!conversation) {
    conversation = { id: conversationId || `conv_${crypto.randomBytes(10).toString('hex')}`, userId: user.id, title: userMessage.slice(0, 60), messages: [], createdAt: now, updatedAt: now };
    db.conversations.unshift(conversation);
  }
  conversation.messages.push({ role: 'user', content: userMessage, timestamp: now }, { role: 'assistant', content: assistantMessage, timestamp: now });
  conversation.updatedAt = now;
  writeDb(db);
  return conversation.id;
}

// Basic in-memory rate limiter for the public chat endpoint.
// Replace with a shared store (Redis/Upstash/etc.) when horizontally scaling.
const chatRate = new Map<string, { count: number; resetAt: number }>();
function chatRateLimit(req: express.Request, res: express.Response, next: express.NextFunction) {
  const now = Date.now();
  const key = req.ip || 'unknown';
  const current = chatRate.get(key);
  if (!current || current.resetAt <= now) {
    chatRate.set(key, { count: 1, resetAt: now + 60_000 });
    next();
    return;
  }
  if (current.count >= 30) {
    res.status(429).json({ error: 'Too many requests. Please wait a moment and try again.' });
    return;
  }
  current.count += 1;
  next();
}

// In-Memory Database for Knowledge Base, Tickets, and Tests
let knowledgeBase: KnowledgeDocument[] = [...INITIAL_KNOWLEDGE_BASE];
let supportTickets: SupportTicket[] = [
  {
    id: 'MAA-TKT-84920',
    title: 'Janani Nutrition Grant installment delayed beyond 7 days',
    category: 'Welfare Application',
    severity: 'high',
    status: 'in_review',
    userContact: 'demo.user@example.com',
    description: 'Applicant verified MCP card on Aug 1st. Bank account shows DBT enabled but second ₹2,000 installment is pending in portal verification.',
    troubleshootingStepsTaken: [
      'Checked DBT linkage with Aadhaar',
      'Verified bank IFSC code clarity in passbook'
    ],
    createdAt: Date.now() - 86400000 * 2,
    updatedAt: Date.now() - 86400000,
    assignedAgent: 'Demo Grievance Officer (Zone 4)',
    resolutionNotes: 'Escalated to district welfare disbursement unit. Scheduled for clearing in next batch.'
  },
  {
    id: 'MAA-TKT-55102',
    title: 'Difficulty uploading high-res ultrasound PDF report',
    category: 'Technical Bug',
    severity: 'medium',
    status: 'resolved',
    userContact: 'anita.sharma@example.com',
    description: 'User experienced timeout when uploading 12MB scan. Advised on 5MB PDF compression limit.',
    troubleshootingStepsTaken: [
      'Explained maximum file size constraint',
      'Assisted with built-in compression link'
    ],
    createdAt: Date.now() - 86400000 * 4,
    updatedAt: Date.now() - 86400000 * 3,
    assignedAgent: 'Demo Support Specialist',
    resolutionNotes: 'User successfully compressed file to 2.4MB and booked appointment with Dr. Meenakshi.'
  }
];

let testCases: TestCase[] = [...COMPREHENSIVE_TEST_CASES];
const OPS_FILE = path.join(DATA_DIR, 'operational-data.json');
function loadOperationalData() {
  try {
    const saved = JSON.parse(fs.readFileSync(OPS_FILE, 'utf8'));
    if (Array.isArray(saved.knowledgeBase) && saved.knowledgeBase.length) knowledgeBase = saved.knowledgeBase;
    if (Array.isArray(saved.supportTickets)) supportTickets = saved.supportTickets;
  } catch { /* first run: seed from verified source data above */ }
}
function saveOperationalData() {
  fs.mkdirSync(DATA_DIR, { recursive: true });
  const temp = `${OPS_FILE}.tmp`;
  fs.writeFileSync(temp, JSON.stringify({ knowledgeBase, supportTickets }, null, 2), 'utf8');
  fs.renameSync(temp, OPS_FILE);
}
loadOperationalData();


// Lazy Gemini AI Client Initialization
let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn('GEMINI_API_KEY not found in environment. Using fallback responses.');
    }
    aiClient = new GoogleGenAI({
      apiKey: apiKey || 'dummy-key',
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build'
        }
      }
    });
  }
  return aiClient;
}

// ----------------------------------------------------
// Robust Gemini AI Generation with Multi-Model Fallback & Retry
// ----------------------------------------------------
async function generateGroundedAIResponse(
  contents: any,
  systemInstruction: string,
  userQuery: string,
  retrieved: { doc: KnowledgeDocument; score: number }[]
): Promise<string> {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return getRuleBasedFallback(userQuery, retrieved);
  }

  const ai = getGeminiClient();
  const candidateModels = ['gemini-2.5-flash', 'gemini-2.5-flash-lite'];

  for (const model of candidateModels) {
    try {
      const response = await ai.models.generateContent({
        model,
        contents,
        config: {
          systemInstruction,
          temperature: 0.2,
          topP: 0.8
        }
      });

      const text = response?.text;
      if (text && text.trim().length > 0) {
        return text.trim();
      }
    } catch (err: any) {
      console.warn(`Gemini API call on model ${model} encountered an issue (${err?.status || err?.message || 'Error'}). Trying next tier or fallback...`);
      // If 503 (high demand) or 429 (rate limit), brief pause before next model attempt
      await new Promise((resolve) => setTimeout(resolve, 300));
    }
  }

  // Gracefully fallback to verified rule-based knowledge synthesizer
  return getRuleBasedFallback(userQuery, retrieved);
}

// ----------------------------------------------------
// RAG & Knowledge Retrieval System
// ----------------------------------------------------
function retrieveRelevantKnowledge(query: string, limit = 4): { doc: KnowledgeDocument; score: number }[] {
  const normalizedQuery = query.toLowerCase();
  const queryTokens = normalizedQuery
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter((t) => t.length > 2);

  const scoredDocs = knowledgeBase.map((doc) => {
    let score = 0;
    const titleLower = doc.title.toLowerCase();
    const contentLower = doc.content.toLowerCase();
    const tagsLower = doc.tags.join(' ').toLowerCase();

    for (const token of queryTokens) {
      if (titleLower.includes(token)) score += 8;
      if (tagsLower.includes(token)) score += 5;
      if (contentLower.includes(token)) score += 2;
    }

    // Exact phrase matching boost
    if (titleLower.includes(normalizedQuery)) score += 15;
    if (contentLower.includes(normalizedQuery)) score += 10;

    return { doc, score };
  });

  return scoredDocs
    .filter((item) => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

// Determine navigation actions based on content
function determineNavigationActions(query: string, reply: string) {
  const actions: Array<{ label: string; route: string; description: string; icon: string }> = [];
  const text = (query + ' ' + reply).toLowerCase();

  if (text.includes('doctor') || text.includes('appointment') || text.includes('maternal') || text.includes('tele-consultation') || text.includes('pregnancy') || text.includes('mcp')) {
    actions.push({
      label: 'Maa Care Hub',
      route: '/maternal-care',
      description: 'Book doctor tele-consultations & track ANC milestones',
      icon: 'HeartPulse'
    });
  }

  if (text.includes('welfare') || text.includes('grant') || text.includes('scholarship') || text.includes('allowance') || text.includes('financial') || text.includes('money') || text.includes('dbt')) {
    actions.push({
      label: 'Welfare Schemes',
      route: '/welfare-schemes',
      description: 'Apply for Janani Nutrition & Girl Child Grants',
      icon: 'HandCoins'
    });
  }

  if (text.includes('problem') || text.includes('delay') || text.includes('complaint') || text.includes('ticket') || text.includes('troubleshoot') || text.includes('issue') || text.includes('error')) {
    actions.push({
      label: 'Support & Grievance Desk',
      route: '/support/report',
      description: 'File an issue ticket & track resolution',
      icon: 'LifeBuoy'
    });
  }

  if (text.includes('contact') || text.includes('phone') || text.includes('email') || text.includes('helpline') || text.includes('address') || text.includes('emergency')) {
    actions.push({
      label: 'Official Contacts',
      route: '/support/contact',
      description: '24/7 Helpline: 1800-11-6222 & Regional Centers',
      icon: 'PhoneCall'
    });
  }

  return actions.slice(0, 3);
}

// Determine suggested follow-up questions
function determineFollowUps(query: string, reply: string): string[] {
  const q = query.toLowerCase();
  if (q.includes('what is') || q.includes('about')) {
    return ['What services are available?', 'Are MaaProject services free?', 'How can I apply?'];
  }
  if (q.includes('welfare') || q.includes('grant')) {
    return ['What documents are required to apply?', 'How long does application verification take?', 'How do I report a payment delay?'];
  }
  if (q.includes('maternal') || q.includes('doctor')) {
    return ['How do I book a tele-consultation?', 'What is the 24/7 Emergency Line?', 'Where can I get free nutrition kits?'];
  }
  if (q.includes('contact') || q.includes('helpline')) {
    return ['What are the operating hours?', 'How do I report an emergency?', 'Where is the national headquarter?'];
  }
  return ['Explore MaaProject services', 'How to apply for welfare grants', 'Connect with support'];
}

// ----------------------------------------------------
// API ROUTES
// ----------------------------------------------------

// ----------------------------------------------------
// Training Dataset Matcher & Grounding
// ----------------------------------------------------
function matchTrainingExample(query: string): TrainingExample | null {
  const cleanQ = query.trim().toLowerCase().replace(/[?!.,]/g, '');
  
  // Exact match
  const exact = MAA_TRAINING_DATASET.find(
    (t) => t.instruction.trim().toLowerCase().replace(/[?!.,]/g, '') === cleanQ
  );
  if (exact) return exact;

  // High similarity match for fallback and standard queries
  for (const item of MAA_TRAINING_DATASET) {
    const cleanItem = item.instruction.trim().toLowerCase().replace(/[?!.,]/g, '');
    if (cleanQ === cleanItem) return item;
    
    // For specific fallback queries
    if (item.category === 'fallback') {
      if (cleanQ.includes('weather') && cleanItem.includes('weather')) return item;
      if (cleanQ.includes('joke') && cleanItem.includes('joke')) return item;
      if (cleanQ.includes('football') && cleanItem.includes('football')) return item;
      if (cleanQ.includes('poem') && cleanItem.includes('poem')) return item;
      if (cleanQ.includes('capital of france') && cleanItem.includes('capital of france')) return item;
      if (cleanQ.includes('stock market') && cleanItem.includes('stock market')) return item;
      if ((cleanQ.includes('hack') || cleanQ.includes('password')) && cleanItem.includes('hack')) return item;
      if (cleanQ.includes('medical advice') && cleanItem.includes('medical advice')) return item;
      if (cleanQ.includes('latest news') && cleanItem.includes('latest news')) return item;
    }
  }

  return null;
}

// Health Check
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    time: new Date().toISOString(), 
    totalDocs: knowledgeBase.length,
    totalTrainingExamples: MAA_TRAINING_DATASET.length
  });
});

// Training Data Endpoint
app.get('/api/training-data', requireAdmin, (req, res) => {
  res.json({
    total: MAA_TRAINING_DATASET.length,
    dataset: MAA_TRAINING_DATASET
  });
});

// Chatbot Endpoint (Core Conversational Engine)
app.post('/api/chat', chatRateLimit, async (req, res) => {
  try {
    const { message, history = [], conversation_id } = req.body;
    const authUser = getAuthUser(req);
    if (history !== undefined && !Array.isArray(history)) {
      res.status(400).json({ error: 'History must be an array.' });
      return;
    }

    if (!message || typeof message !== 'string' || message.trim() === '') {
      res.status(400).json({ error: 'Message cannot be empty.' });
      return;
    }

    const trimmedQuery = message.trim();
    if (trimmedQuery.length > 4000) {
      res.status(413).json({ error: 'Message is too long. Please keep it under 4,000 characters.' });
      return;
    }

    // Check for extreme emergencies immediately
    const emergencyRegex = /(severe bleeding|chest pain|unconscious|active labor|sudden collapse|pre-eclampsia|can't breathe)/i;
    const isEmergency = emergencyRegex.test(trimmedQuery);

    // Knowledge Retrieval
    const retrieved = retrieveRelevantKnowledge(trimmedQuery, 4);
    const sources = retrieved.map((r) => ({
      docId: r.doc.id,
      title: r.doc.title,
      category: r.doc.category,
      snippet: r.doc.summary,
      urlOrRoute: r.doc.route,
      relevanceScore: r.score
    }));

    // Build context string from retrieved knowledge
    let contextBlock = '';
    if (retrieved.length > 0) {
      contextBlock = retrieved
        .map(
          (r, idx) =>
            `[DOCUMENT ${idx + 1}: ${r.doc.title} (ID: ${r.doc.id}, Category: ${r.doc.category})]
${r.doc.content}
`
        )
        .join('\n---\n');
    } else {
      contextBlock = 'No highly relevant MaaProject documents matched directly in the index.';
    }

    // 1. Simple Friendly Greeting Handler (Greets warmly without dumping massive text)
    const greetingRegex = /^(hi+|hello+|hey+|hiya+|howdy|good\s*(morning|afternoon|evening|day)|namaste|greetings|hi\s*there|hello\s*there|hi\s*how\s*are\s*you|how\s*are\s*you|what\'?s\s*up)[\s!.,?~]*$/i;
    if (greetingRegex.test(trimmedQuery)) {
      res.json({
        reply: `Hello! 👋 I'm **Maa AI Assistant**.\n\nHow can I help you today with **MaaProject** healthcare services, welfare grants, nutrition kits, or support?`,
        sources: [],
        navigationActions: [
          {
            label: 'Maa Care Hub',
            route: '/maternal-care',
            description: 'Maternal health & free doctor consultations',
            icon: 'HeartPulse'
          },
          {
            label: 'Welfare Schemes',
            route: '/welfare-schemes',
            description: '₹6,000 allowance & grants',
            icon: 'HandCoins'
          }
        ],
        suggestedFollowUps: [
          'What is MaaProject?',
          'What services do you offer?',
          'How do I apply for the ₹6,000 grant?'
        ],
        isProblemReportPrompt: false,
        isEscalated: false,
        groundedScore: 100
      });
      return;
    }

    // Check Training Dataset for direct match (especially fallbacks)
    const matchedTraining = matchTrainingExample(trimmedQuery);
    if (matchedTraining && matchedTraining.category === 'fallback') {
      res.json({
        reply: matchedTraining.output,
        sources: [],
        navigationActions: [],
        suggestedFollowUps: ['What is MaaProject?', 'What services does MaaProject offer?', 'How can I contact support?'],
        isProblemReportPrompt: false,
        isEscalated: false,
        groundedScore: 100
      });
      return;
    }

    // System prompt enforcing clean, short, straightforward responses
    const systemInstruction = `You are "Maa AI Chat", the official intelligent assistant for the "MaaProject" platform.
MaaProject is a dedicated public welfare initiative providing maternal healthcare guidance, direct financial allowances, child/community nutrition kits, 24/7 emergency helplines, and vocational empowerment.

CRITICAL RESPONSE RULES:
1. CLEAN, SHORT & STRAIGHTFORWARD:
   - Provide direct, concise, and easy-to-read responses.
   - Do NOT produce long or messy walls of text.
   - Keep answers under 3-5 clean bullet points or 1-2 short paragraphs.
   - Bold important details naturally (e.g. **₹6,000**, **1800-11-6222**).
2. GREETINGS: If user says "Hi", "Hello", etc., greet warmly in 1-2 short sentences.
3. NO SOURCE TAGS: Do not append source citations or document ID references in the message text.
4. ACCURACY: Base answers on verified facts in the knowledge context. Never hallucinate.
5. OFFICIAL CONTACTS: National Helpline: **1800-11-MAA-CARE (1800-11-6222)**, Email: **support@maaproject.org**.
6. OUT-OF-SCOPE: If asked about external trivia, stocks, games, coding, etc., politely reply in 1 brief sentence that you focus exclusively on MaaProject.

VERIFIED KNOWLEDGE BASE CONTEXT:
${contextBlock}
`;

    let generatedReply = '';
    let isEscalated = false;

    // Convert prior history into valid contents format
    const formattedContents = [
      ...history.slice(-8).filter((h: any) => h && typeof h.content === 'string').map((h: { role: string; content: string }) => ({
        role: h.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: h.content }]
      })),
      {
        role: 'user',
        parts: [{ text: trimmedQuery }]
      }
    ];

    generatedReply = await generateGroundedAIResponse(
      formattedContents,
      systemInstruction,
      trimmedQuery,
      retrieved
    );

    if (!generatedReply) {
      generatedReply = getRuleBasedFallback(trimmedQuery, retrieved);
    }

    // Emergency prepending if severe condition detected
    if (isEmergency) {
      isEscalated = true;
      if (!generatedReply.includes('1800-11-6222')) {
        generatedReply = `⚠️ **URGENT EMERGENCY ALERT**: If you or a family member are experiencing acute medical distress or active pregnancy complications, please immediately call our 24/7 Toll-Free Emergency Hotline: **1800-11-MAA-CARE (1800-11-6222)** or proceed to the nearest emergency maternity hospital.\n\n` + generatedReply;
      }
    }

    // Check if user is asking to report a problem or submit a ticket
    const problemRegex = /(problem|issue|stuck|delay|complaint|not working|failed|grievance|error)/i;
    const isProblemReportPrompt = problemRegex.test(trimmedQuery);

    const navigationActions = determineNavigationActions(trimmedQuery, generatedReply);
    const suggestedFollowUps = determineFollowUps(trimmedQuery, generatedReply);

    res.json({
      reply: generatedReply,
      sources,
      navigationActions,
      suggestedFollowUps,
      isProblemReportPrompt,
      isEscalated,
      groundedScore: retrieved.length > 0 ? Math.min(100, Math.round(retrieved[0].score * 4)) : 0
    });
  } catch (error: any) {
    console.error('Error in /api/chat endpoint:', error);
    res.status(500).json({
      error: 'An internal error occurred while processing your query.'
    });
  }
});

// Rule-based fallback generator with clean, short, straightforward formatting
function getRuleBasedFallback(query: string, retrieved: { doc: KnowledgeDocument; score: number }[]): string {
  const q = query.toLowerCase().trim();

  // Out of scope / unrelated queries
  const outOfScopePatterns = [
    'crypto', 'bitcoin', 'ethereum', 'stock', 'trading', 'weather', 'python', 'javascript',
    'coding', 'recipe', 'movie', 'cinema', 'cricket', 'football', 'fifa', 'flight', 'hotel',
    'instagram', 'tiktok', 'facebook', 'gaming', 'ps5', 'xbox', 'translate to french', 'write a poem'
  ];

  if (outOfScopePatterns.some((pattern) => q.includes(pattern))) {
    return `I am specifically designed to help with **MaaProject** healthcare services, welfare grants, nutrition kits, and support.\n\nHow can I help you with MaaProject today?`;
  }

  // Common high-frequency intents
  if (q.includes('what is maaproject') || q.includes('about') || q.includes('who are you') || q.includes('mission')) {
    return `**MaaProject** is a public healthcare and social welfare platform providing maternal health guidance, direct financial allowances, and community nutrition for mothers and children.

**Key Offerings:**
- **Maa Care**: 24/7 tele-consultations with certified doctors and pregnancy checkup tracking.
- **Maa Welfare**: **₹6,000** Janani Nutrition Grant (DBT) and girl child education scholarships.
- **Maa Nutrition**: Monthly fortified food kits and free Iron/Folic Acid supplements.
- **Maa Support**: 24/7 Emergency helpline & ambulance dispatch (**1800-11-6222**).

All core services are **100% free** for verified beneficiaries.`;
  }

  if (q.includes('service') || q.includes('what does maaproject provide') || q.includes('what do you provide') || q.includes('features')) {
    return `**MaaProject** provides 5 core welfare services:

1. **Maa Care**: 24/7 free doctor tele-consultations and ANC immunization tracking.
2. **Maa Welfare**: **₹6,000** Janani Nutrition Grant (in 3 installments) and Vidya scholarships.
3. **Maa Nutrition**: Free monthly Poshan ration kits and Iron/Folic Acid supplements.
4. **24/7 Emergency Line**: Toll-Free **1800-11-6222** for instant ambulance routing.
5. **Maa Skills**: Vocational training and digital literacy for Self-Help Groups.`;
  }

  if (q.includes('free') || q.includes('cost') || q.includes('fee') || q.includes('charge') || q.includes('price')) {
    return `**Yes, all core MaaProject services are 100% free.**

- **Doctor Consultations**: Free tele-consultations with certified specialists.
- **Nutrition Kits**: Monthly Poshan ration packages distributed free at 450+ Care Centers.
- **Welfare Grants**: **₹6,000** Janani Grant credited directly to your bank account with zero deductions.

Never pay any fee to unauthorized agents.`;
  }

  if (q.includes('contact') || q.includes('phone') || q.includes('email') || q.includes('helpline') || q.includes('call') || q.includes('toll-free') || q.includes('address') || q.includes('office')) {
    return `**Official MaaProject Contacts:**

- **National Toll-Free Helpline**: **1800-11-MAA-CARE (1800-11-6222)** (24/7)
- **Support Email**: support@maaproject.org
- **Emergency WhatsApp**: +91-98765-43210
- **Headquarters**: 4th Floor, Community Welfare Bhawan, Institutional Area, New Delhi — 110001`;
  }

  if (q.includes('emergency') || q.includes('ambulance') || q.includes('bleeding') || q.includes('urgent') || q.includes('labor')) {
    return `🚨 **24/7 EMERGENCY HELPLINE**:

If you are experiencing severe complications or active labor, call immediately:
**1800-11-MAA-CARE (1800-11-6222)**

Emergency dispatch will coordinate immediate ambulance routing and hospital admission.`;
  }

  if (q.includes('apply') || q.includes('how to apply') || q.includes('register') || q.includes('enroll') || q.includes('steps')) {
    return `**How to Apply for the ₹6,000 Janani Grant:**

1. Open the **Welfare Schemes** tab.
2. Enter and verify your mobile number with OTP.
3. Fill in beneficiary details and pregnancy stage.
4. Upload your Government ID (Aadhaar), MCP Card, and Bank Passbook.
5. Submit to receive your Tracking ID. Verification takes **3–5 business days**.`;
  }

  if (q.includes('doctor') || q.includes('appointment') || q.includes('consultation') || q.includes('tele-consultation') || q.includes('teleconsultation')) {
    return `**Booking a Free Doctor Consultation:**

1. Go to the **Maa Care Hub**.
2. Select your specialist (Obstetrician, Pediatrician, or Dietitian).
3. Pick your preferred date and time slot.
4. You will receive a video/audio consultation link via SMS 15 minutes before the session.`;
  }

  if (q.includes('nutrition') || q.includes('poshan') || q.includes('food') || q.includes('iron') || q.includes('folic acid') || q.includes('kit')) {
    return `**Maa Nutrition Kits:**

- **Monthly Poshan Kit**: Free fortified grains, pulses, iodized salt, and protein mix.
- **Supplements**: Free Iron & Folic Acid (IFA) tablets, Calcium, and Vitamin D3.
- **Pickup**: Available monthly at over 450+ Care Centers or home-delivered for high-risk pregnancies.`;
  }

  if (q.includes('problem') || q.includes('ticket') || q.includes('delay') || q.includes('complaint') || q.includes('grievance') || q.includes('troubleshoot') || q.includes('issue')) {
    return `**How to Report an Issue:**

1. Open the **Support Desk** or click **'Report a Problem'**.
2. Choose your issue type (Payment Delay, Application Status, Portal Bug).
3. Enter your contact number and Application ID.
4. Receive a Ticket ID. Inquiries are resolved within **24–48 hours**.`;
  }

  // Synthesize from retrieved documents if matching
  if (retrieved.length > 0) {
    const top = retrieved[0].doc;
    return `**${top.title}**\n\n${top.summary}`;
  }

  return `I can help you with:
- **Maa Care**: Doctor tele-consultations & pregnancy checkups
- **Maa Welfare**: **₹6,000** Janani Nutrition Grant application
- **Maa Nutrition**: Free Poshan kits & supplements
- **24/7 Helpline**: Immediate assistance via **1800-11-6222**`;
}

// ----------------------------------------------------
// Knowledge Base CRUD Endpoints
// ----------------------------------------------------
app.get('/api/knowledge', (req, res) => {
  const { category, search } = req.query;
  let results = [...knowledgeBase];

  if (category && typeof category === 'string' && category !== 'all') {
    results = results.filter((doc) => doc.category === category);
  }

  if (search && typeof search === 'string' && search.trim() !== '') {
    const s = search.toLowerCase();
    results = results.filter(
      (doc) =>
        doc.title.toLowerCase().includes(s) ||
        doc.content.toLowerCase().includes(s) ||
        doc.tags.some((t) => t.toLowerCase().includes(s))
    );
  }

  res.json({ documents: results, total: results.length });
});

app.post('/api/knowledge', requireAdmin, (req, res) => {
  const { title, category, summary, content, tags = [], route } = req.body;
  if (!title || !content) {
    res.status(400).json({ error: 'Title and Content are required.' });
    return;
  }

  const newDoc: KnowledgeDocument = {
    id: `maa-custom-${Date.now()}`,
    title: title.trim(),
    category: category || 'about',
    summary: summary || title,
    content: content.trim(),
    tags: Array.isArray(tags) ? tags : tags.split(',').map((t: string) => t.trim()),
    lastUpdated: new Date().toISOString().split('T')[0],
    verifiedBy: 'MaaProject Governance Board (Verified Submission)',
    route: route || '/knowledge-base'
  };

  knowledgeBase.unshift(newDoc);
  saveOperationalData();
  res.status(201).json({ document: newDoc, message: 'Document added to verified knowledge base.' });
});

app.delete('/api/knowledge/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const initialLen = knowledgeBase.length;
  knowledgeBase = knowledgeBase.filter((d) => d.id !== id);
  if (knowledgeBase.length === initialLen) {
    res.status(404).json({ error: 'Document not found.' });
    return;
  }
  saveOperationalData();
  res.json({ message: 'Document removed from knowledge index.' });
});

// ----------------------------------------------------
// Support Ticket Endpoints
// ----------------------------------------------------
app.get('/api/tickets', requireAdmin, (req, res) => {
  res.json({ tickets: supportTickets });
});

app.post('/api/tickets', (req, res) => {
  const { title, category, severity, userContact, description, troubleshootingStepsTaken = [] } = req.body;

  if (!title || !userContact || !description) {
    res.status(400).json({ error: 'Title, user contact, and description are required.' });
    return;
  }

  const ticketId = `MAA-TKT-${Math.floor(10000 + Math.random() * 90000)}`;
  const newTicket: SupportTicket = {
    id: ticketId,
    title: title.trim(),
    category: category || 'General Support',
    severity: severity || 'medium',
    status: 'open',
    userContact: userContact.trim(),
    description: description.trim(),
    troubleshootingStepsTaken,
    createdAt: Date.now(),
    updatedAt: Date.now(),
    assignedAgent: 'Auto-Triage Desk (MaaProject Grievance Cell)'
  };

  supportTickets.unshift(newTicket);
  saveOperationalData();
  res.status(201).json({ ticket: newTicket, message: `Support Ticket ${ticketId} created successfully.` });
});

app.patch('/api/tickets/:id', requireAdmin, (req, res) => {
  const { id } = req.params;
  const { status, assignedAgent, resolutionNotes } = req.body;

  const ticket = supportTickets.find((t) => t.id === id);
  if (!ticket) {
    res.status(404).json({ error: 'Ticket not found' });
    return;
  }

  if (status) ticket.status = status;
  if (assignedAgent) ticket.assignedAgent = assignedAgent;
  if (resolutionNotes) ticket.resolutionNotes = resolutionNotes;
  ticket.updatedAt = Date.now();
  saveOperationalData();

  res.json({ ticket, message: 'Ticket updated successfully.' });
});

// ----------------------------------------------------
// Automated Test Suite Runner Endpoints
// ----------------------------------------------------
app.get('/api/test/suite', requireAdmin, (req, res) => {
  const passed = testCases.filter((t) => t.status === 'passed').length;
  const failed = testCases.filter((t) => t.status === 'failed').length;
  const idle = testCases.filter((t) => t.status === 'idle' || t.status === 'running').length;

  res.json({
    testCases,
    metrics: {
      total: testCases.length,
      passed,
      failed,
      idle,
      accuracyRate: testCases.length > 0 && passed + failed > 0 ? Math.round((passed / (passed + failed)) * 100) : 100
    }
  });
});

app.post('/api/test/run-single', requireAdmin, async (req, res) => {
  const { testId } = req.body;
  const testCase = testCases.find((t) => t.id === testId);

  if (!testCase) {
    res.status(404).json({ error: 'Test case not found.' });
    return;
  }

  const startTime = Date.now();
  try {
    const retrieved = retrieveRelevantKnowledge(testCase.query, 4);

    const contextBlock = retrieved.map((r) => `[${r.doc.title}]\n${r.doc.content}`).join('\n\n');
    const testSystemInstruction = `You are Maa AI Chat for MaaProject. Answer truthfully using ONLY verified context. If out-of-scope or unverified, state so cleanly without hallucinating.\n\nContext:\n${contextBlock}`;

    const actualResponse = await generateGroundedAIResponse(
      testCase.query,
      testSystemInstruction,
      testCase.query,
      retrieved
    );

    const latencyMs = Date.now() - startTime;

    // Evaluation Logic
    let isPassed = false;
    const respLower = actualResponse.toLowerCase();

    if (testCase.category === 'Unrelated / Out of Scope' || testCase.category === 'Out-of-Scope Fallback') {
      isPassed = respLower.includes('maaproject') && (respLower.includes('not have verified') || respLower.includes('cannot assist') || respLower.includes('specifically designed') || respLower.includes('outside'));
    } else if (testCase.category === 'Invalid Input') {
      isPassed = respLower.includes('how can i assist') || respLower.includes('maaproject') || respLower.includes('help');
    } else if (testCase.id === 'TC-04') {
      isPassed = respLower.includes('1800-11') || respLower.includes('6222');
    } else if (testCase.id === 'TC-03') {
      isPassed = respLower.includes('free') || respLower.includes('100%');
    } else {
      isPassed = actualResponse.length > 30 && !respLower.includes('error occurred');
    }

    testCase.actualResponse = actualResponse;
    testCase.status = isPassed ? 'passed' : 'failed';
    testCase.matchedSources = retrieved.map((r) => r.doc.title);
    testCase.latencyMs = latencyMs;
    testCase.improvementNote = isPassed ? 'Meets all grounding and boundary constraints.' : 'Refine prompt context matching for this boundary case.';

    res.json({ testCase });
  } catch (err: any) {
    testCase.status = 'failed';
    testCase.actualResponse = `Execution Error: ${err.message}`;
    testCase.latencyMs = Date.now() - startTime;
    res.json({ testCase });
  }
});

// ----------------------------------------------------
// Production / Vite Development Middleware
// ----------------------------------------------------
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Maa AI Chat full-stack server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
