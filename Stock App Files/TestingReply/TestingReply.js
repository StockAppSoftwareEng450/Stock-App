//init the request
var httpRequest = new XMLHttpRequest();
// Make true for asynchronous request
httpRequest.open('GET', "https://api.iextrading.com/1.0/stock/aapl/quote", true);
//This sends the request
httpRequest.send();
// This notifies us of when the request comes back
httpRequest.addEventListener("readystatechange", processRequest, false);

//Next we need process the Request we just recieved
function processRequest(e) {
  /*   readyState 4 is equal to done and status code 200
       means that the request is OK */
  if (httpRequest.readyState == 4 && httpRequest.status == 200) {
    //Reading the body of the response
    var response = JSON.parse(httpRequest.responseText);
    // for debugging purposes response sent back
    console.log(response.latestPrice);
    var lastPrice = response.latestPrice;
    alert(lastPrice);
    document.getElementById("StockPrice").innerHTML = lastPrice;
    //console.log(lastPrice);
    return lastPrice;
  }
}
