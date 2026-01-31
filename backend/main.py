import os
import google.generativeai as genai
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from supabase import create_client, Client
from dotenv import load_dotenv

# -----------------------------------------------------------------------------
# 1. SETUP & CONFIGURATION
# -----------------------------------------------------------------------------

load_dotenv()

app = FastAPI(
    title="Dream University API",
    version="2.0.1"
)

# --- CORS MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    # Allow Frontend URLs (Localhost + Production)
    allow_origins=["http://localhost:3000", "https://dream-university.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- SUPABASE CONFIGURATION ---
supabase_url: str = os.getenv("SUPABASE_URL")
supabase_key: str = os.getenv("SUPABASE_KEY")

if not supabase_url or not supabase_key:
    raise RuntimeError("CRITICAL: SUPABASE_URL or SUPABASE_KEY is missing.")

try:
    supabase: Client = create_client(supabase_url, supabase_key)
except Exception as e:
    print(f"Failed to initialize Supabase: {e}")
    raise e

# --- GEMINI AI CONFIGURATION ---
gemini_key: str = os.getenv("GEMINI_API_KEY")

if not gemini_key:
    print("WARNING: GEMINI_API_KEY is missing. Chat will fail.")
else:
    genai.configure(api_key=gemini_key)

# 🔍 SELF-REPAIRING MODEL SELECTION
active_model = None
try:
    # Try getting the model directly to save startup time
    active_model = genai.GenerativeModel('gemini-1.5-flash')
except Exception as e:
    print(f"⚠️ Model Fallback: {e}")
    active_model = genai.GenerativeModel('gemini-pro')

# -----------------------------------------------------------------------------
# 2. DATA MODELS
# -----------------------------------------------------------------------------

class ChatRequest(BaseModel):
    message: str

# -----------------------------------------------------------------------------
# 3. HELPER FUNCTIONS
# -----------------------------------------------------------------------------

def format_universities_for_prompt(universities_data):
    if not universities_data:
        return "No university data available."
    
    formatted_list = []
    for uni in universities_data:
        name = uni.get("name", "Unknown University")
        country = uni.get("country", "Unknown Country")
        # ✅ FIXED: Correct Column Name from Database
        fees = uni.get("tuition_fees_usd", "N/A") 
        tags = uni.get("tags", [])
        
        entry = f"- {name} ({country}): Fees ${fees}, Tags: {tags}"
        formatted_list.append(entry)
    
    return "\n".join(formatted_list)

# -----------------------------------------------------------------------------
# 4. ROUTES
# -----------------------------------------------------------------------------

@app.get("/")
async def root():
    return {"message": "Dream University API is live"}

@app.get("/universities")
async def get_universities():
    try:
        response = supabase.table("universities").select("*").execute()
        return {"data": response.data}
    except Exception as e:
        return {"error": str(e)}

@app.post("/chat")
async def chat_counsellor(request: ChatRequest):
    try:
        # 1. Fetch Data (✅ FIXED Column Name here too)
        uni_response = supabase.table("universities").select("name, country, tuition_fees_usd, tags").execute()
        context_text = format_universities_for_prompt(uni_response.data)
        
        # 2. Build SYSTEM PROMPT (Smart Persona)
        system_instruction = (
            "You are 'Dream University AI', an expert international education counsellor. "
            "Adopt the following personas based on the user query:\n\n"
            
            "🧠 PROFILE ANALYZER:\n"
            "- Analyze student profile (GPA, Budget, Exams) to identify strengths and weaknesses.\n\n"
            
            "🏫 UNIVERSITY SHORTLISTER:\n"
            "- Suggest universities from the list below that realistically match the profile.\n"
            "- STRICT RULE: For recommendations, ONLY use the provided database list.\n\n"
            
            "✍️ SOP WRITER (Special Mode):\n"
            "- If asked to write/draft an SOP, Essay, or Email, IGNORE the database restriction.\n"
            "- Focus purely on writing a high-quality, professional, and personalized document based on the user's name, GPA, and target course.\n"
            "- Do not add placeholder text like '[Your Name]', use the data provided in the prompt.\n\n"
            
            f"--- UNIVERSITY DATABASE ---\n{context_text}\n---------------------------"
        )
        
        full_prompt = f"{system_instruction}\n\nUser Query: {request.message}"

        # 3. Generate Response
        if active_model:
            response = active_model.generate_content(full_prompt)
            return {"response": response.text}
        else:
             return {"response": "AI Service Unavailable. Check server logs."}

    except Exception as e:
        print(f"❌ AI Chat Error: {str(e)}")
        # Return error as string so frontend can show it (optional)
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")