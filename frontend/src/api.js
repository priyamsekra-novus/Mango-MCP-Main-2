export async function sendMessage(message, onChunk) {
  const response = await fetch("http://127.0.0.1:8000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message }),
  });

  if (!response.ok) {
    console.error("Backend error:", response.status);
    onChunk("⚠️ Backend returned an error: " + response.status);
    return;
  }

  // Expect a JSON response: { response: "...text..." }
  const data = await response.json();
  const text = typeof data === "object" && data !== null && "response" in data
    ? data.response
    : String(data);

  onChunk(text);
}
