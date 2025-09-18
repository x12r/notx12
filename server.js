const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = process.env.PORT || 3000;

// In-memory store for mod states
let modStates = {};

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static(__dirname)); // serves index.html, script.js, style.css

// Endpoint for DLL to fetch latest mod states
app.get("/latest", (req, res) => {
    res.json(modStates);
});

// Endpoint to update mods via web UI
app.post("/command", (req, res) => {
    const { command } = req.body;
    if (!command) return res.status(400).send("No command provided");

    if (command.startsWith("!")) {
        const parts = command.slice(1).split(" ");
        const modName = parts[0].toLowerCase();
        const action = parts[1] ? parts[1].toLowerCase() : "toggle";

        if (!modStates[modName]) modStates[modName] = false;

        if (action === "on") modStates[modName] = true;
        else if (action === "off") modStates[modName] = false;
        else modStates[modName] = !modStates[modName];

        console.log(`Mod ${modName} is now ${modStates[modName] ? "enabled" : "disabled"}`);
        return res.json({ mod: modName, state: modStates[modName] });
    }

    res.status(400).send("Invalid command");
});

// Start server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
