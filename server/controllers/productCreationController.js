const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

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

module.exports = { addProductCreation };
