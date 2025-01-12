const express = require("express");
const { mongoClient } = require("../api/mongodb");

const router = express.Router();

// Like route
router.post("/like", async (req, res) => {});

// Unlike route
router.post("/unlike", async (req, res) => {});

module.exports = router;
