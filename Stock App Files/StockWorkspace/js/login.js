// Initialize Firebase
var config = {
    apiKey: "AIzaSyBWRqFtzDSiyZfDD8WjvdERLo-NuraC8Bg",
    authDomain: "stockapp-57f25.firebaseapp.com",
    databaseURL: "https://stockapp-57f25.firebaseio.com",
    projectId: "stockapp-57f25",
    storageBucket: "stockapp-57f25.appspot.com",
    messagingSenderId: "496167713307"
};
firebase.initializeApp(config);

var ref = firebase.database().ref("Users")
console.log(ref);
/*ref.orderByKey().startAt(document.getElementById('exampleInputEmail1').innerHTML).endAt(document.getElementById('exampleInputEmail1')).on("child_added", function(snapshot) {
    console.log(snapshot.key);
});*/

ref.orderByKey().on("child_added", function(snapshot) {
    console.log("User: "+snapshot.val().confirmPassword);
})