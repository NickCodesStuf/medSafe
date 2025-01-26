import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import sqlite3 from "sqlite3";
import path from "path";
import cors from "cors";
import {connect} from "./serialHelper.js"

const app = express();
const PORT = 5000;

const JWT_SECRET = "key";

app.use(express.json());
app.use(cors());


app.post('/api/serial', async (req, res) => {
  const {start_datetime, quantity, frequency} = req.body;
  
  // Convert quantity and frequency to numbers
  const quantityNumber = Number(quantity);
  const startNumber = Number(start_datetime);
  const frequencyNumber = Number(frequency);
  
  if (isNaN(startNumber)) {
    return res.status(400).json({ message: 'Start must be a valid number.' });
  }
  
  if (isNaN(quantityNumber)) {
    return res.status(400).json({ message: 'Quantity must be a valid number.' });
  }
  

  if (isNaN(frequencyNumber)) {
    return res.status(400).json({ message: 'Frequency must be a valid number.' });
  }
  console.log()

  try {
    // Call the serial function to handle serial communication
    await connect(start_datetime, quantity, frequency);
    res.status(200).json({ message: 'Serial communication triggered successfully.' });
  } catch (error) {
    console.error('Error in serial communication:', error);
    res.status(500).json({ message: 'Error triggering serial communication.' });
  }
});

// Register Route (POST /register)
app.post("/register", async (req, res) => {
  const { username, password, permission } = req.body;

  // Check if name and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  // Check if the username already exists in the database
  db.get("SELECT * FROM users WHERE username = ?", [username], (err, user) => {
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
          `INSERT INTO users (username, passwordHash, permission) VALUES (?, ?, ?)`,
          [username, passwordHash, permission],
          function (err) {
            if (err) {
              return res
                .status(500)
                .json({ error: "Error adding user to database" });
            }
            // Respond with user information (including id)
            res.status(201).json({
              id: this.lastID,
              name: username,
            });
          }
        );
      });
    });
  });
});

// Login Route (POST /login)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  // Check if name and password are provided
  if (!username || !password) {
    return res.status(400).json({ error: "Name and password are required" });
  }

  // Get the user from the database by name
  db.get("SELECT * FROM users WHERE username = ?", [username], async (err, user) => {
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
      username: user.username,
      permission: user.permission,
    };

    // Sign the JWT
    const token = jwt.sign(payload, JWT_SECRET, { expiresIn: "1h" });

    // Successful login
    res.json({
      message: "Login successful",
      user: { id: user.id, username: user.username, permission: user.permission },
      token,
    });
  });
});

function authorizeAdmin(req, res, next) {
  const { username } = req.user;

  // Fetch user from the database to check their permission
  db.get("SELECT permission FROM users WHERE username = ?", [username], (err, row) => {
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
  username TEXT,
  passwordHash TEXT,
  permission TEXT
)`);

db.run(`CREATE TABLE IF NOT EXISTS prescriptions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  drug_name TEXT,
  patient_name TEXT,
  quantity INT(255)
)`);

app.get("/prescriptions", (req, res) => {
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

// Debugging routes
app.get("/prescriptions-admin", authenticateJWT, authorizeAdmin, (req, res) => {
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

app.post("/prescriptions-admin", authenticateJWT, authorizeAdmin, async (req, res) => {
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
    "SELECT id, username, passwordHash, permission FROM users",
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
    `INSERT INTO users (username, passwordHash, permission) VALUES (?, ?, ?)`,
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
