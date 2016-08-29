'use strict'

module.exports = function (recipientID, payload) {

    if (payload !== null) {

      return {
        recipient: {
          id: recipientID
        },
        message: {
          attachment: {
            type: "template",
            payload: {
              template_type: "button",
              text: payload.text,
              buttons : createButtons(payload.buttons)
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
        type: button.type,
        title: button.text,
        payload:  "USER_DEFINED_PAYLOAD"
      }
    )
  });
  return buttonArray;
}
