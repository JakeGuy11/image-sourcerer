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
            console.log("Unknown Feed. Skipping.");
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
