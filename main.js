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
					var dataToInject = "v001" + ";&&;" + recMsg.post_src + ";&&;" + recMsg.save_name + recMsg.ext;
					var encodedData = btoa(dataToInject).replace(/=/g, "");
					var injectionContent = "THISISUNIQUE" + encodedData + "THISISUNIQUE";
					while(injectionContent.length % 4 != 0){
						injectionContent += "X";
					}
					injectedDataURL = firstChars + lastCharsPreEquals + injectionContent;
					console.log(injectedDataURL);
					notifySignal({ "intent": "download", "target_url": injectedDataURL, "save_name": recMsg.save_name, "ext": recMsg.ext });
				});
				break;
			case "download":
				break;
			case "undefined_intent":
				console.log("[" + recMsg.sender + "][Intent not specified]: " + JSON.stringify(recMsg));
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
	xhr.onerror = (e) => alert("Due to the CORS policy of the server,\nthe image could not be downloaded. It is\nrecommended that you download the chrome\nextension \"Allow CORS\" and try again.");
	xhr.open('GET', url);
	xhr.responseType = 'blob';
	xhr.send();
}

function notifySignal(msg) {
	msg.sender = "main.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
