const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add product creation controller
const addProductCreation = async (req, res) => {
  const { name, tailor, materials, startDate, estimationTime, total } =
    req.body;

  try {
    // Fungsi untuk menghitung dateTime berdasarkan estimationTime
    const calculateCompletionDate = (startDate, estimationTime) => {
      // Konversi startDate ke objek Date
      const start = new Date(startDate);

      // Pisahkan estimationTime ke dalam jam, menit, dan detik
      const [hours, minutes, seconds] = estimationTime.split(":").map(Number);

      // Hitung total waktu estimasi dalam milidetik
      const totalMilliseconds =
        hours * 60 * 60 * 1000 + minutes * 60 * 1000 + seconds * 1000;

      // Tambahkan waktu estimasi ke startDate
      return new Date(start.getTime() + totalMilliseconds);
    };

    // Tentukan status berdasarkan startDate
    const now = new Date();
    const start = new Date(startDate);

    let status;
    if (start <= now && start.toDateString() === now.toDateString()) {
      // Jika startDate sama dengan tanggal hari ini
      status = "dalam_proses";
    } else if (start > now) {
      // Jika startDate lebih dari sekarang
      status = "belum_dimulai";
    }

    const query = await prisma.productCreation.create({
      data: {
        name,
        tailorId: tailor,
        materials: {
          create: materials.map((material) => ({
            materialId: material.id,
            quantity: parseInt(material.quantity),
            size: parseFloat(material.size),
          })),
        },
        startDate: start,
        estimationTime: calculateCompletionDate(startDate, estimationTime),
        total,
        status,
      },
    });

    if (query) {
      await prisma.tailor.update({
        where: {
          id: tailor,
        },
        data: {
          available: false,
        },
      });
    }

    return res
      .status(200)
      .json({ message: "Successfully added product creation", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all product creation controller
const getAllProductCreation = async (req, res) => {
  const { product, tailor } = req.query;

  try {
    const tailorArray = tailor ? tailor.split(",") : [];

    const query = await prisma.productCreation.findMany({
      where: {
        AND: [
          product ? { name: { contains: product } } : undefined,
          tailor ? { tailorId: { in: tailorArray } } : undefined,
        ].filter(Boolean),
      },
      include: {
        tailor: true,
      },
    });
    if (!query) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Menambahkan countdown untuk setiap produk
    const resultsWithCountdown = query.map((product) => {
      const estimationTime = new Date(product.estimationTime);
      const now = new Date();

      // Menghitung selisih waktu dalam milidetik
      const timeDifference = estimationTime.getTime() - now.getTime();

      // Mengonversi ke format hari, jam, menit, dan detik
      const countdown = {
        days: Math.max(0, Math.floor(timeDifference / (1000 * 60 * 60 * 24))),
        hours: Math.max(
          0,
          Math.floor(
            (timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
          )
        ),
        minutes: Math.max(
          0,
          Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60))
        ),
        seconds: Math.max(0, Math.floor((timeDifference % (1000 * 60)) / 1000)),
      };

      return { ...product, countdown };
    });

    return res.status(200).json({
      message: "Successfully get all the products",
      results: resultsWithCountdown,
    });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update production status
const updateStatuses = async (req, res) => {
  try {
    const now = new Date();

    // Update status "belum_dimulai" menjadi "dalam_proses"
    const inProgress = await prisma.productCreation.updateMany({
      where: {
        startDate: { lte: now },
        status: "belum_dimulai",
      },
      data: { status: "dalam_proses" },
    });

    // Cari produk yang akan diubah statusnya menjadi "selesai"
    const productsToComplete = await prisma.productCreation.findMany({
      where: {
        estimationTime: { lte: now },
        status: "dalam_proses",
      },
      select: { tailorId: true }, // Ambil tailorId untuk pembaruan
    });

    // Update status "dalam_proses" menjadi "selesai"
    const completed = await prisma.productCreation.updateMany({
      where: {
        estimationTime: { lte: now },
        status: "dalam_proses",
      },
      data: { status: "selesai" },
    });

    // Ambil unique tailorId dari produk yang selesai
    const tailorIds = [...new Set(productsToComplete.map((p) => p.tailorId))];

    // Update status penjahit menjadi "ada" untuk penjahit terkait
    if (tailorIds.length > 0) {
      await prisma.tailor.updateMany({
        where: { id: { in: tailorIds } },
        data: { available: true },
      });
    }

    return res.status(200).json({
      message: `${inProgress.count} products started, ${completed.count} products completed, ${tailorIds.length} tailors updated to available`,
    });
  } catch (err) {
    console.error("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Delete production
const deleteProductCreation = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await prisma.productCreation.delete({
      where: {
        id: id,
      },
    });
    if (!query) {
      return res.status(404).json({ message: "Product not found" });
    }

    return res
      .status(200)
      .json({ message: "Product deleted successfully", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel production
const cancelProductCreation = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await prisma.productCreation.update({
      where: {
        id: id,
      },
      data: {
        status: "dibatalkan",
      },
    });
    if (!query) {
      return res.status(404).json({ message: "Product not found" });
    }

    await prisma.tailor.update({
      where: {
        id: query.tailorId,
      },
      data: {
        available: true,
      },
    });

    return res
      .status(200)
      .json({ message: "Product canceled successfully", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  addProductCreation,
  getAllProductCreation,
  updateStatuses,
  deleteProductCreation,
  cancelProductCreation,
};
