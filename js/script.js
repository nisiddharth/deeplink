document.addEventListener("DOMContentLoaded", function () {
    // Fill in any URL if present in URL param
    const params = new URLSearchParams(document.location.search);
    const link = params.get("link");
    if (link) {
        document.getElementById("deeplink-input").value = link;
    }
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
    document.getElementById("history-div").style.display = "block"
    document.getElementById("copy-button").style.display = "block"
    var historyList = document.getElementById("history-list");

    // Remove all occurrences of the link from the history list
    Array.from(historyList.children).forEach(function (item) {

        if (item.textContent.trim() === link.trim()) {
            item.remove();
        }
    });

    var listItem = document.createElement("li");
    listItem.classList.add("flex")
    listItem.classList.add("history-item")

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
        document.getElementById("history-div").style.display = "none"
        document.getElementById("copy-button").style.display = "none"
    }
}

function launchDeepLink(deepLink) {
    window.open(deepLink);
}

function copyPageUrl() {
    var link = document.getElementById("deeplink-input").value;
    if (link) {
        var url = document.location.href.split('?')[0] + "?link=" + link
        navigator.clipboard.writeText(url);

        document.getElementById("copy-button").innerHTML = 'Copied! <i class="fa-solid fa-seedling"></i>'
    }
}