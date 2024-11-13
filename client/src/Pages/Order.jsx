import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { IoChevronDownOutline, IoCheckmarkSharp } from "react-icons/io5";
import { GrDeliver } from "react-icons/gr";
import axios from "axios";
import { HiOutlineTrash, HiOutlinePencil } from "react-icons/hi2";

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
          console.log(data.results);
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

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-4">Pemesanan</h1>

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
                          className="w-28 h-28 object-contain rounded-xl border"
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
                  <div className="flex items-center gap-x-2">
                    {/* Detail button */}
                    <button
                      type="button"
                      className="flex items-center gap-x-2 py-2.5 px-4 text-sm text-[#0f0f0f] font-medium rounded-full transition-all active:scale-90 duration-300 bg-black/[.05] hover:bg-black/[.1] whitespace-nowrap"
                    >
                      <span className="text-lg text-[#0f0f0f]">
                        <FiInfo />
                      </span>
                      Detail
                    </button>

                    {/* Update status button */}
                    <div id="update-status-menu" className="relative">
                      <button
                        type="button"
                        className="group flex items-center gap-x-2 py-2.5 px-4 text-sm text-[#0f0f0f] font-medium rounded-full transition-all active:scale-90 duration-300 bg-black/[.05] hover:bg-black/[.1] whitespace-nowrap"
                        onClick={() => handleShowMenuStatusUpdates(order._id)}
                      >
                        <span className="text-lg text-[#0f0f0f]">
                          <GrDeliver />
                        </span>
                        Update status
                        <span className="hidden group-hover:block text-base text-[#0f0f0f]">
                          <IoChevronDownOutline />
                        </span>
                      </button>

                      {/* Update status menu */}
                      {showMenuStatusUpdates === order?._id && (
                        <div className="absolute top-0 left-0 shadow bg-white min-w-48 py-2.5 rounded-2xl border border-[#F1F1F1] z-10">
                          <ul className="flex flex-col gap-y-0.5">
                            <li>
                              <button
                                onClick={() =>
                                  handleOrderStatus(order?._id, "belum bayar")
                                }
                                className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]"
                              >
                                {order?.status === "belum bayar" ? (
                                  <span>
                                    <IoCheckmarkSharp className="text-xl" />
                                  </span>
                                ) : (
                                  <span>
                                    <IoCheckmarkSharp className="invisible text-xl" />
                                  </span>
                                )}
                                Belum bayar
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleOrderStatus(
                                    order?._id,
                                    "sedang dikemas"
                                  )
                                }
                                className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]"
                              >
                                {order?.status === "sedang dikemas" ? (
                                  <span>
                                    <IoCheckmarkSharp className="text-xl" />
                                  </span>
                                ) : (
                                  <span>
                                    <IoCheckmarkSharp className="invisible text-xl" />
                                  </span>
                                )}
                                Sedang dikemas
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleOrderStatus(order?._id, "dikirim")
                                }
                                className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]"
                              >
                                {order?.status === "dikirim" ? (
                                  <span>
                                    <IoCheckmarkSharp className="text-xl" />
                                  </span>
                                ) : (
                                  <span>
                                    <IoCheckmarkSharp className="invisible text-xl" />
                                  </span>
                                )}
                                Dikirim
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleOrderStatus(order?._id, "selesai")
                                }
                                className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]"
                              >
                                {order?.status === "selesai" ? (
                                  <span>
                                    <IoCheckmarkSharp className="text-xl" />
                                  </span>
                                ) : (
                                  <span>
                                    <IoCheckmarkSharp className="invisible text-xl" />
                                  </span>
                                )}
                                Selesai
                              </button>
                            </li>
                            <li>
                              <button
                                onClick={() =>
                                  handleOrderStatus(order?._id, "dibatalkan")
                                }
                                className="flex items-center gap-x-4 w-full pl-4 pr-6 py-2 text-left text-sm hover:bg-[#1D1B20]/[.08]"
                              >
                                {order?.status === "dibatalkan" ? (
                                  <span>
                                    <IoCheckmarkSharp className="text-xl" />
                                  </span>
                                ) : (
                                  <span>
                                    <IoCheckmarkSharp className="invisible text-xl" />
                                  </span>
                                )}
                                Dibatalkan
                              </button>
                            </li>
                          </ul>
                        </div>
                      )}
                    </div>

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
                      className="flex items-center gap-x-2 py-2.5 px-4 text-sm text-[#0f0f0f] font-medium rounded-full transition-all active:scale-90 duration-300 bg-black/[.05] hover:bg-black/[.1] whitespace-nowrap"
                    >
                      <span className="text-lg text-[#0f0f0f]">
                        <HiOutlineTrash />
                      </span>
                      Hapus
                    </button>
                  </div>

                  {/* Total product */}
                  <h3 className="text-sm line-clamp-2">
                    Total pesanan ({order.product.length} barang):{" "}
                    <span className="font-bold">
                      {order.totalPrice.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </span>
                  </h3>
                </div>
              </div>
            );
          })}
      </div>
    </>
  );
};

export default Order;
