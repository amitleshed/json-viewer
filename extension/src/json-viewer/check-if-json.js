var extractJSON = require('./extract-json');

function getPreWithSource() {
  var childNodes = document.body.childNodes;

  if (childNodes.length === 1) {
    var childNode = childNodes[0];
    var nodeName = childNode.nodeName
    var textContent = childNode.textContent

    if (nodeName === "PRE") {
      return childNode;

    // if Content-Type is text/html
    } else if (nodeName === "#text" && !/^\s+$/g.test(textContent)) {
      if (process.env.NODE_ENV === 'development') {
        console.debug("[JSONViewer] Loaded from a text node, this might have returned content-type: text/html");
      }

      var pre = document.createElement("pre");
      pre.textContent = textContent;
      document.body.removeChild(childNode);
      document.body.appendChild(pre);
      return pre;
    }
  }

  return null
}

function isJSON(jsonStr) {
  var str = jsonStr;
  if (!str || str.length === 0) {
    return false
  }

  str = str.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
  str = str.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
  str = str.replace(/(?:^|:|,)(?:\s*\[)+/g, '')
  return (/^[\],:{}\s]*$/).test(str)
}

function isJSONP(jsonStr) {
  return isJSON(extractJSON(jsonStr));
}

function checkIfJson(sucessCallback, element) {
  var pre = element || getPreWithSource();

  if (pre !== null &&
    pre !== undefined &&
    (isJSON(pre.textContent) || isJSONP(pre.textContent))) {

    sucessCallback(pre);
  }
}

module.exports = checkIfJson;
