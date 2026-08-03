const sendButton = document.getElementById("send");

sendButton.addEventListener("click", () => {

    const prompt =
    document.getElementById("prompt").value;

    document.getElementById("response").innerText =
    "You asked: " + prompt;

});