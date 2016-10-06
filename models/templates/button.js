'use strict'

module.exports = function (recipientID, payload) {
  console.log(payload);

    if (payload !== null) {

      return {
        "recipient": {
          "id": recipientID
        },
        "message": {
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "button",
              "text": payload.text,
              "buttons": createButtons(payload.options)
            }
          }
        }
      }
    }
  }

function createButtons(buttons) {
  let buttonArray = [];
  buttons.forEach(function(button) {
    buttonArray.push(
      {
        "type": "postback",
        "title": button.title,
        "payload": button.data
      }
    )
  });
  return buttonArray;
}
