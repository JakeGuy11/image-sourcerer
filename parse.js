console.log("Starting plugin!");

//Load the document and isolate the actual feed
var feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;

function printTEST() {
	console.log("print test!!!");
}

function refreshNodes(){
	//Get all the nodes again
	feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;

	//For ever node in the list
	for(var i = 0; i < feedNodeList.length; i++) {
		try{
			var currentNode = feedNodeList.item(i);
			imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.item(2).nodeValue;
			//var buttonLink = '<idl_button><a href="' + imageURL + '"><img src="https://raw.githubusercontent.com/JakeGuy11/image-archive/main/icons/icon.png" width=32 height=32></a></idl_button>';
			var buttonLink = '<idl_button><a><img src="https://raw.githubusercontent.com/JakeGuy11/image-archive/main/icons/icon.png" width=32 height=32></a></idl_button>';
			currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(0).innerHTML += buttonLink;

			var idl_downloader = currentNode.getElementsByTagName("img")[0];
			idl_downloader.addEventListener("click", printTEST, false);
		}
		catch (err) {	}
	
	}

	//console.log(feedNodeList);
}

refreshNodes();

//var intervalId = setInterval(refreshNodes, 1000);