const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getIncome = async (req, res) => {
  const { timePeriod } = req.query;

  try {
    const today = new Date(); // Tanggal sekarang
    const startDate = new Date(); // Tanggal awal untuk range
    const dates = [];
    let dateRange;

    // Tentukan durasi waktu berdasarkan query parameter
    if (timePeriod === "1-week-period") {
      dateRange = 7;
    } else if (timePeriod === "4-week-period") {
      dateRange = 28;
    } else if (timePeriod === "90-days-period") {
      dateRange = 90;
    } else if (timePeriod === "1-year-period") {
      dateRange = 365;
    } else {
      return res.status(400).json({ message: "Invalid time period provided" });
    }

    // Atur tanggal awal untuk filter
    startDate.setDate(today.getDate() - dateRange);

    // Buat array tanggal untuk rentang waktu
    for (let i = 1; i <= dateRange; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      const formattedDate = pastDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      dates.push(formattedDate);
    }

    // Ambil data order berdasarkan range waktu
    const getOrder = await prisma.order.findMany({
      where: {
        status: "selesai",
        createdAt: {
          gte: startDate, // Gunakan `startDate` yang valid
        },
      },
      include: {
        orderProducts: {
          include: {
            productVariant: true,
          },
        },
      },
    });

    // Inisialisasi totalIncome untuk setiap tanggal
    let incomeByDate = dates.reduce((acc, date) => {
      acc[date] = 0;
      return acc;
    }, {});

    // Hitung total income untuk setiap tanggal
    getOrder.forEach((order) => {
      const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      let orderTotal = 0;

      order.orderProducts.forEach((orderProduct) => {
        const productTotal =
          orderProduct.quantity * orderProduct.productVariant.price;
        orderTotal += productTotal;

        // Hitung biaya pengiriman per produk
        const shippingFeePerProduct =
          order.shippingFee / order.orderProducts.length;
        orderTotal -= shippingFeePerProduct;
      });

      if (incomeByDate[orderDate] !== undefined) {
        incomeByDate[orderDate] += orderTotal;
      }
    });

    // Ubah objek incomeByDate menjadi array dengan urutan yang benar
    const resultArray = dates.map((date) => ({
      date,
      totalIncome: incomeByDate[date] || 0,
    }));

    resultArray.reverse();

    res.status(200).json({
      message: "Successfully retrieved income data",
      results: resultArray,
    });
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = { getIncome };
