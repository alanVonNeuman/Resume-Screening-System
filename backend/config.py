import os
from dotenv import load_dotenv # type: ignore
import google.generativeai as genai # type: ignore

load_dotenv()

def get_gemini_model():
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise RuntimeError("GEMINI_API_KEY is not set. Create a .env in backend/ with GEMINI_API_KEY=...")
    genai.configure(api_key=api_key)
    # Use a sensible default model; adjust if needed
    model = genai.GenerativeModel("gemini-1.5-flash")
    return model
