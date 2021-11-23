sleep(1000);
notifySignal({ "intent": "relay", "content": "=====================" });
notifySignal({ "intent": "relay", "content": "Starting Pixiv Script" });
notifySignal({ "intent": "relay", "content": "=====================" });

const DarkMode = {
	OPNode: 'sc-10gpz4q-6 iJAMDQ',
	BottomPosts: 'sc-iasfms-3 jDiPOg',
	SidePosts: 'sc-iasfms-3 hQJkLh',
	FarBottomPosts: 'sc-iasfms-3 jDiQFZ'
};

const LightMode = {
	OPNode: 'sc-d98f2c-0 sc-10gpz4q-6 laVdFC',
	BottomPosts: 'sc-iasfms-3 jDiPOg',
	SidePosts: 'sc-iasfms-3 hQJkLh',
	FarBottomPosts: 'sc-iasfms-3 jDiQFZ'
};

// Set which mode it is - will be updated periodically
let mode = DarkMode;

// Handle the download
function startDownload(src, post_link, op) {
    if (op == "") op = document.getElementsByClassName(mode.OPNode)[0].innerText.replace("\nAccepting requests", "");
    notifySignal({ "intent": "relay", "content": "Asked to download image at " + post_link + " by " + op });

    var extention = "";

     if(src.includes(".jpg")){
        extention = ".jpg";
    } else if(src.includes(".png")) {
        extention = ".png";
    } else if(src.includes(".gif")) {
        extention = ".gif";
    } else {
        notifySignal({ "intent": "relay", "content": "Extention could not be found." });
        return;
    }

   var save_name = prompt("Enter the path (relative to ~/Downloads/Image-Sourcerer/) and filename you would like to save the image under","");

    if (save_name == null || save_name == "") return;
    if(save_name.includes("..")){
        alert("Your save location cannot include '..'");
        return;
    }

    notifySignal({
        "intent": "queue_download",
        "target_url": src,
        "post_src": post_link,
        "save_name": "Image-Sourcerer/" + save_name,
        "ext": extention,
        "op": op,
        "custom_header": true,
        "header_name": "referer",
        "header_content": "https://www.pixiv.net/"
    });
}

function startParse()
{
	// Update which mode the user is using
	switch (document.getElementById('gtm-var-theme-kind').innerText) {
		case 'dark':
			mode = DarkMode;
			break;
		case 'default':
			mode = LightMode;
			break;
		default:
			mode = DarkMode;
			break;
	}
    // Find the link to the actual image
    var image_divs = Array.from(document.querySelectorAll("[role=\"presentation\"]"));
    // Remove the two elements we know we don't want
    image_divs.splice(0, 1);
    image_divs.splice(-1, 1);

    for(current_item of image_divs)
    {
        // Make sure the image is loaded
        var image_not_loaded = (current_item.getElementsByTagName('img').length == 0);
        var image_processed = (current_item.getElementsByTagName('idl_button').length > 0);
        if (image_not_loaded || image_processed) continue;

        // Get all the info we'll need
        var source = document.URL;
        var img_src = current_item.childNodes[0].href;
        var op = document.getElementsByClassName(mode.OPNode)[0].innerText.replace("\nAccepting requests", "");

        var button_element = '<idl_button style="position:absolute;float:left;top:10px;left:10px;z-index:99"><a><img src="' + chrome.runtime.getURL("res/icons/download-coloured.png") + '" width=32></a></idl_button>';
        current_item.style.position = "relative";
        current_item.innerHTML += button_element;

        let idl_downloader = current_item.getElementsByTagName("idl_button")[0].getElementsByTagName("img")[0];
        idl_downloader.addEventListener("click", startDownload.bind(null, img_src, source, op), false);
    }

    // Add listeners to every suggested post to reload the page after clicked
    let bottom_posts = Array.from(document.getElementsByClassName(mode.BottomPosts));
    let side_posts = Array.from(document.getElementsByClassName(mode.SidePosts));
    let far_bottom_posts = Array.from(document.getElementsByClassName(mode.FarBottomPosts));
    var posts_to_listen = bottom_posts.concat(side_posts, far_bottom_posts);

    for(current_preview of posts_to_listen)
    {
        current_preview.addEventListener("click", function()
        {
            if(document.location.href.includes("/users/")) return;
            setTimeout(function() {
                window.location.reload(false);
            }, 5);
        });
    }
}

window.onscroll = function() { startParse(); };

setInterval(function() {
    startParse();
}, 250);

function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}

function notifySignal(msg) {
	msg.sender = "pixiv.js";
	if(!("intent" in msg)) msg.intent = "undefined_intent";
	chrome.runtime.sendMessage(msg);
}
