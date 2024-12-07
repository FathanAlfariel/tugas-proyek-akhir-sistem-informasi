const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getIncome = async (req, res) => {
  const { timePeriod } = req.query;

  try {
    const today = new Date();
    const dates = [];
    let date;

    if (timePeriod === "1-week-period") {
      date = 7;
    } else if (timePeriod === "4-week-period") {
      date = 28;
    } else if (timePeriod === "90-days-period") {
      date = 90;
    } else if (timePeriod === "1-year-period") {
      date = 365;
    }

    // Generate array of dates for the last `date` days excluding today
    for (let i = 1; i <= date; i++) {
      const pastDate = new Date(today);
      pastDate.setDate(today.getDate() - i);
      // Format the date in 'Month Day, Year' format
      const formattedDate = pastDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
      dates.push(formattedDate);
    }

    // Fetch orders with their associated products
    const getOrder = await prisma.order.findMany({
      where: {
        status: "selesai",
        createdAt: {
          gte: new Date(today.setDate(today.getDate() - date)), // Filter by past 'date' days
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

    // Initialize totalIncome for each date with 0
    let incomeByDate = dates.reduce((acc, date) => {
      acc[date] = 0; // Set initial income as 0 for each date
      return acc;
    }, {});

    // Calculate total income for the orders and assign to corresponding dates
    getOrder.forEach((order) => {
      // Format order date as 'Month Day, Year'
      const orderDate = new Date(order.createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });

      let orderTotal = 0;

      // Calculate the total for each product in the order
      order.orderProducts.forEach((orderProduct) => {
        const productTotal =
          orderProduct.quantity * orderProduct.productVariant.price;
        orderTotal += productTotal;

        // Add the shipping fee to the total income for this product
        const shippingFeePerProduct =
          order.shippingFee / order.orderProducts.length;
        orderTotal -= shippingFeePerProduct;
      });

      // Update the totalIncome for the corresponding order date
      if (incomeByDate[orderDate] !== undefined) {
        incomeByDate[orderDate] += orderTotal;
      }
    });

    // Convert the `incomeByDate` object into an array with correct order
    const resultArray = dates.map((date) => ({
      date,
      totalIncome: incomeByDate[date] || 0, // Set totalIncome to 0 if no orders on that date
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
      .json({ message: "Internal server error", error: err });
  }
};

module.exports = { getIncome };
