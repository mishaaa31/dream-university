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
    version="2.0.0"
)

# --- CORS MIDDLEWARE ---
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
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
    print("🤖 Checking available AI models...")
    available_models = []
    try:
        for m in genai.list_models():
            if 'generateContent' in m.supported_generation_methods:
                available_models.append(m.name)
    except Exception as list_err:
        print(f"⚠️ Could not list models: {list_err}")

    # Priority list
    priority_list = [
        "models/gemini-1.5-flash", 
        "models/gemini-1.5-pro",
        "models/gemini-pro"
    ]
    
    selected_model_name = None
    for priority in priority_list:
        if priority in available_models:
            selected_model_name = priority
            break
            
    if not selected_model_name and available_models:
        selected_model_name = available_models[0]
    
    if not selected_model_name:
        selected_model_name = "models/gemini-pro"
            
    print(f"🚀 Selected Model: {selected_model_name}")
    active_model = genai.GenerativeModel(selected_model_name)

except Exception as e:
    print(f"⚠️ Model Auto-Detect Failed: {e}")
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
        # 1. Fetch Data
        uni_response = supabase.table("universities").select("name, country, tuition_fees_usd, tags").execute()
        context_text = format_universities_for_prompt(uni_response.data)
        
        # 2. Build SYSTEM PROMPT (Integrating the specific personas you requested)
        system_instruction = (
            "You are 'Dream University AI', an expert international education counsellor. "
            "Adopt the following personas based on the user query:\n\n"
            
            "🧠 PROFILE ANALYZER:\n"
            "- Analyze student profile (GPA, Budget, Exams) to identify strengths and weaknesses.\n"
            "- Be honest and practical. Highlight missing requirements (like IELTS/GRE).\n\n"
            
            "🧠 DECISION MAKER:\n"
            "- Recommend best countries based on career goals and budget.\n"
            "- Highlight risks (visa issues, low budget) and give confidence levels.\n\n"
            
            "🏫 UNIVERSITY SHORTLISTER:\n"
            "- Suggest universities from the list below that realistically match the profile.\n"
            "- Categorize them as SAFE, MODERATE, or AMBITIOUS.\n"
            "- STRICT RULE: Only recommend universities from the provided database list.\n\n"
            
            "✍️ SOP WRITER:\n"
            "- Help write compelling Statements of Purpose.\n"
            "- Ensure the SOP aligns with the selected university and career goals.\n"
            "- Ask clarifying questions if details are missing before writing.\n\n"
            
            f"--- UNIVERSITY DATABASE (For Recommendations Only) ---\n{context_text}\n---------------------------"
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
        raise HTTPException(status_code=500, detail=f"AI Error: {str(e)}")