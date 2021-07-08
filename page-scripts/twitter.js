sleep(1000);
notifySignal({ "intent": "relay", "content": "=======================" });
notifySignal({ "intent": "relay", "content": "Starting Twitter Script" });
notifySignal({ "intent": "relay", "content": "=======================" });

function startDownload(url, pageLink, author) {
    //try {
    //    likeButton.click();
    //} catch (e) {
    //    console.log("Could not like post");
    //}
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

    var feed_root = document.getElementsByClassName("css-1dbjc4n r-kemksi r-1kqtdi0 r-1ljd8xs r-13l2t4g r-1phboty r-1jgb5lz r-11wrixw r-61z16t r-1ye8kvj r-13qz1uu r-184en5c")[0];
    var feed_node_list;

    // We need to parse for the list of all the posts
    if (feed_root.childNodes.item(0).childNodes.item(3) != null)
    {
        // If this evaluates to true, it's the home feed.
        console.log("I think this is a home feed");
        feed_node_list = feed_root.childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
    }
    else if (feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(2) != null)
    {
        // If this is true, it's a profile feed
        console.log("I think this is a profile feed");
        feed_node_list = feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
    }
    else if (feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(1) != null)
    {
        // It's a single enlarged post
        console.log("I think this is a single post feed");
        feed_node_list = feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
    }
    else if (feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0) != null)
    {
        // It's a hashtag feed
        console.log("I think this is a hashtag feed");
        feed_node_list = feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
    }

    console.log("Currently detecting " + feed_node_list.length + " posts");

}


setTimeout(function() { try {  var intervalId = setInterval(refreshNodes, 2000);  } catch (e) {  notifySignal({"intent": "relay", "content": "Error occurred: " + e});  }}, 5000);

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
