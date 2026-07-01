const userName =
localStorage.getItem("userName");

const userEmail =
localStorage.getItem("userEmail");

document.getElementById(
    "profileName"
).innerText = userName;

document.getElementById(
    "profileEmail"
).innerText = userEmail;

function logout()
{
    localStorage.clear();

    window.location.href =
    "login.html";
}