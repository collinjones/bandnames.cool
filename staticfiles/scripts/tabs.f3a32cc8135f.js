function openTab(tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    tablinks = document.getElementsByClassName("tablinks");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";

    // Add 'active' class to the current tab
    var currentTab = document.querySelector(`.tablinks[onclick*="${tabName}"]`);
    if (currentTab) {
        currentTab.className += " active";
    }

    // Store the current tab in local storage
    localStorage.setItem("lastTab", tabName);
}

// Open stored last tab on page load if it exists, otherwise open 1st tab
window.onload = function () {

    // Open stored last tab if it exists
    var lastTab = localStorage.getItem("lastTab");
    tabcontent = document.getElementsByClassName("tabcontent");
    for (let i = 0; i < tabcontent.length; i++) {
        if (tabcontent[i].id === lastTab) {
            openTab(lastTab);
            return;
        }
    }

    first_tab = document.getElementsByClassName("tabcontent")[0].id
    openTab(first_tab);
};