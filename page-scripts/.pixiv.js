sleep(1000);
notifySignal({ "intent": "relay", "content": "=====================" });
notifySignal({ "intent": "relay", "content": "Starting Pixiv Script" });
notifySignal({ "intent": "relay", "content": "=====================" });

// This is just some code I don't want to lose - it'll allow parsing of japanese/chinese/non-ascii characters
/*
btoa(unescape(encodeURIComponent("私のString")));
decodeURIComponent(escape(window.atob("56eB44GuU3RyaW5n")));
*/

/*
notifySignal({
	"intent": "queue_download",
	"target_url": "this is the url of the actual image",
	"post_src": "the link to the actual post, not the raw image",
	"save_name": "the name and path relative to ~/Downloads/Image-Sourcerer/ to save the file under",
	"ext": "a simple '.jpg', '.png', etc. depending on the image",
	"op": "the original poster as a string. Do not omit site specific tags such as '@' or 'u/'",
	"custom_header": false,
	"header_name": "the name of the header",
	"header_content": "the value of the header"
});
*/

function refreshNodes() {

	var feedNodeList = document.body.getElementsByClassName("iasfms-3 hvlsSe");

	for (var i = 0; i < feedNodeList.length; i++) {
		var currentNode = feedNodeList[i];

		// If we haven't parsed this element yet
		if(currentNode.getElementsByTagName("idl_button").length == 0) {
			var image_url = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).src;
			var author = currentNode.childNodes.item(2).childNodes.item(0).childNodes.item(1).innerText;
			var link_to_post = currentNode.childNodes.item(1).childNodes.item(0).href;
				
			var buttonLink = '<idl_button align="right"><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center></idl_button>';
			if (image_url != null){
				currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).innerHTML += buttonLink;
				
				var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
			}
		}
	}
}

refreshNodes();
var intervalId = setInterval(refreshNodes, 3000);

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "pixiv.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
