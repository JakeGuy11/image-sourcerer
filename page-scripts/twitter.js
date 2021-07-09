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
    switch (images.length)
    {
        case 1: ordered_images = images;
        case 2: ordered_images = images;
        case 3: ordered_images = images;
        case 4: ordered_images[0] = images[0]; ordered_images[1] = posts[2]; ordered_images[2] = posts[1]; ordered_images[3] = posts[3];
        default: alert("Failed to parse image list! Please report this to the Image Sourcerer github page."); return;
    }

    // If there are >1 images, prompt the user for which to download
    if (ordered_images.length == 1) url = ordered_images[0];
    else
    {
        let req_image = prompt("Enter the number of the post you would like to download (left to right, top to bottom):","");
        let req_index = parseInt(req_image, 10);
        if (isNaN(req_index)) alert("That is not a valid image index!"); return;
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
    if(saveName.includes("..")){
        alert("Your saveName cannot include '..'");
        return;
    }

    // Send the signal to download
    notifySignal({ "intent": "queue_download", "target_url": url, "save_name": "Image-Sourcerer/" + saveName, "ext": extention, "post_src": pageLink, "op": author, "page": "https://twitter.com/" });
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

        console.log(op + " posted " + interested_images.join(", ") + " at " + link);

        // Bind everything we've collected to a download function
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
