require("dotenv").config();

const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());


app.post("/chat", async (req, res) => {

    const userMessage = req.body.message;

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
                            content: userMessage
                        }
                    ]

                })
            }
        );


        const data = await response.json();


        res.json({
            reply:
            data.choices[0].message.content
        });


    } catch(error){

        res.status(500).json({
            error: error.message
        });

    }

});


app.listen(3000, () => {

    console.log(
    "DeepSeek server running on port 3000"
    );

});