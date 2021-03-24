console.log("=========================");
console.log("Starting Reddit Script...");
console.log("=========================");

//A test message to send at the start
browser.runtime.sendMessage({ "message": "This is my message" });

//Load the document and isolate the actual feed
var feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;
var oldListSize = 0;

function myFunction(url, pageLink) {
	console.log("Image \"" + url + "\", taken from " + pageLink + ".");
	var extention = "";
	if(url.includes(".jpg")){
		extention = ".jpg";
	} else if(url.includes(".png")) {
		extention = ".png";
	} else if(url.includes(".gif")) {
		extention = ".gif";
	} else {
		console.log("Extention could not be found.");
		return;
	}
	var saveName = prompt("Enter the path (relative to ~/Downloads/Image-Sourcerer/) and filename you would like to save the image under","");
	if(saveName.includes("..")){
		alert("Your saveName cannot include '..'");
		return;
	}
	browser.runtime.sendMessage({"url": url, "saveName": "Image-Sourcerer/" + saveName, "ext": extention});
}

function refreshNodes(){

	//Get all the nodes again
	feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;

	if(oldListSize < feedNodeList.length) {
		console.log("Posts updated from " + oldListSize + " to " + feedNodeList.length);
		oldListSize = feedNodeList.length;

		//Remove all previous dl buttons
		var element = document.getElementsByTagName("idl_button"), index;

		for (index = element.length - 1; index >= 0; index--) {
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
				var buttonLink = '<idl_button align="right"><a><img src="' + browser.runtime.getURL("icons/download.png") + '" width=32 height=32></a></idl_button>';
				currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).innerHTML += buttonLink;

				var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
				idl_downloader.addEventListener("click", myFunction.bind(null, imageURL, linkToPost), false);
			}
			catch (err){
				try {
					//GIF post. No links or slides.
					var currentNode = feedNodeList.item(i);
					var imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.item(0).nodeValue;
					if(!imageURL.includes(".gif")) throw new Error("Extention not supported");
					var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
					var titleText = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).nodeValue;
					var buttonLink = '<idl_button align="right"><a><img src="' + browser.runtime.getURL("icons/download.png") + '" width=32 height=32></a></idl_button>';
					currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).innerHTML += buttonLink;

					var idl_downloader = currentNode.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
					idl_downloader.addEventListener("click", myFunction.bind(null, imageURL, linkToPost), false);
				} catch (err2) {		}
			}
		
		}

	}

}

refreshNodes();

var intervalId = setInterval(refreshNodes, 3000);
