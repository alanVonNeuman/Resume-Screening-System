import os
import fitz  # PyMuPDF
from config import get_gemini_model

def extract_text_from_pdf(path: str) -> str:
    try:
        text_parts = []
        with fitz.open(path) as doc:
            for page in doc:
                text_parts.append(page.get_text())
        return "\n".join(text_parts).strip()
    except Exception as e:
        return f"[Extraction error] {e}"

def analyze_resume(file_path: str):
    text = extract_text_from_pdf(file_path)
    model = get_gemini_model()
    prompt = (
        "You are a resume screening assistant. Analyze the following resume text and produce a clear, helpful assessment "
        "including key skills, experience level, best-fit roles, a 1–10 suitability score, and actionable recommendations.\n\n"
        f"RESUME TEXT:\n{text}\n\n"
        "Return the analysis as well-formatted markdown."
    )
    try:
        resp = model.generate_content(prompt)
        analysis = resp.text if hasattr(resp, 'text') else str(resp)
    except Exception as e:
        analysis = f"[LLM error] {e}"
    return {"status": "success", "analysis": analysis}
