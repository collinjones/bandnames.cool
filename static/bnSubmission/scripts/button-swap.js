document.onmousedown = function () {
    console.log('setting clicked')
    document.getElementById("bandname-submit").src="static/images/button-clicked.png"
}
document.onmouseup = function () {
    document.getElementById("bandname-submit").src="static/images/button-open.png"
}