var ref = firebase.database().ref("Users");
ref.orderByChild("UID").equalTo(user.uid).once("value", function(snapshot) {

    snapshot.forEach(function (value){
        console.log(value.child("StockSymbole").val());
    });
});