console.log("========================");
console.log("Starting Relay Script...");
console.log("========================");

chrome.runtime.onMessage.addListener(startMessageRelay);

function startMessageRelay(msg) {

	chrome.tabs.getSelected(null, function(tabs) {
		console.log("message recived:");
		console.log(msg);
		console.log("Sending to tab #" + tabs.id);
		chrome.tabs.sendRequest(tabs.id, msg);
	});
}
