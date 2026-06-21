document.addEventListener("DOMContentLoaded", () => {

    const chatbotToggle = document.getElementById("chatbotToggle");
    const chatbotContainer = document.getElementById("chatbotContainer");
    const closeChatbot = document.getElementById("closeChatbot");
    const chatMessages = document.getElementById("chatMessages");
    const chatInput = document.getElementById("chatInput");
    const sendBtn = document.getElementById("sendBtn");

    // Open chatbot
    chatbotToggle.addEventListener("click", () => {
        chatbotContainer.classList.add("active");
    });

    // Close chatbot
    closeChatbot.addEventListener("click", () => {
        chatbotContainer.classList.remove("active");
    });

    // Send Button
    sendBtn.addEventListener("click", sendMessage);

    // Enter Key
    chatInput.addEventListener("keypress", (e) => {
        if (e.key === "Enter") {
            sendMessage();
        }
    });

    async function sendMessage() {
        const userText = chatInput.value.trim();
        if(!userText) return;
        addUserMessage(userText);
        chatInput.value = "";
        const response = await fetch(
            "https://hcl-backend-portal.onrender.com/chatbot",
            {
                method:"POST",
                headers: {
                    "Content-Type":"application/json"
                },
                body:JSON.stringify({
                    message: userText
                })
            }
        );
        const data = await response.json();
        console.log("data");
        addBotMessage(data.reply);
    }

    function addUserMessage(message) {
        const div = document.createElement("div");
        div.className = "user-message";
        div.innerHTML = message;

        chatMessages.appendChild(div);
        scrollBottom();
    }

    function addBotMessage(message) {
        const div = document.createElement("div");
        div.className = "bot-message";
        div.innerHTML = message;

        chatMessages.appendChild(div);
        scrollBottom();
    }

    function showTyping() {
        const div = document.createElement("div");
        div.className = "bot-message typing";
        div.id = "typingIndicator";
        div.innerHTML = "🤖 Typing...";
        chatMessages.appendChild(div);

        scrollBottom();
    }

    function removeTyping() {
        const typing = document.getElementById("typingIndicator");
        if (typing) typing.remove();
    }

    function scrollBottom() {
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

});