console.log("[main.js]: =======================");
console.log("[main.js]: Starting Main Script...");
console.log("[main.js]: =======================");

chrome.extension.onRequest.addListener(messageRecieved);

var downloaded;

function messageRecieved(recMsg) {
	try{
		switch (recMsg.intent) {
			case "relay":
				console.log("[" + recMsg.sender + "]: " + recMsg.content);
				break;
			case "queue_download":
				toDataURL(recMsg.target_url, function(dataUrl) {
					var lastChars = dataUrl.substr(-10);
					var firstChars = dataUrl.substr(0, dataUrl.length - 10);
					var equalsCount = 0;
					for (var x = lastChars.length-1; x >= 0; x--)
					{
					    var c = lastChars.charAt(x);
					    if(c == "="){
					    	equalsCount++;
					    }
					}
					var lastCharsPreEquals = lastChars.slice(0, 10-equalsCount);
					var lastCharsPostEquals = "";
					for (var i = 0; i < equalsCount; i++){
						lastCharsPostEquals += "=";
					}

					console.log(firstChars + lastCharsPreEquals + "datahere" + lastCharsPostEquals);
					//console.log("[" + recMsg.sender + "]: Downloading \"" + recMsg.target_url + "\" as ~/Downloads/" + recMsg.save_name + recMsg.ext);
					//notifySignal({ "intent": "download", "target_url": recMsg.target_url, "save_name": recMsg.save_name, "ext": recMsg.ext });
				});
				break;
			case "download":
				break;
			case "undefined_intent":
				console.log("[" + recMsg.sender + "][Intent not specified]: " + recMsg.content);
				break;
			default:
				console.log("[main.js]: Untagged message recieved:");
				console.log(recMsg);
		}
	} catch (overallerr) {
		console.log(overallerr);
	}
}

function toDataURL(url, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var reader = new FileReader();
		reader.onloadend = function() {
			callback(reader.result);
		}
		reader.readAsDataURL(xhr.response);
	};
	xhr.onerror = (e) => alert("Due to the CORS policy of the image,\n\
								it could not be downloaded. It is\n\
								recommended that you download the chrome\n\
								extension \"Allow CORS\" and try again.");
	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send();
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "reddit.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
