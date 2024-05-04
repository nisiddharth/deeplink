document.addEventListener("DOMContentLoaded", function () {
    // Load history from localStorage
    loadHistory();
    document.getElementById("deeplink-input").focus()
});

document.getElementById("deeplink-input").addEventListener("keypress", function (event) {
    // If the user presses the "Enter" key on the keyboard
    if (event.key === "Enter") {
        // Cancel the default action, if needed
        event.preventDefault();
        // do the thing
        triggerDeepLink()
    }
});

function triggerDeepLink() {
    var input = document.getElementById("deeplink-input").value;

    if (input) {
        // Launch the deep link
        launchDeepLink(input);

        // Adding the triggered link to history
        addToHistory(input);

        // Save history to localStorage
        saveHistory();
    }
}

function addToHistory(link) {
    document.getElementById("history-div").style.visibility = "visible"
    var historyList = document.getElementById("history-list");

    // Remove all occurrences of the link from the history list
    Array.from(historyList.children).forEach(function (item) {

        if (item.textContent.trim() === link.trim()) {
            item.remove();
        }
    });

    var listItem = document.createElement("li");
    listItem.classList.add("flex")

    var listText = document.createElement("p");
    listText.classList.add("ellipsis")
    listText.style.flexGrow = 1;
    listText.textContent = link;
    listItem.appendChild(listText)

    // Delete button
    var deleteButton = document.createElement("i");
    deleteButton.classList.add("fa-solid");
    deleteButton.classList.add("fa-trash");
    deleteButton.classList.add("delete-button");
    deleteButton.addEventListener("click", function (event) {
        event.stopPropagation(); // Prevent triggering the click event of the parent li
        listItem.remove();
        saveHistory(); // Save history after deletion
    });
    listItem.appendChild(deleteButton);

    // Allow editing of history item
    listItem.addEventListener("click", function () {
        document.getElementById("deeplink-input").value = link; // Populate input field
        document.getElementById("deeplink-input").focus()
    });

    historyList.prepend(listItem);
}

function saveHistory() {
    var historyList = document.getElementById("history-list").innerHTML;
    localStorage.setItem("history", historyList);
}

function loadHistory() {
    var historyList = localStorage.getItem("history");
    if (historyList) {
        document.getElementById("history-list").innerHTML = historyList;

        // Attach event listeners to delete buttons for existing items
        var deleteButtons = document.querySelectorAll(".delete-button");
        deleteButtons.forEach(function (button) {
            button.addEventListener("click", function (event) {
                event.stopPropagation(); // Prevent triggering the click event of the parent li
                var listItem = button.parentElement;
                listItem.remove();
                saveHistory(); // Save history after deletion
            });
        });

        // Attach event listeners to text for existing items, for edit
        var texts = document.getElementById("history-list").querySelectorAll("li");
        texts.forEach(function (text) {
            text.addEventListener("click", function (event) {
                event.stopPropagation(); // Prevent triggering the click event of the parent li
                document.getElementById("deeplink-input").value = text.innerText; // Populate input field
                document.getElementById("deeplink-input").focus()
            });
        });
    } else {
        document.getElementById("history-div").style.visibility = "hidden"
    }
}

function launchDeepLink(deepLink) {
    // Check if the user is on an Android device
    var userAgent = navigator.userAgent || navigator.vendor || window.opera;
    if (/android/i.test(userAgent)) {
        launchAndroidDeepLink(deepLink);
    }
    // Check if the user is on an iOS device
    else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        launchiOSDeepLink(deepLink);
    }
    // For other devices or desktop, simply navigate to the deep link
    else {
        window.open(deepLink);
    }
}


function launchAndroidDeepLink(deepLink) {
    var iframe = document.createElement("iframe");
    iframe.style.display = "none";
    iframe.src = deepLink;
    document.body.appendChild(iframe);
    setTimeout(function () {
        document.body.removeChild(iframe);
    }, 500);
}


function launchiOSDeepLink(deepLink) {
    window.open(deepLink);
    setTimeout(function () {
        // If the deep link doesn't work, redirect to the App Store
        window.location.href = "https://apps.apple.com/us/app/your-app-name/id1234567890";
    }, 1000); // Adjust the delay as needed
}
