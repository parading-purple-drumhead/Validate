import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "https://www.gstatic.com/firebasejs/9.5.0/firebase-auth.js";

const url = "https://6173-122-174-231-95.ngrok.io/";

const auth = getAuth();

const loginForm = document.getElementById("loginForm");
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const loginEmail = loginForm.loginEmail.value.trim();
  const loginPassword = loginForm.loginPassword.value.trim();

  if (loginEmail.length == 0 || loginPassword.length == 0) {
    document.getElementById("loginError").innerText =
      "Email/password cannot be empty";
    return;
  }

  signInWithEmailAndPassword(auth, loginEmail, loginPassword)
    .then(async (userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      sessionStorage.setItem("uid", user.uid);

      fetch(url + "getuser/" + user.uid, {
        method: "GET",
      })
        .then((response) => response.json())
        .then(async (data) => {
          console.log(data);
          await sessionStorage.setItem("name", data.name);
          console.log(sessionStorage.name);
        })
        .then(() => {
          window.location.href = "home.html";
        })
        .catch((error) => console.error(error));

      document.getElementById("loginError").innerText = "";
      loginForm.reset();
      // ...
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.log(errorMessage);
      document.getElementById("loginSuccess").innerText = "";
      document.getElementById("loginError").innerText = errorMessage;
      loginForm.loginPassword.value = "";
    });
});

const signupForm = document.getElementById("signupForm");
signupForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const signupName = signupForm.signupName.value.trim();
  const signupEmail = signupForm.signupEmail.value.trim();
  const signupPassword = signupForm.signupPassword.value.trim();
  const signupConfirmPassword = signupForm.signupConfirmPassword.value.trim();

  if (
    signupName.length == 0 ||
    signupEmail.length == 0 ||
    signupPassword.length == 0
  ) {
    document.getElementById("signupError").innerText =
      "Fields cannot be left empty";
    return;
  } else if (signupPassword != signupConfirmPassword) {
    document.getElementById("signupError").innerText = "Passwords do not match";
    return;
  }

  createUserWithEmailAndPassword(auth, signupEmail, signupPassword)
    .then((userCredential) => {
      // Signed in
      const user = userCredential.user;
      console.log(user);
      signupForm.reset();
      document.getElementById("signupError").innerText = "";
      document.getElementById("signupSuccess").innerText =
        "User created successfully!";

      fetch(url + "create", {
        method: "POST",
        body: JSON.stringify({
          uid: user.uid,
          name: signupName,
          email: signupEmail,
          trust_rating: 0,
          verifier: false,
          posts_created: [],
          posts_upvoted: [],
          posts_downvoted: [],
          comments_upvoted: [],
          comments_downvoted: [],
          badge: "Level 1",
        }),
        headers: {
          "Content-Type": "application/json",
        },
      })
        .then((response) => response.json())
        .then((data) => console.log(data))
        .catch((error) => console.error(error));
    })
    .catch((error) => {
      const errorCode = error.code;
      const errorMessage = error.message;
      document.getElementById("signupSuccess").innerText = "";
      document.getElementById("signupError").innerText = errorMessage;
    });
});
