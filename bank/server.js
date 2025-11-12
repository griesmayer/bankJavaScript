const express = require("express");
const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

const customers = [
  { id:  1, name: "Max",     balance: 100 },
  { id:  2, name: "Susi",    balance: 300 },
  { id:  3, name: "Fritz",   balance: 500 },
  { id:  4, name: "Andrea",  balance: 150 },
  { id:  5, name: "Thomas",  balance: 200 },
  { id:  6, name: "Verena",  balance: 400 },
  { id:  7, name: "Marion",  balance: 500 },
  { id:  8, name: "Karl",    balance: 700 },
  { id:  9, name: "Hans",    balance: 800 },
  { id: 10, name: "Barbara", balance: 900 }
];

app.get("/", (req, res) => {
  res.send("Hello, Thomas and World from Express!");
});

app.get("/customers", (req, res) => {
  res.json(customers);
});

app.get("/customers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const customer = customers.find(c => c.id === id)

  if (!customer) {
    return res.status(404).json({ error: "Customer not found" });
  }

  res.json(customer);
});

app.post("/customers", (req, res) => {
  const { name, balance } = req.body;

  if (!name || !balance) {
    return res.status(400).json({ error: "Name and balance are required!" });
  }

  const newId = customers.length ? customers[customers.length - 1].id + 1 : 1;

  const newCustomer = { id: newId, name, balance };

  customers.push(newCustomer);

  res.status(201).json(newCustomer);
});

app.put("/customers/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { name, balance } = req.body;

  if (!name || !balance) {
    return res.status(400).json({ error: "Name and balance are required!" });
  }

  const pos = customers.findIndex(c => c.id === id);
  if (pos === -1) {
    return res.status(404).json({ error: "Customer not found" });
  }

  customers[pos] = { id, name, balance };
  res.json(customers[pos]);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});