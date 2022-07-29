const one = document.querySelector(".checkbox label:nth-child(1) input");
one.addEventListener("change", colorTableOne);
function colorTableOne() {
  let table = document.querySelector("table tr:nth-child(1)");
  table.classList.toggle("colorGreen");
}

const two = document.querySelector(".checkbox label:nth-child(2) input");
two.addEventListener("change", colorTableTwo);
function colorTableTwo() {
  let table = document.querySelector("table tr:nth-child(2)");
  table.classList.toggle("colorGreen");
}

const three = document.querySelector(".checkbox label:nth-child(3) input");
three.addEventListener("change", colorTableThree);
function colorTableThree() {
  let table = document.querySelector("table tr:nth-child(3)");
  table.classList.toggle("colorGreen");
}

const four = document.querySelector(".checkbox label:nth-child(4) input");
four.addEventListener("change", colorTableFour);
function colorTableFour() {
  let table = document.querySelector("table tr:nth-child(4)");
  table.classList.toggle("colorGreen");
}

const five = document.querySelector(".checkbox label:nth-child(5) input");
five.addEventListener("change", colorTableFive);
function colorTableFive() {
  let table = document.querySelector("table tr:nth-child(5)");
  table.classList.toggle("colorGreen");
}

const six = document.querySelector(".checkbox label:nth-child(6) input");
six.addEventListener("change", colorTableSix);
function colorTableSix() {
  let table = document.querySelector("table tr:nth-child(6)");
  table.classList.toggle("colorGreen");
}

// ============취소===================================================

const first = document.querySelector(".radio label:nth-child(1) input");
first.addEventListener("change", colorTableFirst);
function colorTableFirst() {
  let table = document.querySelector("#cancel tr:nth-child(1)");
  document.querySelectorAll("#cancel tr").forEach(function (tr) {
    tr.classList.remove("colorRed");
  });
  table.classList.toggle("colorRed");
}

const second = document.querySelector(".radio label:nth-child(2) input");
second.addEventListener("change", colorTableSecond);
function colorTableSecond() {
  let table = document.querySelector("#cancel tr:nth-child(2)");
  document.querySelectorAll("#cancel tr").forEach(function (tr) {
    tr.classList.remove("colorRed");
  });
  table.classList.toggle("colorRed");
}

const third = document.querySelector(".radio label:nth-child(3) input");
third.addEventListener("change", colorTableThird);
function colorTableThird() {
  let table = document.querySelector("#cancel tr:nth-child(3)");
  document.querySelectorAll("#cancel tr").forEach(function (tr) {
    tr.classList.remove("colorRed");
  });
  table.classList.toggle("colorRed");
}

const fourth = document.querySelector(".radio label:nth-child(4) input");
fourth.addEventListener("change", colorTableFourth);
function colorTableFourth() {
  let table = document.querySelector("#cancel tr:nth-child(4)");
  document.querySelectorAll("#cancel tr").forEach(function (tr) {
    tr.classList.remove("colorRed");
  });
  table.classList.toggle("colorRed");
}

const fifth = document.querySelector(".radio label:nth-child(5) input");
fifth.addEventListener("change", colorTableFifth);
function colorTableFifth() {
  let table = document.querySelector("#cancel tr:nth-child(5)");
  document.querySelectorAll("#cancel tr").forEach(function (tr) {
    tr.classList.remove("colorRed");
  });
  table.classList.toggle("colorRed");
}

const sixth = document.querySelector(".radio label:nth-child(6) input");
sixth.addEventListener("change", colorTableSixth);
function colorTableSixth() {
  let table = document.querySelector("#cancel tr:nth-child(6)");
  document.querySelectorAll("#cancel tr").forEach(function (tr) {
    tr.classList.remove("colorRed");
  });
  table.classList.toggle("colorRed");
}

// ===============================================================

document.querySelector("#submit").addEventListener("click", function (event) {
  const data = {
    email: document.getElementById("email").value,
    keyword: [
      document.querySelector(".checkbox label:nth-child(1) input").checked
        ? document.querySelector(".checkbox label:nth-child(1) input").value
        : undefined,
      document.querySelector(".checkbox label:nth-child(2) input").checked
        ? document.querySelector(".checkbox label:nth-child(2) input").value
        : undefined,
      document.querySelector(".checkbox label:nth-child(3) input").checked
        ? document.querySelector(".checkbox label:nth-child(3) input").value
        : undefined,
      document.querySelector(".checkbox label:nth-child(4) input").checked
        ? document.querySelector(".checkbox label:nth-child(4) input").value
        : undefined,
      document.querySelector(".checkbox label:nth-child(5) input").checked
        ? document.querySelector(".checkbox label:nth-child(5) input").value
        : undefined,
      document.querySelector(".checkbox label:nth-child(6) input").checked
        ? document.querySelector(".checkbox label:nth-child(6) input").value
        : undefined,
    ].filter((i) => i !== undefined),
  };

  console.log(data);
  fetch("http://13.125.244.198/email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  alert("전송되었습니다.");
});

// ===============================================================

document
  .querySelector("#cancel_button")
  .addEventListener("click", function (event) {
    const data_cancel = {
      email: document.getElementById("email_cancel").value,
      keyword_arr: [
        document.querySelector(".radio label:nth-child(1) input").checked
          ? document.querySelector(".radio label:nth-child(1) input").value
          : undefined,
        document.querySelector(".radio label:nth-child(2) input").checked
          ? document.querySelector(".radio label:nth-child(2) input").value
          : undefined,
        document.querySelector(".radio label:nth-child(3) input").checked
          ? document.querySelector(".radio label:nth-child(3) input").value
          : undefined,
        document.querySelector(".radio label:nth-child(4) input").checked
          ? document.querySelector(".radio label:nth-child(4) input").value
          : undefined,
        document.querySelector(".radio label:nth-child(5) input").checked
          ? document.querySelector(".radio label:nth-child(5) input").value
          : undefined,
        document.querySelector(".radio label:nth-child(6) input").checked
          ? document.querySelector(".radio label:nth-child(6) input").value
          : undefined,
      ].filter((i) => i !== undefined),
    };
    console.log(data_cancel);
    fetch("http://13.125.244.198/email/drop", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data_cancel),
    });
    alert("전송되었습니다.");
  });
