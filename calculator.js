// Arrays to store results
let results = [];

// Start main table
document.write("<table>");
document.write("<tr><th>Number 1</th><th>Operator</th><th>Number 2</th><th>Result</th></tr>");

while (true) {
  let x = prompt("Enter the first number (Cancel to quit):");
  if (x === null) break; // exit loop

  let y = prompt("Enter the second number:");
  if (y === null) break;

  let operator = prompt("Enter operator (+, -, *, /, %):");
  if (operator === null) break;

  let num1 = parseFloat(x);
  let num2 = parseFloat(y);
  let result;

  // Check if inputs are valid numbers
  if (isNaN(num1) || isNaN(num2)) {
    result = "<span class='error'>Error: Invalid number</span>";
  } else {
    switch (operator) {
      case "+":
        result = num1 + num2;
        results.push(result);
        break;
      case "-":
        result = num1 - num2;
        results.push(result);
        break;
      case "*":
        result = num1 * num2;
        results.push(result);
        break;
      case "/":
        if (num2 === 0) {
          result = "<span class='error'>Error: Division by zero</span>";
        } else {
          result = num1 / num2;
          results.push(result);
        }
        break;
      case "%":
        if (num2 === 0) {
          result = "<span class='error'>Error: Modulus by zero</span>";
        } else {
          result = num1 % num2;
          results.push(result);
        }
        break;
      default:
        result = "<span class='error'>Error: Invalid operator</span>";
    }
  }

  // Print row
  document.write("<tr><td>" + x + "</td><td>" + operator + "</td><td>" + y + "</td><td>" + result + "</td></tr>");
}

document.write("</table>");

// Summary table if valid results exist
if (results.length > 0) {
  let min = Math.min(...results);
  let max = Math.max(...results);
  let total = results.reduce((a, b) => a + b, 0);
  let avg = total / results.length;

  document.write("<h3>Summary of Valid Results</h3>");
  document.write("<table>");
  document.write("<tr><th>Minimum</th><th>Maximum</th><th>Average</th><th>Total</th></tr>");
  document.write("<tr><td>" + min + "</td><td>" + max + "</td><td>" + avg.toFixed(2) + "</td><td>" + total + "</td></tr>");
  document.write("</table>");
} else {
  document.write("<p><strong>No valid results to summarize.</strong></p>");
}
