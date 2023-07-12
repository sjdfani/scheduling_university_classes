$(document).ready(function () {
  $("#add-class-btn").click(function () {
    $("#add-class-div").toggleClass("d-none");
  });
  $("#edit-delete-class").click(function () {
    $("#edit-delete-class-div").toggleClass("d-none");
  });
  $("#search-class-btn").click(function () {
    $("#edit-delete-class-div-form").addClass("d-none");
    const class_name = $("#search-class-name").val();
    fetch(`http://localhost:8080/class/${class_name}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["message"] === "found") {
          $("#class-message-div").addClass("d-none");
          $("#class_name_ed").val(class_name);
          $("#class-capacity_ed").val(data["data"].class_capacity);
          $("#floor_ed").val(data["data"].floor);
          $("#cob_ed").val(data["data"].count_of_board);
          $(
            'input[name="projector2"][value="' + data["data"].projector + '"]'
          ).prop("checked", true);
          $('input[name="window2"][value="' + data["data"].window + '"]').prop(
            "checked",
            true
          );
          $("#rt_ed").val(data["data"].room_type);
          $("#edit-delete-class-div-form").removeClass("d-none");
        } else {
          $("#class-message-div").toggleClass("d-none");
        }
      })
      .catch((error) => console.error(error));
  });
  $("#delete-class-btn").click(function () {
    const class_name = $("#search-class-name").val();
    fetch(`http://localhost:8080/class/delete/${class_name}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
      })
      .catch((error) => console.error(error));
  });
  $("#update-class-btn").click(function () {
    fetch("http://localhost:8080/class", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        class_name: $("#class_name_ed").val(),
        class_capacity: $("#class-capacity_ed").val(),
        floor: $("#floor_ed").val(),
        count_of_board: $("#cob_ed").val(),
        projector: $('input[name="projector2"]:checked').val(),
        window: $('input[name="window2"]:checked').val(),
        room_type: $("#rt_ed").val(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
      })
      .catch((error) => console.error(error));
  });
});
