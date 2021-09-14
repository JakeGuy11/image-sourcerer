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
				toDataURL(recMsg, function(dataUrl) {
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
					var dataToInject = "v003" + ";&&;" + recMsg.post_src + ";&&;" + recMsg.save_name + recMsg.ext + ";&&;" + recMsg.op;
					var encodedData = btoa(escape(dataToInject)).replaceAll("=","");
					var injectionContent = "THISISUNIQUE" + encodedData + "THISISUNIQUE";
					while(injectionContent.length % 4 != 0) {
						injectionContent += "X";
					}
					injectedDataURL = firstChars + lastCharsPreEquals + injectionContent;
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

function toDataURL(obj, callback) {
	var xhr = new XMLHttpRequest();
	xhr.onload = function() {
		var reader = new FileReader();
		reader.onloadend = function() {
            callback(reader.result);
		}
		reader.readAsDataURL(xhr.response);
	};
    xhr.onerror = function() { // only triggers if the request couldn't be made at all
        console.log(`Error ${xhr.status}: ${xhr.statusText}`);
    };
    if (("custom_header" in obj) && (obj.custom_header)) proxy_needed = true;
    else proxy_needed = false;
    if (!proxy_needed){
        xhr.open('GET', obj.target_url);
        xhr.responseType = "blob";
    }
    else {
        obj.target_url = obj.target_url.replace("&", "^^^");
        xhr.open('GET', "https://img-sourcerer-proxy.herokuapp.com/custom_header.php?name=" + obj.header_name + "&content=" + obj.header_content + "&src=" + obj.target_url + "&ext=" + obj.ext.split('.')[1]);
        console.log("[main.js]: Downloading https://img-sourcerer-proxy.herokuapp.com/custom_header.php?name=" + obj.header_name + "&content=" + obj.header_content + "&src=" + obj.target_url + "&ext=" + obj.ext.split('.')[1]);
        xhr.responseType = "blob";
	}
    xhr.send();
}

function notifySignal(msg) {
	msg.sender = "main.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
