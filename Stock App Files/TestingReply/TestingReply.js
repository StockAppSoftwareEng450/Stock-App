//init the request
var xhr = new XMLHttpRequest();
// Make true for asynchronous request
xhr.open('GET', "https://api.iextrading.com/1.0/stock/aapl/quote", true);
//This sends the request
xhr.send();
// This notifies us of when the request comes back
xhr.addEventListener("readystatechange", processRequest, false);

//Next we need process the Request we just recieved
function processRequest(e) {
  /*   readyState 4 is equal to done and status code 200
       means that the request is OK */
  if (xhr.readyState == 4 && xhr.status == 200) {
    //Reading the body of the response
    var response = JSON.parse(xhr.responseText);
    // for debugging purposes response sent back
    console.log(response.latestPrice);
    var lastPrice = response.latestPrice;
    alert(lastPrice);
    document.getElementById("StockPrice").innerHTML = lastPrice;
    //console.log(lastPrice);
    return lastPrice;
  }
}
