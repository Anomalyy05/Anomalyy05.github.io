// calculator.js — modern, self-contained calculator UI and logic

(() => {
  // Keep numeric results for summary
  const results = [];

  // Utility to create elements quickly
  const el = (tag, props = {}, children = []) => {
    const e = document.createElement(tag);
    Object.entries(props).forEach(([k, v]) => {
      if (k === "class") e.className = v;
      else if (k === "html") e.innerHTML = v;
      else e.setAttribute(k, v);
    });
    children.forEach(c => (typeof c === "string" ? e.appendChild(document.createTextNode(c)) : e.appendChild(c)));
    return e;
  };

  // Wait for DOM ready
  document.addEventListener("DOMContentLoaded", main);

  function main() {
    try {
      // Insert a container below the existing <h2> if present, otherwise at body end
      const heading = document.querySelector("h2");
      const container = el("div", { id: "calc-container", style: "margin-top:16px;" });

      if (heading && heading.parentNode) heading.parentNode.insertBefore(container, heading.nextSibling);
      else document.body.appendChild(container);

      // Build form
      const form = el("form", { id: "calc-form", style: "display:flex;gap:8px;align-items:center;flex-wrap:wrap;" });

      const num1Input = el("input", { type: "text", id: "num1", placeholder: "Number 1", "aria-label": "Number 1", style: "width:100px;" });
      const opSelect = el("select", { id: "operator", "aria-label": "Operator" }, [
        el("option", { value: "+" }, ["+"]),
        el("option", { value: "-" }, ["-"]),
        el("option", { value: "*"}, ["*"]),
        el("option", { value: "/" }, ["/"]),
        el("option", { value: "%" }, ["%"])
      ]);
      const num2Input = el("input", { type: "text", id: "num2", placeholder: "Number 2", "aria-label": "Number 2", style: "width:100px;" });

      const computeBtn = el("button", { type: "button", id: "compute" }, ["Compute"]);
      const finishBtn  = el("button", { type: "button", id: "finish" }, ["Finish"]);
      const clearBtn   = el("button", { type: "button", id: "clear" }, ["Clear results"]);

      const formError = el("div", { id: "form-error", role: "status", style: "min-width:200px;" });

      form.append(num1Input, opSelect, num2Input, computeBtn, finishBtn, clearBtn, formError);
      container.appendChild(form);

      // Results table
      const resultsTable = el("table", { id: "results-table", style: "margin-top:12px; width: 70%;" });
      const headerRow = el("tr", {}, [
        el("th", {}, ["Number 1"]),
        el("th", {}, ["Operator"]),
        el("th", {}, ["Number 2"]),
        el("th", {}, ["Result"])
      ]);
      resultsTable.appendChild(headerRow);
      container.appendChild(resultsTable);

      // Summary area
      const summaryTitle = el("h3", { style: "margin-top:12px; display:none;" }, ["Summary of Valid Results"]);
      const summaryTable = el("table", { id: "summary-table", style: "margin-top:8px; display:none; width: 70%;" });
      const summaryHeader = el("tr", {}, [
        el("th", {}, ["Minimum"]),
        el("th", {}, ["Maximum"]),
        el("th", {}, ["Average"]),
        el("th", {}, ["Total"])
      ]);
      summaryTable.appendChild(summaryHeader);
      container.appendChild(summaryTitle);
      container.appendChild(summaryTable);

      // Event handlers
      computeBtn.addEventListener("click", () => {
        formError.textContent = "";
        const x = num1Input.value.trim();
        const y = num2Input.value.trim();
        const operator = opSelect.value;

        const num1 = parseFloat(x);
        const num2 = parseFloat(y);

        let displayResult;
        let pushed = false;

        if (!Number.isFinite(num1) || !Number.isFinite(num2)) {
          displayResult = "<span class='error'>Error: Invalid number</span>";
          formError.textContent = "Enter valid numeric values.";
        } else {
          switch (operator) {
            case "+":
              displayResult = (num1 + num2).toString();
              results.push(num1 + num2);
              pushed = true;
              break;
            case "-":
              displayResult = (num1 - num2).toString();
              results.push(num1 - num2);
              pushed = true;
              break;
            case "*":
              displayResult = (num1 * num2).toString();
              results.push(num1 * num2);
              pushed = true;
              break;
            case "/":
              if (num2 === 0) {
                displayResult = "<span class='error'>Error: Division by zero</span>";
                formError.textContent = "Cannot divide by zero.";
              } else {
                displayResult = (num1 / num2).toString();
                results.push(num1 / num2);
                pushed = true;
              }
              break;
            case "%":
              if (num2 === 0) {
                displayResult = "<span class='error'>Error: Modulus by zero</span>";
                formError.textContent = "Cannot modulus by zero.";
              } else {
                displayResult = (num1 % num2).toString();
                results.push(num1 % num2);
                pushed = true;
              }
              break;
            default:
              displayResult = "<span class='error'>Error: Invalid operator</span>";
              formError.textContent = "Invalid operator selected.";
          }
        }

        // Append row
        const row = el("tr");
        row.appendChild(el("td", { html: escapeHtml(x) }));
        row.appendChild(el("td", { html: escapeHtml(operator) }));
        row.appendChild(el("td", { html: escapeHtml(y) }));
        row.appendChild(el("td", { html: displayResult }));
        resultsTable.appendChild(row);

        // Update summary if we pushed a numeric result
        if (pushed) updateSummary();
      });

      finishBtn.addEventListener("click", () => {
        // Reveal summary (already updating after each compute)
        if (results.length === 0) {
          alert("No valid numeric results to summarize.");
          return;
        }
        summaryTitle.style.display = "";
        summaryTable.style.display = "";
        window.scrollTo({ top: summaryTitle.offsetTop - 10, behavior: "smooth" });
      });

      clearBtn.addEventListener("click", () => {
        // Remove result rows except header
        const rows = Array.from(resultsTable.querySelectorAll("tr")).slice(1);
        rows.forEach(r => r.remove());
        results.length = 0;
        // Hide summary
        summaryTitle.style.display = "none";
        summaryTable.style.display = "none";
        // Remove old summary values (keep header)
        Array.from(summaryTable.querySelectorAll("tr")).slice(1).forEach(r => r.remove());
        formError.textContent = "";
      });

      // Prevent form submission (Enter key)
      form.addEventListener("submit", e => e.preventDefault());
    } catch (err) {
      console.error("Calculator initialization failed:", err);
    }
  }

  function updateSummary() {
    try {
      const summaryTable = document.getElementById("summary-table");
      // Remove old summary row(s)
      Array.from(summaryTable.querySelectorAll("tr")).slice(1).forEach(r => r.remove());

      if (results.length === 0) {
        summaryTable.style.display = "none";
        return;
      }

      const min = Math.min(...results);
      const max = Math.max(...results);
      const total = results.reduce((a, b) => a + b, 0);
      const avg = total / results.length;

      const row = el("tr", {}, [
        el("td", { html: min.toString() }),
        el("td", { html: max.toString() }),
        el("td", { html: avg.toFixed(2) }),
        el("td", { html: total.toString() })
      ]);
      summaryTable.appendChild(row);
      summaryTable.style.display = "";
      document.querySelector("h3") && (document.querySelector("h3").style.display = "");
    } catch (err) {
      console.error("Failed to update summary:", err);
    }
  }

  // Small helper to avoid accidental HTML injection in table cells
  function escapeHtml(str) {
    if (typeof str !== "string") return str;
    return str
      .replace(/&/g, "&amp;")
      .replace(/</g, "&lt;")
      .replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;");
  }
})();
