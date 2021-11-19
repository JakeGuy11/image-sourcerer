notifySignal({ "intent": "relay", "content": "======================" });
notifySignal({ "intent": "relay", "content": "Starting Reddit Script" });
notifySignal({ "intent": "relay", "content": "======================" });

// Check to see if the user has used the reddit script yet
chrome.storage.local.get(['reddit_init'], function(result) {
	if (result.reddit_init != 'true') {
		// the user's never used reddit before
        // Show the modal
		var overall_div = document.createElement("div");
		overall_div.id = "welcome_modal";
		overall_div.style.position = "fixed";
		overall_div.style.backgroundColor = "#000000AA";
		overall_div.style.width = overall_div.style.height = "100%";
		overall_div.style.left = overall_div.style.top = "0";
		overall_div.style.zIndex = "99";
		overall_div.innerHTML = `
		<div style="position:absolute;left:35%;width:30%;height:50%;top:25%;padding:10px;background-color:#F5F5FF;border-radius:10px;">
            <div style="position:absolute;height:10%;width:10%;top:2%;right:2%;padding:0px;">
                <svg id="modal_close" fill="#888888" viewBox="0 0 16 16">
                    <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708z"/>
                </svg>
            </div>
            <div id="modal_title_text" style="display:bloxk;width:100%;height:8%;">
            </div>
			<div id="modal_body_text" style="display:block;width:100%;height:72%;overflow-y:auto;">
                Here is my text Here is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my textHere is my text
			</div>
			<div id="modal_button_holder" style="display:block;position:relative;width:100%;height:20%;">
                <button id="modal_okay" style="display:block;position:absolute;height:80%;width:40%;left:30%;border-style:solid;border-radius:10px;border-color:#A5A5AA">
                    Okay
                </button>
			</div>
		</div>
		`;
		document.body.appendChild(overall_div);
        // Set the listeners on the close buttons
        let close_modal = function(div, ack) { 
            div.parentNode.removeChild(div);
            if (ack) {
                chrome.storage.local.set({'reddit_init': 'true'}, function() {
                    notifySignal({"intent": "relay", "content": "Set reddit_init to true"});
                });
            } else {
                chrome.storage.local.set({'reddit_init': 'false'}, function() {
                    notifySignal({"intent": "relay", "content": "Set reddit_init to false"});
                });
            }
        };
        document.getElementById("modal_close").addEventListener("click", close_modal.bind(null, overall_div, false));
        document.getElementById("modal_okay").addEventListener("click", close_modal.bind(null, overall_div, true));
	}
});

let oldListSize = 0;
const FeedType = {
    Home: 'home',
    Profile: 'profile',
    Single: 'single',
    Enlarged: 'enlarged',
    Unknown: 'unknown'
};

function start_download(url, pageLink, author) {
    console.log('asked to download ' + url);
	var extention = "";
	if(url.includes(".jpg")){
		extention = ".jpg";
	} else if(url.includes(".png")) {
		extention = ".png";
	} else if(url.includes(".gif")) {
		extention = ".gif";
	} else {
		notifySignal({ "intent": "relay", "content": "Extention could not be found." });
		return;
	}
	var saveName = prompt("Enter the path (relative to ~/Downloads/Image-Sourcerer/) and filename you would like to save the image under","");
	if(saveName.includes("..")){
		alert("Your saveName cannot include '..'");
		return;
	}

	var cors_risk = false;
	if(url.includes("i.redd.it") || url.includes("external-preview.redd.it")){
		cors_risk = true;
	}

    if (cors_risk) {
	    notifySignal({
            "intent": "queue_download",
            "target_url": url,
            "save_name": "Image-Sourcerer/" + saveName,
            "ext": extention,
            "post_src": pageLink,
            "op": author,
            "page": "https://www.reddit.com/",
            "custom_header": true,
            "header_name": "important",
            "header_content": "false"
        });
    } else {
	    notifySignal({
            "intent": "queue_download",
            "target_url": url,
            "save_name": "Image-Sourcerer/" + saveName,
            "ext": extention,
            "post_src": pageLink,
            "op": author,
            "page": "https://www.reddit.com/",
        });
    }
}

function delete_tags(node, tag) {
    for (var element of node.getElementsByTagName(tag)) {
        element.parentElement.removeChild(element);
    }
}

// ============
// ENTIRE FEEDS
// ============
var last_count = 0;
function handle_feed() {
    var mycount = 0;
    let node_list = document.getElementsByClassName('rpBJOHq2PR60pnwJlUyP0')[0].childNodes;
    for (var base_node of node_list) {
        try {
            // Define the things we're checking for
            let op = 'UNKNOWN';
            let link = 'UNKNOWN';
            let src = 'UNKNOWN';
            let injection_button = '<idl_button style="position:absolute;margin-left:10px;top:10px;z-index:999"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" width=32></a></idl_button>';

            // Get the OP
            op = base_node.getElementsByClassName('_2tbHP6ZydRpjI44J3syuqC  _23wugcdiaj44hdfugIAlnX oQctV4n0yUb0uiHDdGnmE')[0].innerText;

            // Get the link
            link = base_node.getElementsByClassName('SQnoC3ObvgnGjWt90zD9Z _2INHSNB8V5eaWp4P0rY_mE')[0].href;

            // Collect and filter all the images we want to parse
            let all_images = Array.from(base_node.getElementsByTagName('img'));
            let images = all_images.filter(function (current_img) {
                // Just to make this easier for future me: The first image class is the subreddit icon, the second is the large cover for NSFW posts, the third is the blurred NSFW posts
                return (current_img.height > 100) && (current_img.width > 150) && (current_img.className != "_34CfAAowTqdbNDYXz5tBTW _1WX5Y5qFVBTdr6hCPpARDB") && (current_img.className != "_2iaYXFpGyyEGq1rp02cl5w") && (current_img.className != "_2_tDEnGMLxpM6uOa2kaDB3 ImageBox-image media-element _1XWObl-3b9tPy64oaG6fax _3oBPn1sFwq76ZAxXgwRhhn");
            });
            // If there are no images
            if (images.length == 0) continue;
            // If there are images
            for (var img of images) {
                // Skip if already injected, but not if div is tiny
                // Is a tiny div
                let tiny_div = ((img.parentElement.clientHeight < 50) || (img.parentElement.clientWidth < 50));
                // Has idl button
                let is_parsed = (img.parentElement.parentElement.getElementsByTagName('idl_button').length > 0);
                if ((!tiny_div) && is_parsed) continue;
                if (tiny_div) continue;
                
                // Get the src and some other info
                src = img.src;
                if (src == undefined) continue;

                // Inject the button
                img.style.position = 'relative';
                let parent_element = img.parentElement;
                parent_element.parentElement.parentElement.removeAttribute('href');
                parent_element.innerHTML = '<a href="' + link + '" target="_blank">' + img.outerHTML + '</a>' + injection_button;
                // Reset the width and height so we don't get overlap
                parent_element.getElementsByTagName('img')[0].style.maxWidth = parent_element.clientWidth + "px";
                
                // Remove the default event (which redirects you) and add the download listener
                let idl_button = parent_element.getElementsByTagName('idl_button')[0];
                idl_button.addEventListener('click', function(e){ e.preventDefault(); });
                idl_button.addEventListener('click', start_download.bind(null, src, link, op), false);
            }
        } catch (err) {  }
    }
}

// ===========
// SINGLE POST
// ===========
function handle_post() {
    // Define the things we're checking for
    let op = 'UNKNOWN';
    let link = 'UNKNOWN';
    let src = 'UNKNOWN';
    let injection_button = '<idl_button style="position:absolute;margin-left:10px;top:10px;z-index:999"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" width=32></a></idl_button>';

    // Get the base node
    let base_node = document.getElementsByClassName('uI_hDmU5GSiudtABRz_37 ')[0];
    if (base_node == undefined) return;

    // Get the OP
    try { op = base_node.getElementsByClassName('_2tbHP6ZydRpjI44J3syuqC  _23wugcdiaj44hdfugIAlnX oQctV4n0yUb0uiHDdGnmE')[0].innerText; } catch (e) { return; }

    // Get the link
    link = document.location.href;

    // Get the source(s) and inject the download button
    let all_images = Array.from(base_node.getElementsByTagName('img'));
    let images = all_images.filter(function (current_img) {
        // Easier for future me: The one class is for single nsfw posts
        return (current_img.height > 200) && (current_img.width > 200) && (current_img.className != "_2_tDEnGMLxpM6uOa2kaDB3 ImageBox-image media-element _1XWObl-3b9tPy64oaG6fax _3oBPn1sFwq76ZAxXgwRhhn");
    });
    // If there are no images
    if (images.length == 0) return;
    // If there are images
    for (var img of images) {
        // Skip if already injected
        if (img.parentElement.parentElement.getElementsByTagName('idl_button').length > 0) continue;
        
        // Get the src and some other info
        src = img.parentElement.href;
        if (src == undefined) src = img.parentElement.parentElement.href;

        // Get the old height and width
        let old_width = img.width;
        let old_height = img.height;
        
        // Inject the button
        img.style.position = 'relative';
        let parent_element = img.parentElement;
        parent_element.removeAttribute('href');
        parent_element.parentElement.removeAttribute('href');
        parent_element.innerHTML = '<a href="' + src + '" target="_blank">' + img.outerHTML + '</a>' + injection_button;
        // Reset the height and width so we don't get overlap
        parent_element.getElementsByTagName('img')[0].style.maxWidth = old_width + "px";
        parent_element.getElementsByTagName('img')[0].style.maxHeight = old_height + "px";
        
        // Add the listener
        parent_element.getElementsByTagName('idl_button')[0].addEventListener('click', start_download.bind(null, src, link, op), false);
    }
}

function periodic(){
    // Identify where we are
    let feed_type;
    if (document.getElementsByClassName('rpBJOHq2PR60pnwJlUyP0').length > 0) {
        if (document.location.href.includes('/comments/')) feed_type = FeedType.Enlarged;
        else if (document.location.href.includes('/user/')) feed_type = FeedType.Profile;
        else feed_type = FeedType.Home;
    } else if (document.location.href.includes('/comments/')) feed_type = FeedType.Single;
    else feed_type = FeedType.Unknown;

    // Separate out what kind of feed it is
    switch (feed_type) {
        case FeedType.Home:
            handle_feed();
            break;
        case FeedType.Profile:
            handle_feed();
            break;
        case FeedType.Enlarged:
            handle_post();
            break;
        case FeedType.Single:
            handle_post();
            break;
        default:
            console.log('Unknown Feed. Skipping.');
            break;
    }

}

var intervalId = setInterval(periodic, 500);

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "reddit.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
