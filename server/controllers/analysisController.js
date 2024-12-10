const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getIncomes = async (req, res) => {
  const {
    timePeriod,
    startDate: startDateQuery,
    endDate: endDateQuery,
  } = req.query;

  try {
    const today = new Date(); // Tanggal sekarang
    let startDate = new Date(); // Tanggal awal untuk range
    let endDate = new Date(); // Tanggal akhir untuk range
    const dates = [];
    let isMonthlyFilter = false;

    // Cek apakah user memberikan tanggal mulai dan tanggal akhir
    if (startDateQuery && endDateQuery) {
      startDate = new Date(startDateQuery);
      endDate = new Date(endDateQuery);
    } else {
      // Tentukan range waktu berdasarkan query parameter
      if (timePeriod === "1-week-period") {
        startDate.setDate(today.getDate() - 7);
      } else if (timePeriod === "4-week-period") {
        startDate.setDate(today.getDate() - 28);
      } else if (timePeriod === "90-days-period") {
        startDate.setDate(today.getDate() - 90);
      } else if (timePeriod === "1-year-period") {
        startDate.setDate(today.getDate() - 365);
      } else if (timePeriod === "period-current_month") {
        isMonthlyFilter = true;
        startDate.setDate(1); // Awal bulan ini
        endDate.setMonth(startDate.getMonth() + 1, 0); // Akhir bulan ini
      } else if (timePeriod === "period-minus_1_month") {
        isMonthlyFilter = true;
        startDate.setMonth(today.getMonth() - 1, 1); // Awal bulan sebelumnya
        endDate.setMonth(today.getMonth(), 0); // Akhir bulan sebelumnya
      } else if (timePeriod === "period-minus_2_month") {
        isMonthlyFilter = true;
        startDate.setMonth(today.getMonth() - 2, 1); // Awal 2 bulan sebelumnya
        endDate.setMonth(today.getMonth() - 1, 0); // Akhir 2 bulan sebelumnya
      } else {
        return res
          .status(400)
          .json({ message: "Invalid time period provided" });
      }
    }

    // Buat array tanggal untuk rentang waktu jika filter bulanan atau berdasarkan startDate dan endDate
    if (isMonthlyFilter) {
      for (
        let d = new Date(startDate);
        d <= endDate;
        d.setDate(d.getDate() + 1)
      ) {
        dates.push(
          new Date(d).toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        );
      }
    } else {
      // Pastikan rentang dari startDate sampai endDate, bukan hanya berdasarkan today
      const dateRange = Math.ceil(
        (endDate - startDate) / (1000 * 60 * 60 * 24)
      ); // Menghitung jumlah hari
      for (let i = 0; i <= dateRange; i++) {
        const pastDate = new Date(startDate);
        pastDate.setDate(startDate.getDate() + i); // Mulai dari startDate dan tambahkan hari
        dates.push(
          pastDate.toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          })
        );
      }
    }

    // Ambil data order berdasarkan range waktu
    const getOrder = await prisma.order.findMany({
      where: {
        status: "selesai",
        createdAt: {
          gte: startDate,
          lte: endDate, // Gunakan endDate yang telah ditentukan
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
        orderTotal -= shippingFeePerProduct + order.discount;
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

const getExpenses = async (req, res) => {
  const {
    timePeriod,
    startDate: startDateQuery,
    endDate: endDateQuery,
  } = req.query;

  try {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    if (startDateQuery && endDateQuery) {
      startDate = new Date(startDateQuery);
      endDate = new Date(endDateQuery);
    } else {
      if (timePeriod === "1-week-period") {
        startDate.setDate(today.getDate() - 7);
      } else if (timePeriod === "4-week-period") {
        startDate.setDate(today.getDate() - 28);
      } else if (timePeriod === "90-days-period") {
        startDate.setDate(today.getDate() - 90);
      } else if (timePeriod === "1-year-period") {
        startDate.setDate(today.getDate() - 365);
      } else if (timePeriod === "period-current_month") {
        startDate.setDate(1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      } else if (timePeriod === "period-minus_1_month") {
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      } else if (timePeriod === "period-minus_2_month") {
        startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() - 1, 0);
      } else {
        return res
          .status(400)
          .json({ message: "Invalid time period provided" });
      }
    }

    // Generate array tanggal dari startDate ke endDate
    const dates = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(
        new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    }

    // Ambil data pengeluaran dari database
    const expenses = await prisma.expense.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Hitung totalExpense berdasarkan tanggal
    const incomeByDate = expenses.reduce((acc, expense) => {
      const formattedDate = new Date(expense.createdAt).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );
      acc[formattedDate] = (acc[formattedDate] || 0) + expense.price;
      return acc;
    }, {});

    // Buat array hasil dengan memastikan setiap tanggal memiliki totalExpense
    const resultArray = dates.map((date) => ({
      date,
      totalExpense: incomeByDate[date] || 0,
    }));

    res.status(200).json({
      message: "Successfully retrieved expense data",
      results: resultArray,
    });
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getOrders = async (req, res) => {
  const {
    timePeriod,
    startDate: startDateQuery,
    endDate: endDateQuery,
  } = req.query;

  try {
    const today = new Date();
    let startDate = new Date();
    let endDate = new Date();

    if (startDateQuery && endDateQuery) {
      startDate = new Date(startDateQuery);
      endDate = new Date(endDateQuery);
    } else {
      if (timePeriod === "1-week-period") {
        startDate.setDate(today.getDate() - 7);
      } else if (timePeriod === "4-week-period") {
        startDate.setDate(today.getDate() - 28);
      } else if (timePeriod === "90-days-period") {
        startDate.setDate(today.getDate() - 90);
      } else if (timePeriod === "1-year-period") {
        startDate.setDate(today.getDate() - 365);
      } else if (timePeriod === "period-current_month") {
        startDate.setDate(1);
        endDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
      } else if (timePeriod === "period-minus_1_month") {
        startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
        endDate = new Date(today.getFullYear(), today.getMonth(), 0);
      } else if (timePeriod === "period-minus_2_month") {
        startDate = new Date(today.getFullYear(), today.getMonth() - 2, 1);
        endDate = new Date(today.getFullYear(), today.getMonth() - 1, 0);
      } else {
        return res
          .status(400)
          .json({ message: "Invalid time period provided" });
      }
    }

    // Generate array tanggal dari startDate ke endDate
    const dates = [];
    for (
      let d = new Date(startDate);
      d <= endDate;
      d.setDate(d.getDate() + 1)
    ) {
      dates.push(
        new Date(d).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      );
    }

    // Ambil data pesanan dari database
    const orders = await prisma.order.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Hitung jumlah penjualan berdasarkan tanggal
    const ordersByDate = orders.reduce((acc, order) => {
      const formattedDate = new Date(order.createdAt).toLocaleDateString(
        "en-US",
        { month: "short", day: "numeric", year: "numeric" }
      );
      acc[formattedDate] = (acc[formattedDate] || 0) + 1; // Menambahkan 1 untuk setiap pesanan
      return acc;
    }, {});

    // Buat array hasil dengan memastikan setiap tanggal memiliki totalOrders
    const resultArray = dates.map((date) => ({
      date,
      totalOrders: ordersByDate[date] || 0,
    }));

    res.status(200).json({
      message: "Successfully retrieved order data",
      results: resultArray,
    });
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

const getProfits = async (req, res) => {
  const { month, year } = req.query;

  try {
    if (!month || !year) {
      return res.status(400).json({
        message: "Please provide both month and year parameters",
      });
    }

    const startDate = new Date(year, month - 1, 1); // Awal bulan
    const endDate = new Date(year, month, 0); // Akhir bulan

    // Buat array tanggal mingguan dalam bulan tersebut
    const weeks = [];
    let weekStart = new Date(startDate);

    while (weekStart <= endDate) {
      const weekEnd = new Date(weekStart);
      weekEnd.setDate(weekStart.getDate() + 6);
      weeks.push({
        start: new Date(weekStart),
        end: weekEnd > endDate ? new Date(endDate) : new Date(weekEnd),
      });
      weekStart.setDate(weekStart.getDate() + 7);
    }

    // Ambil data order dalam range bulan dan tahun
    const orders = await prisma.order.findMany({
      where: {
        status: "selesai",
        createdAt: {
          gte: startDate,
          lte: endDate,
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

    // Ambil data expense dalam range bulan dan tahun
    const expenses = await prisma.expense.findMany({
      where: {
        createdAt: {
          gte: startDate,
          lte: endDate,
        },
      },
    });

    // Hitung laba per minggu
    const weeklyProfits = weeks.map(({ start, end }) => {
      // Format tanggal untuk hasil
      const formattedWeek = `${start.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })} - ${end.toLocaleDateString("en-US", {
        day: "numeric",
        month: "short",
      })}`;

      // Hitung income per minggu
      const weeklyIncome = orders.reduce((total, order) => {
        const orderDate = new Date(order.createdAt);
        if (orderDate >= start && orderDate <= end) {
          let orderTotal = 0;
          order.orderProducts.forEach((orderProduct) => {
            const productTotal =
              orderProduct.quantity * orderProduct.productVariant.price;
            orderTotal += productTotal;
          });

          const shippingFeePerProduct =
            order.shippingFee / order.orderProducts.length;
          orderTotal -= shippingFeePerProduct + order.discount;

          total += orderTotal;
        }
        return total;
      }, 0);

      // Hitung expense per minggu
      const weeklyExpense = expenses.reduce((total, expense) => {
        const expenseDate = new Date(expense.createdAt);
        if (expenseDate >= start && expenseDate <= end) {
          total += expense.price;
        }
        return total;
      }, 0);

      // Hitung laba
      const profit = weeklyIncome - weeklyExpense;

      return {
        week: formattedWeek,
        profit,
      };
    });

    res.status(200).json({
      message: "Successfully retrieved weekly profits",
      results: weeklyProfits,
    });
  } catch (err) {
    console.error("Error:", err);
    return res
      .status(500)
      .json({ message: "Internal server error", error: err.message });
  }
};

module.exports = { getIncomes, getExpenses, getOrders, getProfits };
