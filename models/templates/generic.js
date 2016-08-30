'use strict';

module.exports = function (recipientID, payload) {

    if (payload !== null) {

      return {
        "recipient": {
          "id": recipientID
        },
          "message": {
            "attachment": {
              "type": "template",
              "payload": {
                "template_type": "generic",
                "elements": createElements(payload)
                }
              }
            }
          }
        }
      }

function createElements(elements) {
  console.log(elements)
  let elementsArray = [];
  elements.forEach(function(elements) {
    elementArray.push(
      {
        "title": element.title,
        "image_url": element.imageUrl ? element.imageUrl : null,
        "type": element.subtitle ? element.subtitle : null,
        "buttons": createElements(element.buttons)
      }
    )
  });
  return elementArray;
}

function createButtons(buttons) {
  let buttonArray = [];
  buttons.forEach(function(button) {
    buttonArray.push(
      {
        "type": button.type,
        "text": button.text,
        "payload": button.data
      }
    )
  });
  return buttonArray;
}
