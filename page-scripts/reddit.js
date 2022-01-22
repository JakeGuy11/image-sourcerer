notifySignal({ "intent": "relay", "content": "======================" });
notifySignal({ "intent": "relay", "content": "Starting Reddit Script" });
notifySignal({ "intent": "relay", "content": "======================" });

// Make sure the script is enabled - exit if it's not
let reddit_js_enabled = false;
chrome.storage.local.get(function(result) {
	reddit_js_enabled = result.reddit_enabled;
	if (reddit_js_enabled == undefined) { reddit_js_enabled = true; }

	// Set the interval if it's enabled
	if (reddit_js_enabled) var intervalId = setInterval(periodic, 500);
	else { notifySignal({ "intent": "relay", "content": "Image Sourcerer has been disabled on reddit" }); }
});

// Update the modal
notifySignal({ "intent": "update_init", "site_meta": true });

let oldListSize = 0;
const FeedType = {
    Home: 'home',
    Profile: 'profile',
    Single: 'single',
    Enlarged: 'enlarged',
    Unknown: 'unknown'
};

function start_download(url, pageLink, author) {
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
            notifySend({ "intent": "relay", "content": "Unknown Feed. Skipping." });
            break;
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
	msg.sender = "reddit.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
