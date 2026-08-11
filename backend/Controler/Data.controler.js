import prisma from "../Database/prismaClient.js";

function serializeRecord(record) {
  if (!record) return record;

  return {
    ...record,
    _id: String(record.id),
    price: record.price?.toString?.() ?? record.price,
    total: record.total?.toString?.() ?? record.total,
  };
}

function serializeRecords(records) {
  return records.map(serializeRecord);
}

async function getData(req, res) {
  try {
    if (req.userData.type === "Customer") {
      // Fetch all products available for customers
      let products = await prisma.product.findMany({
        orderBy: {
          createdAt: "desc",
        },
      });

      // Fetch customer's orders
      let orders = await prisma.orderDetails.findMany({
        where: { customer_id: String(req.userData.id) },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        userData: req.userData,
        products: serializeRecords(products),
        orders: serializeRecords(orders),
      });
    }

    if (req.userData.type === "Vendor") {
      // Fetch vendor's products only
      let result = await prisma.product.findMany({
        where: { user_id: String(req.userData.id) },
        orderBy: {
          createdAt: "desc",
        },
      });

      return res.status(200).json({
        userData: req.userData,
        products: serializeRecords(result),
      });
    }

    return res.status(200).json({
      message: "Unauthorized user type",
      userData: req.userData,
    });
  } catch (error) {
    console.error("Error in getData:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

async function updateData(req, res) {
  try {
    if (req.userData.type !== "Vendor" && req.userData.type !== "Admin") {
      return res.status(403).json({
        message: "Only vendors and admins are allowed to update products",
      });
    }

    const productId = Number(req.body._id || req.body.id);

    if (!productId || isNaN(productId)) {
      return res.status(400).json({
        message: "Valid product ID is required",
      });
    }

    // Verify product exists and belongs to vendor
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    if (product.user_id !== String(req.userData.id) && req.userData.type !== "Admin" && req.userData.type !== "Vendor") {
      return res.status(403).json({
        message: "You are not authorized to update this product",
      });
    }

    // Prepare update data
    const updateData = {};

    if (req.body.product_name)
      updateData.product_name = req.body.product_name.trim();
    if (req.body.description)
      updateData.description = req.body.description.trim();
    if (req.body.price !== undefined) {
      const price = Number(req.body.price);
      if (isNaN(price) || price < 0) {
        return res.status(400).json({
          message: "Price must be a valid non-negative number",
        });
      }
      updateData.price = price;
    }
    if (req.body.stock !== undefined) {
      const stock = Number(req.body.stock);
      if (isNaN(stock) || stock < 0) {
        return res.status(400).json({
          message: "Stock must be a valid non-negative number",
        });
      }
      updateData.stock = stock;
    }
    if (req.body.category) updateData.category = req.body.category.trim();
    if (req.body.brand) updateData.brand = req.body.brand.trim();
    if (req.body.unit) updateData.unit = req.body.unit.trim();

    // Update product
    const result = await prisma.product.update({
      where: { id: productId },
      data: updateData,
    });

    return res.status(200).json({
      message: "Product updated successfully",
      result: serializeRecord(result),
    });
  } catch (error) {
    console.error("Error in updateData:", error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}
export { getData, updateData };
