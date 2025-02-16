"use strict";
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("loginForm");
    if (!loginForm)
        return;
    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const usernameInput = document.getElementById("username");
        const passwordInput = document.getElementById("password");
        const errorMessage = document.getElementById("error-message");
        if (!usernameInput || !passwordInput || !errorMessage)
            return;
        const username = usernameInput.value;
        const password = passwordInput.value;
        fetch("https://fakestoreapi.com/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        })
            .then((res) => res.json())
            .then((data) => {
            if (data.token) {
                sessionStorage.setItem("authToken", data.token);
                sessionStorage.setItem("username", username);
                window.location.href = "index.html";
            }
            else {
                errorMessage.style.display = "block";
            }
        })
            .catch(() => {
            errorMessage.style.display = "block";
        });
    });
});
//# sourceMappingURL=login.js.map