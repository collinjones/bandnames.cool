function startTour() {
    ////////  Resources  ////////

    function injectCSS(css_link) {var head = document.getElementsByTagName("head")[0];var link = document.createElement("link");link.rel = "stylesheet";link.type = "text/css";link.href = css_link;link.crossorigin = "anonymous";head.appendChild(link);};
    function injectJS(js_link) {var head = document.getElementsByTagName("head")[0];var script = document.createElement("script");script.src = js_link;script.defer;script.type="text/javascript";script.crossorigin = "anonymous";script.onload = function() { null };head.appendChild(script);};
    function injectStyle(css) {var head = document.getElementsByTagName("head")[0];var style = document.createElement("style");style.type = "text/css";style.appendChild(document.createTextNode(css));head.appendChild(style);};
    injectCSS("https://cdn.jsdelivr.net/npm/intro.js@5.1.0/minified/introjs.min.css");
    injectStyle("    .introjs-button.introjs-nextbutton,    .introjs-button.introjs-donebutton {        color: #fff !important;        background-color: #367be5 !important;        border: 1px solid #245ac0 !important;        text-shadow: none;        box-shadow: none;    }    .introjs-button.introjs-nextbutton:hover,    .introjs-button.introjs-donebutton:hover {        color: #fff !important;        background-color: #245ac0 !important;        border: 1px solid #245ac0 !important;    }    .introjs-button {        box-sizing: content-box;        text-decoration: none;    }    .introjs-button.introjs-skipbutton {        color: #367be5;    }    .introjs-tooltip, .introjs-floating {        box-sizing: content-box;        position: absolute;    }");
    injectJS("https://cdn.jsdelivr.net/npm/intro.js@5.1.0/intro.min.js");
    loadTour() 
}
////////  Tour Code  ////////
function loadTour() { if ( typeof introJs !== "undefined" ) {

    // IntroJS Tour
    function startIntro(){
    var intro = introJs();
    intro.setOptions({
    steps: [
    {
    intro: '<font size="3" color="#33477B"><center><b>Welcome</b></center><hr>Welcome to bandnames.cool, a website where you can submit and vote on on cool bandnames.</font>',
    position: 'top'},{element: 'input[id=\'bandname\']',
    intro: '<font size="3" color="#33477B"><center><b>Bandname Submission</b></center><hr>You can submit bandnames here.</font>',
    position: 'top'},{element: 'div[id=\'sketch-holder\']',
    intro: '<font size="3" color="#33477B"><center><b>Bandname Wheel</b></center><hr>Spin the wheel and discover thousands of user-submitted bandnames!</font>',
    position: 'top'},{element: 'img[id=\'upvote-button\']',
    intro: '<font size="3" color="#33477B"><center><b>Voting</b></center><hr>If you like a bandname, vote it up!</font>',
    position: 'top'},{element: 'img[id=\'downvote-button\']',
    intro: '<font size="3" color="#33477B"><center><b>Voting</b></center><hr>If you dislike a bandname, vote it down!</font>',
    position: 'top'},{element: 'img[id=\'scroll-img\']',
    intro: '<font size="3" color="#33477B"><center><b>Voting History</b></center><hr>Bandnames you’ve voted on will appear here! Click “Bandname” or “Score” to sort your collected bandnames alphabetically, or by total user score.</font>',
    position: 'top'},{
    intro: '<font size="3" color="#33477B"><center><b>Complete</b></center><hr>That’s about it! If you enjoy it, you can make an account to start tracking your voted bandnames as well as ones you have submitted.</font>',
    position: 'top'},]
    });
    intro.setOption("disableInteraction", true);
    intro.setOption("overlayOpacity", .29);
    intro.setOption("scrollToElement", true);
    intro.setOption("keyboardNavigation", true);
    intro.setOption("exitOnEsc", true);
    intro.setOption("hidePrev", true);
    intro.setOption("nextToDone", true);
    intro.setOption("exitOnOverlayClick", false);
    intro.setOption("showStepNumbers", false);
    intro.setOption("showProgress", false);
    intro.start();
    $tour = intro;
    };
    startIntro();

} else { window.setTimeout("loadTour();",100); }}
