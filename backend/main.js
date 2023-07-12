const express = require("express");
const bodyParser = require("body-parser");
const fs = require("fs");
const crypto = require("crypto");

const base_settings = {
  USER_FILE_PATH: "./database/users.json",
  LESSON_FILE_PATH: "./database/lessons.json",
  CLASS_FILE_PATH: "./database/classes.json",
  SETTING_FILE_PATH: "./database/settings.json",
  PORT: 8080,
  SALT: "c4ca4238a0b923820dcc509a6f75849b",
};

const routes = {
  BASE_PATH: `http://localhost:${base_settings["PORT"]}`,
  LOGIN_PATH: "/login",
  REGISTER_PATH: "/register",
  LESSON_PATH: "/lesson",
  LESSON_RETRIEVE_PATH: "/lesson/:id",
  LESSON_DELETE_PATH: "/lesson/delete/:id",
  CLASS_PATH: "/class",
  CLASS_NAME_PATH: "/class-name",
  CLASS_RETRIEVE_PATH: "/class/:id",
  CLASS_DELETE_PATH: "/class/delete/:id",
  HOME_PATH: "/home",
  SETTING_PATH: "/setting",
  SEARCH_PATH: "/search",
};

const html_addresses = {
  INDEX_HTML: "http://localhost:5500/templates/index.html",
  FAILED_REGISTER: "http://localhost:5500/templates/failed_register.html",
  SUCCESS_REGISTER: "http://localhost:5500/templates/success_register.html",
  SUCCESS_LESSON: "http://localhost:5500/templates/success_lesson.html",
  FAILED_LESSON: "http://localhost:5500/templates/failed_lesson.html",
  SUCCESS_CLASS: "http://localhost:5500/templates/success_class.html",
};

const app = express();
app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
  res.header("Access-Control-Allow-Headers", "Content-Type");
  next();
});
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static("public"));

app.post(routes["LOGIN_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["LOGIN_PATH"]}\t\tPOST`);
  const username = req.body.username;
  const password1 = req.body.password;

  let newData = {};
  try {
    const data = fs.readFileSync(base_settings["USER_FILE_PATH"], "utf8");
    newData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }

  let response = {};
  let status;
  if (username in newData) {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password1 + base_settings["SALT"])
      .digest("hex");
    if (hashedPassword === newData[username].password) {
      response["message"] = "password-correct";
      status = 200;
    } else {
      response["message"] = "password-incorrect";
      status = 401;
    }
  } else {
    response["message"] = "username-notfound";
    status = 404;
  }
  res.status(status).send(JSON.stringify(response));
  res.end();
});

app.post(routes["REGISTER_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["REGISTER_PATH"]}\t\tPOST`);
  const username = req.body.username;
  const password = req.body.password;

  let newData = {};
  try {
    const data = fs.readFileSync(base_settings["USER_FILE_PATH"], "utf8");
    newData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }

  if (username in newData) {
    res.redirect(html_addresses["FAILED_REGISTER"]);
  } else {
    const hashedPassword = crypto
      .createHash("sha256")
      .update(password + base_settings["SALT"])
      .digest("hex");
    newData[username] = { password: hashedPassword };
    fs.writeFileSync(
      base_settings["USER_FILE_PATH"],
      JSON.stringify(newData),
      "utf8"
    );
    res.redirect(html_addresses["SUCCESS_REGISTER"]);
  }
});

app.post(routes["LESSON_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["LESSON_PATH"]}\t\tPOST`);
  const student_number = parseInt(req.body.student_number);
  const state_day = req.body.state_day;
  const lesson_time = req.body.time;
  const lesson_day = req.body.day;
  const lesson_room_type = req.body.lesson_room_type;
  delete req.body.lesson_room_type;

  let class_newData = {};
  let lesson_newData = {};
  try {
    const lesson_data = fs.readFileSync(
      base_settings["LESSON_FILE_PATH"],
      "utf8"
    );
    const class_data = fs.readFileSync(
      base_settings["CLASS_FILE_PATH"],
      "utf8"
    );
    lesson_newData = JSON.parse(lesson_data);
    class_newData = JSON.parse(class_data);
  } catch (err) {
    console.error(err);
  }

  let class_name = "";
  let status = false;
  let status_type_day = false;
  const lessons_keys = Object.keys(lesson_newData);

  for (item in class_newData) {
    const key = `${item}-${state_day}-(${lesson_time})-${lesson_day}`;
    if (state_day === "both") {
      const exp1 = `${item}-odd-(${lesson_time})-${lesson_day}`;
      const exp2 = `${item}-even-(${lesson_time})-${lesson_day}`;
      if (lessons_keys.includes(exp1) || lessons_keys.includes(exp2)) {
        status_type_day = true;
      }
    } else {
      const exp3 = `${item}-both-(${lesson_time})-${lesson_day}`;
      if (lessons_keys.includes(exp3)) {
        status_type_day = true;
      }
    }
    if (
      !status_type_day &&
      !lessons_keys.includes(key) &&
      parseInt(class_newData[item].class_capacity) >= student_number &&
      class_newData[item].room_type === lesson_room_type
    ) {
      class_name = item;
      status = true;
      break;
    }
    status_type_day = false;
  }
  if (status) {
    req.body["class_name"] = class_name;
    const id = `${class_name}-${state_day}-(${lesson_time})-${lesson_day}`;
    lesson_newData[id] = req.body;
    fs.writeFileSync(
      base_settings["LESSON_FILE_PATH"],
      JSON.stringify(lesson_newData),
      "utf8"
    );
    res.redirect(html_addresses["SUCCESS_LESSON"]);
  } else {
    res.redirect(html_addresses["FAILED_LESSON"]);
  }
});

app.get(routes["LESSON_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["LESSON_PATH"]}\t\tGET`);
  let newData_lesson = {};
  let newData_class = {};
  try {
    const lesson_data = fs.readFileSync(
      base_settings["LESSON_FILE_PATH"],
      "utf8"
    );
    const class_data = fs.readFileSync(
      base_settings["CLASS_FILE_PATH"],
      "utf8"
    );
    newData_lesson = JSON.parse(lesson_data);
    newData_class = JSON.parse(class_data);
  } catch (err) {
    console.error(err);
  }

  const lessons_value = Object.values(newData_lesson);
  const class_keys = Object.keys(newData_class);
  class_keys.sort();

  let result_newData = {};
  for (i in class_keys) {
    for (item in lessons_value) {
      if (lessons_value[item].class_name === class_keys[i]) {
        let id = `${lessons_value[item].class_name}-${lessons_value[item].state_day}-(${lessons_value[item].time})-${lessons_value[item].day}`;
        result_newData[id] = lessons_value[item];
      }
    }
  }

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(result_newData));
});

app.get(routes["LESSON_RETRIEVE_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["LESSON_RETRIEVE_PATH"]}\t\tGET`);
  let newData = {};
  let res_data = {};
  try {
    const data = fs.readFileSync(base_settings["LESSON_FILE_PATH"], "utf8");
    newData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
  if (req.params.id in newData) {
    res_data = { message: "found", data: newData[req.params.id] };
  } else {
    res_data = { message: "not-found" };
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(res_data));
});

app.delete(routes["LESSON_DELETE_PATH"], (req, res) => {
  console.log(
    `${routes["BASE_PATH"]}${routes["LESSON_DELETE_PATH"]}\t\tDELETE`
  );
  let newData = {};
  try {
    const data = fs.readFileSync(base_settings["LESSON_FILE_PATH"], "utf8");
    newData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
  const id = req.params.id;
  delete newData[id];
  fs.writeFileSync(
    base_settings["LESSON_FILE_PATH"],
    JSON.stringify(newData),
    "utf8"
  );
  res.end();
});

app.get(routes["CLASS_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["CLASS_PATH"]}\t\tGET`);
  let newData = {};
  try {
    const data = fs.readFileSync(base_settings["CLASS_FILE_PATH"], "utf8");
    newData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(newData));
});

app.post(routes["CLASS_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["CLASS_PATH"]}\t\tPOST`);
  const class_name = req.body.class_name;
  delete req.body.class_name;

  let newData = {};
  try {
    const data = fs.readFileSync(base_settings["CLASS_FILE_PATH"], "utf8");
    newData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }

  newData[class_name] = req.body;
  fs.writeFileSync(
    base_settings["CLASS_FILE_PATH"],
    JSON.stringify(newData),
    "utf8"
  );
  res.redirect(html_addresses["SUCCESS_CLASS"]);
});

app.get(routes["CLASS_NAME_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["CLASS_NAME_PATH"]}\t\tGET`);
  let newData = {};
  try {
    const data = fs.readFileSync(base_settings["CLASS_FILE_PATH"], "utf8");
    newData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
  const keys = Object.keys(newData);
  keys.sort();
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(keys));
});

app.get(routes["CLASS_RETRIEVE_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["CLASS_RETRIEVE_PATH"]}\t\tGET`);
  let newData = {};
  let res_data = {};
  try {
    const data = fs.readFileSync(base_settings["CLASS_FILE_PATH"], "utf8");
    newData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }
  if (req.params.id in newData) {
    res_data = { message: "found", data: newData[req.params.id] };
  } else {
    res_data = { message: "not-found" };
  }
  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(res_data));
});

app.delete(routes["CLASS_DELETE_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["CLASS_DELETE_PATH"]}\t\tDELETE`);
  let newData_class = {};
  let newData_lesson = {};
  try {
    const class_data = fs.readFileSync(
      base_settings["CLASS_FILE_PATH"],
      "utf8"
    );
    const lesson_data = fs.readFileSync(
      base_settings["LESSON_FILE_PATH"],
      "utf8"
    );
    newData_class = JSON.parse(class_data);
    newData_lesson = JSON.parse(lesson_data);
  } catch (err) {
    console.error(err);
  }
  // delete class from json
  const class_name = req.params.id;
  delete newData_class[class_name];
  // delete lesson with class_name's input
  for (item in newData_lesson) {
    if (newData_lesson[item].class_name === class_name) {
      delete newData_lesson[item];
    }
  }
  fs.writeFileSync(
    base_settings["CLASS_FILE_PATH"],
    JSON.stringify(newData_class),
    "utf8"
  );
  fs.writeFileSync(
    base_settings["LESSON_FILE_PATH"],
    JSON.stringify(newData_lesson),
    "utf8"
  );
  res.end();
});

app.get(routes["HOME_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["HOME_PATH"]}\t\tGET`);
  let newData_class = {};
  let newData_lesson = {};
  let newData_setting = {};
  try {
    const class_data = fs.readFileSync(
      base_settings["CLASS_FILE_PATH"],
      "utf8"
    );
    const lesson_data = fs.readFileSync(
      base_settings["LESSON_FILE_PATH"],
      "utf8"
    );
    const setting_data = fs.readFileSync(
      base_settings["SETTING_FILE_PATH"],
      "utf8"
    );
    newData_class = JSON.parse(class_data);
    newData_lesson = JSON.parse(lesson_data);
    newData_setting = JSON.parse(setting_data);
  } catch (err) {
    console.error(err);
  }
  const class_keys = Object.keys(newData_class);
  class_keys.sort();
  // ============================================================================
  // Combine 2 json file
  let combination_data = {};
  let temp_result = {};
  let status = false;

  for (i in class_keys) {
    for (item in newData_lesson) {
      if (
        item.includes(class_keys[i]) &&
        newData_lesson[item].day === newData_setting.nav_day
      ) {
        status = true;
        temp_result[item] = newData_lesson[item];
      }
    }
    if (status) {
      combination_data[class_keys[i]] = temp_result;
      status = false;
      temp_result = {};
    }
  }
  // ============================================================================
  // Sort data by time
  newData_result = {};
  temp_result = {};
  status = false;
  for (item in combination_data) {
    var data_values = Object.values(combination_data[item]);

    data_values.sort(function (a, b) {
      return a.time.split("-")[0] - b.time.split("-")[0];
    });

    for (i in data_values) {
      let id =
        data_values[i].class_name +
        "-" +
        data_values[i].state_day +
        "-(" +
        data_values[i].time +
        ")";
      temp_result[id] = data_values[i];
    }
    newData_result[item] = temp_result;
    temp_result = {};
  }

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(newData_result));
});

app.get(routes["SETTING_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["SETTING_PATH"]}\t\tGET`);
  let newData = {};
  try {
    const data = fs.readFileSync(base_settings["SETTING_FILE_PATH"], "utf8");
    newData = JSON.parse(data);
  } catch (err) {
    console.error(err);
  }

  number_of_week = Number(newData["number_of_week"].slice(0, 2));
  if (number_of_week % 2 === 0) newData["state_week"] = "even";
  else newData["state_week"] = "odd";

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(newData));
});

app.post(routes["SETTING_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["SETTING_PATH"]}\t\tPOST`);
  fs.writeFileSync(
    base_settings["SETTING_FILE_PATH"],
    JSON.stringify(req.body)
  );
  res.redirect(html_addresses["INDEX_HTML"]);
});

app.post(routes["SEARCH_PATH"], (req, res) => {
  console.log(`${routes["BASE_PATH"]}${routes["SEARCH_PATH"]}\t\tPOST`);
  lesson_name = req.body.lesson_name;
  let newData_class = {};
  let newData_lesson = {};
  let newData_setting = {};
  try {
    const class_data = fs.readFileSync(
      base_settings["CLASS_FILE_PATH"],
      "utf8"
    );
    const lesson_data = fs.readFileSync(
      base_settings["LESSON_FILE_PATH"],
      "utf8"
    );
    const setting_data = fs.readFileSync(
      base_settings["SETTING_FILE_PATH"],
      "utf8"
    );
    newData_class = JSON.parse(class_data);
    newData_lesson = JSON.parse(lesson_data);
    newData_setting = JSON.parse(setting_data);
  } catch (err) {
    console.error(err);
  }
  const class_keys = Object.keys(newData_class);
  class_keys.sort();
  // ============================================================================
  // Combine 2 json file
  let combination_data = {};
  let temp_result = {};
  let status = false;

  for (i in class_keys) {
    for (item in newData_lesson) {
      if (
        item.includes(class_keys[i]) &&
        newData_lesson[item].day === newData_setting.nav_day &&
        newData_lesson[item].lesson_name.includes(lesson_name)
      ) {
        status = true;
        temp_result[item] = newData_lesson[item];
      }
    }
    if (status) {
      combination_data[class_keys[i]] = temp_result;
      status = false;
      temp_result = {};
    }
  }
  // ============================================================================
  // Sort data by time
  newData_result = {};
  temp_result = {};
  status = false;
  for (item in combination_data) {
    var data_values = Object.values(combination_data[item]);

    data_values.sort(function (a, b) {
      return a.time.split("-")[0] - b.time.split("-")[0];
    });

    for (i in data_values) {
      let id =
        data_values[i].class_name +
        "-" +
        data_values[i].state_day +
        "-(" +
        data_values[i].time +
        ")";
      temp_result[id] = data_values[i];
    }
    newData_result[item] = temp_result;
    temp_result = {};
  }

  res.setHeader("Content-Type", "application/json");
  res.end(JSON.stringify(newData_result));
});

app.listen(base_settings["PORT"], () => {
  console.log(`Server started on port ${base_settings["PORT"]}`);
});
