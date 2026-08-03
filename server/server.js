require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


// Test route
app.get("/", (req, res) => {
    res.send("DeepSeek server is running!");
});


// DeepSeek chat route
app.post("/chat", async (req, res) => {

    console.log("Chat request received:", req.body);

    const message = req.body.message;

    if (!message) {
        return res.status(400).json({
            error: "No message provided"
        });
    }


    try {

        const response = await fetch(
            "https://api.deepseek.com/chat/completions",
            {
                method: "POST",

                headers: {
                    "Content-Type": "application/json",
                    "Authorization":
                    `Bearer ${process.env.DEEPSEEK_API_KEY}`
                },

                body: JSON.stringify({

                    model: "deepseek-chat",

                    messages: [
                        {
                            role: "user",
                            content: message
                        }
                    ]

                })
            }
        );


        const data = await response.json();

        console.log("DeepSeek response:");
        console.log(JSON.stringify(data, null, 2));


        if (!response.ok) {
            return res.status(response.status).json({
                error: "DeepSeek API error",
                details: data
            });
        }


        if (!data.choices || data.choices.length === 0) {
            return res.status(500).json({
                error: "Unexpected DeepSeek response",
                details: data
            });
        }


        res.json({
            reply: data.choices[0].message.content
        });


    } catch (error) {

        console.error("Server error:", error);

        res.status(500).json({
            error: error.message
        });

    }

});


app.listen(3000, () => {
    console.log("🚀 Server running at http://localhost:3000");
});