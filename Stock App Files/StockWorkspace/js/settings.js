"use strict";

function show(id, value) {
    document.getElementById(id).style.display = value ? 'block' : 'none';
}


$(document).ready(function () {

    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            //fill input fields with values
            let ref = firebase.database().ref("Users");
            ref.orderByKey().equalTo(user.uid).once("value", function(snapshot) {
                if(snapshot.exists()){
                    snapshot.forEach(function (value){
                        document.getElementById("email").value =  user.email;
                        document.getElementById("fstName").value = value.val().firstName;
                        document.getElementById("lstName").value = value.val().lastName;
                        document.getElementById("phone").value = value.val().phone;
                        document.getElementById("currency").value = value.val().currency;
                        show('alert_message',false);
                    });
                }
            });
        } else {
            // No user is signed in.
            window.location.href = "login.html";
        }
    });

    // Setting copyright footer to current
    // setCopyrightTime();

});

// Listen for form sumbit
document.getElementById('settingsForm').addEventListener('submit', submitForm);

// Sumbit form
function submitUserForm(){
    //Get values
    let email = getInputVal('email');
    let password = getInputVal('password');
    let confirmPass = getInputVal('confirmPass');

    // Passing values that need to be checked to a function that returns whether they are correct or not.
    let checkedArray = checkUserVals(email, password, confirmPass);
    console.log("checked values: " + checkedArray);

    show('alert_message',true);

    /** INVALID EMAIL MESSAGE TO USER**/
    if (checkedArray[0] === false ){
        document.querySelector('.email-invalid ').style.display = 'block';
        console.log("showing email alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.email-invalid ').style.display = 'none';
        }, 5000);
    }

    /** INVALID PASSWORD MESSAGE TO USER**/
    if (checkedArray[1] === false ){
        document.querySelector('.password-invalid').style.display = 'block';
        console.log("showing password alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.password-invalid').style.display = 'none';
        }, 5000);
    }

    if (checkedArray[0] !== false && checkedArray[1] !== false) {

        // Calling send function to pass checked values to the array
        sendUser(checkedArray[0], checkedArray[1]);
    }
}

// Function to check if all values are correct
function checkUserVals (email, password, confirmPass) {
    let array = [email, password, confirmPass];

    // Checked values return false if all criteria are not met
    let emailChecked, passwordChecked, confirmPassChecked = null;

    /** EMAIL CHECKING **/
    let emailRegex = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    let emailRegexResult = emailRegex.test(email);
    //console.log("emailRegexResult: " +  emailRegexResult);

    if (emailRegexResult === false){
        emailChecked = false;
    } else {
        emailChecked = email;
    }

    console.log("emailChecked " + emailChecked);

    /** PASSWORD **/
    let passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/;  // Minimum 8 chars, 1 num, 1 upper, 1 lower
    let passRegexResult = passRegex.test(password);
    //console.log("passRegexResult: " + passRegexResult);

    if (passRegexResult === false){
        passwordChecked = false;
    } else {
        passwordChecked = password;
    }

    console.log("passwordChecked" + passwordChecked );

    /** CONFIRM PASSWORD **/
    // If checked Regex password is the same as the checked Regex Confirm Password
    if (passwordChecked === confirmPass){
        passwordChecked = password;
        confirmPassChecked = confirmPass;
    } else {
        passwordChecked = false;
        confirmPassChecked = false;
        //console.log("setting checked passwords against each other to false");
    }

    console.log("passwordChecked" + passwordChecked);
    console.log("confirmPassChecked" + confirmPassChecked );

    // Return checked array
    array = [emailChecked, passwordChecked, confirmPassChecked];

    return array;

}

// Function to send the correct values to firebase
function sendUser(email, password) {
    // Get current Firebase user
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.
            let credential = firebase.auth.EmailAuthProvider.credential(
                user.email,
                password
            );

            // Prompt the user to re-provide their sign-in credentials
            user.reauthenticateWithCredential(credential).then(function() {
                // User re-authenticated.
                if(email !== false){
                    user.updateEmail(email).then(function() {
                        // Update successful.
                        console.log("Email Update successful")
                    }).catch(function(error) {
                        // An error happened.
                        let errorCode = error.code;
                        let errorMessage = error.message;

                        // Consoling error messages
                        console.log(errorCode);
                        console.log(errorMessage);
                    });
                }

                if(password !== false){
                    user.updatePassword(password).then(function() {
                        // Update successful.
                        console.log("Password Update successful")
                    }).catch(function(error) {
                        // An error happened.
                        let errorCode = error.code;
                        let errorMessage = error.message;

                        // Consoling error messages
                        console.log(errorCode);
                        console.log(errorMessage);
                    });
                }
            }).catch(function(error) {
                // An error happened.
                let errorCode = error.code;
                let errorMessage = error.message;

                // Consoling error messages
                console.log(errorCode);
                console.log(errorMessage);
            });


            // show alert
            document.querySelector('.successful-register').style.display = 'block';

        } else {
            // No user is signed in.
        }
    });
}

// Sumbit form
function submitForm(e){
    e.preventDefault();

    //Get values
    let fstName = getInputVal('fstName');
    let lstName = getInputVal('lstName');
    let phone = getInputVal('phone');

    let dropdown = document.getElementById("currency");
    let currency = dropdown.options[dropdown.selectedIndex].value;

    // Passing values that need to be checked to a function that returns whether they are correct or not.
    let checkedArray = checkVals(fstName, lstName, phone, currency);
    console.log("checked values: " + checkedArray);

    /** INVALID NAME MESSAGE TO USER**/
    if (checkedArray[0] === false || checkedArray[1] === false){
        document.querySelector('.name-invalid').style.display = 'block';
        console.log("showing naming alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.name-invalid').style.display = 'none';
        }, 5000);
    }

    /** INVALID PHONE MESSAGE TO USER**/
    if (checkedArray[2] === false ){
        // show phone alert
        document.querySelector('.alert-message-valid-phone').style.display = 'block';
        console.log("showing phone alert");

        // //hide alert after 5 seconds
        setTimeout(function(){
            document.querySelector('.alert-message-valid-phone').style.display = 'none';
        }, 5000);
    }

    /** ADD INVALID Currency, upper & lower Bound MESSAGE TO USER **/

    if (checkedArray[0] !== false && checkedArray[1] !== false &&
        checkedArray[2] !== false && checkedArray[3] !== false &&
        checkedArray[4] !== false && checkedArray[5] !== false &&
        checkedArray[6] !== false && checkedArray[7] !== false) {

        // Calling send function to pass checked values to the array
        send(checkedArray[0], checkedArray[1], checkedArray[2], checkedArray[3], checkedArray[4], checkedArray[5], checkedArray[6], checkedArray[7], checkedArray[8]);
    }

    show('alert_message',true);
}

// Function to check if all values are correct
function checkVals (fstName, lstName, phone, currency) {
    let array = [fstName, lstName, phone, currency];

    // Checked values return false if all criteria are not met
    let fstNameChecked, lstNameChecked, phoneChecked, currencyChecked = null;

    /** NAME CHECKING **/

        // Calculating the len of first and last name does not exceed 40 chars
    let fstNameLen = fstName.length;
    let lstNameLen = lstName.length;
    let nameLenResult = fstNameLen + lstNameLen + 1;    // Adding 1 to account for the space in between the name

    let fullNameRegex = /^(([A-Za-z]+[\-']?)*([A-Za-z]+)?\s)+([A-Za-z]+[\-']?)*([A-Za-z]+)?$/;
    let NameRegexResult = fullNameRegex.test(fstName + " " + lstName);
    //console.log("fullNameRegexResult: " + NameRegexResult);

    // Check to see if user forgot name
    if (fstNameLen === 0  || lstNameLen === 0){
        fstNameChecked = false;
        lstNameChecked = false;
    } else {
        if (NameRegexResult === false || nameLenResult > 40 ) {
            fstNameChecked = false;
            lstNameChecked = false;
        } else {
            fstNameChecked = fstName;
            lstNameChecked = lstName;
        }
    }

    console.log("fstNameChecked " + fstNameChecked);
    console.log("lstNameChecked " + lstNameChecked);

    /** PHONE CHECKING **/
    let phoneLen = phone.length;

    let phoneRegex = /^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im;
    let phoneRegexResult = phoneRegex.test(phone);
    //console.log("phoneRegexResult: " + phoneRegexResult);

    // Check for ten numbers
    if (phoneRegexResult === false || phoneLen !== 10){
        phoneChecked = false;
    } else {
        phoneChecked = phone;
    }

    console.log("phoneChecked " + phoneChecked);

    /** CURRENCY CHECKING **/
    // Check for a currency
    if (currency === null){
        currencyChecked = false;
    } else {
        currencyChecked = currency;
    }

    console.log("currencyChecked " + currencyChecked);



    // Return checked array
    array = [fstNameChecked, lstNameChecked, phoneChecked, currencyChecked];

    return array;
}

// Function to send the correct values to firebase
function send(fstName, lstName, phone, currency) {

    // Get current Firebase user
    firebase.auth().onAuthStateChanged(function(user) {
        if (user) {
            // User is signed in.

            // Save message
            saveMessage(user.uid, fstName, lstName, phone, currency);

            // show alert
            //document.querySelector('.successful-register').style.display = 'block';

        } else {
            // No user is signed in.
        }
    });
}

// Save message to firebase
function saveMessage(userId, fstName, lstName, phone, currency){
    firebase.database().ref('Users/' + userId).set({
        firstName: fstName,
        lastName: lstName,
        phone: phone,
        currency: currency
    });

    console.log("Sent");

}

//Function to get the form values
function getInputVal(id) {
    //returns value of id
    return document.getElementById(id).value;
}



