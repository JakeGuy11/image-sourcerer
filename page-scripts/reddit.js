notifySignal({ "intent": "relay", "content": "======================" });
notifySignal({ "intent": "relay", "content": "Starting Reddit Script" });
notifySignal({ "intent": "relay", "content": "======================" });

let oldListSize = 0;
const FeedType = {
    Home: 'home',
    Profile: 'profile',
    Single: 'single',
    Enlarged: 'enlarged',
    Unknown: 'unknown'
};

function startDownload(url, pageLink, author, upvoteButton) {
	upvoteButton.click();
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
	var CORSRisk = false;
	if(url.includes("i.redd.it")){
		CORSRisk = true;
	}
	notifySignal({ "intent": "queue_download", "target_url": url, "save_name": "Image-Sourcerer/" + saveName, "ext": extention, "post_src": pageLink, "op": author, "cors_risk": CORSRisk, "page": "https://www.reddit.com/" });
}

function handle_feed() {

}

function handle_post() {
    // Define the things we're checking for
    let op = "";
    let link = "";
    let src = "";

    // Get the base node
    let base_node = document.getElementsByClassName('uI_hDmU5GSiudtABRz_37 ')[0];

    // Get the OP
    try {
        op = base_node.getElementsByClassName('_2tbHP6ZydRpjI44J3syuqC  _23wugcdiaj44hdfugIAlnX oQctV4n0yUb0uiHDdGnmE')[0].innerText;
    } catch (err) {
        console.log('Failed to find OP - setting to UNKNOWN');
        op = 'UNKNOWN';
    }

    // Get the link
    link = document.location.href;

    // Get the source(s)
    let all_images = Array.from(base_node.getElementsByTagName('img'));
    let images = all_images.filter(function (current_img) {
        return (current_img.height > 200) && (current_img.width > 200);
    });
    if (images.length == 0) return;
    else if (images.length == 1) src = images[0].src;
    else console.log('Multi post - cannot handle!');
    
    console.log('detected data:\nLink: ' + link + '\nOP: ' + op + '\nSRC: ' + src);
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

var intervalId = setInterval(periodic, 3000);

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
