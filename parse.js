console.log("Starting plugin!");

//Load the document and isolate the actual feed
var feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;

function myFunction(url, pageLink) {
	console.log("Image \"" + url + "\", taken from " + pageLink);
	window.open(pageLink, "_self");
}

function refreshNodes(){

	//Remove all previous dl buttons
	var element = document.getElementsByTagName("idl_button"), index;

	for (index = element.length - 1; index >= 0; index--) {
	    element[index].parentNode.removeChild(element[index]);
	}


	//Get all the nodes again
	feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;

	//For ever node in the list
	for(var i = 0; i < feedNodeList.length; i++) {
		try{
			var currentNode = feedNodeList.item(i);
			imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.item(2).nodeValue;
			var linkToPost = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(1).childNodes.item(0).childNodes.item(0).href;
			var buttonLink = '<idl_button align="right"><a><img src="https://raw.githubusercontent.com/JakeGuy11/image-archive/main/icons/icon.png" width=32 height=32></a></idl_button>';
			//currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;
			currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).innerHTML += buttonLink;

			console.log(currentNode);

			var idl_downloader = currentNode.getElementsByTagName("img")[0];
			idl_downloader.addEventListener("click", myFunction.bind(null, imageURL, linkToPost), false);
		}
		catch (err) {	}
	
	}

	//console.log(feedNodeList);
}

refreshNodes();

//var intervalId = setInterval(refreshNodes, 3000);
