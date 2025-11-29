export default function ChatBubble({ role, text }) {
  const isUser = role === "user";

  return (
    <div
      style={{
        display: "flex",
        justifyContent: isUser ? "flex-end" : "flex-start",
        marginBottom: "12px",
      }}
    >
      <div
        className="bubble"
        style={{
          background: isUser
            ? "rgba(0, 123, 255, 0.35)"
            : "rgba(255, 255, 255, 0.15)",
          color: "white",
          border: "1px solid rgba(255,255,255,0.2)",
        }}
      >
        {text}
      </div>
    </div>
  );
}
