const BASE_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:5000';

export async function postAnalyze(file: File) {
  const fd = new FormData();
  fd.append('file', file);
  const res = await fetch(`${BASE_URL}/analyze`, { method: 'POST', body: fd });
  if (!res.ok) throw new Error('Analyze failed');
  return res.json();
}

export async function postChat(message: string) {
  const res = await fetch(`${BASE_URL}/chat`, { 
    method: 'POST', 
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message })
  });
  if (!res.ok) throw new Error('Chat failed');
  return res.json();
}
