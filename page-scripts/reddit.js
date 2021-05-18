sleep(3000);
notifySignal({ "intent": "relay", "content": "======================" });
notifySignal({ "intent": "relay", "content": "Starting Reddit Script" });
notifySignal({ "intent": "relay", "content": "======================" });

var oldListSize = 0;

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

function handleSwipePost(nodeNumber){
	var feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;
	var currentNode = feedNodeList.item(nodeNumber);
	var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
	var author = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).textContent;
	var desiredSlide = prompt("Enter the number of the post you would like to download:","");
	if(desiredSlide === null) return;
	var desiredSlideNum = parseInt(desiredSlide);
	if(desiredSlideNum === parseInt(desiredSlide, 10)){
		try {
			var postNodeList = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes;
			var wantedImageNode = postNodeList.item(desiredSlide - 1);
			var imageURL = wantedImageNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.src.nodeValue;
			startDownload(imageURL, linkToPost, author, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0));
		} catch (err) {
			alert("The image at the selected index has not been loaded yet");
		}
	}else{
		alert("The slide value you entered in not a number");
	}
}

function refreshNodes(){

	//Check what type of page it is
	var type = "";
	// Is it the home feed?
	if (document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0) != null) {
		type = "home";
		feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;
	} else if (document.getElementsByClassName("_1OVBBWLtHoSPfGCRaPzpTf _3nSp9cdBpqL13CqjdMr2L_ _2udhMC-jldHp_EpAuBeSR1 PaJBYLqPf_Gie2aZntVQ7")[0] != null) {
		type = "full";
		baseNode = document.getElementsByClassName("_1OVBBWLtHoSPfGCRaPzpTf _3nSp9cdBpqL13CqjdMr2L_ _2udhMC-jldHp_EpAuBeSR1 PaJBYLqPf_Gie2aZntVQ7")[0];
	}

	if (type == "home") {
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
					var imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.item(2).nodeValue;
					var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
					var titleText = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).nodeValue;
					var author = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).textContent;

					var buttonLink = '<idl_button align="right"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=24></a></idl_button>';
					currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).innerHTML += buttonLink;
					
					var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
					idl_downloader.addEventListener("click", startDownload.bind(null, imageURL, linkToPost, author, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0)), false);
				}
				catch (err){
					try {
						//GIF post. No links or slides.
						var currentNode = feedNodeList.item(i);
						var imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.item(0).nodeValue;
						if(!imageURL.includes(".gif")) throw new Error("Extention not supported");
						var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
						var titleText = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).nodeValue;
						var author = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).textContent;

						var buttonLink = '<idl_button align="right"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=24></a></idl_button>';
						currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).innerHTML += buttonLink;

						var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
						idl_downloader.addEventListener("click", startDownload.bind(null, imageURL, linkToPost, author, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0)), false);
					} catch (err2) {
						try {
							//Images with spoilers (and possibly NSFW)
							var currentNode = feedNodeList.item(i);
							var imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(2).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.src.nodeValue;
							var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
							var titleText = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).nodeValue;
							var author = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).textContent;

							var buttonLink = '<idl_button align="right"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=24></a></idl_button>';
							currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).innerHTML += buttonLink;
							
							var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
							idl_downloader.addEventListener("click", startDownload.bind(null, imageURL, linkToPost, author, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0)), false);
						} catch (err3) {
							try {
								//Link Posts (that show images)
								var currentNode = feedNodeList.item(i);
								var imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.src.nodeValue;
								var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
								var titleText = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).nodeValue;
								var author = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).textContent;

								var buttonLink = '<idl_button align="right"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=24></a></idl_button>';
								currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).innerHTML += buttonLink;
								
								var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
								idl_downloader.addEventListener("click", startDownload.bind(null, imageURL, linkToPost, author, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0)), false);
							} catch (err4) {
								try {
									//Scrollable posts
									var currentNode = feedNodeList.item(i);
									var multiPostIndicator = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1);
									if(multiPostIndicator != null) {
										var buttonLink = '<idl_button align="right"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=24></a></idl_button>';
										currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).innerHTML += buttonLink;
										
										var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
										idl_downloader.addEventListener("click", handleSwipePost.bind(null, i), false);
									}
									else throw new Error ("Not a multi post");
								} catch (err5) {	}
							}
						}
					}
				}
			}
		}
	}else if (type == "full") {
		var currentButton = baseNode.getElementsByTagName("idl_button")[0];
		if (currentButton != null) currentButton.parentNode.removeChild(currentButton);

		var imageURL = baseNode.childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(4).childNodes.item(0).childNodes.item(0).childNodes.item(0).src;
		var linkToPost = document.URL;
		var upvoteButton = baseNode.childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0);
		try {
			var author = baseNode.childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).textContent;
		} catch (error) {	}

		var buttonLink = '<idl_button align=right><a><img align=right src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=48></a></idl_button>';
		baseNode.childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(2).innerHTML += buttonLink;

		var idl_downloader = baseNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
		idl_downloader.addEventListener("click", startDownload.bind(null, imageURL, linkToPost, author, upvoteButton), false);
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
	chrome.runtime.sendMessage(msg);
}
