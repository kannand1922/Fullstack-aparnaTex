import express from "express";
import Razorpay from "razorpay";
import crypto from "crypto";
import dbConnect from "../config/db.js";

const router = express.Router();
const connection = await dbConnect();

router.post("/orderr", (req, res) => {
  try {
    const instance = new Razorpay({
      key_id: "rzp_test_lxRT5NF1Dopxfd",
      key_secret: "sEGonS41awMadqWt68JeOl4O",
    });

    const opts = {
      amount: req.body.amount * 100,
      currency: "INR",
      receipt: "sample_receipt",
    };

    instance.orders.create(opts, (err, order) => {
      if (err) {
        console.log(err);
        res.status(500).json({ message: "Something went wrong" });
      } else {
        res.status(200).json({ data: order });
      }
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
});

router.post("/verify", async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
      req.body;
    const sign = `${razorpay_order_id}|${razorpay_payment_id}`;
    const expectedSign = crypto
      .createHmac("sha256", "sEGonS41awMadqWt68JeOl4O")
      .update(sign)
      .digest("hex");

    if (razorpay_signature === expectedSign) {
      return res.status(200).json({ message: "Payment verified successfully" });
    } else {
      return res.status(400).json({ message: "Invalid signature sent!" });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

router.post("/details", async (req, res) => {
  try {
    console.log(req.body);
    const { name, phone, email, address, id } = req.body;

    // First, check if the user_id already exists
    const checkQuery = "SELECT * FROM user_details WHERE user_id = ?";
    const [existing] = await connection.execute(checkQuery, [id]);

    let query;

    if (existing.length > 0) {
      // If user_id exists, update the record
      query = `
        UPDATE user_details
        SET name = ?, phone = ?, email = ?, address = ?
        WHERE user_id = ?
      `;
      await connection.execute(query, [name, phone, email, address, id]);
    } else {
      query = `
        INSERT INTO user_details (name, phone, email, address, user_id)
        VALUES (?, ?, ?, ?, ?)
      `;
      await connection.execute(query, [name, phone, email, address, id]);
    }

    res.status(201).send({
      message:
        existing.length > 0
          ? "Details updated successfully"
          : "Details saved successfully",
      status: 201,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send({ message: "Internal server error", status: 500 });
  }
});

export { router as paymentRoutes };
