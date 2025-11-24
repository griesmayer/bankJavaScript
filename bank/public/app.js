let editingId = null;

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

      const tdBalance = document.createElement("td");

      const tdActions = document.createElement("td");

      if (editingId === c.id) {
        const nameInput = document.createElement("input");
        nameInput.type = "text";
        nameInput.value = c.name;
        nameInput.className = "input-sm";

        const balanceInput = document.createElement("input");
        balanceInput.type = "number";
        balanceInput.value = c.balance;
        balanceInput.className = "input-sm";

        tdName.appendChild(nameInput);
        tdBalance.appendChild(balanceInput);

        



        const okBtn = document.createElement("button");
        okBtn.textContent = "OK";
        okBtn.className = "ok-btn";
        okBtn.onclick = async () => {
          if (!nameInput.value.trim() || !balanceInput.value.trim()) {
            document.getElementById("status").textContent = "Name and balance are required!";
            return;
          }
          await updateCustomer (c.id,
                  { name : nameInput.value.trim(),
                    balance : balanceInput.value.trim() });
          editingId = null;
          await fetchCustomers();
        }

        const cancelBtn = document.createElement("button");
        cancelBtn.textContent = "Cancel";
        cancelBtn.className = "cancel-btn";
        cancelBtn.onclick = async () => {
          editingId = null;
          await fetchCustomers();
        };

        tdActions.append(okBtn, " ", cancelBtn);

      } else {
        tdName.textContent = c.name;
        tdBalance.textContent = c.balance;

        const delBtn = document.createElement("button");
        delBtn.textContent = "Delete";
        delBtn.className = "delete-btn";
        delBtn.onclick = async () => {
          if (!confirm(`Remove customer ${c.name}?`)) return;
          await deleteCustomer(c.id);
          await fetchCustomers();
        }

        const editBtn = document.createElement("button");
        editBtn.textContent = "Edit";
        editBtn.className = "edit-btn";
        editBtn.onclick = async () => {
          editingId = c.id;
          await fetchCustomers();
        }
        tdActions.append(delBtn, " ", editBtn);
      }

      tr.append(tdId, tdName, tdBalance, tdActions);
      tbody.appendChild(tr);
    }

    statusEl.textContent = `Loaded: ${customers.length} customers`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = "Error while loading the data.";
  }
}

async function addClick() {
    const nameInput   = document.getElementById("customer-name");
    const name = nameInput.value.trim();
    const banlanceInput = document.getElementById("balance");
    const balance = parseFloat(banlanceInput.value);
    const button = document.getElementById("add-btn");
    const statusEl = document.getElementById("status");

    if (!name || !balance) {
      statusEl.textContent = "Name and balance is required.";
      return;
    }

    button.disabled = true;
    await addCustomer(name, balance);
    button.disabled = false;

    nameInput.value = "";
    banlanceInput.value = "";
    nameInput.focus();
}

async function addCustomer(name, balance) {
  const statusEl = document.getElementById("status");
  try {
    const res = await fetch("/customers", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, balance }),
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    await fetchCustomers();
    statusEl.textContent = "Customer added.";
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Error while adding a customer: ${err.message}`;
  }
}

async function deleteCustomer(id) {
  const statusEl = document.getElementById("status");
  try {
    const res = await fetch(`/customers/${id}`, { method: "DELETE" });
    if (res.status == 204) {
      statusEl.textContent = `Customer ${id} removed`;
    } else {
      throw new Error(msg.error || `HTTP ${res.status}`);
    }
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Error while removing: ${id}`;
  }
}

async function updateCustomer(id, data) {
  const statusEl = document.getElementById("status");
  try {
    const res = await fetch(`/customers/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data)
    });
    if (!res.ok) {
      const msg = await res.json().catch(() => ({}));
      throw new Error(msg.error || `HTTP ${res.status}`);
    }
    statusEl.textContent = `Customer ${id} updated.`;
  } catch (err) {
    console.error(err);
    statusEl.textContent = `Error while updating: ${err.message}`;
  }
}

// When page isloaded the fetchStudents is called
window.addEventListener("DOMContentLoaded", fetchCustomers);