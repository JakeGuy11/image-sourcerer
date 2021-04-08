sleep(1000);
notifySignal({ "intent": "relay", "content": "=======================" });
notifySignal({ "intent": "relay", "content": "Starting Twitter Script" });
notifySignal({ "intent": "relay", "content": "=======================" });

function startDownload(url, pageLink, likeButton) {
	likeButton.click();
	var extention = "";
	url = url.replace("name=small", "name=large");
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
	var CORSRisk = false;
	if(url.includes("i.redd.it")){
		CORSRisk = true;
	}
	notifySignal({ "intent": "queue_download", "target_url": url, "save_name": "Image-Sourcerer/" + saveName, "ext": extention, "post_src": pageLink , "cors_risk": CORSRisk });
}

function handleMultiPost(aList, linkToPost, likeButton){
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
			startDownload(imageURL, linkToPost, likeButton);
		} catch (err) {
			alert("The image at that index is not available");
			console.log(err);
		}
	}else{
		alert("The slide value you entered in not a number");
	}
}

function refreshNodes() {

	var feedNodeList = document.getElementById("react-root").childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
		
	var element = document.getElementsByTagName("idl_button");
	
	for (var index = element.length - 1; index >= 0; index--) {
	    element[index].parentNode.removeChild(element[index]);
	}
	
	for(var i = 0; i < feedNodeList.length; i++) {
		try {
			//Regular Posts
			var currentNode = feedNodeList.item(i);
			var linkToImage = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(1).src;
			var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).href;

			var buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
			currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;

			var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
			idl_downloader.addEventListener("click", startDownload.bind(null, linkToImage, linkToPost, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(2).childNodes.item(0)), false);
		} catch (err1) {
			try {
				//GIF Posts
				var currentNode = feedNodeList.item(i);
				var linkToImage = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).src;
				if(linkToImage.includes("blob:")) throw new Error("Not a GIF");
				var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(2).href;

				var buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
				currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;

				var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
				idl_downloader.addEventListener("click", startDownload.bind(null, linkToImage, linkToPost, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(2).childNodes.item(0)), false);
			} catch (err2){
				try {
					//Multi-image posts
					var currentNode = feedNodeList.item(i);
					var imagesList = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0);
					var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;

					if(imagesList.getElementsByTagName("img".length) == 1) throw new Error("Not a multi-post");

					var buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
					currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;

					var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
					idl_downloader.addEventListener("click", handleMultiPost.bind(null, imagesList, linkToPost, currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(1).childNodes.item(2).childNodes.item(2).childNodes.item(0)), false);
				} catch (err3) {	}
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