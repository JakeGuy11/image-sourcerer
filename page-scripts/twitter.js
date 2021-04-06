sleep(1000);
notifySignal({ "intent": "relay", "content": "=======================" });
notifySignal({ "intent": "relay", "content": "Starting Twitter Script" });
notifySignal({ "intent": "relay", "content": "=======================" });

var oldListSize = 0;

function startDownload(url, pageLink, likeButton) {
	likeButton.click();
	var extention = "";
	url = url.replace("name=small", "name=large");
	if(url.includes("format=jpg")){
		extention = ".jpg";
	} else if(url.includes("format=png")) {
		extention = ".png";
	} else {
		notifySignal({ "intent": "relay", "content": "Extention could not be found." });
		return;
	}
	var saveName = prompt("Enter the path (relative to ~/Downloads/Image-Sourcerer/) and filename you would like to save the image under","");
	if(saveName.includes("..")){
		alert("Your saveName cannot include '..'");
		return;
	}
	var CORSRisk = false;
	if(url.includes("i.redd.it")){
		CORSRisk = true;
	}
	notifySignal({ "intent": "queue_download", "target_url": url, "save_name": "Image-Sourcerer/" + saveName, "ext": extention, "post_src": pageLink , "cors_risk": CORSRisk });
}

function refreshNodes() {

	var feedNodeList = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;

	if(oldListSize < feedNodeList.length) {
		
		notifySignal({ "intent": "relay", "content": "Posts updated from " + oldListSize + " to " + feedNodeList.length });
		
		oldListSize = feedNodeList.length;
		
		var element = document.getElementsByTagName("idl_button");
		
		for (var index = element.length - 1; index >= 0; index--) {
		    element[index].parentNode.removeChild(element[index]);
		}
		
		for(var i = 0; i < feedNodeList.length; i++) {
			try {
				var currentNode = feedNodeList.item(i);
				var linkToImage = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(1).src;
				var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).href;

				var buttonLink = '<br><idl_button align="right"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" width=32></a></idl_button>';
				currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).innerHTML += buttonLink;

				//Get that button you just injected as a DOM element so we can add a listener
				//To add the listener (each item after null will be passed as an argument):
				//youtButtonElement.addEventListener("click", yourFunctionForDownloading.bind(null, arg1, arg2, argn), false);
			} catch (err1) {
				//In each catch, add parsing for a different type of post, ex. image posts vs. gif posts vs. link posts etc.
			}
		}
	}
}


setTimeout(function() {
		var intervalId = setInterval(refreshNodes, 3000);
	}, 7500);
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "twitter.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}