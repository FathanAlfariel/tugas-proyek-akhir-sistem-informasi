import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";
import { GrDeliver } from "react-icons/gr";
import axios from "axios";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi2";
import { Link } from "react-router-dom";
import DropdownSelect from "../Components/DropdownSelect";
import IconButton from "../Components/IconButton";
import { IoMdMore } from "react-icons/io";
import Dropdown from "../Components/Dropdown";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [showMenuStatusUpdates, setShowMenuStatusUpdates] = useState(null);

  const handleShowMenuStatusUpdates = (id) => {
    setShowMenuStatusUpdates((prev) => (prev === id ? null : id));
  };

  useEffect(() => {
    const getAllOrders = async () => {
      await axios
        .get("http://localhost:5000/api/order")
        .then(({ data }) => {
          setOrders(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAllOrders();
  }, []);

  const handleClickOutside = (e) => {
    if (!e.target.closest("#update-status-menu") && showMenuStatusUpdates) {
      setShowMenuStatusUpdates(null);
    }
  };

  useEffect(() => {
    if (showMenuStatusUpdates) {
      window.addEventListener("click", handleClickOutside);
      return () => window.removeEventListener("click", handleClickOutside);
    }
  }, [showMenuStatusUpdates]);

  const handleOrderStatus = async (id, status) => {
    const { data } = await axios.put(
      `http://localhost:5000/api/order/status/${id}`,
      {
        status: status,
      }
    );

    setOrders((prev) => {
      return prev.map((item) => {
        return item._id === id
          ? { ...item, status: data.results.status }
          : item;
      });
    });

    setShowMenuStatusUpdates(null);
  };

  const deleteOrder = async (id) => {
    await axios
      .delete(`http://localhost:5000/api/order/${id}`)
      .then(({ data }) => {
        const newData = orders.filter((item) => item._id !== id);
        setOrders(newData);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-4">Pesanan</h1>

      <div className="flex flex-col gap-y-6">
        {orders &&
          orders.map((order, key) => {
            return (
              <div key={key}>
                <div className="flex justify-between items-center pb-4 border-b">
                  {/* Tracking receipt / No.Resi */}
                  <div>
                    <p className="text-xs text-[#606060]">No. Resi:</p>
                    <p className="text-base font-medium">
                      {order.trackingReceipt}
                    </p>
                  </div>

                  {/* Order status */}
                  {order.status === "belum bayar" ? (
                    <span className="px-3 py-1.5 bg-[#ECEFF1] rounded-full first-letter:uppercase text-xs text-[#546E7A] font-semibold">
                      {order.status}
                    </span>
                  ) : order.status === "sedang dikemas" ? (
                    <span className="px-3 py-1.5 bg-[#FFE0B2] rounded-full first-letter:uppercase text-xs text-[#F57C00] font-semibold">
                      {order.status}
                    </span>
                  ) : order.status === "dikirim" ? (
                    <span className="px-3 py-1.5 bg-[#BBDEFB] rounded-full first-letter:uppercase text-xs text-[#1976D2] font-semibold">
                      {order.status}
                    </span>
                  ) : order.status === "selesai" ? (
                    <span className="px-3 py-1.5 bg-[#C8E6C9] rounded-full first-letter:uppercase text-xs text-[#388E3C] font-semibold">
                      {order.status}
                    </span>
                  ) : order.status === "selesai" ? (
                    <span className="px-3 py-1.5 bg-[#FFCDD2] rounded-full first-letter:uppercase text-xs text-[#D32F2F] font-semibold">
                      {order.status}
                    </span>
                  ) : null}
                </div>

                <div
                  className={`grid ${
                    order.product.length > 1
                      ? "grid-cols-1 md:grid-cols-2 gap-x-12"
                      : "grid-cols-1"
                  } max-h-44 md:max-h-80 overflow-y-auto`}
                >
                  {order.product.map((prod, key) => {
                    return (
                      <div key={key} className="flex items-start gap-x-3 py-4">
                        <img
                          src={`http://localhost:5000/public/images/${prod.images[0]}`}
                          alt={prod.images[0]}
                          className="w-20 h-20 md:w-28 md:h-28 object-contain rounded-xl"
                        />

                        <div className="grow">
                          <h3 className="text-sm line-clamp-2">{prod.name}</h3>
                          <p className="text-xs text-[#606060] line-clamp-1">
                            Variasi:{" "}
                            <span>
                              {prod.variant.color}(
                              {`${prod.variant.size.length} cm x ${prod.variant.size.width} cm x ${prod.variant.size.height} cm`}
                              )
                            </span>
                          </p>
                          <p className="text-xs text-[#606060]">
                            x{prod.total}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold">
                            {prod.variant.size.price.toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            })}
                          </h3>
                          <p className="text-xs text-[#606060] text-right">
                            (
                            {(
                              prod.variant.size.price * prod.total
                            ).toLocaleString("id-ID", {
                              style: "currency",
                              currency: "IDR",
                            })}
                            )
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="flex justify-between items-center border-y py-4 overflow-x-auto md:overflow-visible">
                  <div className="hidden md:flex items-center gap-x-2">
                    {/* Detail button */}
                    <Link to={`/admin/order/detail/${order._id}`}>
                      <button
                        type="button"
                        className="flex items-center gap-x-2 py-2.5 px-4 text-sm text-[#0f0f0f] font-medium rounded-full transition-all active:scale-90 duration-300 bg-black/[.05] hover:bg-black/[.1] whitespace-nowrap"
                      >
                        <span className="text-lg text-[#0f0f0f]">
                          <FiInfo />
                        </span>
                        Detail
                      </button>
                    </Link>

                    <DropdownSelect
                      id={"update-status-menu" + key}
                      minWidth="min-w-48"
                      button={
                        <button
                          type="button"
                          className="group flex items-center gap-x-2 py-2.5 px-4 text-sm text-[#0f0f0f] font-medium rounded-full transition-all active:scale-90 duration-300 bg-black/[.05] hover:bg-black/[.1] whitespace-nowrap"
                        >
                          <span className="text-lg text-[#0f0f0f]">
                            <GrDeliver />
                          </span>
                          Update status
                          <span className="hidden group-hover:block text-base text-[#0f0f0f]">
                            <IoChevronDownOutline />
                          </span>
                        </button>
                      }
                      selectMenu={[
                        {
                          label: "Belum bayar",
                          value: "belum bayar",
                          handleMenuClicked: () =>
                            handleOrderStatus(order?._id, "belum bayar"),
                        },
                        {
                          label: "Sedang dikemas",
                          value: "sedang dikemas",
                          handleMenuClicked: () =>
                            handleOrderStatus(order?._id, "sedang dikemas"),
                        },
                        {
                          label: "Dikirim",
                          value: "dikirim",
                          handleMenuClicked: () =>
                            handleOrderStatus(order?._id, "dikirim"),
                        },
                        {
                          label: "Selesai",
                          value: "selesai",
                          handleMenuClicked: () =>
                            handleOrderStatus(order?._id, "selesai"),
                        },
                        {
                          label: "Dibatalkan",
                          value: "dibatalkan",
                          handleMenuClicked: () =>
                            handleOrderStatus(order?._id, "dibatalkan"),
                        },
                      ]}
                      defaultValue={order?.status}
                    />

                    {/* Edit button */}
                    <button
                      type="button"
                      className="flex items-center gap-x-2 py-2.5 px-4 text-sm text-[#0f0f0f] font-medium rounded-full transition-all active:scale-90 duration-300 bg-black/[.05] hover:bg-black/[.1] whitespace-nowrap"
                    >
                      <span className="text-lg text-[#0f0f0f]">
                        <HiOutlinePencil />
                      </span>
                      Edit
                    </button>

                    {/* Delete button */}
                    <button
                      type="button"
                      onClick={() => deleteOrder(order._id)}
                      className="flex items-center gap-x-2 py-2.5 px-4 text-sm text-[#0f0f0f] font-medium rounded-full transition-all active:scale-90 duration-300 bg-black/[.05] hover:bg-black/[.1] whitespace-nowrap"
                    >
                      <span className="text-lg text-[#0f0f0f]">
                        <HiOutlineTrash />
                      </span>
                      Hapus
                    </button>
                  </div>

                  {/* Total product */}
                  <h3 className="text-sm line-clamp-1">
                    Total pesanan ({order.product.length} barang):{" "}
                    <span className="font-bold">
                      {order.totalPrice.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </span>
                  </h3>

                  <div className="block md:hidden">
                    <Dropdown
                      id={"action-menu" + key}
                      button={
                        <IconButton>
                          <IoMdMore className="text-lg" />
                        </IconButton>
                      }
                      selectMenu={[
                        {
                          type: "link",
                          url: `/admin/order/detail/${order._id}`,
                          icon: <FiInfo />,
                          label: "Detail",
                        },
                        {
                          type: "menu-select",
                          icon: <GrDeliver />,
                          label: "Update status",
                          selectMenu: [
                            {
                              label: "Belum bayar",
                              value: "belum bayar",
                              handleMenuClicked: () =>
                                handleOrderStatus(order?._id, "belum bayar"),
                            },
                            {
                              label: "Sedang dikemas",
                              value: "sedang dikemas",
                              handleMenuClicked: () =>
                                handleOrderStatus(order?._id, "sedang dikemas"),
                            },
                            {
                              label: "Dikirim",
                              value: "dikirim",
                              handleMenuClicked: () =>
                                handleOrderStatus(order?._id, "dikirim"),
                            },
                            {
                              label: "Selesai",
                              value: "selesai",
                              handleMenuClicked: () =>
                                handleOrderStatus(order?._id, "selesai"),
                            },
                            {
                              label: "Dibatalkan",
                              value: "dibatalkan",
                              handleMenuClicked: () =>
                                handleOrderStatus(order?._id, "dibatalkan"),
                            },
                          ],
                          defaultValue: order?.status,
                        },
                        {
                          icon: <HiOutlinePencil />,
                          label: "Edit",
                        },
                        {
                          icon: <HiOutlineTrash />,
                          label: "Hapus",
                          handleMenuClicked: () => deleteOrder(order._id),
                        },
                      ]}
                    />
                  </div>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Order;
