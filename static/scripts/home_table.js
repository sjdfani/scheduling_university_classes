$(document).ready(function () {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/home");
  xhr.onload = function () {
    const data = JSON.parse(xhr.responseText);
    let start_time = "",
      temp_text = "",
      time_8 = "",
      time_10 = "",
      time_12 = "",
      time_14 = "",
      time_16 = "",
      time_18 = "";

    const tableBody = $("#index-body");
    $.each(data, function (i, row) {
      const tableRow = $("<tr>");
      for (item in row) {
        start_time = item.split("-")[2].slice(1);

        // format of text in table
        let temp_lesson_type = "";
        if (row[item].lesson_type === "ta") {
          temp_lesson_type = "حل تمرین";
        } else if (row[item].lesson_type === "reparative") {
          temp_lesson_type = "جبرانی";
        } else if (row[item].lesson_type === "main") {
          temp_lesson_type = "اصلی";
        }

        let temp_state_day = "";
        if (row[item].state_day === "even") {
          temp_state_day = "ز";
        } else if (row[item].state_day === "odd") {
          temp_state_day = "ف";
        } else if (row[item].state_day === "both") {
          temp_state_day = "ث";
        }

        temp_text = `${
          row[item].lesson_name.charAt(0).toUpperCase() +
          row[item].lesson_name.slice(1)
        }(${temp_state_day})<br>${
          row[item].master_name.charAt(0).toUpperCase() +
          row[item].master_name.slice(1)
        }-(${temp_lesson_type})`;

        // set color for type of lessons
        if (row[item].lesson_type === "ta") {
          temp_text = `<div style="color:green;">${temp_text}</div>`;
        } else if (row[item].lesson_type === "reparative") {
          temp_text = `<div style="color:purple;">${temp_text}</div>`;
        }

        switch (Number(start_time)) {
          case 8:
            time_8 += temp_text + "<br>";
            break;
          case 10:
            time_10 += temp_text + "<br>";
            break;
          case 12:
            time_12 += temp_text + "<br>";
            break;
          case 14:
            time_14 += temp_text + "<br>";
            break;
          case 16:
            time_16 += temp_text + "<br>";
            break;
          case 18:
            time_18 += temp_text + "<br>";
            break;
        }
      }
      tableRow.append($(`<td>`).html(i));
      tableRow.append($(`<td>`).html(time_8));
      tableRow.append($(`<td>`).html(time_10));
      tableRow.append($(`<td>`).html(time_12));
      tableRow.append($(`<td>`).html(time_14));
      tableRow.append($(`<td>`).html(time_16));
      tableRow.append($(`<td>`).html(time_18));
      tableBody.append(tableRow);
      (time_8 = ""),
        (time_10 = ""),
        (time_12 = ""),
        (time_14 = ""),
        (time_16 = ""),
        (time_18 = "");
    });
  };
  xhr.send();
});
