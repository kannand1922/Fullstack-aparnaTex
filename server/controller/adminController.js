import dbConnect from "../config/db.js";

// Controller function to handle product data
export async function postProducts(req, res) {
  const connection = await dbConnect();

  try {
    const { name, description, price, image } = req.body;

    const query = `
      INSERT INTO products (name, description, price, image)
      VALUES (?, ?, ?, ?)
    `;

    await connection.execute(query, [name, description, price, image]);

    res.status(201).send({
      message: "Product saved successfully",
      status: 201,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}
