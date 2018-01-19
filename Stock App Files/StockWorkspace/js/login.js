"use strict";

//Logout a current user
firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("Sign-out successful.")
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    // ...
});

// Listen for form submit
document.getElementById('loginForm').addEventListener('submit', submitForm);

// Submit form
function submitForm(e){
    e.preventDefault();

    //Get values
    var email = getInputVal('email');
    var password = getInputVal('password');

    //login user
    loginUser(email, password);

    //try if user is logged in
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.

            //On success forward to index.html
            window.location.replace("index.html");
        } else {
            // No user is signed in.
        }
    });

}

//Function to get form values
function getInputVal(id){
    //returns value of id
    return document.getElementById(id).value;
}

// login a user
// returns a promsie
function loginUser(email, password) {
    var deferred = $.Deferred();
    firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ...
    });

    return deferred.promise();
}