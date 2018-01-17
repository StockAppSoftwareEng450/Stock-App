function doSomething() {
    console.log("enter!")
}

document.getElementById("txtSearch").addEventListener("keyup", function(event) {
    event.preventDefault();
    if (event.keyCode === 13) {
        document.getElementById("btnSearch").click();
    }
});