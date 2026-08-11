import prisma from "../Database/prismaClient.js";

// Middleware to check Vendor (admin) access
function requireVendor(req, res, next) {
  if (req.userData.type !== "Vendor") {
    return res.status(403).json({ message: "Admin access required" });
  }
  next();
}

// GET /admin/stats
async function getStats(req, res) {
  try {
    const [totalUsers, totalProducts, totalOrders, revenueAgg] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.orderDetails.count(),
      prisma.orderDetails.aggregate({ _sum: { total: true } }),
    ]);

    const totalRevenue = revenueAgg._sum.total
      ? parseFloat(revenueAgg._sum.total.toString())
      : 0;

    return res.status(200).json({
      stats: { totalUsers, totalProducts, totalOrders, totalRevenue },
    });
  } catch (error) {
    console.error("Error in getStats:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /admin/users
async function getUsers(req, res) {
  try {
    const page   = Math.max(1, parseInt(req.query.page  || 1));
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit || 20)));
    const skip   = (page - 1) * limit;
    const search = req.query.search?.trim() || "";

    const where = search
      ? { OR: [{ username: { contains: search, mode: "insensitive" } }, { email: { contains: search, mode: "insensitive" } }] }
      : {};

    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        select: { id: true, username: true, email: true, type: true, createdAt: true },
      }),
      prisma.user.count({ where }),
    ]);

    const normalized = users.map((u) => ({
      ...u,
      _id: String(u.id),
      name: u.username,
      role: u.type === "Vendor" ? "admin" : "customer",
    }));

    return res.status(200).json({ users: normalized, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// PUT /admin/users/:id
async function updateUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });

    const updateData = {};
    if (req.body.type) updateData.type = req.body.type;
    if (req.body.role) updateData.type = req.body.role === "admin" ? "Vendor" : "Customer";
    if (req.body.username) updateData.username = req.body.username.trim();
    if (req.body.name) updateData.username = req.body.name.trim();

    const updated = await prisma.user.update({
      where: { id },
      data: updateData,
      select: { id: true, username: true, email: true, type: true, createdAt: true },
    });

    return res.status(200).json({
      user: { ...updated, _id: String(updated.id), name: updated.username, role: updated.type === "Vendor" ? "admin" : "customer" },
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// DELETE /admin/users/:id
async function deleteUser(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid user ID" });
    if (id === req.userData.id) return res.status(400).json({ message: "Cannot delete your own account" });
    await prisma.user.delete({ where: { id } });
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /admin/orders — all orders, paginated
async function getAllOrders(req, res) {
  try {
    const page   = Math.max(1, parseInt(req.query.page  || 1));
    const limit  = Math.min(100, Math.max(1, parseInt(req.query.limit || 20)));
    const skip   = (page - 1) * limit;
    const status = req.query.status?.trim() || "";

    const where = status ? { status } : {};

    const [orders, total] = await Promise.all([
      prisma.orderDetails.findMany({ where, orderBy: { createdAt: "desc" }, skip, take: limit }),
      prisma.orderDetails.count({ where }),
    ]);

    const serialized = orders.map((o) => ({
      ...o,
      _id: String(o.id),
      total: o.total ? parseFloat(o.total.toString()) : 0,
      totalPrice: o.total ? parseFloat(o.total.toString()) : 0,
      items: Array.isArray(o.product) ? o.product : [],
      shippingAddress: { fullName: o.name, phone: o.number, street: o.address, city: o.city, state: o.state, country: o.country, pincode: o.pincode },
      paymentMethod: o.payment,
      status: o.status || "pending",
      // Expose customer name for admin table
      user: { name: o.name, email: o.email },
    }));

    return res.status(200).json({ orders: serialized, total, page, totalPages: Math.ceil(total / limit) });
  } catch (error) {
    console.error("Error in getAllOrders:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// PUT /admin/orders/:id/status
async function updateOrderStatus(req, res) {
  try {
    const id = parseInt(req.params.id);
    const { status } = req.body;
    const VALID = ["pending", "confirmed", "shipped", "delivered", "cancelled"];
    if (!status || !VALID.includes(status)) {
      return res.status(400).json({ message: `Status must be one of: ${VALID.join(", ")}` });
    }
    const updated = await prisma.orderDetails.update({
      where: { id },
      data: { status },
    });
    return res.status(200).json({
      order: {
        ...updated,
        _id: String(updated.id),
        totalPrice: updated.total ? parseFloat(updated.total.toString()) : 0,
        status: updated.status,
      },
    });
  } catch (error) {
    console.error("Error in updateOrderStatus:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { requireVendor, getStats, getUsers, updateUser, deleteUser, getAllOrders, updateOrderStatus };
