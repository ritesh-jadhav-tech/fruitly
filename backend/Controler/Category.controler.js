import prisma from "../Database/prismaClient.js";

// GET /categories — derives distinct category names from the products table
async function getCategories(req, res) {
  try {
    // Get all distinct category strings from products
    const result = await prisma.product.findMany({
      select: { category: true },
      distinct: ["category"],
      orderBy: { category: "asc" },
    });

    // Map to objects with _id = name (so frontend category filtering works by name)
    const categories = result
      .filter((r) => r.category && r.category.trim())
      .map((r) => ({
        _id: r.category.trim(),
        name: r.category.trim(),
      }));

    return res.status(200).json({ categories });
  } catch (error) {
    console.error("Error in getCategories:", error);
    return res.status(500).json({ message: "Server error", error: error.message });
  }
}

export { getCategories };
