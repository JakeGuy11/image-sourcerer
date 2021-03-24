console.log("=======================");
console.log("Starting Main Script...");
console.log("=======================");

browser.runtime.onMessage.addListener(saveImage);

function saveImage(msg) {
	console.log("Message SaveName: " + msg.saveName);
}