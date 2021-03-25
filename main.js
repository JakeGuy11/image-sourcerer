console.log("[main.js]: =======================");
console.log("[main.js]: Starting Main Script...");
console.log("[main.js]: =======================");

browser.runtime.onMessage.addListener(messageRecieved);

function messageRecieved(recMsg) {
	switch (recMsg.intent) {
		case "relay":
			console.log("[" + recMsg.sender + "]: " + recMsg.content);
		break;
		case "queue_download":
			console.log("[" + recMsg.sender + "]: Downloading \"" + recMsg.target_url + "\" as ~/Downloads/" + recMsg.save_name + recMsg.ext);
			notifySignal({ "intent": "download", "target_url": recMsg.target_url, "save_name": recMsg.save_name, "ext": recMsg.ext });
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
}

function notifySignal(msg) {
	msg.sender = "reddit.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	browser.runtime.sendMessage(msg);
}