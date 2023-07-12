$(document).ready(function () {
  const xhr = new XMLHttpRequest();
  xhr.open("GET", "http://localhost:8080/class");
  xhr.onload = function () {
    const data = JSON.parse(xhr.responseText);
    const tableBody = $("#class-body");
    $.each(data, function (className, row) {
      const tableRow = $("<tr>");

      let temp_projector = "";
      if (row.projector === "yes") {
        temp_projector = "دارد";
      } else {
        temp_projector = "ندارد";
      }

      let temp_window = "";
      if (row.window === "yes") {
        temp_window = "دارد";
      } else {
        temp_window = "ندارد";
      }

      let temp_room_type = "";
      if (row.room_type === "class") {
        temp_room_type = "کلاس";
      } else if (row.room_type === "laboratory") {
        temp_room_type = "آزمایشگاه";
      } else if (row.room_type === "workshop") {
        temp_room_type = "کارگاه";
      }

      tableRow.append($("<td>").text(className));
      tableRow.append($("<td>").text(row.floor));
      tableRow.append($("<td>").text(row.count_of_board));
      tableRow.append($("<td>").text(temp_projector));
      tableRow.append($("<td>").text(row.class_capacity));
      tableRow.append($("<td>").text(temp_window));
      tableRow.append($("<td>").text(temp_room_type));
      tableBody.append(tableRow);
    });
  };
  xhr.send();
});
