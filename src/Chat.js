import React, { Component } from "react";
import { Client } from "@stomp/stompjs";

class Chat extends Component {
  constructor() {
    super();
    this.state = {
      username: "",
      role: "",
      client: null,
    };
  }

  componentDidMount() {
    this.connect();
  }

  showMessage(value, user, timestamp) {
    const response = document.getElementById("response");

    const messageContainer = document.createElement("div");
    messageContainer.className = "message";

    const userSpan = document.createElement("span");
    userSpan.textContent = user + ": ";
    messageContainer.appendChild(userSpan);

    const messageSpan = document.createElement("span");
    messageSpan.textContent = value + " ";
    messageContainer.appendChild(messageSpan);

    const timestampSpan = document.createElement("span");
    timestampSpan.className = "timestamp";
    timestampSpan.textContent = timestamp;
    messageContainer.appendChild(timestampSpan);

    response.appendChild(messageContainer);
  }

  getCurrentTimestamp() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    const seconds = now.getSeconds().toString().padStart(2, "0");
    return hours + ":" + minutes + ":" + seconds;
  }

  connect() {
    try {
      const { username, role } = this.state;
      this.setState({ username, role });
      const jwtToken = "/nwmbEe24SlrwOMCI/tJPfxUuBYZhDV151svTWQjQ0c="; // Zastąp tym swoim rzeczywistym tokenem JWT

      this.client = new Client({
        brokerURL: "ws://localhost:8080/chat/websocket",

        debug: function (str) {
          console.log(str);
        },
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
        beforeConnect: () => ({
          Authorization: `Bearer ${jwtToken}`,
        }),
      });

      this.client.onConnect = (frame) => {
        this.client.subscribe("/topic/messages", (message) => {
          const parsedMessage = JSON.parse(message.body);
          this.showMessage(
            parsedMessage.value,
            parsedMessage.user,
            this.getCurrentTimestamp()
          );
        });
      };

      this.client.activate();
    } catch (error) {
      console.error("Błąd połączenia:", error);
    }
  }

  sendMessage() {
    try {
      const messageToSend = document.getElementById("messageToSend").value;
      const user = document.getElementById("user").value;

      if (user.trim() === "" || messageToSend.trim() === "") {
        console.error("Użytkownik i wiadomość nie mogą być puste.");
        return;
      }

      this.client.publish({
        destination: "/app/chat",
        body: JSON.stringify({ value: messageToSend, user }),
      });

      document.getElementById("messageToSend").value = "";
    } catch (error) {
      console.error("Błąd podczas wysyłania wiadomości:", error);
    }
  }

  render() {
    return (
      <div className="chat-container">
        {/* Your chat UI elements go here */}
        <div id="response"></div>
        <input type="text" id="messageToSend" />
        <input type="text" id="user" />
        <button onClick={() => this.sendMessage()}>Send</button>
      </div>
    );
  }
}

export default Chat;
