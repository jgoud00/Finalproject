import { scholarships } from "./data.js";

document.getElementById("eligForm").addEventListener("submit", function(e) {
  e.preventDefault();

  const marks  = parseFloat(document.getElementById("marks").value);
  const income = parseFloat(document.getElementById("income").value);
  const cat    = document.getElementById("catSel").value;
  const course = document.getElementById("course").value;
  const results = document.getElementById("results");

  results.innerHTML = "";

  if (isNaN(marks) || marks < 0 || marks > 100) {
    results.innerHTML = "<p style='color:red'>Enter a valid percentage (0–100).</p>";
    return;
  }

  if (isNaN(income) || income < 0) {
    results.innerHTML = "<p style='color:red'>Enter a valid annual income.</p>";
    return;
  }

  const eligible = scholarships.filter(function(s) {
    if (marks < s.minMarks)    return false;
    if (income > s.maxIncome)  return false;
    if (s.category === "minority" && cat !== "sc" && cat !== "st" && cat !== "obc") return false;
    return true;
  });

  if (eligible.length === 0) {
    results.innerHTML = "<p>No eligible scholarships found. Try different values.</p>";
    return;
  }

  results.innerHTML = "<p><strong>Eligible scholarships:</strong></p>";

  eligible.forEach(function(s) {
    const amt = "₹" + s.amount.toLocaleString("en-IN");
    results.innerHTML += "<div class='result-row'><span class='r-name'>" + s.name + "</span><span class='r-amt'>" + amt + "/yr</span></div>";
  });
});