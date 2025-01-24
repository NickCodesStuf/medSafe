import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sqlite3 from "sqlite3";
import path from "path";

const app = express();
const PORT = 5000;

const JWT_SECRET = "key";

app.use(express.json());

// Register Route (POST /register)
app.post("/register", async (req, res) => {
  const { name, password, permission } = req.body;

  // Check if name and password are provided
  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  // Check if the username already exists in the database
  db.get("SELECT * FROM users WHERE name = ?", [name], (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error checking if username exists" });
    }

    if (user) {
      return res.status(400).json({ error: "Username already exists" });
    }

    // Hash the password before storing it
    bcrypt.genSalt(10, (err, salt) => {
      if (err) {
        return res.status(500).json({ error: "Error generating salt" });
      }

      bcrypt.hash(password, salt, (err, passwordHash) => {
        if (err) {
          return res.status(500).json({ error: "Error hashing password" });
        }

        // Insert the new user with hashed password into the database
        db.run(
          `INSERT INTO users (name, passwordHash, permission) VALUES (?, ?, ?)`,
          [name, passwordHash, permission],
          function (err) {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error adding user to database" });
            }
            // Respond with user information (including id)
            res.status(201).json({
              id: this.lastID,
              name,
            });
          }
        );
      });
    });
  });
});

// Login Route (POST /login)
app.post("/login", async (req, res) => {
  const { name, password } = req.body;

  // Check if name and password are provided
  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  // Get the user from the database by name
  db.get("SELECT * FROM users WHERE name = ?", [name], async (err, user) => {
    if (err) {
      return res
        .status(500)
        .json({ error: "Error fetching user from database" });
    }

    // If user is not found
    if (!user) {
      return res.status(404).json({ error: "Invalid credentials" });
    }

    // Compare the provided password with the stored hash
    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    // Create a JWT payload
    const payload = {
      id: user.id,
      name: user.name,
      permission: user.permission,
    };

    // Sign the JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // Successful login
    res.json({
      message: "Login successful",
      user: { id: user.id, name: user.name, permission: user.permission },
      token,
    });
  });
});

function authorizeAdmin(req, res, next) {
  const { name } = req.user;

  // Fetch user from the database to check their permission
  db.get("SELECT permission FROM users WHERE name = ?", [name], (err, row) => {
    if (err) {
      return res.status(500).json({ error: "Database error" });
    }

    if (!row || row.permission !== "admin") {
      return res.status(403).json({ error: "Access denied" });
    }

    next();
  });
}

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

app.get("/admin", authenticateJWT, authorizeAdmin, (req, res) => {
  res.json({ message: "Access granted" });
});

// Initialize SQLite database (or create it if it doesn't exist)
const db = new sqlite3.Database(path.resolve("./database.db"), (err) => {
  if (err) {
    console.error("Failed to open database:", err.message);
  } else {
    console.log("Connected to SQLite database");
  }
});

// Create a table for users
db.run(`CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  passwordHash TEXT,
  permission TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS prescriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  drug_name TEXT,
  patient_name TEXT,
  quantity INT(255)
)`);

// Debugging routes
app.get("/prescriptions", authenticateJWT, authorizeAdmin, (req, res) => {
  db.all(
    "SELECT id, drug_name, patient_name, quantity FROM prescriptions",
    [],
    (err, rows) => {
      if (err) {
        res.status(500).send("Error retrieving prescriptions");
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/prescriptions", authenticateJWT, authorizeAdmin, async (req, res) => {
  const { drug_name, patient_name, quantity } = req.body;

  if (!drug_name || !patient_name || !quantity) {
    return res.status(400).json({ error: "Drug name, Patient name, and Quantity are required" });
  }

  // Insert the new user with hashed password into the database
  db.run(
    `INSERT INTO prescriptions (drug_name, patient_name, quantity) VALUES (?, ?, ?)`,
    [drug_name, patient_name, quantity],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Error adding prescription to database" });
      }
      res.status(201).json({
        id: this.lastID,
        drug_name,
        patient_name,
        quantity
      });
    }
  );
});

app.post("/prescriptions/decrease", authenticateJWT, authorizeAdmin, (req, res) => {
  const { id, amount } = req.body;

  if (!id || !amount) {
    return res.status(400).json({ error: "Prescription ID and amount are required" });
  }

  // Get the current quantity for the prescription
  db.get(
    "SELECT id, drug_name, patient_name, quantity FROM prescriptions WHERE id = ?",
    [id],
    (err, prescription) => {
      if (err) {
        return res.status(500).json({ error: "Error fetching prescription" });
      }

      if (!prescription) {
        return res.status(404).json({ error: "Prescription not found" });
      }

      // Check if quantity is sufficient
      if (prescription.quantity < amount) {
        return res
          .status(400)
          .json({ error: "Insufficient quantity to decrease by the specified amount" });
      }

      // Decrease the quantity
      const newQuantity = prescription.quantity - amount;
      db.run(
        "UPDATE prescriptions SET quantity = ? WHERE id = ?",
        [newQuantity, id],
        (updateErr) => {
          if (updateErr) {
            return res.status(500).json({ error: "Error updating prescription quantity" });
          }

          res.json({
            message: "Quantity decreased successfully",
            prescription: {
              id: prescription.id,
              drug_name: prescription.drug_name,
              patient_name: prescription.patient_name,
              quantity: newQuantity,
            },
          });
        }
      );
    }
  );
});


// Debugging routes
app.get("/users", (req, res) => {
  db.all(
    "SELECT id, name, passwordHash, permission FROM users",
    [],
    (err, rows) => {
      if (err) {
        res.status(500).send("Error retrieving users");
      } else {
        res.json(rows);
      }
    }
  );
});

app.post("/users", async (req, res) => {
  const { name, password, permission } = req.body;

  if (!name || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  // Hash the password before storing it
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(password, salt);

  // Insert the new user with hashed password into the database
  db.run(
    `INSERT INTO users (name, passwordHash, permission) VALUES (?, ?, ?)`,
    [name, passwordHash, permission],
    function (err) {
      if (err) {
        return res.status(500).json({ error: "Error adding user to database" });
      }
      res.status(201).json({
        id: this.lastID,
        name,
      });
    }
  );
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
