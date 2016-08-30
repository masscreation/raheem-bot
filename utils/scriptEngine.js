'use strict';

let scripts = [
  "varScript",
  "locationScript"
];

let scriptArray = [];

let loadScripts = function(){
  scripts.forEach(function(script){
    scriptArray.push(require(`./scripts/${script}`));
  });
}

loadScripts();

module.exports = {

  digest(content, message) {
    scriptArray.forEach(function(script){
      script(content, message);
    });
  },

  format(content, message) {
    scriptArray.forEach(function(script){
      let new_message = script(content, message);
      new_message ? message = new_message : null
    });

    return message;
  }
}
