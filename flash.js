class Message {
  constructor(message, type = 'ok') {
    this.message = message;
    this.type = type;
  }
}

class Flasher {
  constructor() {

  }

  /**
  * Flashes messages to the session
  * @param {Object} Express request object
  * @param {Array|String} Message or bag of messages
  */
  flash(request, messages, error = false) {
    if (typeof request.session.messageBag === 'undefined') {
      request.session.messageBag = [];
    }
    let m = [];
    if (!Array.isArray(messages)) {
      m = [messages];
    } else {
      m = messages;
    }
    m.forEach((message) => {
        if (typeof message === "string") {
          let type = 'ok';
          if (error) {
            type = 'error';
          }
          request.session.messageBag.push(new Message(message, type));
        } else {
          request.session.messageBag.push(new Message(message.message, message.type));
        }
    });
  }

  getFlash(request) {
    var messages = request.session.messageBag;
    request.session.messageBag = [];
    return messages;
  }
}

var flasher = new Flasher();

module.exports = flasher;
