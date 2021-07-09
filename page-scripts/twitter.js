sleep(1000);
notifySignal({ "intent": "relay", "content": "=======================" });
notifySignal({ "intent": "relay", "content": "Starting Twitter Script" });
notifySignal({ "intent": "relay", "content": "=======================" });

function startDownload(images, pageLink, author) 
{
    // This will hold the actual url to download
    let url = "";
    
    // Make sure the images are in order
    let ordered_images = [];
    if (images.length == 4)
    {
        ordered_images[0] = images[0];
        ordered_images[1] = images[2];
        ordered_images[2] = images[1];
        ordered_images[3] = images[3];
    }
    else ordered_images = images;

    // If there are >1 images, prompt the user for which to download
    if (ordered_images.length == 1) url = ordered_images[0];
    else
    {
        let req_image = prompt("Enter the number of the post you would like to download (left to right, top to bottom):","");
        let req_index = parseInt(req_image);
        if (isNaN(req_index))
        {
            alert("That is not a valid image index!");
            return;
        }
        url = ordered_images[req_index - 1];
    }

    // Get the proper extention
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

    // Find where to save the image
    var saveName = prompt("Enter the path (relative to ~/<Download path>/Image-Sourcerer/) and filename you would like to save the image under","");
    if (saveName == null || saveName == "") return;
    if(saveName.includes("..")){
        alert("Your saveName cannot include '..'");
        return;
    }

    // Send the signal to download
    notifySignal({ "intent": "queue_download", "target_url": url, "save_name": "Image-Sourcerer/" + saveName, "ext": extention, "post_src": pageLink, "op": author, "page": "https://twitter.com/" });
}

function is_enlarged_post(node)
{
    if (node.getElementsByClassName("css-1dbjc4n r-1iusvr4 r-16y2uox r-1777fci r-1h8ys4a r-1bylmt5 r-13tjlyg r-7qyjyx r-1ftll1t").length == 0) return false;
    else return true;
}

function get_feed_list(feed_root)
{ 

    var return_list;

    // We need to parse for the list of all the posts
    if (feed_root.childNodes.item(0).childNodes.item(3) != null)
    {
        // If this evaluates to true, it's the home feed.
        return_list = feed_root.childNodes.item(0).childNodes.item(3).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
    }
    else if (feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(2) != null)
    {
        // If this is true, it's a profile feed
        return_list = feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(2).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
    }
    else if (feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(1) != null)
    {
        // It's a single enlarged post
        return_list = feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
    }
    else if (feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0) != null)
    {
        // It's a hashtag feed
        return_list = feed_root.childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes.item(0).childNodes.item(0).childNodes.item(1).childNodes.item(0).childNodes;
    }
    else
    {
        // We don't recognize it - do no parsing
        return_list = null;
    }
    
    return return_list;

}

function refreshNodes() {

    var element = document.getElementsByTagName("idl_button");

    for (var index = element.length - 1; index >= 0; index--) {
        element[index].parentNode.removeChild(element[index]);
    }

    // Define the feed root and send it to a method to get a list of all the posts. If it's null, exit the function.
    var feed_root = document.getElementsByClassName("css-1dbjc4n r-kemksi r-1kqtdi0 r-1ljd8xs r-13l2t4g r-1phboty r-1jgb5lz r-11wrixw r-61z16t r-1ye8kvj r-13qz1uu r-184en5c")[0];
    var feed_node_list = get_feed_list(feed_root);
    if (feed_node_list == null) return;

    // Iterate through all the posts
    for (var current_node of feed_node_list)
    {
        // Create a blank array that will hold any images we want to download
        let interested_images = [];
        // Scan the post, adding any images we might want to download to the array
        for (var current_image of current_node.getElementsByTagName("img"))
        {
            if (current_image.width >= 100 && current_image.height >= 100) interested_images.push(current_image.src);
        }
        
        // If the list is empty, it's not a post we want to do anything else to
        if (interested_images.length == 0) continue;

        // Find other elements - OP, link to the post, like button(?)
        // Get the OP
        let all_op_tags = current_node.getElementsByClassName("css-901oao css-bfa6kz r-9ilb82 r-18u37iz r-1qd0xha r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-qvutc0");
        let op = "";
        if (all_op_tags.length < 1) op = "UNKNOWN";
        else op = all_op_tags[all_op_tags.length - 1].innerText;

        // Get the link
        let all_link_tags = current_node.getElementsByClassName("css-4rbku5 css-18t94o4 css-901oao r-9ilb82 r-1loqt21 r-1q142lx r-1qd0xha r-a023e6 r-16dba41 r-rjixqe r-bcqeeo r-3s2u2q r-qvutc0");
        let link = "";
        if (all_link_tags.length < 1) link = "UNKNOWN";
        else link = all_link_tags[all_link_tags.length - 1].href;

        // Add an IDL button to the post. If it's an enlarged post, use a modified button in a different position
        if (!is_enlarged_post(current_node))
        {
            let button_code = buttonLink = '<idl_button align="right"><br><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center><br></idl_button>';
            current_node.getElementsByClassName("css-1dbjc4n r-18kxxzh r-1wbh5a2 r-13qz1uu")[0].innerHTML += button_code;
        }
        else
        {
            let button_code = buttonLink = '<idl_button align="right"><center><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" height=32></a></center></idl_button>';
            current_node.getElementsByClassName("css-1dbjc4n r-1r5su4o")[0].childNodes[0].innerHTML += button_code;
        }

        // Bind everything we've collected to a download function
        let idl_downloader = current_node.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
        idl_downloader.addEventListener("click", startDownload.bind(null, interested_images, link, op), false);
    }

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
