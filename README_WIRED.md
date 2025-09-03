# ResumeScreeningSystem2 (Wired)

This bundle contains a wired **frontend + backend** ready to run.

## Backend (Flask)
```
cd backend
python -m venv venv
# Windows:
venv\Scripts\activate
# Mac/Linux:
# source venv/bin/activate

pip install -r requirements.txt
copy .env.example .env   # (Windows) OR: cp .env.example .env
# Edit .env and add your GEMINI_API_KEY
python app.py
```
Runs at: http://localhost:5000

## Frontend (Vite React)
```
cd frontend
npm install
# Optionally set backend URL (defaults to http://localhost:5000):
# echo VITE_BACKEND_URL=http://localhost:5000 > .env.development
npm run dev
```
Open the printed URL, upload a PDF resume, and you'll see the AI analysis.
