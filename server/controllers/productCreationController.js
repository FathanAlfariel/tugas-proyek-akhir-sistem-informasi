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

      // Tambahkan waktu estimasi ke startDate
      start.setHours(start.getHours() + hours);
      start.setMinutes(start.getMinutes() + minutes);
      start.setSeconds(start.getSeconds() + seconds);

      return start;
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
  try {
    const query = await prisma.productCreation.findMany({
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
      const timeDifference = estimationTime - now;

      // Mengonversi ke format hari, jam, menit, dan detik
      const countdown = {
        days: Math.floor(timeDifference / (1000 * 60 * 60 * 24)),
        hours: Math.floor((timeDifference / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((timeDifference / (1000 * 60)) % 60),
        seconds: Math.floor((timeDifference / 1000) % 60),
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
const updateStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const getProduction = await prisma.productCreation.findUnique({
      where: { id },
    });
    if (!getProduction) {
      return res.status(404).json({ message: "Product not found" });
    }

    const now = new Date();
    const start = new Date(getProduction?.startDate);

    // Perbandingan waktu menggunakan getTime()
    if (
      now.getTime() >= start.getTime() &&
      getProduction.status === "belum_dimulai"
    ) {
      await prisma.productCreation.update({
        where: {
          id: id,
        },
        data: {
          status: "dalam_proses",
        },
      });

      return res.status(200).json({ message: "Successfully updated product" });
    }
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = { addProductCreation, getAllProductCreation, updateStatus };
