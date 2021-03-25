console.log("[main.js]: =======================");
console.log("[main.js]: Starting Main Script...");
console.log("[main.js]: =======================");

browser.runtime.onMessage.addListener(messageRecieved);

function messageRecieved(msg) {
	switch (msg.action) {
		case "relay":
			console.log("[" + msg.sender + "]: " + msg.content);
		break;
		case "download":
			console.log("[" + msg.sender + "]: Downloading " + msg.target_url);
		break;
		default:
			console.log("[main.js]: Untagged message recieved:");
			console.log(msg);
	}
}