sleep(1000);
notifySignal({ "intent": "relay", "content": "=======================" });
notifySignal({ "intent": "relay", "content": "Starting Twitter Script" });
notifySignal({ "intent": "relay", "content": "=======================" });

function startDownload(url, pageLink, author, likeButton) {
	console.log(likeButton);
	try {
		likeButton.click();
	} catch (e) {
		console.log("Could not like post");
	}
	var extention = "";
	url = url.split("name=")[0] + "name=large";
	if(url.includes("format=jpg")){
		extention = ".jpg";
	} else if(url.includes("format=png")) {
		extention = ".png";
	} else if(url.includes(".mp4")) {
		extention = ".mp4";
	} else {
		notifySignal({ "intent": "relay", "content": "Extention could not be found." });
		return;
	}
	var saveName = prompt("Enter the path (relative to ~/Downloads/Image-Sourcerer/) and filename you would like to save the image under","");
	if(saveName.includes("..")){
		alert("Your saveName cannot include '..'");
		return;
	}
	notifySignal({ "intent": "queue_download", "target_url": url, "save_name": "Image-Sourcerer/" + saveName, "ext": extention, "post_src": pageLink, "op": author, "page": "https://twitter.com/" });
}

function handleMultiPost(aList, linkToPost, author, likeButton){
	var desiredSlide = prompt("Enter the number of the post you would like to download (left to right, top to bottom):","");
	if(desiredSlide === null) return;
	var desiredSlideNum = parseInt(desiredSlide);
	if(desiredSlideNum === parseInt(desiredSlide, 10)){
		var imageURL = "";
		try {
			var imagesList = aList.getElementsByTagName("img");
			switch(imagesList.length) {
				case 2:
					switch (desiredSlideNum) {
						case 1:
							imageURL = imagesList[0].src;
							break;
						case 2:
							imageURL = imagesList[1].src;
							break;
						default:
							throw new Error("Index out of bounds");
					}
					break;
				case 3:
					switch (desiredSlideNum) {
						case 1:
							imageURL = imagesList[0].src;
							break;
						case 2:
							imageURL = imagesList[1].src;
							break;
						case 3:
							imageURL = imagesList[2].src;
							break;
						default:
							throw new Error("Index out of bounds");
					}
					break;
				case 4:
					switch (desiredSlideNum) {
						case 1:
							imageURL = imagesList[0].src;
							break;
						case 2:
							imageURL = imagesList[2].src;
							break;
						case 3:
							imageURL = imagesList[1].src;
							break;
						case 4:
							imageURL = imagesList[3].src;
							break;
						default:
							throw new Error("Index out of bounds");
					}
					break;
				default:
					throw new Error("Out of range");
			}
			startDownload(imageURL, linkToPost, author, likeButton);
		} catch (err) {
			alert("The image at that index is not available");
			console.log(err);
		}
	}else{
		alert("The slide value you entered in not a number");
	}
}

function feedIsProfile() {
	try {
		var indicator = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(1).tagName.toLowerCase();
		if (indicator == "img") return true;
		else return false;
	} catch (e) {
		return false;
	}
}

function refreshNodes() {

	var element = document.getElementsByTagName("idl_button");
	
	for (var index = element.length - 1; index >= 0; index--) {
	    element[index].parentNode.removeChild(element[index]);
	}

	var feedNodeList;
	var baseNode;	

	// This is a more efficient way to assign feedNodeList
	var currentURL = document.URL;
	// Home feed
	if (currentURL.includes("/home")) feedNodeList = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
	// Profile feed
	else if (feedIsProfile()) feedNodeList = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
	// Individual with feed
	else if (currentURL.includes("/status/") && currentURL.includes("?s=")) feedNodeList = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
	// Individual without feed
	else if (currentURL.includes("/status/") && !currentURL.includes("?s=")) baseNode = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0);
	// Hashtag feed
	else if (currentURL.includes("/hashtag/")) feedNodeList = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;	
	// Page not recognized
	else {
		return;
	}

	// This is to see if it's just a really large photo or an actual feed
	var includesSinglePost = false;
	var isNotEnlargedPhoto = (document.URL.includes("/status/") && !document.URL.includes("/photo/"));
	var isNotSingleFeed = (document.URL.includes("/status/") && !document.URL.includes("?s="));
	if (isNotEnlargedPhoto && isNotSingleFeed) includesSinglePost = true;	

	if (includesSinglePost) {
		// Get the base node
		baseNode = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0);
		try {
			// Is it a basic single post with no recommended posts?
			var linkToImage = baseNode.childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(1).src;
			var linkToPost = baseNode.childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).href;
			var postAuthor = document.URL.split("/")[3];
			
			var buttonLink = '<idl_button align="right"><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center></idl_button>';
			baseNode.childNodes.item(2).childNodes.item(2).childNodes.item(0).innerHTML += buttonLink;

			var idl_downloader = baseNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
			idl_downloader.addEventListener("click", startDownload.bind(null, linkToImage, linkToPost, postAuthor, baseNode.childNodes.item(2).childNodes.item(4).childNodes.item(2).childNodes.item(0)), false);
		} catch (err1) {
			try {
				var imagesList = baseNode.childNodes.item(2).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1);
				var linkToPost = document.URL;
				var postAuthor = document.URL.split("/")[3];

				if(imagesList.getElementsByTagName("img").length == 1) throw new Error("Not a multi-post");
			
				var buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
				baseNode.childNodes.item(2).childNodes.item(2).childNodes.item(0).innerHTML += buttonLink;

				var idl_downloader = baseNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
				idl_downloader.addEventListener("click", handleMultiPost.bind(null, imagesList, linkToPost, postAuthor, baseNode.childNodes.item(2).childNodes.item(4).childNodes.item(2).childNodes.item(0)), false);
			} catch (err2) {	}
		}
	}
	
	for(var i = 0; i < feedNodeList.length; i++) {
		try {
			//Regular Posts
			var currentNode = feedNodeList.item(i);
			var linkToImage = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(1).src;
			var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).href;
			var author = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).textContent;
			
			var buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
			currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;
			
			var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
			idl_downloader.addEventListener("click", startDownload.bind(null, linkToImage, linkToPost, author, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(2).childNodes.item(0)), false);
		} catch (err1) {
			try {
				//GIF Posts
				var currentNode = feedNodeList.item(i);
				var linkToImage = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).src;
				if(linkToImage.includes("blob:")) throw new Error("Not a GIF");
				var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(2).href;
				var author = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).textContent;
				
				var buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
				currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;

				var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
				idl_downloader.addEventListener("click", startDownload.bind(null, linkToImage, linkToPost, author, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(2).childNodes.item(0)), false);
			} catch (err2){
				try {
					//Multi-image posts
					var currentNode = feedNodeList.item(i);
					var imagesList = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0);
					var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
					var author = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).textContent;
					
					if(imagesList.getElementsByTagName("img").length == 1) throw new Error("Not a multi-post");

					var buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
					currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;

					var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
					idl_downloader.addEventListener("click", handleMultiPost.bind(null, imagesList, linkToPost, author, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(2).childNodes.item(0)), false);
				} catch (err3) {
					try {
						// Quote tweet
						var currentNode = feedNodeList.item(i);
						var linkToImage = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(1).src;
						var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).href;
						var author = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).textContent;
						
						var buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
						currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;

						var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
						idl_downloader.addEventListener("click", startDownload.bind(null, linkToImage, linkToPost, author, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(2).childNodes.item(0)), false);
					} catch (err4) {
						try {
							// Unknown 2
							var currentNode = feedNodeList.item(i);
							var imagesList = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0);
							var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).href;

							if(imagesList.getElementsByTagName("img").length == 1) throw new Error("Not a multi-post");

							var buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
							currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;

							var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
							console.log("post at index " + i + " is an unknown 2 post");
							idl_downloader.addEventListener("click", handleMultiPost.bind(null, imagesList, linkToPost, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(2).childNodes.item(0)), false);
						} catch (err5) {
							try {
								// Reply tweet
								var currentNode = feedNodeList.item(i);
								var linkToImage = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(1).src;
								var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).href;
								var author = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).textContent;
						
								var buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
								currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;
								
								var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
								idl_downloader.addEventListener("click", startDownload.bind(null, linkToImage, linkToPost, author, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(3).childNodes.item(2).childNodes.item(0)), false);
							} catch (err6) {
								try {
									
								} catch (err7) {	}
							}
						}
					}
				}
			}
		}
	}
}


setTimeout(function() {
		var intervalId = setInterval(refreshNodes, 2000);
		}, 5000);

function sleep(milliseconds) {
	const date = Date.now();
 		let currentDate = null;
  	do {
    	currentDate = Date.now();
  	} while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "twitter.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
