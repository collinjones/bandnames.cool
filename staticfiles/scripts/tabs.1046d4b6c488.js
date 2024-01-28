function openTab(evt, tabName) {
    var i, tabcontent, tablinks;
    tabcontent = document.getElementsByClassName("tabcontent");
    tablinks = document.getElementsByClassName("tablinks");

    console.log('hello')

    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
        if (i == 0) {
            tabcontent[i].style.display = "block";
        }
    }

    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }

    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}