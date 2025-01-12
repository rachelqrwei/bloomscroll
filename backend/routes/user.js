const express = require("express");
const { mongoClient } = require("../api/mongodb");
const bcrypt = require("bcrypt");
const crypto = require("crypto");

const router = express.Router();

// Signup route
router.post("/signup", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "Username and password are required." });
        }

        const db = mongoClient.db("bloomscroll");
        const collection = db.collection("users");

        // Check if username already exists
        const existingUser = await collection.findOne({ username });
        if (existingUser) {
            return res.status(400).json({ error: "Username already exists." });
        }

        // Hash the password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        // Insert user into the database
        const result = await collection.insertOne({
            username,
            password: hashedPassword,
            token: "",
            likes: [],
            lastday: 0,
            streak: 0,
        });

        res.status(201).json({
            message: "User signed up successfully.",
            userId: result.insertedId,
        });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Sign-in route
router.post("/signin", async (req, res) => {
    try {
        const { username, password } = req.body;

        if (!username || !password) {
            return res
                .status(400)
                .json({ error: "Username and password are required." });
        }

        const db = mongoClient.db("bloomscroll");
        const collection = db.collection("users");

        // Find the user by username
        const user = await collection.findOne({ username });

        if (!user) {
            return res
                .status(401)
                .json({ error: "Invalid username or password." });
        }

        // Compare the provided password with the stored hashed password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return res
                .status(401)
                .json({ error: "Invalid username or password." });
        }

        // Generate a simple token (e.g., a random string)
        const userToken = crypto.randomBytes(16).toString("hex");

        // Update the user's token in the database
        await collection.updateOne(
            { username },
            { $set: { token: userToken } }
        );

        res.status(200).json({
            message: "Sign-in successful.",
            userToken,
        });
    } catch (error) {
        console.error("Error during sign-in:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Like video route
router.post("/like", async (req, res) => {
    try {
        const { userToken, videoName } = req.body;

        if (!userToken || !videoName) {
            return res
                .status(400)
                .json({ error: "userToken and videoName are required." });
        }

        const db = mongoClient.db("bloomscroll");
        const collection = db.collection("users");

        // Find the user by token
        const user = await collection.findOne({ token: userToken });

        if (!user) {
            return res.status(401).json({ error: "Invalid userToken." });
        }

        // Check if the video is already liked
        if (user.likes.includes(videoName)) {
            return res.status(400).json({ error: "Video already liked." });
        }

        // Add videoName to the likes array
        await collection.updateOne(
            { token: userToken },
            { $push: { likes: videoName } }
        );

        res.status(200).json({ message: "Video liked successfully." });
    } catch (error) {
        console.error("Error during like:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Unlike video route
router.post("/unlike", async (req, res) => {
    try {
        const { userToken, videoName } = req.body;

        if (!userToken || !videoName) {
            return res
                .status(400)
                .json({ error: "userToken and videoName are required." });
        }

        const db = mongoClient.db("bloomscroll");
        const collection = db.collection("users");

        // Find the user by token
        const user = await collection.findOne({ token: userToken });

        if (!user) {
            return res.status(401).json({ error: "Invalid userToken." });
        }

        // Check if the video is not liked
        if (!user.likes.includes(videoName)) {
            return res.status(400).json({ error: "Video not liked." });
        }

        // Remove videoName from the likes array
        await collection.updateOne(
            { token: userToken },
            { $pull: { likes: videoName } }
        );

        res.status(200).json({ message: "Video unliked successfully." });
    } catch (error) {
        console.error("Error during unlike:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Check if the video is liked by the user
router.post("/isLiked", async (req, res) => {
    try {
        const { userToken, videoName } = req.body;

        if (!userToken || !videoName) {
            return res
                .status(400)
                .json({ error: "userToken and videoName are required." });
        }

        const db = mongoClient.db("bloomscroll");
        const collection = db.collection("users");

        // Find the user by token
        const user = await collection.findOne({ token: userToken });

        if (!user) {
            return res.status(401).json({ error: "Invalid userToken." });
        }

        // Check if the video is liked
        const isLiked = user.likes.includes(videoName);

        res.status(200).json({
            isLiked: isLiked,
            message: isLiked ? "Video is liked." : "Video is not liked.",
        });
    } catch (error) {
        console.error("Error during isLiked check:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Get all liked videos route
router.post("/getAllLikes", async (req, res) => {
    try {
        const { userToken } = req.body;

        if (!userToken) {
            return res.status(400).json({ error: "userToken is required." });
        }

        const db = mongoClient.db("bloomscroll");
        const collection = db.collection("users");

        // Find the user by token
        const user = await collection.findOne({ token: userToken });

        if (!user) {
            return res.status(401).json({ error: "Invalid userToken." });
        }

        // Retrieve the list of liked video names
        const likedVideos = user.likes || []; // Default to an empty array if no likes exist

        res.status(200).json({ likedVideos });
    } catch (error) {
        console.error("Error fetching liked videos:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

// Progress route
router.post("/progress", async (req, res) => {
    try {
        const { userToken } = req.body;

        if (!userToken) {
            return res.status(400).json({ error: "userToken is required." });
        }

        const db = mongoClient.db("bloomscroll");
        const collection = db.collection("users");

        // Find the user by token
        const user = await collection.findOne({ token: userToken });

        if (!user) {
            return res.status(401).json({ error: "Invalid userToken." });
        }

        // Current date and yesterday's date
        const today = new Date();
        const yesterday = new Date();
        yesterday.setDate(today.getDate() - 1);

        // Format dates as YYYY-MM-DD
        const formattedToday = today.toISOString().split("T")[0];
        const formattedYesterday = yesterday.toISOString().split("T")[0];
        const lastday = user.lastday || null;

        // Calculate streaks
        let streak = user.streak || 0;
        if (lastday === formattedYesterday) {
            // Increment streak if last activity was yesterday
            streak += 1;
        } else if (lastday !== formattedToday) {
            // Reset streak if no activity yesterday or today
            streak = 0;
        }

        // Update the user's progress in the database
        await collection.updateOne(
            { token: userToken },
            { $set: { lastday: formattedToday, streak } }
        );

        res.status(200).json({
            lastday: lastday || "No activity recorded yet",
            streak,
        });
    } catch (error) {
        console.error("Error fetching user progress:", error);
        res.status(500).json({ error: "Internal server error." });
    }
});

module.exports = router;
