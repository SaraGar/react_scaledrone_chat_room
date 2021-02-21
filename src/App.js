import React, { Component } from 'react';
import './App.css';
import Messages from "./Messages";
import Input from "./Input";

function randomName() {
  const adjectives = [
    "bitter", "hidden", "silent", "thin", "dark", "quiet", "delicate", "blue",
    "bald", "small", "old", "bouncy", "wild", "tireless", "funny", "witty", "patient", "single", "bright", "dirty", "old", "baby", "purple", "shy", "brave", "funny", "pretty", "giggly", "clumsy", "lazy", "dull", "colorful", "skillful", "insightful", "sluggish", "confident", "weird", "friendly", "smart", "melancholic"
  ];
  const nouns = [
    "deer", "turtle", "dog", "cat", "lizard", "squirrel", "beaver", "rabbit", "armadillo", "pangolin", "bat", "guinea pig", "zebra", "octopus", "quail", "sparrow", "sole", "shark", "whale", "pig", "dolphin", "iguana", "llama", "canary", "hen", "bear", "wolf", "fox", "wild boar", "wildebeest", "wombat", "raccoon", "cow", "goose", "lion", "panther", "tiger", "puma", "koala", "kangaroo", "ox", "macaque", "snake", "monkey", "sperm whale", "otter", "platypus", "snake", "snake", "monkey", "otter", "platypus", "snake", "viper"
  ];
  const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return  adjective + '_' + noun;
}

function randomColor() {
  return '#' + Math.floor(Math.random() * 0xFFFFFF).toString(16);
}

class App extends Component {
  state = {
    messages: [],
    member: {
      username: randomName(),
      color: randomColor(),
    }
  }

  constructor() {
    super();
    this.drone = new window.Scaledrone("fo1Ifhz3zvATmUBv", {
      data: this.state.member
    });
    this.drone.on('open', error => {
      if (error) {
        return console.error(error);
      }
      const member = {...this.state.member};
      member.id = this.drone.clientId;
      this.setState({member});
    });
    const room = this.drone.subscribe("observable-room");
    room.on('data', (data, member) => {
      const messages = this.state.messages;
      messages.push({member, text: data});
      this.setState({messages});
    });
  }

  render() {
    return (
      <div className="App">
        <div className="App-header">
          <h1>Chat room</h1>
        </div>
        <Messages
          messages={this.state.messages}
          currentMember={this.state.member}
        />
        <Input
          onSendMessage={this.onSendMessage}
        />
        <div className='thanks'>Thanks to Marin Bencevic for the <a href='https://www.scaledrone.com/blog/tutorial-build-a-reactjs-chat-app/'>tutorial</a>!</div>
      </div>
    );
  }

  onSendMessage = (message) => {
    this.drone.publish({
      room: "observable-room",
      message
    });
  }

}

export default App;
