sleep(1000);
notifySignal({ "intent": "relay", "content": "======================" });
notifySignal({ "intent": "relay", "content": "Starting Reddit Script" });
notifySignal({ "intent": "relay", "content": "======================" });

//Load the document and isolate the actual feed
var feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;
var oldListSize = 0;

//Inject the CSS for a floating button
const linkInjection = document.createElement('link');
linkInjection.rel = "stylesheet";
linkInjection.type = "css";
linkInjection.href = browser.runtime.getURL("popup-res/floating_button.css");
document.head.append(linkInjection);

function myFunction(url, pageLink, upvoteButton) {
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
	notifySignal({ "intent": "queue_download", "target_url": url, "save_name": "Image-Sourcerer/" + saveName, "ext": extention });
}

function handleSwipePost(nodeNumber){
	console.log("On post: " + nodeNumber);
	var feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;
	var currentNode = feedNodeList.item(nodeNumber);
	var desiredSlide = prompt("Enter the number of the post you would like to download:","");
	if(desiredSlide === null) return;
	var desiredSlideNum = parseInt(desiredSlide);
	console.log("SlideNum: " + desiredSlide);
	if(desiredSlideNum === parseInt(desiredSlide, 10)){
		console.log("The slide value you entered is a number: " + desiredSlide);
		var postNodeList = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes;
		console.log(postNodeList.item(desiredSlide - 1));
	}else{
		alert("The slide value you entered in not a number");
	}
}

function refreshNodes(){

	//Get all the nodes again
	feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;

	if(oldListSize < feedNodeList.length) {
		notifySignal({ "intent": "relay", "content": "Posts updated from " + oldListSize + " to " + feedNodeList.length });
		oldListSize = feedNodeList.length;

		//Remove all previous dl buttons
		var element = document.getElementsByTagName("idl_button");

		for (var index = element.length - 1; index >= 0; index--) {
		    element[index].parentNode.removeChild(element[index]);
		}

		//For ever node in the list
		for(var i = 0; i < feedNodeList.length; i++) {
			try{
				//Regular Image Post. No links, gifs, slides.
				var currentNode = feedNodeList.item(i);
				var imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.item(2).nodeValue;
				var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
				var titleText = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).nodeValue;
				var buttonLink = '<idl_button align="right"><a><img src="' + browser.runtime.getURL("icons/download.png") + '" width=32></a></idl_button>';
				currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).innerHTML += buttonLink;
				
				var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
				idl_downloader.addEventListener("click", myFunction.bind(null, imageURL, linkToPost, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0)), false);
			}
			catch (err){
				try {
					//GIF post. No links or slides.
					var currentNode = feedNodeList.item(i);
					var imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.item(0).nodeValue;
					if(!imageURL.includes(".gif")) throw new Error("Extention not supported");
					var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
					var titleText = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).nodeValue;
					var buttonLink = '<idl_button align="right"><a><img src="' + browser.runtime.getURL("icons/download.png") + '" width=32></a></idl_button>';
					currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).innerHTML += buttonLink;

					var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
					idl_downloader.addEventListener("click", myFunction.bind(null, imageURL, linkToPost, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0)), false);
				} catch (err2) {
					try {
						//Images with spoilers (and possibly NSFW)
						var currentNode = feedNodeList.item(i);
						var imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.src.nodeValue;
						var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
						var titleText = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).nodeValue;
						var buttonLink = '<idl_button align="right"><a><img src="' + browser.runtime.getURL("icons/download.png") + '" width=32></a></idl_button>';
						currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).innerHTML += buttonLink;
						
						var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
						idl_downloader.addEventListener("click", myFunction.bind(null, imageURL, linkToPost, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0)), false);
					} catch (err3) {
						try {
							//Link Posts (that show images)
							var currentNode = feedNodeList.item(i);
							var imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(3).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.src.nodeValue;
							var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
							var titleText = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).nodeValue;
							var buttonLink = '<idl_button align="right"><a><img src="' + browser.runtime.getURL("icons/download.png") + '" width=32></a></idl_button>';
							currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).innerHTML += buttonLink;
							
							var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
							idl_downloader.addEventListener("click", myFunction.bind(null, imageURL, linkToPost, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0)), false);
						} catch (err4) {
							try {
								//Scrollable posts
								var multiPostIndicator = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1);
								if(multiPostIndicator != null) {
									console.log("handling multi-post");
									handleSwipePost(i);
								}
								
								//var interestedNode = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0);
								//var leftButton = interestedNode.childNodes.item(1).childNodes.item(0);
								//var rightButton = interestedNode.childNodes.item(2).childNodes.item(0);
								//var imagesToCheck = interestedNode.parentNode.childNodes.item(1).childNodes.item(2).textContent;

								//var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
								//var titleText = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).nodeValue;
								//var buttonLink = '<idl_button align="right"><a><img src="' + browser.runtime.getURL("icons/download.png") + '" width=32></a></idl_button>';
								//currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).innerHTML += buttonLink;
								
								//var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
								//idl_downloader.addEventListener("click", myFunction.bind(null, imageURL, linkToPost, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0)), false);
							} catch (err5) {	}
						}
					}
				}
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
	msg.sender = "reddit.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	browser.runtime.sendMessage(msg);
}