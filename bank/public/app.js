async function fetchCustomers() {
  const statusEl = document.getElementById("status");
  const tbody = document.querySelector("#account-table tbody");

  try {
    // Set the status
    statusEl.textContent = "Load data...";

    // Use the route to get the data
    const res = await fetch("/customers");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);

    // Get an array of customers
    const customers = await res.json();

    // Clear the table
    tbody.innerHTML = "";

    // Add rows to the table
    for (const c of customers) {
      const tr = document.createElement("tr");

      const tdId = document.createElement("td");
      tdId.textContent = c.id;

      const tdName = document.createElement("td");
      tdName.textContent = c.name;

      const tdBalance = document.createElement("td");
      tdBalance.textContent = c.balance;

      tr.append(tdId, tdName, tdBalance);
      tbody.appendChild(tr);
    }

    statusEl.textContent = `Loaded: ${customers.length} customers`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error while loading the data.";
  }
}

// When page isloaded the fetchStudents is called
window.addEventListener("DOMContentLoaded", fetchCustomers);