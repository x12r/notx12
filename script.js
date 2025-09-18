const commandInput = document.getElementById("commandBar");
const outputArea = document.getElementById("outputArea");

// List of available mods for !Help
const availableMods = [
    "questpull",
    "pullmod",
    "tagaura",
    "anticrash"
];

// Helper function to append messages to the output area
function appendMessage(msg) {
    const p = document.createElement("p");
    p.textContent = msg;
    outputArea.appendChild(p);
    outputArea.scrollTop = outputArea.scrollHeight;
}

// Send command to backend
async function sendCommand(command) {
    try {
        const res = await fetch("/command", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ command })
        });

        if (!res.ok) {
            const text = await res.text();
            appendMessage(`Error: ${text}`);
            return;
        }

        const data = await res.json();
        appendMessage(`Mod "${data.mod}" is now ${data.state ? "enabled" : "disabled"}`);
    } catch (err) {
        appendMessage(`Error: ${err.message}`);
    }
}

// Handle Enter key
commandInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") {
        const command = commandInput.value.trim();
        if (!command) return;

        if (command.toLowerCase() === "!help") {
            appendMessage("Available mods:");
            availableMods.forEach(mod => appendMessage(`!${mod}`));
        } else {
            sendCommand(command);
        }

        commandInput.value = "";
    }
});
