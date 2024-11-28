const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

// Add order controller
const addOrder = async (req, res) => {
  const {
    variantId,
    name,
    phone,
    shippingFee,
    discount,
    address,
    shippingMethod,
    paymentMethod,
    additionalNotes,
    status,
  } = req.body;

  try {
    const order = await prisma.order.create({
      data: {
        trackingReceipt: `TRK${Date.now()}${Math.floor(Math.random() * 1000)}`,
        orderProducts: {
          create: variantId.map((variant) => ({
            variantId: variant.id,
            quantity: parseInt(variant.total),
          })),
        },
        name: name,
        phone: phone,
        shippingFee: parseInt(shippingFee),
        discount: parseInt(discount),
        address: {
          create: {
            country: address.country,
            address: address.address,
            otherDetails: address.otherDetails,
            province: address.province,
            city: address.city,
            postalCode: address.postalCode,
          },
        },
        shippingMethod: shippingMethod,
        paymentMethod: paymentMethod,
        additionalNotes: additionalNotes,
        status: status,
      },
    });

    for (let item of variantId) {
      await prisma.productVariant.update({
        where: {
          id: item.id,
        },
        data: {
          stock: { decrement: item.total },
        },
      });
    }

    return res
      .status(200)
      .json({ message: "Successfully added order", results: order });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get all orders controller
const getAllOrders = async (req, res) => {
  const { trackingReceipt, orderStatus } = req.query;

  try {
    // Order status URL query for filtering
    const statusArray = orderStatus ? orderStatus.split(",") : [];

    const orders = await prisma.order.findMany({
      where: {
        AND: [
          trackingReceipt
            ? { trackingReceipt: { contains: trackingReceipt } }
            : undefined,
          orderStatus ? { status: { in: statusArray } } : undefined,
        ].filter(Boolean), // Hapus elemen kosong
      },
      include: {
        orderProducts: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
        address: true,
      },
    });

    const orderData = orders.map((order) => {
      // Hitung subtotal (harga produk berdasarkan quantity)
      const subtotal = order.orderProducts.reduce((acc, orderProduct) => {
        return acc + orderProduct.quantity * orderProduct.productVariant.price;
      }, 0);

      const totalPrice = subtotal + order.shippingFee - order.discount;

      return {
        ...order,
        totalPrice,
      };
    });

    return res.status(200).json({
      message: "Successfully get all the orders",
      results: orderData,
    });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update order status controller
const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  try {
    const query = await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: status,
      },
    });

    // If order doesn't exist
    if (!query) {
      return res.status(404).json({ message: "Order not found" });
    }

    return res
      .status(200)
      .json({ message: "Successfully update order status", results: query });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Get order detail by id
const getOrderDetailById = async (req, res) => {
  const { id } = req.params;

  try {
    const query = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: {
        orderProducts: {
          include: {
            productVariant: {
              include: {
                product: {
                  include: {
                    images: true,
                  },
                },
              },
            },
          },
        },
        address: true,
      },
    });

    // If order doesn't exist
    if (!query) {
      return res.status(404).json({ message: "Order not found" });
    }
    // Hitung total harga
    const subTotal = query.orderProducts.reduce((acc, orderProduct) => {
      return acc + orderProduct.quantity * orderProduct.productVariant.price;
    }, 0);

    const totalPrice = subTotal + query.shippingFee - query.discount;

    // Tambahkan totalPrice ke hasil
    const results = {
      ...query,
      subTotal,
      totalPrice,
    };

    return res.status(200).json({
      message: "Successfully get order detail",
      results: results,
    });
  } catch (err) {
    console.log("Error :" + err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Cancel order
const cancelOrder = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the order to be canceled
    const order = await prisma.order.findUnique({
      where: {
        id: id,
      },
      include: { orderProducts: true },
    });

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    // Update stock
    for (const item of order.orderProducts) {
      await prisma.productVariant.update({
        where: { id: item.variantId },
        data: {
          stock: { increment: item.quantity },
        },
      });
    }

    // Update order status
    await prisma.order.update({
      where: {
        id: id,
      },
      data: {
        status: "dibatalkan",
      },
    });

    res.json({ message: "Order canceled successfully" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  addOrder,
  getAllOrders,
  updateOrderStatus,
  getOrderDetailById,
  cancelOrder,
};
