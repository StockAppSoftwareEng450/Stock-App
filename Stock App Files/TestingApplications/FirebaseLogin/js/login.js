"use strict";

// Listen for form sumbit
document.getElementById('frmLogin').addEventListener('submit', submitForm);

// Sumbit form
function submitForm(e){
    e.preventDefault();

    //Get values
    var email = getInputVal('txtEmail');
    var password = getInputVal('txtPass');

    // Passing values that need to be checked to a function that returns whether they are correct or not.
    // var checkedArray = checkVals(fstName, lstName, email, phone, password, confirmPass);
    //console.log("checked values: " + checkedArray);

    // Calling send function to pass checked values to the array
    console.log(loginUser(email, password));

    //forward to webpage

    //You can send an address verification email to a user with the sendEmailVerification method. For example:

    var user = firebase.auth().currentUser;

console.log(user);

    /*user.sendEmailVerification().then(function() {
        // Email sent.
        console.log("Email sent");
    }).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ...
    });*/

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

/*firebase.auth().signOut().then(function() {
    // Sign-out successful.
    console.log("Sign-out successful.")
}).catch(function(error) {
    // Handle Errors here.
    var errorCode = error.code;
    var errorMessage = error.message;
    console.log(errorCode);
    console.log(errorMessage);
    // ...
});*/

/*
//https://firebase.google.com/docs/auth/web/manage-users
//The recommended way to get the current user is by setting an observer on the Auth object:

firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
  } else {
    // No user is signed in.
  }
});


//Set a user's email address
//You can set a user's email address with the updateEmail method. For example:

var user = firebase.auth().currentUser;

user.updateEmail("user@example.com").then(function() {
  // Update successful.
}).catch(function(error) {
  // An error happened.
});


//You can set a user's password with the updatePassword method. For example:

var user = firebase.auth().currentUser;
var newPassword = getASecureRandomPassword();

user.updatePassword(newPassword).then(function() {
  // Update successful.
}).catch(function(error) {
  // An error happened.
});


//Send a password reset email
//You can send a password reset email to a user with the sendPasswordResetEmail method. For example:

var auth = firebase.auth();
var emailAddress = "user@example.com";

auth.sendPasswordResetEmail(emailAddress).then(function() {
  // Email sent.
}).catch(function(error) {
  // An error happened.
});


//Delete a user
//You can delete a user account with the delete method. For example:

var user = firebase.auth().currentUser;

user.delete().then(function() {
  // User deleted.
}).catch(function(error) {
  // An error happened.
});


//Re-authenticate a user
//Some security-sensitive actions—such as deleting an account, setting a primary email address, and changing a password—require that the user has recently signed in. If you perform one of these actions, and the user signed in too long ago, the action fails with an error. When this happens, re-authenticate the user by getting new sign-in credentials from the user and passing the credentials to reauthenticateWithCredential. For example:

var user = firebase.auth().currentUser;
var credential;

// Prompt the user to re-provide their sign-in credentials

user.reauthenticateWithCredential(credential).then(function() {
  // User re-authenticated.
}).catch(function(error) {
  // An error happened.
});
 */