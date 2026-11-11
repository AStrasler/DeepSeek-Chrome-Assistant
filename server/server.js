require("dotenv").config();

const express = require("express");

const app = express();

// This loopback API returns JSON and plain text only. Set browser security
// headers without adding a dependency or enabling HTTPS assumptions on localhost.
app.disable("x-powered-by");
app.use((req, res, next) => {
    res.set({
        "Content-Security-Policy": "default-src 'none'; base-uri 'none'; form-action 'none'; frame-ancestors 'none'",
        "X-Content-Type-Options": "nosniff",
        "X-Frame-Options": "DENY",
        "Referrer-Policy": "no-referrer",
        "Cache-Control": "no-store"
    });
    next();
});

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


// Preserve the middleware's security headers on unmatched routes and parser errors.
app.use((req, res) => {
    res.status(404).type("text/plain").send(`Cannot ${req.method} ${req.path}`);
});

app.use((error, req, res, next) => {
    if (res.headersSent) {
        return next(error);
    }

    const status = error.status || error.statusCode || 500;
    res.status(status).json({
        error: status === 400 ? "Invalid JSON request" : "Request failed"
    });
});


if (require.main === module) {
    app.listen(3000, "127.0.0.1", () => {
        console.log("🚀 Server running at http://127.0.0.1:3000");
    });
}

module.exports = app;