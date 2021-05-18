//Note: This script is never to be called. It will do nothing, assuming it does not throw an error

//**IMPORTANT**: Make sure you read all the comments. They explain what main.js is expecting for downloading and how to pass it.

//It is a template that will tell you how to create your own page script supported by the extension
//This will not work for every site, it is just a template to explain how it's basicaly done
//Implementation instructions will be added in the future

//Wait a little so main.js can get listening before we send messages
sleep(1000);
notifySignal({ "intent": "relay", "content": "==========================" });
notifySignal({ "intent": "relay", "content": "Starting [PageName] Script" });
notifySignal({ "intent": "relay", "content": "==========================" });

//Add a function to handle downloads. Although not technically required, it is **HIGHLY** recommended that you provide the user with a prompt to let them choose the download location
//This is the actual download command:
notifySignal({
	"intent": "queue_download",
	"target_url": "this is the url of the actual image",
	"post_src": "the link to the actual post, not the raw image",
	"save_name": "the name and path relative to ~/Downloads/Image-Sourcerer/ to save the file under",
	"ext": "a simple '.jpg', '.png', etc. depending on the image",
	"op": "the original poster as a string. Do not omit site specific tags such as '@' or 'u/'",
	"cors_risk": "[OPTIONAL] whether or not this image could be at risk for being blocked by the CORS. This doesn't do anything yet",
	"custom_header": false, // if you need a custom https header
	"header_name": "the name of the header",
	"header_content": "the value of the header"
});

function refreshNodes() {
	//Updated the feed
	var feedNodeList = "get a list of nodes of things to parse";

	// The following is what's most common, but note that a lot of sites will need something totally different, and that's fine.

	//If there are new posts in the feed, do what needs to be done
	if(oldListSize < feedNodeList.length) {
		//This notification is optional, just to explain how this works
		//Instead of using console.log (so DON'T USE CONSOLE.LOG), this relays a message to main.js which will be handled accordingly
		//If you just want to print something, set the intent to relay (and put the message under content). If you want to download something, set it to queue_download
		notifySignal({ "intent": "relay", "content": "Posts updated from " + oldListSize + " to " + feedNodeList.length });
		//Update the feed size
		oldListSize = feedNodeList.length;
		//Get every idl_button (legacy from internet-downloader)
		var element = document.getElementsByTagName("idl_button");
		//Remove them all
		for (var index = element.length - 1; index >= 0; index--) {
		    element[index].parentNode.removeChild(element[index]);
		}
		//This part will be less concrete;
		//Go through each node (post) in the queue, inject the download button to a specific place and add a listener to download (example coming up)
		for(var ii = 0; ii < feedNodeList.length; ii++) {
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
refreshNodes();

var intervalId = setInterval(refreshNodes, 3000);

//Touch NOTHING below here except for msg.sender
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
	msg.sender = "your base website";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}