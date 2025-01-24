import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import './Chatbot.css'; // Updated CSS for chatbot design

const Chatbot = () => {
  const [userInput, setUserInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [isBotTyping, setIsBotTyping] = useState(false); // Typing indicator state
  const [menu, setMenu] = useState([]); // State for storing menu items
  const [selectedMenuItem, setSelectedMenuItem] = useState(null); // State for selected menu item
  const [quantity, setQuantity] = useState(1); // State for quantity
  const chatContainerRef = useRef(null);

  // Fetch menu items from Django API
  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await axios.get("http://localhost:8000/menu/");
        setMenu(response.data);
      } catch (error) {
        console.error("Error fetching menu:", error);
      }
    };

    fetchMenu();
  }, []);

  // Scroll to the bottom when a new message is added
  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [chatMessages]);

  // Handle user input change
  const handleInputChange = (e) => {
    setUserInput(e.target.value);
  };

  // Send user message and get bot response (calls FastAPI for NLP processing)
  const handleSendMessage = async () => {
    if (userInput.trim() === "") return;

    // Add user message to chat
    const userMessage = { sender: "User", text: userInput, time: new Date().toLocaleTimeString() };
    setChatMessages([...chatMessages, userMessage]);
    setUserInput(""); // Clear input field

    // Display typing indicator for bot
    setIsBotTyping(true);

    try {
      // Send user input to FastAPI for intent detection
      const intentResponse = await axios.post("http://localhost:8001/nlp/intent", {
        text: userInput, // Send as { "text": userInput } to match FastAPI's expected input
      });

      const intent = intentResponse.data.intent;

      // Send user input to FastAPI for entity recognition
      const nerResponse = await axios.post("http://localhost:8001/nlp/ner", {
        text: userInput,
      });

      const entities = nerResponse.data.entities;

      // Simulate bot response delay
      setTimeout(() => {
        let botMessage = {
          sender: "FoodBot",
          text: "",
          time: new Date().toLocaleTimeString(),
        };

        // Handle different intents (e.g., order food)
        if (intent === "Order Food") {
          if (entities.length > 0) {
            // If entities related to food were found, make the response more natural
            const foodItems = entities.filter((e) => e.label === "FOOD").map((e) => e.entity).join(', ');
            if (foodItems) {
              botMessage.text = `I see you're interested in ordering ${foodItems}. Would you like to add anything else or place your order now?`;
            } else {
              botMessage.text = "What would you like to order from the menu?";
            }
          } else {
            botMessage.text = "What would you like to order? Here are some items on our menu:";
          }

          // Display menu items for the user to choose from
          setChatMessages([
            ...chatMessages,
            userMessage,
            botMessage,
            {
              sender: "FoodBot",
              text: "Here are the items you can order:",
              quickReplies: menu.map((item) => item.name), // Dynamically display menu items
              time: new Date().toLocaleTimeString(),
            },
          ]);
        } else if (intent === "Check Status") {
          botMessage.text = "I can help you with that! Please provide your order ID so I can check the status.";
          setChatMessages([...chatMessages, userMessage, botMessage]);
        } else {
          botMessage.text = "I'm not sure how to assist you with that. Could you clarify?";
          setChatMessages([...chatMessages, userMessage, botMessage]);
        }
        setIsBotTyping(false); // Hide typing indicator after response
      }, 1500); // Delay to simulate typing
    } catch (error) {
      setChatMessages([
        ...chatMessages,
        { sender: "FoodBot", text: "Sorry, something went wrong. Could you please try again?", time: new Date().toLocaleTimeString() },
      ]);
      setIsBotTyping(false); // Hide typing indicator in case of error
    }
  };

  // Handle quick reply click (send order to Django)
  const handleQuickReplyClick = async (replyText) => {
    const userMessage = { sender: "User", text: replyText, time: new Date().toLocaleTimeString() };
    setChatMessages([...chatMessages, userMessage]);

    // Find the selected menu item
    const selectedItem = menu.find((item) => item.name === replyText);
    setSelectedMenuItem(selectedItem);

    // Ask for quantity
    const botMessage = {
      sender: "FoodBot",
      text: `How many ${selectedItem.name}s would you like to order?`,
      time: new Date().toLocaleTimeString(),
    };
    setChatMessages([...chatMessages, userMessage, botMessage]);
  };

  // Handle quantity input and place order
  const handleQuantityChange = (e) => {
    setQuantity(e.target.value);
  };

  const handlePlaceOrder = async () => {
    if (!selectedMenuItem) return;

    try {
      const orderResponse = await axios.post("http://localhost:8000/place_order/", {
        user_id: "123", // Example user_id, replace with real user ID
        menu_id: selectedMenuItem.id,
        quantity,
      });

      const botMessage = {
        sender: "FoodBot",
        text: `You ordered ${quantity} ${selectedMenuItem.name}(s). Your order ID is ${orderResponse.data.order_id}.`,
        time: new Date().toLocaleTimeString(),
      };

      setChatMessages([
        ...chatMessages,
        { sender: "User", text: `${quantity} ${selectedMenuItem.name}(s)`, time: new Date().toLocaleTimeString() },
        botMessage,
      ]);
    } catch (error) {
      setChatMessages([
        ...chatMessages,
        { sender: "FoodBot", text: "There was an issue with your order. Please try again.", time: new Date().toLocaleTimeString() },
      ]);
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chat-window" ref={chatContainerRef}>
        {chatMessages.map((msg, index) => (
          <div
            key={index}
            className={`message ${msg.sender === "User" ? "user-message" : "bot-message"}`}
          >
            <strong>{msg.sender}</strong> <span className="time-stamp">({msg.time})</span>: {msg.text}
            {msg.sender === "FoodBot" && msg.quickReplies && (
              <div className="quick-replies">
                {msg.quickReplies.map((reply, idx) => (
                  <button
                    key={idx}
                    className="quick-reply-button"
                    onClick={() => handleQuickReplyClick(reply)}
                  >
                    {reply}
                  </button>
                ))}
              </div>
            )}
          </div>
        ))}
        {isBotTyping && (
          <div className="bot-typing-indicator">
            <span>FoodBot is typing...</span>
          </div>
        )}
      </div>

      <div className="chat-input">
        <input
          type="text"
          value={userInput}
          onChange={handleInputChange}
          placeholder="Ask me something..."
        />
        <button onClick={handleSendMessage}>Send</button>
      </div>

      {selectedMenuItem && (
        <div className="quantity-input">
          <input
            type="number"
            min="1"
            value={quantity}
            onChange={handleQuantityChange}
            placeholder="Enter quantity"
          />
          <button onClick={handlePlaceOrder}>Place Order</button>
        </div>
      )}
    </div>
  );
};

export default Chatbot;
