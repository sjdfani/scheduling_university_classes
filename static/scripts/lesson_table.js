$(document).ready(function () {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/lesson");
  xhr.onload = function () {
    const data = JSON.parse(xhr.responseText);
    const tableBody = $("#lesson-body");
    $.each(data, function (i, row) {
      const tableRow = $("<tr>");
      tableRow.append($("<td>").text(row.class_name));
      tableRow.append($("<td>").text(row.lesson_name));
      tableRow.append($("<td>").text(row.master_name));
      tableRow.append($("<td>").text(row.time));

      if (row.lesson_type === "ta") {
        tableRow.append($("<td>").text("حل تمرین"));
      } else if (row.lesson_type === "main") {
        tableRow.append($("<td>").text("اصلی"));
      } else if (row.lesson_type === "reparative") {
        tableRow.append($("<td>").text("جبرانی"));
      }

      tableRow.append($("<td>").text(row.student_number));

      if (row.day === "saturday") {
        tableRow.append($("<td>").text("شنبه"));
      } else if (row.day === "sunday") {
        tableRow.append($("<td>").text("یکشنبه"));
      } else if (row.day === "monday") {
        tableRow.append($("<td>").text("دوشنبه"));
      } else if (row.day === "tuesday") {
        tableRow.append($("<td>").text("سه شنبه"));
      } else if (row.day === "wednesday") {
        tableRow.append($("<td>").text("چهارشنبه"));
      } else if (row.day === "thursday") {
        tableRow.append($("<td>").text("پنجشنبه"));
      } else if (row.day === "friday") {
        tableRow.append($("<td>").text("جمعه"));
      }

      if (row.state_day === "both") {
        tableRow.append($("<td>").text("ثابت"));
      } else if (row.state_day === "even") {
        tableRow.append($("<td>").text("زوج"));
      } else if (row.state_day === "odd") {
        tableRow.append($("<td>").text("فرد"));
      }

      tableBody.append(tableRow);
    });
  };
  xhr.send();
});
