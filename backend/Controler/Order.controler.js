import prisma from "../Database/prismaClient.js";

function serializeOrder(order) {
  return {
    ...order,
    _id: String(order.id),
    total: order.total?.toString?.() ?? order.total,
    totalPrice: order.total ? parseFloat(order.total.toString()) : 0,
    // Expose stored product JSON as items for frontend consumption
    items: Array.isArray(order.product) ? order.product : [],
    shippingAddress: {
      fullName: order.name,
      phone:    order.number,
      street:   order.address,
      city:     order.city,
      state:    order.state,
      country:  order.country,
      pincode:  order.pincode,
    },
    paymentMethod: order.payment,
    status: order.status || "pending",
  };
}

// POST /order/data — create a new order
async function makeOrder(req, res) {
  try {
    const data = req.body;

    // Support both old shape (name, number, ...) and new frontend shape (shippingAddress, items, paymentMethod)
    let orderData;
    if (data.shippingAddress) {
      // New frontend shape
      const addr = data.shippingAddress;
      orderData = {
        name:        addr.fullName  || "",
        number:      addr.phone     || "",
        email:       req.userData.email,
        payment:     data.paymentMethod || "cod",
        address:     addr.street    || "",
        city:        addr.city      || "",
        state:       addr.state     || "",
        country:     addr.country   || "India",
        pincode:     addr.pincode   || "",
        product:     data.items     || [],
        total:       Number(data.totalPrice || data.total || 0),
        customer_id: String(req.userData.id),
        status:      "pending",
      };
    } else {
      // Legacy shape
      orderData = {
        name:        data.name,
        number:      data.number,
        email:       data.email,
        payment:     data.payment,
        address:     data.address,
        city:        data.city,
        state:       data.state,
        country:     data.country,
        pincode:     data.pincode,
        product:     data.product,
        total:       Number(data.total),
        customer_id: String(req.userData.id),
        status:      "pending",
      };
    }

    const ack = await prisma.orderDetails.create({ data: orderData });
    return res.status(200).json({
      message: "Order placed successfully",
      order: serializeOrder(ack),
      ack: serializeOrder(ack),
    });
  } catch (error) {
    console.error("Error in makeOrder:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /order/my — customer's own orders
async function getMyOrders(req, res) {
  try {
    const page  = Math.max(1, parseInt(req.query.page  || 1));
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit || 10)));
    const skip  = (page - 1) * limit;

    const [orders, total] = await Promise.all([
      prisma.orderDetails.findMany({
        where: { customer_id: String(req.userData.id) },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      }),
      prisma.orderDetails.count({ where: { customer_id: String(req.userData.id) } }),
    ]);

    return res.status(200).json({
      orders: orders.map(serializeOrder),
      total,
      page,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Error in getMyOrders:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /order/:id — single order (must belong to this customer or be a Vendor)
async function getOrderById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid order ID" });

    const order = await prisma.orderDetails.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ message: "Order not found" });

    // Only owner or vendor can view
    if (order.customer_id !== String(req.userData.id) && req.userData.type !== "Vendor") {
      return res.status(403).json({ message: "Not authorized to view this order" });
    }

    return res.status(200).json({ order: serializeOrder(order) });
  } catch (error) {
    console.error("Error in getOrderById:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// PUT /order/:id/cancel — cancel a pending order
async function cancelOrder(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid order ID" });

    const order = await prisma.orderDetails.findUnique({ where: { id } });
    if (!order) return res.status(404).json({ message: "Order not found" });
    if (order.customer_id !== String(req.userData.id)) {
      return res.status(403).json({ message: "Not authorized to cancel this order" });
    }
    if (!["pending", "confirmed"].includes(order.status)) {
      return res.status(400).json({ message: "This order cannot be cancelled" });
    }

    const updated = await prisma.orderDetails.update({
      where: { id },
      data: { status: "cancelled" },
    });
    return res.status(200).json({ message: "Order cancelled", order: serializeOrder(updated) });
  } catch (error) {
    console.error("Error in cancelOrder:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { makeOrder, getMyOrders, getOrderById, cancelOrder };
