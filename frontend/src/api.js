// api.js
export async function analyzeResume(file) {
  const formData = new FormData();
  formData.append("file", file);

  const response = await fetch("http://localhost:5000/analyze", {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    throw new Error("Failed to analyze resume");
  }

  return await response.json();
}
