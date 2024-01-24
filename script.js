document.addEventListener("DOMContentLoaded", function () {
    const chatInput = document.querySelector(".chat_input textarea");
    const sendChatBtn = document.querySelector(".chat_input span");
    const chatbox = document.querySelector(".chatbox");
    const chatbotToggler = document.querySelector(".chatbot_toggler");
    const chatbotCloseBtn = document.querySelector(".close_btn");
  
    let userMessage;
  
    const API_KEY = "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";
  
    const createChatLi = (message, className) => {
      const chatLi = document.createElement("li");
      chatLi.classList.add("chat", className);
      let chatContent =
        className === "outgoing"
          ? `<p>${message}</p>`
          : `<span class="fa-solid fa-robot"></span>${message}`;
      chatLi.innerHTML = chatContent;
      return chatLi;
    };
  
    const generateResponse = (incomingChatLi) => {
      const API_URL = "https://api.openai.com/v1/chat/completions";
      const messageElement = incomingChatLi.querySelector("p");
  
      const requestOption = {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [{ role: "user", content: userMessage }],
        }),
      };
  
      fetch(API_URL, requestOption)
        .then((res) => res.json())
        .then((data) => {
          if (
            data.choices &&
            data.choices.length > 0 &&
            data.choices[0].message &&
            data.choices[0].message.content
          ) {
            messageElement.textContent = data.choices[0].message.content;
          } else {
            console.error("Error: Response structure is unexpected", data);
          }
        })
        .catch((error) => {
          messageElement.textContent =
            "Oops! Something went wrong. Please try again. ";
        });
    };
  
    const handleChat = () => {
      userMessage = chatInput.value.trim();
      if (!userMessage) return;
  
      chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  
      setTimeout(() => {
        const incomingChatLi = createChatLi("Thinking...", "incoming");
        chatbox.appendChild(incomingChatLi);
        generateResponse(incomingChatLi);
        chatInput.value = ''; // Clear the input text after sending
      }, 600);
    };
  
    sendChatBtn.addEventListener("click", handleChat);
  
    chatbotToggler.addEventListener("click", () => {
      console.log("Toggler clicked");
      const body = document.body;
      body.classList.toggle("show_chatbot");
      console.log("Body classList:", body.classList);
    });
  
    chatbotCloseBtn.addEventListener("click", () =>
      document.body.classList.remove("show_chatbot")
    );
  });
  