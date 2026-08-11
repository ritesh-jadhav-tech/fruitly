import prisma from "../Database/prismaClient.js";

async function feedback(req, res) {
  try {
    await prisma.feedback.create({
      data: {
        user_id: String(req.userData.id),
        name: req.body.name,
        email: req.body.email,
        phoneno: req.body.phoneno,
        description: req.body.description,
      },
    });

    return res.status(200).json({
      message: "Feedback submitted successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      message: "Server error",
      error: error.message,
    });
  }
}

export { feedback };
