$(document).ready(function () {
  $("#add-lesson-btn").click(function () {
    $("#add-lesson-div").toggleClass("d-none");
  });
  $("#edit-delete-lesson").click(function () {
    $("#edit-delete-lesson-div").toggleClass("d-none");
    fetch("http://localhost:8080/class-name", {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        $("#class-name-ed-lesson-search option").remove();
        for (item in data) {
          $("#class-name-ed-lesson-search").append(
            `<option value="${data[item]}">${data[item]}</option>`
          );
        }
        $("#class-name-lesson_ed option").remove();
        for (item in data) {
          $("#class-name-lesson_ed").append(
            `<option value="${data[item]}">${data[item]}</option>`
          );
        }
      })
      .catch((error) => console.error(error));
  });
  $("#search-lesson-btn").click(function () {
    $("#edit-delete-lesson-div-form").addClass("d-none");
    const id = `${$("#class-name-ed-lesson-search").val()}-${$(
      "#state-day-search"
    ).val()}-(${$("#time-search").val()})-${$("#day_1_search").val()}`;
    fetch(`http://localhost:8080/lesson/${id}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data["message"] === "found") {
          $("#lesson-message-div").addClass("d-none");
          $("#lesson_name_ed").val(data["data"].lesson_name);
          $("#master_name_ed").val(data["data"].master_name);
          $("#time_ed").val(data["data"].time);
          $("#lesson_type_ed").val(data["data"].lesson_type);
          $("#day_1_ed").val(data["data"].day);
          $("#state-day_ed").val(data["data"].state_day);
          $("#class-name-lesson_ed").val(data["data"].class_name);
          $("#student_number_ed").val(data["data"].student_number);
          $("#edit-delete-lesson-div-form").removeClass("d-none");
        } else {
          $("#lesson-message-div").toggleClass("d-none");
        }
      })
      .catch((error) => console.error(error));
  });
  $("#delete-lesson-btn").click(function () {
    const id = `${$("#class-name-ed-lesson-search").val()}-${$(
      "#state-day-search"
    ).val()}-(${$("#time-search").val()})`;
    fetch(`http://localhost:8080/lesson/delete/${id}`, {
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
  $("#update-lesson-btn").click(function () {
    fetch("http://localhost:8080/lesson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        lesson_name: $("#lesson_name_ed").val(),
        master_name: $("#master_name_ed").val(),
        time: $("#time_ed").val(),
        lesson_type: $("#lesson_type_ed").val(),
        day: $("#day_1_ed").val(),
        state_day: $("#state-day_ed").val(),
        class_name: $("#class-name-lesson_ed").val(),
        student_number: $("#student_number_ed").val(),
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        window.location.reload();
      })
      .catch((error) => console.error(error));
  });
});
