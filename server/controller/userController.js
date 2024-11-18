import bcrypt from "bcryptjs";
import dbConnect from "../config/db.js";

export async function register(req, res) {
  const { name, email, password, role } = req.body;

  try {
    const connection = await dbConnect();
    const [existingUser] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (existingUser.length > 0) {
      return res
        .status(400)
        .send({ message: "Email already in use", status: 400 });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert the new user and get the inserted ID
    const [result] = await connection.execute(
      "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)",
      [name, email, hashedPassword, role]
    );

    const userId = result.insertId; // Get the inserted ID

    res.status(201).send({
      message: "User registered successfully",
      status: 201,
      user: {
        id: userId,
        name: name,
        email: email,
        role: role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function login(req, res) {
  const { email, password, role } = req.body;

  try {
    const connection = await dbConnect();

    const [user] = await connection.execute(
      "SELECT * FROM users WHERE email = ?",
      [email]
    );
    if (user.length === 0) {
      return res
        .status(400)
        .send({ message: "Invalid email or password", status: 400 });
    }

    const userData = user[0];

    const isMatch = await bcrypt.compare(password, userData.password);
    if (!isMatch) {
      return res
        .status(400)
        .send({ message: "Invalid email or password", status: 400 });
    }

    res.status(200).send({
      message: "Login successful",
      status: 200,
      user: {
        id: userData.id,
        name: userData.name,
        email: userData.email,
        role: userData.role,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      message: "Internal server error",
      status: 500,
    });
  }
}
