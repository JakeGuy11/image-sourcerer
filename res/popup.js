notifySignal({ "intent": "relay", "content": "=====================" });
notifySignal({ "intent": "relay", "content": "Starting Popup Script" });
notifySignal({ "intent": "relay", "content": "=====================" });

document.getElementById("openGithubPageButton").addEventListener("click", openLink.bind(null, "https://github.com/JakeGuy11/image-archive"));
document.getElementById("reportIssueButton").addEventListener("click", openLink.bind(null, "https://github.com/JakeGuy11/image-sourcerer/issues/new"));
document.getElementById("openDecoderPageButton").addEventListener("click", openLink.bind(null, "https://jakeguy11.github.io/image-sourcerer/decode.html"));
document.getElementById("donateButton").addEventListener("click", openLink.bind(null, "https://paypal.me/JakeGuy11"));
document.getElementById("openDecoder").addEventListener("click", openDecoder);
document.getElementById("goBackButton").addEventListener("click", closeDecoder);
document.getElementById("goBackButtonColoured").addEventListener("click", closeDecoder);

//This next chunk is just a copy/paste from the decoding document

var fileInput = document.getElementById("fileDrop");
fileInput.onchange = function(event) {
   var fileList = event.target.files;
   var interestedFile = fileList[0];

   let imageReader = new FileReader();
   imageReader.readAsDataURL(interestedFile);

	imageReader.onload = function() {
		document.getElementById("dataContainer").innerHTML = "";
       var splitFile = imageReader.result.split("THISISUNIQUE");
       var splitFileSecond = splitFile[1].split("THISISUNIQUA");
       var encodedData = splitFileSecond[0];
       var dataArray = atob(encodedData).split(";&&;");
       document.getElementById("dataContainer").innerHTML += "<br>~/Downloads/" + dataArray[2] + "<br><a id=\"postLink\" href=\"\">Source Post</a><br><br>";
       document.getElementById("postLink").addEventListener("click", openLink.bind(null, dataArray[1]));
	};
}

//

function closeDecoder() {
	document.getElementById("openingPage").style.display = "block";
	document.getElementById("decoderPanel").style.display = "none";
}

function openDecoder() {
	document.getElementById("openingPage").style.display = "none";
	document.getElementById("decoderPanel").style.display = "block";
}

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
