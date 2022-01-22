notifySignal({ "intent": "relay", "content": "=========================" });
notifySignal({ "intent": "relay", "content": "Starting Instagram Script" });
notifySignal({ "intent": "relay", "content": "=========================" });

// Make sure the script is enabled - exit if it's not
let insta_js_enabled = false;
chrome.storage.local.get(function(result) {
	insta_js_enabled = result.insta_enabled;
	if (insta_js_enabled == undefined) { insta_js_enabled = true; }

	// Set the interval if it's enabled
	if (insta_js_enabled) var intervalId = setTimeout(periodic, 1000);
	else { notifySignal({ "intent": "relay", "content": "Image Sourcerer has been disabled on insta" }); }
});

// Update the modal
notifySignal({ "intent": "update_init", "site_meta": true });

function start_download(url, pageLink, author) {
    console.log('asked to download ' + url);
	var extention = "";
	if(url.includes(".jpg")){
		extention = ".jpg";
	} else if(url.includes(".png")) {
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

    notifySignal({
        "intent": "queue_download",
        "target_url": url,
        "save_name": "Image-Sourcerer/" + saveName,
        "ext": extention,
        "post_src": pageLink,
        "op": author,
        "page": "https://www.instagram.com/",
    });
}

/*
function delete_tags(node, tag) {
    for (var element of node.getElementsByTagName(tag)) {
        element.parentElement.removeChild(element);
    }
}
*/

function parse_post(post) {
    console.log(post);
}

function parse_feed(feed) {
    let post_list = feed.childNodes;

    for (current_post of post_list) {
        parse_post(current_post);
    }
}

function periodic() {
    // if we're in a single post page, pass that to parse_post. if not, pass it to parse_feed
    if (document.location.href.includes("/p/")) {
        // It's a single post - send the post to parse_post
        let post_to_parse = document.getElementsByClassName("PdwC2 fXiEu ")[0];
        parse_post(post_to_parse);
    } else if (document.getElementsByClassName("cGcGK").length > 0) {
        // It's a feed - send it to parse_feed
        let feed_to_parse = document.getElementsByClassName('cGcGK')[0].childNodes[1].childNodes[0];
        parse_feed(feed_to_parse);
    }
}

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "instagram.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
