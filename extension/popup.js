const sendButton = document.getElementById("send");

sendButton.addEventListener("click", async () => {

    const prompt =
    document.getElementById("prompt").value;

    const responseBox =
    document.getElementById("response");


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


        console.log("Server response:", data);


        if (!response.ok) {

            responseBox.innerText =
            "ERROR:\n" +
            JSON.stringify(data, null, 2);

            return;
        }


        responseBox.innerText =
        data.reply;


    } catch (error) {

        console.error(error);

        responseBox.innerText =
        "CONNECTION ERROR:\n" +
        error.message;

    }

});