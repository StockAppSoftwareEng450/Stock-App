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

// Listen for form sumbit
document.getElementById('registerForm').addEventListener('submit', submitForm);

// Sumbit form
function submitForm(e){
    e.preventDefault();

    //Get values
    var fstName = getInputVal('fstName');
    var lstName = getInputVal('lstName');
    var email = getInputVal('email');
    var phone = getInputVal('phone');
    var password = getInputVal('password');
    var confirmPass = getInputVal('confirmPass');

    // Passing values that need to be checked to a function that returns whether they are correct or not.
    var checkedArray = checkVals(fstName, lstName, email, phone, password, confirmPass);
    console.log("checked values: " + checkedArray);

    // Calling send function to pass checked values to the array
    send(checkedArray[0], checkedArray[1], checkedArray[2], checkedArray[3], checkedArray[4], checkedArray[5]);
}

// Function to check if all values are correct
function checkVals (fstName, lstName, email, phone, password, confirmPass) {
    var array = [fstName, lstName, email, phone, password, confirmPass];

    var phoneLen = phone.length;
    console.log("phone length: " + phoneLen);

    // Check for ten numbers
    if (phoneLen !== 10){
        // show alert
        document.querySelector('.alert-message-valid-phone').style.display = 'block';

        //hide alert after 3 seconds
        setTimeout(function(){
            document.querySelector('.alert-message-valid-phone').style.display = 'none';
            console.log("Valid phone alert");
        }, 3000);
    }

    return array;
}



// Function to send the correct values to firebase
function send(fstName, lstName, email, phone, password, confirmPass) {

    // Create Firebase User + Login
    createUserAndLogin(email, password);
    // Get current Firebase user
    var user1 = null;
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.

            // Save message
            saveMessage(user.uid, fstName, lstName, phone);

            // show alert
            document.querySelector('.alert-message-sent').style.display = 'block';

            //hide alert after 3 seconds
            setTimeout(function(){
                document.querySelector('.alert-message-sent').style.display = 'none';
                console.log("before href transfer");
                //window.location.href = "login.html";
                console.log("after href transfer");
            }, 3000);

            // Clear Form
            document.getElementById('contactForm').reset();
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

// Save message to firebase
function saveMessage(userId, fstName, lstName, phone){
    firebase.database().ref('Users/' + userId).set({
        firstName: fstName,
        lastName: lstName,
        phone: phone
    });

    console.log("Sent");
}

// create a user but not login
// returns a promsie
function createUser(email, password) {
    var deferred = $.Deferred();
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        // Handle Errors here.
        var errorCode = error.code;
        var errorMessage = error.message;
        console.log(errorCode);
        console.log(errorMessage);
        // ...
    });

    return deferred.promise();
}

// Create a user and then login in
// returns a promise
function createUserAndLogin(email, password) {
    return createUser(email, password)
        .then(function () {
            return firebase.auth().signInWithEmailAndPassword(email, password).catch(function(error) {
                // Handle Errors here.
                var errorCode = error.code;
                var errorMessage = error.message;
                console.log(errorCode);
                console.log(errorMessage);
                // ...
            });
        });
}

