sleep(1000);
notifySignal({ "intent": "relay", "content": "=======================" });
notifySignal({ "intent": "relay", "content": "Starting Twitter Script" });
notifySignal({ "intent": "relay", "content": "=======================" });

//Load the feed here. If there are multiple types of feeds to check (ex. home feed, profile feed, single post w details, etc.), put all node parsing in a try statement
//var feedNodeList = feedNodeList = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0);
//Create a var for the last feed size so the page isn't actually updated every 3 seconds
var oldListSize = 0;

//Add a function to handle downloads. Although not required, it is **HIGHLY** recommended that you provide the user with a prompt to let them choose the download location
//This is the actual download command:
//notifySignal({
//	"intent": "queue_download",
//	"target_url": "this is the url of the actual image",
//	"post_src": "the link to the actual post, not the raw image",
//	"save_name": "the name and path relative to ~/Downloads/Image-Sourcerer/ to save the file under",
//	"ext": "a simple '.jpg', '.png', etc. depending on the image",
//	"cors_risk": "[OPTIONAL] whether or not this image could be at risk for being blocked by the CORS. This doesn't do anything yet"
	//Eventually, more things like author will be implemented, but this is it for now
//});

function refreshNodes() {

	var feedNodeList = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0);
	
	if(oldListSize < feedNodeList.length) {
		
		notifySignal({ "intent": "relay", "content": "Posts updated from " + oldListSize + " to " + feedNodeList.length });
		
		oldListSize = feedNodeList.length;
		
		var element = document.getElementsByTagName("idl_button");
		
		for (var index = element.length - 1; index >= 0; index--) {
		    element[index].parentNode.removeChild(element[index]);
		}
		
		for(var i = 0; i < feedNodeList.length; i++) {
			try {
				//Navigate to the post in the current node
				//Get all needed information, like the image url, title, source for tracking, etc.
				//Create the html to inject for the button. Don't change too much here, stick to trivial things like the height and align
				var buttonLink = '<idl_button align="right"><a><img src="' + chrome.runtime.getURL("icons/download.png") + '" width=32></a></idl_button>';
				//Now inject the button

				//Get that button you just injected as a DOM element so we can add a listener
				//To add the listener (each item after null will be passed as an argument):
				youtButtonElement.addEventListener("click", yourFunctionForDownloading.bind(null, arg1, arg2, argn), false);
			} catch (err1) {
				//In each catch, add parsing for a different type of post, ex. image posts vs. gif posts vs. link posts etc.
			}
		}
	}
}

//Refresh the nodes every 3 seconds
//This assumes the site updates the feed programmatically as you scroll
//If it does not, just call refreshNodes();
var intervalId = setInterval(refreshNodes, 5000);

//Touch NOTHING below here
//A simple sleep function. Don't use this, it's only for a small delay at the start
function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

//Send a message to everything. It will be picked up by relay.js and sent to main.js
function notifySignal(msg) {
	msg.sender = "twitter.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}