notifySignal({ "intent": "relay", "content": "=====================" });
notifySignal({ "intent": "relay", "content": "Starting Popup Script" });
notifySignal({ "intent": "relay", "content": "=====================" });

document.getElementById("openGithubPageButton").addEventListener("click", openLink.bind(null, "https://github.com/JakeGuy11/image-archive"));
document.getElementById("reportIssueButton").addEventListener("click", openLink.bind(null, "https://github.com/JakeGuy11/image-sourcerer/issues/new"));
document.getElementById("openDecoderPageButton").addEventListener("click", openLink.bind(null, "https://jakeguy11.github.io/image-sourcerer/decode.html"));
document.getElementById("donateButton").addEventListener("click", openLink.bind(null, "https://paypal.me/JakeGuy11"));
document.getElementById("betaTestButton").addEventListener("click", openLink.bind(null, "https://github.com/JakeGuy11/image-sourcerer/blob/main/beta-testing.md"));

function openLink(url){
	chrome.tabs.create({
		active: true,
		url:  url
		}, null);
	window.close();
}

function notifySignal(msg) {
	msg.sender = "popup.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
