const os = require("os");
const express = require("express");
const { exec } = require("child_process");
const path = require("path");
const cors = require("cors");
const fs = require("fs");

const app = express();
const port = 3001;

// Enable CORS with more permissive options
app.use(
    cors({
        origin: "*",
        methods: ["GET", "POST", "OPTIONS"],
        allowedHeaders: ["Content-Type", "Authorization"],
        credentials: true,
        preflightContinue: false,
        optionsSuccessStatus: 204,
    })
);

app.use(express.json());

// Create videos directory if it doesn't exist
const videosDir = path.join(__dirname, "videos");
if (!fs.existsSync(videosDir)) {
    fs.mkdirSync(videosDir, { recursive: true });
}

function getAllLocalIPs() {
    const interfaces = os.networkInterfaces();
    const addresses = [];

    for (const interfaceName of Object.keys(interfaces)) {
        for (const interface of interfaces[interfaceName]) {
            // Only get IPv4 addresses and exclude internal addresses
            if (interface.family === "IPv4" && !interface.internal) {
                addresses.push(interface.address);
            }
        }
    }
    return addresses;
}

// Test endpoint that doesn't require video generation
app.get("/test", (req, res) => {
    res.json({
        message: "Server is reachable",
        clientIP: req.ip,
        serverAddresses: getAllLocalIPs(),
    });
});

app.post("/generaaaaate-video", async (req, res) => {
    try {
        const venv = path.join(__dirname, "videoGen", ".venv", "bin", "python");
        const { prompt, useAppPexel } = req.body;
        const scriptName = ` -m videoGen.${
            useAppPexel ? "app_pexel" : "app_brainrot"
        }`;
        const filename = `${prompt.replace(/\s+/g, "_")}_${Date.now()}.mp4`;
        const outputFilename = path.join(videosDir, filename);
        const command = `${venv} ${scriptName} "${prompt}" "${outputFilename}"`;

        console.log("Executing command:", command);

        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`exec error: ${error}`);
                console.error(`stderr: ${stderr}`);
                return res.status(500).json({
                    error: "Video generation failed",
                    details: stderr,
                });
            }
            console.log(`stdout: ${stdout}`);
            console.log(`Video generated: ${filename}`);

            // Send all possible URLs back to the client
            const urls = getAllLocalIPs().map(
                (ip) => `http://${ip}:${port}/videos/${filename}`
            );

            res.json({
                videoUrls: urls,
                filename: filename,
                message: "If the first URL doesn't work, try the others",
            });
        });
    } catch (error) {
        console.error("Error in generate-video:", error);
        res.status(500).json({
            error: "Internal server error",
            details: error.message,
        });
    }
});

// Serve static video files with proper CORS headers
app.use(
    "/videos",
    express.static(videosDir, {
        setHeaders: (res, path) => {
            res.set("Access-Control-Allow-Origin", "*");
            res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
            res.set("Access-Control-Allow-Headers", "Content-Type");
        },
    })
);

// Debug endpoint to check connectivity
app.get("/debug", (req, res) => {
    const clientIP = req.ip;
    const addresses = getAllLocalIPs();

    res.json({
        clientIP,
        serverAddresses: addresses,
        message: "If you can see this, the server is reachable",
    });
});

// Health check endpoint
app.get("/", (req, res) => {
    res.json({ status: "Server is running" });
});

// Start the server
app.listen(port, "0.0.0.0", () => {
    console.log(`Server running on port ${port}`);
    console.log("\nAvailable on:");

    const addresses = getAllLocalIPs();
    console.log(`Local: http://localhost:${port}`);
    addresses.forEach((addr) => {
        console.log(`Network: http://${addr}:${port}`);
    });

    console.log("\nTo test connectivity, try:");
    console.log(`curl http://localhost:${port}/test`);
    addresses.forEach((addr) => {
        console.log(`curl http://${addr}:${port}/test`);
    });
});
