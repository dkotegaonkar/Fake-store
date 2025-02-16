document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById(
    "loginForm"
  ) as HTMLFormElement | null;

  if (!loginForm) return;

  loginForm.addEventListener("submit", (event: Event) => {
    event.preventDefault();

    const usernameInput = document.getElementById(
      "username"
    ) as HTMLInputElement | null;
    const passwordInput = document.getElementById(
      "password"
    ) as HTMLInputElement | null;
    const errorMessage = document.getElementById(
      "error-message"
    ) as HTMLDivElement | null;

    if (!usernameInput || !passwordInput || !errorMessage) return;

    const username = usernameInput.value;
    const password = passwordInput.value;

    fetch("https://fakestoreapi.com/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    })
      .then((res) => res.json())
      .then((data: { token?: string }) => {
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
