'use strict'

module.exports = function (recipientID, payload) {
    console.log("QUICKREPLY PAYLOAD", payload)
    if (payload !== null) {

      return {
        "recipient": {
          "id": recipientID
        },
        "message": {
          "text": payload.text,
          "quick_replies": createQuickReplies(payload.options)
          }
        }
      }
    }

function createQuickReplies(quickReplies) {
  let quickReplyArray = [];
  quickReplies.forEach(function(quickReply) {
    quickReplyArray.push(
      {
        "content_type": "text",
        "title": quickReply.title,
        "payload": quickReply.data
      }
    )
  });
  return quickReplyArray;
}
