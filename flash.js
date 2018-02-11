class Message {
  constructor(message, type) {
    this.message = message;
    this.type = type;
  }
}

class Flasher {
  constructor() {
    this.messageBag = [];
  }

  flash({ message, type = "ok" }) {
    this.messageBag.push(new Message(message, type));
  }

  getFlash() {
    return this.messageBag.pop();
  }
}

var flasher = new Flasher();

module.exports = flasher;
