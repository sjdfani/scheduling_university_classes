$(document).ready(function () {
  $("#forgot-password").click(function () {
    $("#forgot-password-div").toggleClass("d-none");
  });
  $("#login-btn").click(function () {
    $(this).prop("disabled", true);

    fetch("http://localhost:8080/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        username: $("#username").val(),
        password: $("#password").val(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["message"] === "password-correct") {
          localStorage.setItem("signIn", "true");
          window.location.href = "http://localhost:5500/templates/index.html";
        } else if (data["message"] === "password-incorrect") {
          $("#login-message-tag").text("Your password is incorrect.");
          $("#login-message-div").removeClass("d-none");
        } else if (data["message"] === "username-notfound") {
          $("#login-message-tag").text("Your username is not exists.");
          $("#login-message-div").removeClass("d-none");
        }
      })
      .catch((error) => console.error(error));

    $(this).prop("disabled", false);
  });
  $("#logout-tag").click(function () {
    localStorage.removeItem("signIn");
    window.location.reload();
  });
});

window.addEventListener("load", function () {
  const signIn = JSON.parse(localStorage.getItem("signIn"));
  if (signIn) {
    document.querySelector("#login-div").classList.toggle("d-none");
    document.querySelector("#hide-navbar-item").classList.toggle("d-none");
  }
});
