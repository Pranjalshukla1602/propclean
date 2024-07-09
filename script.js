// script.js

import { initializeApp } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-app.js";
import { getAnalytics } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-analytics.js";
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, sendPasswordResetEmail, GoogleAuthProvider, signInWithPopup, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-auth.js";
import { getDatabase, ref, set } from "https://www.gstatic.com/firebasejs/9.6.10/firebase-database.js";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAn2hwFs7g1StFNAGVbiOxTTcLbuNq1le0",
  authDomain: "propclean.firebaseapp.com",
  databaseURL: "https://propclean-default-rtdb.firebaseio.com",
  projectId: "propclean",
  storageBucket: "propclean.appspot.com",
  messagingSenderId: "795234019311",
  appId: "1:795234019311:web:369566b90b91139164781a",
  measurementId: "G-CE3LFP4HSJ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const auth = getAuth(app);
const database = getDatabase(app);

// DOM Elements
const submitButton = document.getElementById("submit");
const signupButton = document.getElementById("sign-up");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const main = document.getElementById("main");
const createacct = document.getElementById("create-acct");
const googleSignInButton = document.getElementById("google-sign-in");

const signupEmailIn = document.getElementById("email-signup");
const confirmSignupEmailIn = document.getElementById("confirm-email-signup");
const signupPasswordIn = document.getElementById("password-signup");
const confirmSignUpPasswordIn = document.getElementById("confirm-password-signup");
const createacctbtn = document.getElementById("create-acct-btn");
const officeSignupIn = document.getElementById("office-signup");

const returnBtn = document.getElementById("return-btn");
const forgotPasswordLink = document.getElementById("forgot-password") ? document.getElementById("forgot-password").querySelector("a") : null;
const googleSignUpButton = document.getElementById("google-sign-up");

// Variables
let email, password, signupEmail, signupPassword, confirmSignupEmail, confirmSignUpPassword, office;

// Check authentication state when the page loads
onAuthStateChanged(auth, (user) => {
  if (user) {
    window.location.href = "land.html"; // Redirect to landing page if user is already authenticated
  }
});

// Google Sign-In
googleSignInButton.addEventListener("click", function() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Signed in with Google successfully:", user);
      window.location.href = "land.html"; // Redirect to landing page
    })
    .catch((error) => {
      console.error("Error signing in with Google:", error);
      handleAuthError(error);
    });
});

// Google Sign-Up
googleSignUpButton.addEventListener("click", function() {
  const provider = new GoogleAuthProvider();
  signInWithPopup(auth, provider)
    .then((result) => {
      const user = result.user;
      console.log("Signed up with Google successfully:", user);
      window.location.href = "organ.html";
    })
    .catch((error) => {
      console.error("Error signing up with Google:", error);
      handleAuthError(error);
    });
});

// script.js
document.addEventListener("DOMContentLoaded", function() {
  setTimeout(function() {
      document.getElementById('splash-screen').style.display = 'none';
      document.getElementById('main-content').style.display = 'block';
  }, 3000); // Adjust the timeout duration as needed
});

// script.js
function goBack() {
  window.history.back();
}

document.addEventListener("DOMContentLoaded", function() {
  const continueButton = document.getElementById("continue-button");

  continueButton.addEventListener("click", function() {
    const selectedOrganisation = document.getElementById("office-signup").value;
    const user = auth.currentUser;

    if (selectedOrganisation && user) {
      const userRef = ref(database, 'users/' + user.uid);
      set(userRef, {
        email: user.email,
        office: selectedOrganisation
      })
      .then(() => {
        console.log("Organisation saved successfully.");
        window.location.href = "land.html";
      })
      .catch((error) => {
        console.error("Error saving organisation:", error);
        window.alert("Error occurred. Try again.");
      });
    } else {
      window.alert("Please select an organisation.");
    }
  });
});


// Email Sign-Up
createacctbtn.addEventListener("click", function() {
  signupEmail = signupEmailIn.value;
  confirmSignupEmail = confirmSignupEmailIn.value;
  signupPassword = signupPasswordIn.value;
  confirmSignUpPassword = confirmSignUpPasswordIn.value;
  office = officeSignupIn.value;

  if (validateSignUpInputs(signupEmail, confirmSignupEmail, signupPassword, confirmSignUpPassword, office)) {
    createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
      .then((userCredential) => {
        const user = userCredential.user;
        return set(ref(database, 'users/' + user.uid), {
          email: signupEmail,
          office: office
        });
      })
      .then(() => {
        window.alert("Success! Account created.");
        window.location.href = "index.html";
      })
      .catch((error) => {
        console.error("Error occurred during sign-up:", error);
        window.alert("Error occurred. Try again.");
      });
  }
});

// Email Sign-In
submitButton.addEventListener("click", function() {
  email = emailInput.value;
  password = passwordInput.value;

  signInWithEmailAndPassword(auth, email, password)
    .then((userCredential) => {
      const user = userCredential.user;
      window.alert("Success! Welcome back!");
      window.location.href = "land.html";
    })
    .catch((error) => {
      console.error("Error occurred during sign-in:", error);
      if (error.code === "auth/invalid-email") {
        window.alert("Invalid email format. Please check and try again.");
      } else if (error.code === "auth/wrong-password") {
        window.alert("Incorrect password. Please try again.");
      } else if (error.code === "auth/user-not-found") {
        window.alert("No user found with this email. Please sign up first.");
      } else {
        window.alert("Error occurred. Try again.");
      }
    });
});

// Toggle Sign-Up Form
signupButton.addEventListener("click", function() {
  main.style.display = "none";
  createacct.style.display = "block";
});

// Return to Login Form
returnBtn.addEventListener("click", function() {
  main.style.display = "block";
  createacct.style.display = "none";
});

// Password Reset
if (forgotPasswordLink) {
  forgotPasswordLink.addEventListener("click", function() {
    email = emailInput.value;
    if (!email) {
      window.alert("Please enter your email to reset password.");
      return;
    }
    sendPasswordResetEmail(auth, email)
      .then(() => {
        window.alert("Password reset email sent. Check your inbox.");
      })
      .catch((error) => {
        console.error("Error occurred during password reset:", error);
        window.alert("Error occurred. Try again.");
      });
  });
}

// Helper functions
function validateSignUpInputs(email, confirmEmail, password, confirmPassword, office) {
  if (email !== confirmEmail) {
    window.alert("Email fields do not match. Try again.");
    return false;
  }
  if (password !== confirmPassword) {
    window.alert("Password fields do not match. Try again.");
    return false;
  }
  if (!email || !confirmEmail || !password || !confirmPassword || !office) {
    window.alert("Please fill out all required fields.");
    return false;
  }
  return true;
}

function handleAuthError(error) {
  if (error.code === "auth/account-exists-with-different-credential") {
    window.alert("Account exists with different credential. Please sign in using your email and password.");
  } else {
    window.alert("Error occurred. Please try again.");
  }
}
