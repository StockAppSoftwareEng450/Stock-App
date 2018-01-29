"use strict";

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

// Reference Messages collections
var messagesRef = firebase.database().ref('messages');


// Listen for form sumbit
document.getElementById('contactForm').addEventListener('submit', submitForm);

// Sumbit form
function submitForm(e){
    e.preventDefault();

    //Get values
    var name = getInputVal('name');
    var company = getInputVal('company');
    var email = getInputVal('email');
    var phone = getInputVal('phone');
    var message = getInputVal('message');

    // Save message
    saveMessage(name,company,email,phone,message);

    // show alert
    document.querySelector('.alert').style.display = 'block';

    //hide alert after 3 seconds
    setTimeout(function(){
        document.querySelector('.alert').style.display = 'none';
    }, 3000);

    // Clear Form
    document.getElementById('contactForm').reset();

}

//Function to get form values
function getInputVal(id){
    //returns value of id
    return document.getElementById(id).value;
}

// Save message to firebase
function saveMessage(name, company, email, phone, message){
    var newMessageRef = messagesRef.push();
    newMessageRef.set({
        name: name,
        company: company,
        email: email,
        phone: phone,
        message: message
    });
}

