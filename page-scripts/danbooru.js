sleep(1000);
notifySignal({ "intent": "relay", "content": "========================" });
notifySignal({ "intent": "relay", "content": "Starting Danbooru Script" });
notifySignal({ "intent": "relay", "content": "========================" });

// Handle the download
function download_post(src, post_link, op) {
	
	// Get what the user wants to save it as

	// Parse for the file ext
	
	// Send it to download

	notifySignal({
		"intent": "queue_download",
		"target_url": src,
		"post_src": post_link,
		"save_name": "testimg",
		"ext": ".jpg",
		"op": op
	});
}

// First, find the link to the image
var link_to_image = document.getElementById("content").getElementsByTagName("img")[0].src;

// Get the url to save it with
var post_link = document.getElementById("post-info-source").childNodes.item(1).href;

// Get the OP
var original_poster = document.getElementsByClassName("artist-tag-list")[1].childNodes.item(1).getAttribute("data-tag-name");

// Inject the button, add the listener
var button_element = '<idl_button id="idl_button"><br><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" width=64></a><br></idl_button>';
document.getElementById("post-information").innerHTML += button_element;
document.getElementById("idl_button").addEventListener("click", download_post.bind(null, link_to_image, post_link, original_poster), false);

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "danbooru.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
