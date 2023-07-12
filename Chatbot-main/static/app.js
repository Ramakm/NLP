class Chatbox {
  constructor() {
    this.args = {
      textOptionButton: document.getElementById('textOptionButton'),
      chatBox: document.querySelector('.chatbox__support'),
      sendButton: document.querySelector('.send__button'),
      speechButton: document.querySelector('.speech__button'),
      closeButton: document.getElementById('closeButton'),
      historyButton: document.getElementById('historyButton')
    };
    

    this.state = false;
    this.messages = [];
    this.recognition = null;
    this.history = JSON.parse(localStorage.getItem('chatHistory')) || [];

    window.addEventListener('beforeunload', () => {
      this.clearLocalStorage();
    });
  }

  display() {
  const { closeButton, textOptionButton, chatBox, sendButton, speechButton, historyButton } = this.args;

  textOptionButton.addEventListener('click', () => this.openChatbox(false));

  closeButton.addEventListener('click', () => this.toggleState(chatBox));

  sendButton.addEventListener('click', () => this.onSendButton(chatBox));

  const node = chatBox.querySelector('input');
  node.addEventListener('keyup', ({ key }) => {
    if (key === 'Enter') {
      this.onSendButton(chatBox);
    }
  });

  historyButton.addEventListener('click', () => {
    this.updateConversationHistory();
    this.showConversationHistory();
    this.clearMessages();
  });

  speechButton.addEventListener('click', () => this.startSpeechRecognition());

  // Check if there is existing conversation history and clear it
  const existingHistory = localStorage.getItem('chatHistory');
  if (existingHistory) {
    localStorage.removeItem('chatHistory');
  }
}

  openChatbox(isSpeechOption) {
    const { chatBox, textOptionButton } = this.args;

    chatBox.classList.add('chatbox--active');
  }

  startSpeechRecognition() {
    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.interimResults = false;

    this.recognition.onresult = (event) => {
      const speechResult = event.results[event.results.length - 1][0].transcript;
      const inputField = this.args.chatBox.querySelector('input');
      inputField.value = speechResult;
      this.onSendButton(this.args.chatBox, speechResult);
    };

    this.recognition.onerror = (event) => {
      console.log('Speech recognition error:', event.error);
    };

    this.recognition.start();
  }

  stopSpeechRecognition() {
    if (this.recognition) {
      this.recognition.stop();
    }
  }

  toggleState(chatbox) {
    this.state = !this.state;
  
    if (this.state) {
      chatbox.classList.add('chatbox--active');
    } else {
      chatbox.classList.remove('chatbox--active');
      this.stopSpeechRecognition();
      this.clearDisplayedMessages(chatbox);
      this.updateConversationHistory(); // Update the conversation history before clearing messages
      this.clearMessages();
    }
  }
  

  onSendButton(chatbox) {
    var textField = chatbox.querySelector('input');
    let text1 = textField.value;
    if (text1 === "") {
      return;
    }
  
    let msg1 = { name: "User", message: text1, tag: "" }
    this.messages.push(msg1);
  
    this.stopSpeechRecognition();
  
    const chatmessage = chatbox.querySelector('.chatbox__messages');
    const userMessageHtml = '<div class="messages__item messages__item--visitor">' + text1 + '</div>';
    chatmessage.innerHTML += userMessageHtml;
    textField.value = '';
  
    fetch('http://127.0.0.1:5000/predict', {
      method: 'POST',
      body: JSON.stringify({ message: text1 }),
      mode: 'cors',
      headers: {
        'Content-Type': 'application/json'
      },
    })
      .then(r => r.json())
      .then(r => {
        const tag = r.tag;
        let msg2 = { name: "Sourav", message: r.answer, tag: tag };
        this.messages.push(msg2);
  
        this.updateChatText(chatbox);
        this.updateConversationHistory();
        //this.clearMessages(); // Clear the messages after updating the history
      })
      .catch((error) => {
        console.error('Error:', error);
        this.updateChatText(chatbox);
        //this.clearMessages(); // Clear the messages even if there is an error
      });
  }
  

  clearMessages() {
    this.messages = [];
  }

  updateChatText(chatbox) {
   var html = '';
        this.messages.slice().reverse().forEach(function(item, index) {
            if (item.name === "Sourav")
            {
                html += '<div class="messages__item messages__item--visitor">' + item.message + '</div>'
            }
            else
            {
                html += '<div class="messages__item messages__item--operator">' + item.message + '</div>'
            }
          });

        const chatmessage = chatbox.querySelector('.chatbox__messages');
        chatmessage.innerHTML = html;
  }
  

  updateConversationHistory() {
    this.history = [...this.history, ...this.messages];
    localStorage.setItem('chatHistory', JSON.stringify(this.history));
    //this.clearMessages(); // Clear the messages array after updating the history
  }
  
  

  showConversationHistory() {
    const conversationHistoryWindow = window.open('', '_blank');
    conversationHistoryWindow.document.write('<html><head><title>Conversation History</title></head><body>');
  
    let allMessagesHtml = '';
    let currentTag = null;
  
    this.history.forEach((item) => {
      if (item.name === 'Sourav') {
        currentTag = item.tag;
        allMessagesHtml += '<h3>' + currentTag + '</h3>';
        allMessagesHtml += '<div class="messages__item messages__item--visitor">' + item.message + '</div>';
      } else {
        allMessagesHtml += '<div class="messages__item messages__item--operator">' + item.message + '</div>';
      }
    }); 
  
    conversationHistoryWindow.document.write('<div class="chatbox__support chatbox--active">');
    //conversationHistoryWindow.document.write('<div class="chatbox__messages">' + '<h3>' + currentTag + '</h3>' + '</div>');
    conversationHistoryWindow.document.write( allMessagesHtml );
    conversationHistoryWindow.document.write('</div>');
  
    conversationHistoryWindow.document.write('</body></html>');
    conversationHistoryWindow.document.close(); 
  }
  
  

  clearConversationHistory() {
    this.history = [];
    localStorage.removeItem('chatHistory');
  }

  clearDisplayedMessages(chatbox) {
    const chatmessage = chatbox.querySelector('.chatbox__messages');
    chatmessage.innerHTML = '';
  }
  clearLocalStorage() {
    this.clearConversationHistory();
    localStorage.clear();
  }

}

const chatbox = new Chatbox();
chatbox.display();
