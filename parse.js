console.log("Starting plugin!");

var feedNodeList = document.querySelectorAll("div.rpBJOHq2PR60pnwJlUyP0").item(0).childNodes;
console.log(feedNodeList);

for(var i = 0; i < feedNodeList.length; i++) {

	try{
		var currentNode = feedNodeList.item(i);

		imageURL = currentNode.childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(0).attributes.item(2).nodeValue;

		console.log(imageURL);
	}
	catch (err) {
		//console.log("Error encountered in parsing");
	}
	
}