const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const axios = require("axios");

// Endpoint estimasi yang menggunakan data material dari database
const estimate = async (req, res) => {
  const { materials, totalQuantity } = req.body;

  try {
    // Ambil semua karakteristik material dari database
    const materialCharacteristics = {};
    const dbMaterials = await prisma.material.findMany();

    dbMaterials.forEach((mat) => {
      materialCharacteristics[mat.name] = {
        complexity: mat.complexity,
        cutting_time: mat.cuttingTime,
        sewing_time: mat.sewingTime,
      };
    });

    // Kirim request ke Python service dengan karakteristik material
    const pythonResponse = await axios.post("http://localhost:3000/estimate", {
      materials,
      totalQuantity,
      materialCharacteristics,
    });

    const estimation = pythonResponse.data;

    // Optional: Simpan hasil estimasi
    // const savedEstimation = await prisma.productionEstimate.create({
    //   data: {
    //     totalEstimatedHours: estimation.total_estimated_hours,
    //     cuttingHours: estimation.cutting_hours,
    //     sewingHours: estimation.sewing_hours,
    //     complexityFactor: estimation.complexity_factor,
    //     totalQuantity,
    //     materials: JSON.stringify(materials),
    //   },
    // });

    return res.json({
      success: true,
      data: estimation,
    });
  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: error.message,
    });
  }
};

module.exports = { estimate };
