function loadDoc() {

    //creating an XMLHttpRequest object
    var xhttp = new XMLHttpRequest();

    // Defines a function to be called when the readyState property changes
    xhttp.onreadystatechange = function() {

        /* The ReadyState holds the status of the XMLHttpRequest.
        0: request not initialized
        1: server connection established
        2: request received
        3: processing request
        4: request finished and response is ready */

        /* status return the result
        200: "OK"
        403: "Forbidden"
        404: "Page not found" */
        if (this.readyState === 4 && this.status === 200) {
            document.getElementById("demo").innerHTML =
                this.responseText;
        }
        else if (this.readyState === 4 && this.status === 403) {
            document.getElementById("demo").innerHTML =
                this.responseText;
        }
    };

    // Specifies the type of request: open(method, url, async)
    xhttp.open("GET", "helloWorld.txt", true);

    // Sends the request to the server (used for GET)
    xhttp.send();
}