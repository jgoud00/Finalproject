import { scholarships } from "./data.js";

const page = document.body.dataset.page;

const $ = id => document.getElementById(id);
const nav = $("navLinks");

$("hamburger")?.addEventListener("click", function () {
  const open = nav.classList.toggle("open");
  this.setAttribute("aria-expanded", open);
});

const darkBtn = $("darkBtn");
if (darkBtn) {
  const stored = localStorage.getItem("dark") === "true";
  if (stored) document.documentElement.setAttribute("data-theme", "dark");
  darkBtn.textContent = stored ? "☀ Light" : "☾ Dark";
  darkBtn.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    document.documentElement.setAttribute("data-theme", isDark ? "light" : "dark");
    localStorage.setItem("dark", !isDark);
    darkBtn.textContent = !isDark ? "☀ Light" : "☾ Dark";
  });
}

document.querySelectorAll(".nav-link").forEach(link => {
  if (link.href === window.location.href) link.classList.add("active");
});

if (page === "scholarships") {
  const grid    = $("grid");
  const search  = $("search");
  const filter  = $("filter");
  const countEl = $("count");

  const cards = Array.from(grid.querySelectorAll(".card"));

  const applyFilters = () => {
    const q   = search.value.toLowerCase().trim();
    const cat = filter.value;
    let shown = 0;

    cards.forEach(card => {
      const text     = card.textContent.toLowerCase();
      const cardCat  = card.dataset.cat;
      const matchQ   = q === "" || text.includes(q);
      const matchCat = cat === "all" || cardCat === cat;
      const visible  = matchQ && matchCat;
      card.style.display = visible ? "" : "none";
      if (visible) shown++;
    });

    if (countEl) countEl.textContent = `${shown} result${shown !== 1 ? "s" : ""}`;

    const noRes = $("noResults");
    if (noRes) noRes.style.display = shown === 0 ? "block" : "none";
  };

  search?.addEventListener("input", applyFilters);
  filter?.addEventListener("change", applyFilters);
  if (countEl) countEl.textContent = `${cards.length} results`;
}

if (page === "calculator") {
  const form    = $("eligForm");
  const results = $("results");

  const rules = {
    marks:  { required: true, min: 0,  max: 100,     msg: "Enter a percentage between 0 and 100." },
    income: { required: true, min: 0,  max: 10000000, msg: "Enter a valid annual income." },
  };

  const showErr = (id, msg) => {
    const input = $(id);
    const errEl = $(`${id}Err`);
    input.classList.add("error");
    if (errEl) { errEl.textContent = msg; errEl.classList.add("show"); }
  };

  const clearErr = (id) => {
    const input = $(id);
    const errEl = $(`${id}Err`);
    input.classList.remove("error");
    if (errEl) errEl.classList.remove("show");
  };

  ["marks", "income"].forEach(id => {
    $(id)?.addEventListener("input", () => clearErr(id));
  });

  form?.addEventListener("submit", e => {
    e.preventDefault();
    let valid = true;

    const marks  = parseFloat($("marks").value);
    const income = parseFloat($("income").value);
    const cat    = $("catSel").value;
    const course = $("course").value;

    clearErr("marks");
    clearErr("income");

    if (isNaN(marks) || marks < 0 || marks > 100) {
      showErr("marks", rules.marks.msg);
      valid = false;
    }
    if (isNaN(income) || income < 0) {
      showErr("income", rules.income.msg);
      valid = false;
    }
    if (!valid) return;

    const eligible = scholarships.filter(s => {
      let ok = marks >= s.minMarks && income <= s.maxIncome;
      if (s.category === "minority") {
        ok = ok && (cat === "sc" || cat === "st" || cat === "obc");
      }
      if (s.category === "sports") {
        ok = ok && course.length > 0;
      }
      return ok;
    });

    results.innerHTML = "";

    const heading = document.createElement("h3");
    heading.className = "results-heading";

    if (eligible.length === 0) {
      heading.textContent = "No eligible scholarships found.";
      results.appendChild(heading);
      const tip = document.createElement("p");
      tip.className = "tip-text";
      tip.textContent = "Try different values or check back after updates.";
      results.appendChild(tip);
      return;
    }

    heading.textContent = `You may be eligible for ${eligible.length} scholarship${eligible.length > 1 ? "s" : ""}.`;
    results.appendChild(heading);

    eligible.map(s => {
      const amt = new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(s.amount);
      const div = document.createElement("div");
      div.className = "result-item";
      div.innerHTML = `
        <span class="result-name">${s.name}</span>
        <span class="result-amount">${amt} / yr</span>
        <a href="scholarships.html" class="result-link">Details →</a>
      `;
      return div;
    }).forEach(el => results.appendChild(el));
  });
}