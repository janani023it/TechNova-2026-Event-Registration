const form = document.getElementById("registrationForm");
const successMessage = document.getElementById("successMessage");

function setError(id, message) {
  document.getElementById(id + "Error").textContent = message;
}
function clearErrors() {
  ["name","regno","dept","year","email","mobile","event"].forEach(id => setError(id, ""));
}

function getRegistrations() {
  return JSON.parse(localStorage.getItem("technovaRegistrations") || "[]");
}

function saveRegistrations(data) {
  localStorage.setItem("technovaRegistrations", JSON.stringify(data));
}

function displayRecords() {
  const records = getRegistrations();
  const tbody = document.querySelector("#recordsTable tbody");
  const count = document.getElementById("recordCount");
  tbody.innerHTML = "";
  count.textContent = records.length
    ? `${records.length} registration(s) stored in this browser.`
    : "No registrations yet.";

  records.forEach(r => {
    const row = document.createElement("tr");
    [r.name, r.regno, r.dept, r.email, r.event].forEach(value => {
      const cell = document.createElement("td");
      cell.textContent = value;
      row.appendChild(cell);
    });
    tbody.appendChild(row);
  });
}

form.addEventListener("submit", function(e) {
  e.preventDefault();
  clearErrors();
  successMessage.style.display = "none";

  const name = document.getElementById("name").value.trim();
  const regno = document.getElementById("regno").value.trim();
  const dept = document.getElementById("dept").value;
  const year = document.getElementById("year").value;
  const email = document.getElementById("email").value.trim();
  const mobile = document.getElementById("mobile").value.trim();
  const event = document.getElementById("eventChoice").value;

  let valid = true;

  if (name.length < 2) { setError("name", "Please enter your name."); valid = false; }
  if (!regno) { setError("regno", "Register number is required."); valid = false; }
  if (!dept) { setError("dept", "Please select a department."); valid = false; }
  if (!year) { setError("year", "Please select your year."); valid = false; }

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailPattern.test(email)) { setError("email", "Enter a valid email address."); valid = false; }

  if (!/^\d{10}$/.test(mobile)) {
    setError("mobile", "Mobile number must contain exactly 10 digits.");
    valid = false;
  }

  if (!event) { setError("event", "Please select an event."); valid = false; }

  if (!valid) return;

  const records = getRegistrations();
  records.push({name, regno, dept, year, email, mobile, event});
  saveRegistrations(records);
  displayRecords();

  successMessage.textContent = `Registration successful! Welcome, ${name}. Your details have been saved in this browser.`;
  successMessage.style.display = "block";
  form.reset();
  window.location.hash = "register";
});

document.getElementById("clearBtn").addEventListener("click", function() {
  clearErrors();
  successMessage.style.display = "none";
});

document.getElementById("clearRecords").addEventListener("click", function() {
  if (confirm("Clear all demo registration records from this browser?")) {
    localStorage.removeItem("technovaRegistrations");
    displayRecords();
  }
});

displayRecords();
