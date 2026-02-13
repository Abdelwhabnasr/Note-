async function sendMessage() {
    const msgInput = document.getElementById("message");
    const message = msgInput.value.trim();
    if (!message) return;

    addMessage("user", message);
    msgInput.value = "";

    try {
        // API مجاني من HuggingFace
        const response = await fetch("https://api-inference.huggingface.co/models/gpt2", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ inputs: message })
        });

        const data = await response.json();
        let reply = data[0]?.generated_text || "آسف، لم أفهم الرسالة";

        addMessage("bot", reply);

    } catch (err) {
        console.error(err);
        addMessage("bot", "حدث خطأ في الاتصال بالـ API");
    }
}

function addMessage(sender, text) {
    const chat = document.getElementById("chat");
    const div = document.createElement("div");
    div.className = sender;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}