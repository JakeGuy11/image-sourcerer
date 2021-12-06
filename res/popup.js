notifySignal({ "intent": "relay", "content": "=====================" });
notifySignal({ "intent": "relay", "content": "Starting Popup Script" });
notifySignal({ "intent": "relay", "content": "=====================" });

document.getElementById("toggleEnableButton").addEventListener("click", toggleEnabled);
document.getElementById("viewHelpMessageButton").addEventListener("click", showHelp);

document.getElementById("openGithubPageButton").addEventListener("click", openLink.bind(null, "https://github.com/JakeGuy11/image-sourcerer"));
document.getElementById("reportIssueButton").addEventListener("click", openLink.bind(null, "https://github.com/JakeGuy11/image-sourcerer/issues/new"));
document.getElementById("openDecoderPageButton").addEventListener("click", openLink.bind(null, "https://jakeguy11.github.io/image-sourcerer-site/decode.html"));
document.getElementById("donateButton").addEventListener("click", openLink.bind(null, "https://jakeguy11.github.io/image-sourcerer-site/contribute.html"));
document.getElementById("betaTestButton").addEventListener("click", openLink.bind(null, "https://github.com/JakeGuy11/image-sourcerer/blob/main/beta-testing.md"));

// Update the enabled button text to match whether it's enabled or disabled


function toggleEnabled() {
	console.log("in toggleEnabled");
	// Get the url to toggle
	chrome.tabs.query({active:true,currentWindow:true}, function(tabs) {
		// Clean up the url
		let unparsed_url = tabs[0].url;
		let clean_url = unparsed_url.split("//")[1].split("/")[0];
		let parsing_url = clean_url.split(".");
		parsing_url = parsing_url.splice(0, parsing_url.length-1).splice(1);
		clean_url = parsing_url.join(".");

		notifySignal({ "intent": "toggle_enabled", "site_meta": true, "sender": clean_url + ".js" });
	});
}

function showHelp() {
	// show it here
}

function openLink(url) {
	chrome.tabs.create({
		active: true,
		url:  url
		}, null);
	window.close();
}

function notifySignal(msg) {
	if(!("sender" in msg)) msg.sender = "popup.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
