import prisma from "../Database/prismaClient.js";

// Normalize a Prisma product record to the shape the frontend expects
function normalizeProduct(p) {
  return {
    ...p,
    _id: String(p.id),
    name: p.product_name,
    images: p.url ? [p.url] : [],
    price: parseFloat(p.price),
    category: p.category,        // plain string
    brand: p.brand || "",
    unit: p.unit || "kg",
    description: p.description || "",
    stock: p.stock,
    averageRating: 0,
    reviewCount: 0,
    reviews: [],
  };
}

// GET /products  — public, paginated + filtered
async function getProducts(req, res) {
  try {
    const {
      page = 1,
      limit = 12,
      search = "",
      category = "",
      sort = "newest",
      minPrice = "",
      maxPrice = "",
    } = req.query;

    const pageNum  = Math.max(1, parseInt(page));
    const limitNum = Math.min(50, Math.max(1, parseInt(limit)));
    const skip     = (pageNum - 1) * limitNum;

    // Build Prisma where clause
    const where = {};
    if (search.trim()) {
      where.product_name = { contains: search.trim(), mode: "insensitive" };
    }
    if (category.trim()) {
      where.category = { equals: category.trim(), mode: "insensitive" };
    }
    if (minPrice !== "") {
      where.price = { ...(where.price || {}), gte: parseFloat(minPrice) };
    }
    if (maxPrice !== "") {
      where.price = { ...(where.price || {}), lte: parseFloat(maxPrice) };
    }

    // Sort mapping
    const orderBy = sort === "price_asc"
      ? { price: "asc" }
      : sort === "price_desc"
      ? { price: "desc" }
      : sort === "oldest"
      ? { createdAt: "asc" }
      : { createdAt: "desc" }; // default: newest

    const [products, total] = await Promise.all([
      prisma.product.findMany({ where, orderBy, skip, take: limitNum }),
      prisma.product.count({ where }),
    ]);

    return res.status(200).json({
      products: products.map(normalizeProduct),
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    console.error("Error in getProducts:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /products/featured — public, returns latest 10 products
async function getFeaturedProducts(req, res) {
  try {
    const products = await prisma.product.findMany({
      orderBy: { createdAt: "desc" },
      take: 10,
    });
    return res.status(200).json({ products: products.map(normalizeProduct) });
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

// GET /products/:id — public, single product
async function getProductById(req, res) {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid product ID" });
    const product = await prisma.product.findUnique({ where: { id } });
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ product: normalizeProduct(product) });
  } catch (error) {
    console.error("Error in getProductById:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { getProducts, getFeaturedProducts, getProductById };
