$(document).ready(function () {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/setting");
  xhr.onload = function () {
    const data = JSON.parse(xhr.responseText);

    let day = "";

    switch (data["nav_day"]) {
      case "saturday":
        day = "شنبه";
        break;
      case "sunday":
        day = "یکشنبه";
        break;
      case "monday":
        day = "دوشنبه";
        break;
      case "tuesday":
        day = "سه شنبه";
        break;
      case "wednesday":
        day = "چهارشنبه";
        break;
      case "thursday":
        day = "پنجشنبه";
        break;
      case "friday":
        day = "جمعه";
        break;
    }

    const nav_text = `${data["number_of_week"].slice(0, 2)} ${day} - هفته `;

    $("#navbar-text").text(nav_text);
    $("#now").val(data["number_of_week"]);
    $("#nav-day").val(data["nav_day"]);
  };
  xhr.send();
});
