const sendButton = document.getElementById("send");

sendButton.addEventListener("click", async () => {

    const prompt = document.getElementById("prompt").value;

    const responseBox = document.getElementById("response");

    responseBox.innerText = "Thinking...";

    try {

        const response = await fetch(
            "http://localhost:3000/chat",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    message: prompt
                })
            }
        );


        const data = await response.json();


        if (data.error) {
            throw new Error(data.error);
        }


        responseBox.innerText = data.reply;


    } catch (error) {

        console.error(error);

        responseBox.innerText =
        "ERROR: " + error.message;

    }

});