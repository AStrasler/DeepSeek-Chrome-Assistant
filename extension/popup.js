const sendButton = document.getElementById("send");

sendButton.addEventListener("click", async () => {

    const prompt =
    document.getElementById("prompt").value;


    document.getElementById("response").innerText =
    "Thinking...";


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


    document.getElementById("response").innerText =
    data.reply;

});