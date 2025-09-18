const consoleDiv = document.getElementById("console");
const input = document.getElementById("commandInput");

// Change this URL later to your Render server
const API_URL = "https://your-server.onrender.com/command";

function logMessage(message) {
  const line = document.createElement("div");
  line.textContent = message;
  consoleDiv.appendChild(line);
  consoleDiv.scrollTop = consoleDiv.scrollHeight;
}

input.addEventListener("keydown", async (event) => {
  if (event.key === "Enter") {
    const command = input.value.trim();
    if (!command) return;

    logMessage("> " + command);
    input.value = "";

    if (command === "!help") {
      logMessage("Available commands: !pullmod, !tagaura, !questpull");
    } else {
      try {
        const response = await fetch(API_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command })
        });
        const result = await response.json();
        logMessage("Server: " + result.message);
      } catch (err) {
        logMessage("Error: could not reach server.");
      }
    }
  }
});
