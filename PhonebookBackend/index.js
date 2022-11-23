const express = require("express");
const app = express();

// date and time package
const date = require("date-and-time");

app.use(express.json());

let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

// GET METHOD
// root access
app.get("/", (req, res) => {
  res.send("<h1>Root Address</h1>");
});

// list of available people [3.1]
app.get("/api/persons", (req, res) => {
  res.json(persons);
});

// getting person id [3.3]
app.get("/api/persons/:id", (req, res) => {
  const id = Number(req.params.id);
  const selectedPerson = persons.find((person) => {
    return person.id === id;
  });

  if (selectedPerson) {
    res.json(selectedPerson);
  } else {
    const message = res.json({ error: `Failed to find person with id: ${id}` });

    res.statusMessage = `Failed to find person id "${id}"`;
    res.status(404).end(message);
  }
});

// info [3.2]
app.get("/info", (req, res) => {
  // person list info
  const personQnt = persons.length;

  // date info (using date-and-time node.js package)
  const formatOption = "ddd MMM DD YYYY HH:mm:ss [GMT]Z";
  const dateFormat = date.format(new Date(), formatOption);

  res.send(`
    <p>Phonebook has info for ${personQnt} people</p>
    <p>${dateFormat} (Eastern Europe Standard Time)</p>
  `);
});

// DELETE METHOD
// delete contact [3.4]
app.delete("/api/persons/:id", (req, res) => {
  console.log(persons);
  const id = Number(req.params.id);
  persons = persons.filter((person) => person.id !== id);
  console.log(persons);

  res
    .status(204)
    .json({ message: `Deleted person with id: ${id}` })
    .end();
});

// POST METHOD
// add new contact [3.5]
app.post("/api/persons", (req, res) => {
  const body = req.body;
  console.log("name: ", body.name);
  console.log("number: ", body.number);

  // • The name or number is missing [3.6]
  if (!body.name || !body.number) {
    return res.status(400).json({ error: "name or number missing" });
  }

  // • The name already exists in the phonebook [3.6]
  const isDoubleName = persons.find((person) => person.name === body.name);

  if (isDoubleName) {
    return res.status(409).json({ error: "name must be unique" });
  }

  const person = {
    id: genId(),
    name: body.name,
    number: body.number,
  };

  persons = persons.concat(person);
  res.json(person);
});

const genId = () => {
  const newId = parseInt(Math.random() * 10000);
  console.log(newId);
  return newId;
};

// server inicialitazion
const PORT = 3001;
app.listen(PORT, () => {
  console.log(
    `Server running on port ${3001}\nURL Access: http://localhost:3001/ `
  );
});
