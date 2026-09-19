import os, json, re, sqlite3, hashlib, secrets, hmac, time
from pathlib import Path
from typing import Optional
from fastapi import FastAPI, Header, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel, Field, EmailStr
from dotenv import load_dotenv

load_dotenv()
BASE = Path(__file__).resolve().parent
DATA = BASE / "data"
DATA.mkdir(exist_ok=True)
DB = DATA / "maa_project.db"
KNOWLEDGE = json.loads((BASE / "knowledge.json").read_text(encoding="utf-8"))
TESTS = json.loads((BASE / "test_cases.json").read_text(encoding="utf-8"))

app = FastAPI(title="MaaProject AI Backend", version="1.0.0")
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173","http://127.0.0.1:5173"], allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

def conn():
    c = sqlite3.connect(DB)
    c.row_factory = sqlite3.Row
    return c

def init_db():
    with conn() as db:
        db.executescript("""
        CREATE TABLE IF NOT EXISTS users(
          id TEXT PRIMARY KEY, name TEXT NOT NULL, email TEXT UNIQUE NOT NULL,
          password_hash TEXT NOT NULL, salt TEXT NOT NULL, created_at REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS sessions(
          token TEXT PRIMARY KEY, user_id TEXT NOT NULL, expires_at REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS conversations(
          id TEXT PRIMARY KEY, user_id TEXT, title TEXT NOT NULL,
          created_at REAL NOT NULL, updated_at REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS messages(
          id INTEGER PRIMARY KEY AUTOINCREMENT, conversation_id TEXT NOT NULL,
          role TEXT NOT NULL, content TEXT NOT NULL, created_at REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS knowledge(
          id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL,
          summary TEXT NOT NULL, content TEXT NOT NULL, tags TEXT NOT NULL,
          last_updated TEXT, verified_by TEXT, route TEXT
        );
        CREATE TABLE IF NOT EXISTS tickets(
          id TEXT PRIMARY KEY, title TEXT NOT NULL, category TEXT NOT NULL,
          severity TEXT NOT NULL, status TEXT NOT NULL, user_contact TEXT NOT NULL,
          description TEXT NOT NULL, created_at REAL NOT NULL, updated_at REAL NOT NULL
        );
        CREATE TABLE IF NOT EXISTS audit_log(
          id INTEGER PRIMARY KEY AUTOINCREMENT, event TEXT NOT NULL,
          detail TEXT, created_at REAL NOT NULL
        );
        """)
        for d in KNOWLEDGE:
            db.execute("""INSERT OR REPLACE INTO knowledge
              (id,title,category,summary,content,tags,last_updated,verified_by,route)
              VALUES(?,?,?,?,?,?,?,?,?)""",
              (d["id"],d["title"],d["category"],d["summary"],d["content"],
               json.dumps(d["tags"]),d["lastUpdated"],d["verifiedBy"],d.get("route")))
        db.commit()

@app.on_event("startup")
def startup():
    init_db()

class AuthPayload(BaseModel):
    name: str = ""
    email: EmailStr
    password: str = Field(min_length=8, max_length=128)

class ChatPayload(BaseModel):
    message: str = Field(min_length=1, max_length=4000)
    history: list[dict] = Field(default_factory=list)
    conversation_id: Optional[str] = None

class TicketPayload(BaseModel):
    title: str
    category: str = "General Support"
    severity: str = "medium"
    userContact: str
    description: str

def password_hash(password, salt):
    return hashlib.scrypt(password.encode(), salt=salt.encode(), n=16384, r=8, p=1).hex()

def public_user(r):
    return {"id":r["id"],"name":r["name"],"email":r["email"],"createdAt":r["created_at"]}

def create_session(user_id):
    token = secrets.token_urlsafe(48)
    with conn() as db:
        db.execute("INSERT INTO sessions VALUES(?,?,?)",(token,user_id,time.time()+30*86400))
        db.commit()
    return token

def current_user(authorization: Optional[str]):
    if not authorization or not authorization.startswith("Bearer "):
        return None
    token=authorization[7:]
    with conn() as db:
        r=db.execute("""SELECT u.* FROM users u JOIN sessions s ON s.user_id=u.id
                        WHERE s.token=? AND s.expires_at>?""",(token,time.time())).fetchone()
    return r

@app.get("/api/health")
def health():
    return {"status":"ok","backend":"FastAPI","database":"SQLite","knowledge_documents":len(KNOWLEDGE)}

@app.post("/api/auth/signup")
def signup(p: AuthPayload):
    name=p.name.strip()
    if len(name)<2: raise HTTPException(400,"Please enter a valid name.")
    with conn() as db:
        if db.execute("SELECT 1 FROM users WHERE email=?",(str(p.email).lower(),)).fetchone():
            raise HTTPException(409,"An account with this email already exists.")
        salt=secrets.token_hex(16); uid="usr_"+secrets.token_hex(10)
        db.execute("INSERT INTO users VALUES(?,?,?,?,?,?)",(uid,name,str(p.email).lower(),password_hash(p.password,salt),salt,time.time()))
        db.commit()
        user=db.execute("SELECT * FROM users WHERE id=?",(uid,)).fetchone()
    return {"token":create_session(uid),"user":public_user(user)}

@app.post("/api/auth/login")
def login(p: AuthPayload):
    with conn() as db: user=db.execute("SELECT * FROM users WHERE email=?",(str(p.email).lower(),)).fetchone()
    if not user or not hmac.compare_digest(password_hash(p.password,user["salt"]),user["password_hash"]):
        raise HTTPException(401,"Email or password is incorrect.")
    return {"token":create_session(user["id"]),"user":public_user(user)}

@app.get("/api/auth/me")
def me(authorization: Optional[str]=Header(None)):
    u=current_user(authorization)
    if not u: raise HTTPException(401,"Unauthorized.")
    return {"user":public_user(u)}

@app.get("/api/conversations")
def conversations(authorization: Optional[str]=Header(None)):
    u=current_user(authorization)
    if not u: raise HTTPException(401,"Sign in to access your conversations.")
    with conn() as db:
        rows=db.execute("""SELECT c.*, COUNT(m.id) message_count FROM conversations c
                           LEFT JOIN messages m ON m.conversation_id=c.id
                           WHERE c.user_id=? GROUP BY c.id ORDER BY c.updated_at DESC""",(u["id"],)).fetchall()
    return {"conversations":[{"id":r["id"],"title":r["title"],"createdAt":r["created_at"],"updatedAt":r["updated_at"],"messageCount":r["message_count"]} for r in rows]}

@app.get("/api/knowledge")
def knowledge(search: str="", category: str="all"):
    with conn() as db:
        rows=db.execute("SELECT * FROM knowledge").fetchall()
    out=[]
    for r in rows:
        if category!="all" and r["category"]!=category: continue
        hay=(r["title"]+" "+r["summary"]+" "+r["content"]+" "+r["tags"]).lower()
        if search and search.lower() not in hay: continue
        out.append(dict(r))
    return {"documents":out,"total":len(out)}

def retrieve(q, limit=4):
    tokens=[x for x in re.findall(r"[a-z0-9]+",q.lower()) if len(x)>2]
    scored=[]
    for d in KNOWLEDGE:
        hay=(d["title"]+" "+" ".join(d["tags"])+" "+d["content"]).lower()
        score=sum((8 if t in d["title"].lower() else 5 if t in " ".join(d["tags"]).lower() else 2 if t in hay else 0) for t in tokens)
        if q.lower() in d["content"].lower(): score+=10
        if score: scored.append((score,d))
    scored.sort(key=lambda x:x[0],reverse=True)
    return scored[:limit]

def fallback(q,retrieved):
    low=q.lower()
    if not retrieved:
        return "I can help with MaaProject information, services, user guidance, navigation, search, support, and problem reporting. I don't have enough verified MaaProject information to answer that specific question."
    if any(x in low for x in ["stock","bitcoin","python","instagram","fifa","flight","recipe","weather","car insurance"]):
        return "I’m specifically designed to help with MaaProject. I can assist with its services, guidance, navigation, support, and problem reporting."
    d=retrieved[0][1]
    return f"**{d['title']}**\n\n{d['summary']}\n\n{d['content']}"

async def gemini_answer(q, history, retrieved):
    key=os.getenv("GEMINI_API_KEY")
    if not key: return None
    try:
        from google import genai
        client=genai.Client(api_key=key)
        context="\n\n---\n\n".join(f"{d['title']}\n{d['content']}" for _,d in retrieved)
        prompt=f"""You are Maa AI Chat, a MaaProject-specific assistant.
Use ONLY the verified context below. If the context does not contain the answer, say you do not have enough verified information. Never invent contacts, services, policies, fees or procedures. Keep the answer concise (3-5 bullets or 1-2 short paragraphs).
VERIFIED CONTEXT:
{context}
USER QUESTION:
{q}
"""
        r=client.models.generate_content(model=os.getenv("GEMINI_MODEL","gemini-2.5-flash"),contents=prompt)
        return r.text.strip() if r.text else None
    except Exception:
        return None

@app.post("/api/chat")
async def chat(p: ChatPayload, authorization: Optional[str]=Header(None)):
    q=p.message.strip()
    if not q: raise HTTPException(400,"Message cannot be empty.")
    retrieved=retrieve(q)
    answer=await gemini_answer(q,p.history,retrieved)
    if not answer: answer=fallback(q,retrieved)
    sources=[{"docId":d["id"],"title":d["title"],"category":d["category"],"snippet":d["summary"],"urlOrRoute":d.get("route"),"relevanceScore":score} for score,d in retrieved]
    u=current_user(authorization)
    cid=p.conversation_id
    if u:
        with conn() as db:
            now=time.time()
            if not cid or not db.execute("SELECT 1 FROM conversations WHERE id=? AND user_id=?",(cid,u["id"])).fetchone():
                cid="conv_"+secrets.token_hex(10)
                db.execute("INSERT INTO conversations VALUES(?,?,?,?,?)",(cid,u["id"],q[:60],now,now))
            db.execute("INSERT INTO messages(conversation_id,role,content,created_at) VALUES(?,?,?,?)",(cid,"user",q,now))
            db.execute("INSERT INTO messages(conversation_id,role,content,created_at) VALUES(?,?,?,?)",(cid,"assistant",answer,now))
            db.execute("UPDATE conversations SET updated_at=? WHERE id=?",(now,cid))
            db.execute("INSERT INTO audit_log(event,detail,created_at) VALUES(?,?,?)",("chat",q[:200],now))
            db.commit()
    return {"reply":answer,"sources":sources,"conversation_id":cid,"groundedScore":min(100,(retrieved[0][0]*4 if retrieved else 0))}

@app.post("/api/tickets")
def create_ticket(p: TicketPayload):
    tid=f"MAA-TKT-{secrets.randbelow(90000)+10000}"; now=time.time()
    with conn() as db:
        db.execute("INSERT INTO tickets VALUES(?,?,?,?,?,?,?,?,?)",(tid,p.title.strip(),p.category,p.severity,"open",p.userContact.strip(),p.description.strip(),now,now))
        db.execute("INSERT INTO audit_log(event,detail,created_at) VALUES(?,?,?)",("ticket_created",tid,now)); db.commit()
    return {"ticket":{"id":tid,"title":p.title,"category":p.category,"severity":p.severity,"status":"open","userContact":p.userContact,"description":p.description,"createdAt":now,"updatedAt":now}}

@app.get("/api/test/suite")
def test_suite():
    return {"testCases":TESTS,"metrics":{"total":len(TESTS),"passed":0,"failed":0,"idle":len(TESTS)}}

@app.post("/api/test/run-single")
async def run_single(payload: dict):
    tid=payload.get("testId"); tc=next((x for x in TESTS if x["id"]==tid),None)
    if not tc: raise HTTPException(404,"Test case not found.")
    start=time.time(); r=retrieve(tc["query"]); ans=await gemini_answer(tc["query"],[],r) or fallback(tc["query"],r)
    low=ans.lower()
    passed=len(ans)>30 and ("maaproject" in low or bool(r))
    if "Out of Scope" in tc["category"] or "fallback" in tc["category"].lower():
        passed=any(x in low for x in ["maaproject","specifically designed","don't have enough verified","cannot"])
    result={**tc,"actualResponse":ans,"status":"passed" if passed else "failed","matchedSources":[d["title"] for _,d in r],"latencyMs":round((time.time()-start)*1000),"improvementNote":"" if passed else "Review retrieval coverage or knowledge source."}
    return {"testCase":result}


# Serve the compiled React app from FastAPI in production.
DIST = BASE.parent / "dist"
if DIST.exists():
    app.mount("/", StaticFiles(directory=DIST, html=True), name="frontend")
