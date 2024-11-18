import dbConnect from "../config/db.js";

export async function getProducts(req, res) {
  try {
    const connection = await dbConnect();

    const [products] = await connection.execute(`
      SELECT 
        p.*, 
        COALESCE(SUM(c.quantity), 0) AS cart_count,
        (
          SELECT COUNT(1)
          FROM wish_list w
          WHERE w.product_id = p.id
        ) > 0 AS status
      FROM products p
      LEFT JOIN carts c ON p.id = c.product_id
      GROUP BY p.id
    `);

    res.status(200).send({
      message: "Products retrieved successfully",
      status: 200,
      products,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function getProductById(req, res) {
  const { id } = req.params;

  try {
    const connection = await dbConnect();
    const [product] = await connection.execute(
      `
      SELECT p.*, COALESCE(SUM(c.quantity), 0) AS count
      FROM products p
      LEFT JOIN carts c ON p.id = c.product_id
      WHERE p.id = ?
      GROUP BY p.id
      `,
      [id]
    );

    if (product.length === 0) {
      return res
        .status(404)
        .send({ message: "Product not found", status: 404 });
    }

    res.status(200).send({
      message: "Product retrieved successfully",
      status: 200,
      product: product[0],
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function deleteProduct(req, res) {
  const { id } = req.body;

  if (!id) {
    return res
      .status(400)
      .send({ message: "Product ID is required", status: 400 });
  }

  let connection;

  try {
    connection = await dbConnect();
    await connection.beginTransaction();

    await connection.execute("DELETE FROM carts WHERE product_id = ?", [id]);
    const [deleteProductResult] = await connection.execute(
      "DELETE FROM products WHERE id = ?",
      [id]
    );
    await connection.commit();

    if (deleteProductResult.affectedRows > 0) {
      res.status(200).send({
        message: "Product and associated cart items removed",
        status: 200,
      });
    } else {
      res.status(404).send({ message: "Product not found", status: 404 });
    }
  } catch (err) {
    if (connection) await connection.rollback(); // Rollback the transaction in case of error
    console.error("Error deleting product:", err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function getCartProducts(req, res) {
  const { id } = req.params; // This is the ID passed in the request URL

  try {
    const connection = await dbConnect();
    const query = `
      SELECT c.id, c.product_id, c.quantity, c.name, c.description, c.image, c.color, c.size,
             p.price, (c.quantity * p.price) AS total_price
      FROM carts c
      JOIN products p ON c.product_id = p.id
      WHERE c.user_id = ?  
    `;

    const [products] = await connection.execute(query, [id]); // Pass the id as a parameter

    res.status(200).send({
      message: "Cart products retrieved successfully",
      status: 200,
      products,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function getOrderDetails(req, res) {
  // const { id } = req.params;
  try {
    const connection = await dbConnect();

    // Modified query to include a JOIN between orders and users tables
    const query = `
      SELECT *
      FROM orders
    `;

    const [orders] = await connection.execute(query);

    res.status(200).send({
      message: "Orders retrieved successfully",
      status: 200,
      orders,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function addToCart(req, res) {
  const { id, name, description, price, image, color, size, user_id } =
    req.body;

  console.log(user_id);
  try {
    const connection = await dbConnect();
    const [existingCart] = await connection.execute(
      "SELECT * FROM carts WHERE product_id = ? AND color = ? AND size = ? AND user_id=?",
      [id, color, size, user_id]
    );

    if (existingCart.length > 0) {
      await connection.execute(
        "UPDATE carts SET quantity = quantity + 1 WHERE product_id = ? AND color = ? AND size = ? AND user_id = ?",
        [id, color, size, user_id]
      );
    } else {
      // Insert new item with color and size
      await connection.execute(
        "INSERT INTO carts (product_id, name, price, description, quantity, image, color, size,user_id) VALUES (?, ?, ?, ?, ?, ?, ?, ?,?)",
        [id, name, price, description, 1, image, color, size, user_id]
      );
    }

    res.status(200).send({ message: "Product added to cart", status: 200 });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function removeFromCart(req, res) {
  const { id, color, size, user_id } = req.body;

  try {
    const connection = await dbConnect();
    const [existingCart] = await connection.execute(
      "SELECT * FROM carts WHERE product_id = ? AND color = ? AND size = ? AND user_id = ?",
      [id, color, size, user_id]
    );

    if (existingCart.length > 0) {
      if (existingCart[0].quantity > 1) {
        await connection.execute(
          "UPDATE carts SET quantity = quantity - 1 WHERE product_id = ? AND color = ? AND size = ? AND user_id = ?",
          [id, color, size, user_id]
        );
        res
          .status(200)
          .send({ message: "Product quantity updated", status: 200 });
      } else {
        await connection.execute(
          "DELETE FROM carts WHERE product_id = ? AND color = ? AND size = ? AND user_id=?",
          [id, color, size, user_id]
        );
        res
          .status(200)
          .send({ message: "Product removed from cart", status: 200 });
      }
    } else {
      res
        .status(404)
        .send({ message: "Product not found in cart", status: 404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function removeCartProduct(req, res) {
  const { id, color, size } = req.body;

  try {
    const connection = await dbConnect();
    const [existingCart] = await connection.execute(
      "SELECT * FROM carts WHERE id = ? AND color = ? AND size = ?",
      [id, color, size]
    );

    if (existingCart.length > 0) {
      await connection.execute(
        "DELETE FROM carts WHERE id = ? AND color = ? AND size = ?",
        [id, color, size]
      );
      res
        .status(200)
        .send({ message: "Product removed from cart", status: 200 });
    } else {
      res
        .status(404)
        .send({ message: "Product not found in cart", status: 404 });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function placeOrder(req, res) {
  const { id } = req.body;
  console.log(id);
  try {
    const connection = await dbConnect();

    const [cartItems] = await connection.execute(
      `
      SELECT c.product_id, c.quantity, c.name, c.description, c.image, c.color, c.size,
             p.price, (c.quantity * p.price) AS total_price
      FROM carts c
      JOIN products p ON c.product_id = p.id
      `
    );

    // Fetch user details
    const [userDetails] = await connection.execute(
      `
      SELECT name, email, address, phone
      FROM user_details
      WHERE user_id = ?
      `,
      [id]
    );

    if (userDetails.length === 0) {
      return res.status(404).send({ message: "User not found", status: 404 });
    }

    const user = userDetails[0];

    // Insert orders with user details
    for (const item of cartItems) {
      await connection.execute(
        `
        INSERT INTO orders (product_id, user_id, product_name, product_description, product_image, quantity, price, total_price, color, size, status, name, email, address, phone)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `,
        [
          item.product_id,
          id,
          item.name,
          item.description,
          item.image,
          item.quantity,
          item.price,
          item.total_price,
          item.color,
          item.size,
          "Pending",
          user.name,
          user.email,
          user.address,
          user.phone,
        ]
      );
    }

    await connection.execute(
      `
      DELETE FROM carts
      `
    );

    res.status(200).send({
      message: "Order placed successfully",
      status: 200,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function getMyOrderDetails(req, res) {
  const { id } = req.params;
  try {
    const connection = await dbConnect();
    const query = "select * from orders where user_id=? order by order_date desc";
    const [orders] = await connection.execute(query, [id]);

    res.status(200).send({
      message: "Orders retrieved successfull",
      status: 200,
      orders,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function checkUserAvailablity(req, res) {
  const connection = await dbConnect();
  const { id } = req.params;
  console.log("called");
  try {
    const [userDetails] = await connection.execute(
      `
      SELECT name, email, address, phone
      FROM user_details
      WHERE user_id = ?
      `,
      [id]
    );

    if (userDetails.length === 0) {
      return res.status(404).send({ message: "User not found", status: 404 });
    } else {
      res.status(200).send({
        message: "details retrieved successfull",
        status: 200,
      });
    }
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function AddWishlist(req, res) {
  const { id, product_id } = req.body;

  try {
    const connection = await dbConnect();
    const [existing] = await connection.execute(
      "select * from wish_list where product_id = ?",
      [product_id]
    );
    if (existing.length > 0) {
      await connection.execute("DELETE FROM wish_list where product_id = ?", [
        product_id,
      ]);
    } else {
      await connection.execute(
        "INSERT INTO wish_list (user_id,product_id) VALUES (?,?)",
        [id, product_id]
      );
    }
    res.status(200).send({
      message: "WISHLIST chnaged successfull",
      status: 200,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function getWishListProducts(req, res) {
  const { id } = req.params;
  try {
    const connection = await dbConnect();

    const [products] = await connection.execute(
      `
    SELECT 
      *
    FROM products where id in (select product_id from wish_list where user_id = ?)
    `,
      [id]
    );

    res.status(200).send({
      message: "Products retrieved successfully",
      status: 200,
      products,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function moveWishlistToCart(req, res) {
  const { id } = req.params; // Get id from request body
  console.log(id);

  try {
    const connection = await dbConnect();

    // Fetch wishlist items for the user
    const [wishlistItems] = await connection.execute(
      `
      SELECT 
        w.product_id, p.name, p.description, p.image, p.price
      FROM wish_list w
      JOIN products p ON w.product_id = p.id
      WHERE w.user_id = ?
      `,
      [id]
    );

    if (wishlistItems.length === 0) {
      return res
        .status(404)
        .send({ message: "No items in wishlist", status: 404 });
    }

    // Move wishlist items to the cart
    for (const item of wishlistItems) {
      await connection.execute(
        `
        INSERT INTO carts (product_id, user_id, name, description, image, quantity, price,color,size)
        VALUES (?, ?, ?, ?, ?, 1, ?,"red","M")
        ON DUPLICATE KEY UPDATE quantity = quantity + 1
        `,
        [
          item.product_id,
          id,
          item.name,
          item.description,
          item.image,
          item.price,
        ]
      );
    }

    // Remove items from wishlist
    await connection.execute(
      `
      DELETE FROM wish_list
      WHERE user_id = ?
      `,
      [id]
    );

    res.status(200).send({
      message: "Wishlist items moved to cart successfully",
      status: 200,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
}

export async function analyticsDetails(req, res) {
  try {
    const connection = await dbConnect();

    const [ordersData] = await connection.execute(
      `SELECT 
        DATE(order_date) as order_date, 
        COUNT(id) as total_orders, 
        SUM(total_price) as total_revenue
      FROM orders
      GROUP BY DATE(order_date)
      ORDER BY order_date DESC`
    );

    if (ordersData.length === 0) {
      return res.status(404).send({
        message: "No orders found",
        status: 404,
      });
    }

    res.status(200).send({
      message: "Order analytics fetched successfully",
      status: 200,
      data: ordersData,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({
      message: "Internal server error",
      status: 500,
    });
  }
}

export async function analyticsDetailsByProduct(req, res) {
  try {
    const connection = await dbConnect();

    // Query to get product analytics
    const [productsData] = await connection.execute(
      `SELECT 
        product_name, 
        SUM(quantity) as total_quantity, 
        SUM(total_price) as total_revenue
      FROM orders
      GROUP BY product_name
      ORDER BY total_quantity DESC`
    );

    // Handle case when no products are found
    if (productsData.length === 0) {
      return res.status(404).send({
        message: "No products found",
        status: 404,
      });
    }

    // Return the fetched product data
    res.status(200).send({
      message: "Product analytics fetched successfully",
      status: 200,
      data: productsData,
    });
  } catch (err) {
    console.error(err.message);
    // Handle internal server error
    res.status(500).send({
      message: "Internal server error",
      status: 500,
    });
  }
}
