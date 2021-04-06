notifySignal({ "intent": "relay", "content": "=====================" });
notifySignal({ "intent": "relay", "content": "Starting Popup Script" });
notifySignal({ "intent": "relay", "content": "=====================" });

document.getElementById("openGithubPageButton").addEventListener("click", openGithubPage);
document.getElementById("openGithubTemplateButton").addEventListener("click", openGithubTemplate);
document.getElementById("downloadDecoder").addEventListener("click", downloadDecoder);
document.getElementById("openDecoder").addEventListener("click", openDecoder);

function openDecoder() {
	document.getElementById("openingPage").style.display = "none";
	document.getElementById("decoderPanel").style.display = "block";
}

function openGithubPage(){
	chrome.tabs.create({
		active: true,
		url:  'https://github.com/JakeGuy11/image-archive'
		}, null);
}

function openGithubTemplate(){
	chrome.tabs.create({
		active: true,
		url:  'https://github.com/JakeGuy11/image-sourcerer/blob/main/page-scripts/_template.js'
		}, null);
}

function downloadDecoder() {
	notifySignal({ "intent": "download", "target_url": "https://raw.githubusercontent.com/JakeGuy11/image-sourcerer/main/res/decoder.html", "save_name": "image-sourcerer-decoder", "ext": ".html" });
}

function notifySignal(msg) {
	msg.sender = "popup.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
