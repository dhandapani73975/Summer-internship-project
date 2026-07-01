document
.getElementById("loginForm")
.addEventListener("submit", async function(e){

    e.preventDefault();

    const email =
    document.getElementById("email").value;

    const password =
    document.getElementById("password").value;

    // const users =
    // JSON.parse(localStorage.getItem("users"))
    // || [];

//     const user =
//     users.find(u =>
//         u.email === email &&
//         u.password === password
//     );

//     if(!user)
//     {
//         alert("Invalid Credentials");
//         return;
//     }

//     localStorage.setItem(
//         "currentUser",
//         JSON.stringify(user)
//     );

//     alert("Login Successful");

//     window.location.href =
//     "index.html";

// });
 try {

        const response = await fetch(
            "http://localhost:5000/api/auth/login",
            {
                method: "POST",

                headers: {
                    "Content-Type":
                    "application/json"
                },

                body: JSON.stringify({
                    email,
                    password
                })
            }
        );

        const data =
        await response.json();

        alert(data.message);

        if(response.ok)
        {
            localStorage.setItem(
                "user",
                JSON.stringify(data.user)
            );

            localStorage.setItem(
                "userName",
                data.user.name
            );

            localStorage.setItem(
                "userEmail",
                data.user.email
            );

            window.location.href =
            "index.html";
        }

    } catch(error) {

        console.log(error);

        alert("Something went wrong");
    }

});