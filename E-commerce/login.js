document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;
        const errorMessage = document.getElementById("error-message");

        fetch("https://fakestoreapi.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password })
        })
        .then(res => res.json())
        .then(data => {
            if (data.token) {
                sessionStorage.setItem("authToken", data.token);
                sessionStorage.setItem("username", username);
                window.location.href = "index.html"; 
            } else {
                errorMessage.style.display = "block";
            }
        })
        .catch(() => {
            errorMessage.style.display = "block";
        });
    });
});
