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
    let type = button.type !== undefined ? "url" : "button";
    console.log("BUTTON TYPE", button.type);
    buttonArray.push(
      {
        "type": type,
        "title": button.title,
        "payload": button.data
      }
    )
  });
  return buttonArray;
}
