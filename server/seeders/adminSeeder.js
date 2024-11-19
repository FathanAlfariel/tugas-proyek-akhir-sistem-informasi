const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv");

dotenv.config();

const prisma = new PrismaClient();

const adminSeeder = async () => {
  try {
    // Check if admin already exists
    const existingAdmin = await prisma.admin.findUnique({
      where: { username: "admin1" },
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      return;
    }

    // Hash the admin password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash("admin1", salt);

    // Create admin credentials with a custom UUID
    await prisma.admin.create({
      data: {
        name: "Admin1",
        username: "admin1",
        password: hashedPassword,
      },
    });

    console.log("Admin created successfully");
  } catch (error) {
    console.error("Error seeding admin:", error);
  } finally {
    // Disconnect Prisma Client
    await prisma.$disconnect();
  }
};

adminSeeder()
  .then(() => {
    console.log("Admin seeding completed");
    process.exit(0);
  })
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
