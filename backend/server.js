const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");

const app = express();
const port = 5000;

const JWT_SECRET = "key";

const users = [
  {
    username: "bob123",
    hash: bcrypt.hashSync("bob123", 10),
    permission: "client",
  },
  {
    username: "admin",
    hash: bcrypt.hashSync("password", 10),
    permission: "admin",
  },
];

app.use(express.json());

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Find the user in the "database"
  const user = users.find((u) => u.username === username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  // Check if the password is correct
  const isMatch = await bcrypt.compare(password, user.hash);
  if (!isMatch) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  // Successful login
  const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: "24h" });

  res.status(200).json({ message: "Login successful", token });
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const user = users.find((u) => u.username === username);
  if (user) {
    return res.status(400).json({ message: "Username taken" });
  }

  users.push({ username, hash: await bcrypt.hash(password, 10) });
  res.status(201).json({ message: "User registered" });
});

app.get("/api/data", (req, res) => {
  res.json({ message: "Expressed" });
});

app.listen(port, () => {
  console.log(`backend on port 5000`);
  console.log(users);
});

const authenticateJWT = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader) {
    const token = authHeader.split(" ")[1];

    jwt.verify(token, JWT_SECRET, (err, user) => {
      if (err) {
        return res.status(403).json({ message: "Invalid token" });
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json({ message: "Bad token" });
  }
};

app.get("/admin", authenticateJWT, (req, res) => {
  const user = users.find((u) => u.username === req.user.username);
  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }
  if (user.permission === "admin") {
    res.json({ message: `${user.username}` });
  }
  res.status(403).json({ message: "Bad credentials" });
});
