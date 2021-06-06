sleep(1000);
notifySignal({ "intent": "relay", "content": "========================" });
notifySignal({ "intent": "relay", "content": "Starting Danbooru Script" });
notifySignal({ "intent": "relay", "content": "========================" });

// Handle the download
function download_post(src, post_link, op) {
	
	var extention = "";
	
	if(src.includes(".jpg")){
		extention = ".jpg";
	} else if(src.includes(".png")) {
		extention = ".png";
	} else if(src.includes(".gif")) {
		extention = ".gif";
	} else {
		notifySignal({ "intent": "relay", "content": "Extention could not be found." });
		return;
	}

	var save_name = prompt("Enter the path (relative to ~/Downloads/Image-Sourcerer/) and filename you would like to save the image under","");
	
	if (save_name == null || save_name == "") return;
	if(save_name.includes("..")){
		alert("Your save location cannot include '..'");
		return;
	}

	notifySignal({
		"intent": "queue_download",
		"target_url": src,
		"post_src": post_link,
		"save_name": "Image-Sourcerer/" + save_name,
		"ext": extention,
		"op": op
	});
}

// First, find the link to the image
var link_to_image = document.getElementById("post-info-size").childNodes.item(1).href;

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
