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
		"target_url": "this is the url of the actual image",
		"post_src": "the link to the actual post, not the raw image",
		"save_name": "the name and path relative to ~/Downloads/Image-Sourcerer/ to save the file under",
		"ext": "a simple '.jpg', '.png', etc. depending on the image",
		"op": "the original poster as a string. Do not omit site specific tags such as '@' or 'u/'",
	});
}

// First, find the link to the image

// Get the url to save it with

// Get the OP

// Inject the button, add the listener

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "your base website";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
