'use strict';

let scripts = [
  "varScript"
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
      message = script(content, message);
    });

    return message;
  }
}
