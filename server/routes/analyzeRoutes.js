const express = require("express");

const router = express.Router();

router.post("/analyze", async (req, res) => {
  try {
    const { code, language } = req.body;

    if (!code || !code.trim()) {
      return res.status(400).json({
        message: "Code is required",
      });
    }

    if (language !== "python") {
      return res.status(400).json({
        message: "Currently only Python is supported.",
      });
    }

    const response = await fetch(
      "http://127.0.0.1:8000/analyze/python",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code,
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      return res.status(response.status).json(data);
    }

    res.json(data);
  } catch (error) {
    console.error("Python Engine Error:", error);

    res.status(500).json({
      message: "Could not connect to CodeFix Python Engine",
      error: error.message,
    });
  }
});

module.exports = router;