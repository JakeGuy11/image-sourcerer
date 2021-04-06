notifySignal({ "intent": "relay", "content": "=====================" });
notifySignal({ "intent": "relay", "content": "Starting Popup Script" });
notifySignal({ "intent": "relay", "content": "=====================" });

document.getElementById("openGithubPageButton").addEventListener("click", openGithubPage);
document.getElementById("openGithubTemplateButton").addEventListener("click", openGithubTemplate);
document.getElementById("downloadDecoder").addEventListener("click", downloadDecoder);
document.getElementById("openDecoder").addEventListener("click", openDecoder);

//This next chunk is just a copy/paste from the decoding document

var fileInput = document.getElementById("fileDrop");
fileInput.onchange = function(event) {
   var fileList = event.target.files;
   var interestedFile = fileList[0];

   let imageReader = new FileReader();
   imageReader.readAsDataURL(interestedFile);

	imageReader.onload = function() {
       var splitFile = imageReader.result.split("THISISUNIQUE");
       var splitFileSecond = splitFile[1].split("THISISUNIQUA");
       var encodedData = splitFileSecond[0];
       var dataArray = atob(encodedData).split(";&&;");
       document.getElementById("dataContainer").innerHTML += dataArray[2] + "<br><a href=\"" + dataArray[1] + "\">Source Post</a><br><br>";
	};
}

//

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
