import prisma from "../Database/prismaClient.js";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function serializeProduct(product) {
  return {
    ...product,
    _id: String(product.id),
    price: product.price?.toString?.() ?? product.price,
  };
}

async function fileUplode(req, res) {
  try {
    // Validate required fields
    if (!req.file) {
      return res.status(400).json({
        message: "Image file is required",
      });
    }

    if (
      !req.body.name ||
      !req.body.price ||
      !req.body.stock ||
      !req.body.category
    ) {
      // Clean up uploaded file if validation fails
      if (req.file?.path) {
        fs.unlink(req.file.path, (err) => {
          if (err) console.error("Failed to delete temp file:", err);
        });
      }
      return res.status(400).json({
        message: "All fields (name, price, stock, category) are required",
      });
    }

    // Construct the local URL for the image
    const baseUrl = `${req.protocol}://${req.get('host')}`;
    const fileUrl = `${baseUrl}/uploads/${req.file.filename}`;

    // Prepare product data
    const storeData = {
      public_id: req.file.filename, // Store filename as public_id so we can delete it later
      url: fileUrl,
      product_name: req.body.name.trim(),
      description: req.body.description?.trim() || "",
      price: parseFloat(req.body.price),
      stock: parseInt(req.body.stock),
      category: req.body.category.trim(),
      brand: req.body.brand?.trim() || "",
      user_id: String(req.userData.id),
      unit: req.body.unit?.trim() || "kg",
    };

    // Validate numeric fields
    if (isNaN(storeData.price) || isNaN(storeData.stock)) {
      return res.status(400).json({
        message: "Price and stock must be valid numbers",
      });
    }

    if (storeData.price < 0 || storeData.stock < 0) {
      return res.status(400).json({
        message: "Price and stock cannot be negative",
      });
    }

    // Create product in database
    const dbResult = await prisma.product.create({
      data: storeData,
    });

    // DO NOT clean up temporary file because it's now our persistent file!

    return res.status(200).json({
      message: "Product added successfully",
      result: serializeProduct(dbResult),
    });
  } catch (error) {
    console.error("Error in fileUplode:", error);

    // Clean up temporary file on error
    if (req.file?.path) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error("Failed to delete temp file:", err);
      });
    }

    return res.status(500).json({
      message: "Server error while uploading file",
      error: error.message,
    });
  }
}

async function fileDelete(req, res) {
  try {
    const data = req.body;

    if (!data._id && !data.id) {
      return res.status(400).json({
        message: "Product ID is required",
      });
    }

    if (!data.public_id) {
      return res.status(400).json({
        message: "Public ID is required",
      });
    }

    // Get product details before deletion to verify ownership
    const product = await prisma.product.findUnique({
      where: {
        id: Number(data._id || data.id),
      },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Verify user owns this product or is a Vendor/Admin
    if (product.user_id !== String(req.userData.id) && req.userData.type !== "Admin" && req.userData.type !== "Vendor") {
      return res.status(403).json({
        message: "You are not authorized to delete this product",
      });
    }

    // Delete local file
    try {
      const filePath = path.join(__dirname, "..", "uploads", product.public_id);
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
      }
    } catch (err) {
      console.error("Failed to delete local file:", err);
    }

    // Delete from database
    const dbResult = await prisma.product.delete({
      where: {
        id: Number(data._id || data.id),
      },
    });

    return res.status(200).json({
      message: "Product deleted successfully",
      result: serializeProduct(dbResult),
    });
  } catch (error) {
    console.error("Error in fileDelete:", error);
    return res.status(500).json({
      message: "Server error while deleting product",
      error: error.message,
    });
  }
}

export { fileUplode, fileDelete };
