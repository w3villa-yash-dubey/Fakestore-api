
function getUsers() {
  return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUser(username, useremail , password) {
  const users = getUsers();
  users.push({ username, useremail , password });
  localStorage.setItem("loggedInUser", username);
  localStorage.setItem("users", JSON.stringify(users));
}

function signup() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const useremail = document.getElementById("useremail").value

  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  let validemail = regex.test(useremail)

  if(!validemail) {
    showMessage("enter a valid email");
    return;
  }

  if (!username || !password || !useremail) {
    showMessage("Please fill both fields.");
    return;
  }

  const users = getUsers();
  const exists = users.find(u => u.useremail === useremail);
  if (exists) {
    showMessage("User already exists.");
    return;
  }

  saveUser(username, useremail , password);
  window.location.href = "home.html";
}

function login() {
  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const useremail = document.getElementById("useremail").value

  const users = getUsers();
  const user = users.find(u => u.useremail === useremail && u.username === username && u.password === password);

  if (user) {
    localStorage.setItem("loggedInUser", username);
    window.location.href = "home.html";
  } else {
    showMessage("Invalid credentials.");
  }
}

function showMessage(msg) {
  document.getElementById("message").innerText = msg;
}
