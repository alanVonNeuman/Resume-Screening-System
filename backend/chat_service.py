from config import get_gemini_model

def chat_response(message: str) -> str:
    model = get_gemini_model()
    prompt = (
        "You are a helpful resume assistant. Keep answers concise, specific, and actionable.\n"
        f"User: {message}\nAssistant:"
    )
    try:
        resp = model.generate_content(prompt)
        return resp.text if hasattr(resp, 'text') else str(resp)
    except Exception as e:
        return f"[LLM error] {e}"
