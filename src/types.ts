export type Role = 'user' | 'assistant' | 'system';

export interface SourceCitation {
  docId: string;
  title: string;
  category: string;
  snippet: string;
  urlOrRoute?: string;
  relevanceScore?: number;
}

export interface NavigationAction {
  label: string;
  route: string;
  description?: string;
  icon?: string;
}

export interface ChatMessage {
  id: string;
  role: Role;
  content: string;
  timestamp: number;
  sources?: SourceCitation[];
  navigationActions?: NavigationAction[];
  suggestedFollowUps?: string[];
  isProblemReportPrompt?: boolean;
  ticketId?: string;
  isEscalated?: boolean;
  sentiment?: 'positive' | 'neutral' | 'frustrated' | 'urgent';
  groundedScore?: number;
}

export interface KnowledgeDocument {
  id: string;
  title: string;
  category: 'about' | 'service' | 'guide' | 'faq' | 'contact' | 'policy' | 'troubleshooting';
  summary: string;
  content: string;
  tags: string[];
  lastUpdated: string;
  verifiedBy: string;
  route?: string;
}

export interface SupportTicket {
  id: string;
  title: string;
  category: 'Service Access' | 'Welfare Application' | 'Health Center / Clinic' | 'Technical Bug' | 'Grievance' | 'General Support';
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'in_review' | 'escalated_to_human' | 'resolved';
  userContact: string;
  description: string;
  troubleshootingStepsTaken?: string[];
  createdAt: number;
  updatedAt: number;
  assignedAgent?: string;
  resolutionNotes?: string;
}

export interface TestCase {
  id: string;
  category: 
    | 'Normal Query'
    | 'Complex Query'
    | 'Incomplete Query'
    | 'Incorrect / Misconception'
    | 'Unrelated / Out of Scope'
    | 'Repeated / Contextual'
    | 'Out-of-Scope Fallback'
    | 'Invalid Input'
    | 'Long Query'
    | 'Multiple Questions';
  query: string;
  expectedResponseCriteria: string;
  actualResponse?: string;
  status: 'idle' | 'running' | 'passed' | 'failed';
  matchedSources?: string[];
  improvementNote?: string;
  latencyMs?: number;
}

export interface ConversationFlowScenario {
  id: string;
  title: string;
  category: string;
  description: string;
  userGoal: string;
  steps: {
    sender: 'user' | 'bot';
    message: string;
    note?: string;
    expectedAction?: string;
  }[];
}

export interface PlatformMetric {
  totalQueries: number;
  groundedAccuracyRate: number;
  activeKnowledgeDocs: number;
  resolvedTickets: number;
  averageResponseTimeMs: number;
}

export type NotificationType = 'message' | 'ticket' | 'system' | 'knowledge' | 'alert';

export interface AppNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: number;
  read: boolean;
  severity?: 'info' | 'success' | 'warning' | 'error';
  actionRoute?: 'landing' | 'chat' | 'knowledge' | 'tickets' | 'tests' | 'docs';
  actionPayload?: string;
}
