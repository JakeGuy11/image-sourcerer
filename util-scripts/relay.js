console.log("========================");
console.log("Starting Relay Script...");
console.log("========================");

browser.runtime.onMessage.addListener(startMessageRelay);

function startMessageRelay(msg) {
	browser.tabs.query({currentWindow: true, active : true}).then(tabs => {
		console.log(tabs[0].id);
		browser.tabs.sendMessage(tabs[0].id, {command: "start",});
	});
}