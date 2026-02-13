async function sendMessage() {
    const msgInput = document.getElementById("message");
    const message = msgInput.value.trim();
    if (!message) return;

    addMessage("user", message); // يظهر رسالة المستخدم
    msgInput.value = "";

    // مؤقتًا: رد تلقائي للبوت لعرض الإرسال
    const replies = [
        "مرحبًا! كيف أساعدك اليوم؟",
        "تمام، فهمت رسالتك.",
        "آسف، لم أفهم ذلك، جرب صياغة أخرى."
    ];
    const reply = replies[Math.floor(Math.random() * replies.length)];

    // عرض الرد بعد ثانيتين
    setTimeout(() => addMessage("bot", reply), 1000);
}

function addMessage(sender, text) {
    const chat = document.getElementById("chat");
    const div = document.createElement("div");
    div.className = sender;
    div.textContent = text;
    chat.appendChild(div);
    chat.scrollTop = chat.scrollHeight;
}