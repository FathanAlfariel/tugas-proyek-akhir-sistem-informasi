import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import Button from "../Components/Button";
import { IoChevronDownOutline, IoCheckmarkSharp } from "react-icons/io5";
import { GrDeliver } from "react-icons/gr";
import axios from "axios";

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
                  <span className="px-3 py-1.5 bg-[#6750A4]/[.12] rounded-full first-letter:uppercase text-xs text-[#6750A4] font-semibold">
                    {order.status}
                  </span>
                </div>

                <div
                  className={`grid ${
                    order.product.length > 1
                      ? "grid-cols-2 gap-x-12"
                      : "grid-cols-1"
                  } `}
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
                          <p className="text-xs text-[#606060]">
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

                <div className="flex justify-between items-center border-y py-4">
                  <div className="flex items-center gap-x-2">
                    {/* Detail button */}
                    <Button
                      type="button"
                      buttonStyle="tonal-button-with-icon"
                      icon={<FiInfo />}
                    >
                      Detail
                    </Button>

                    {/* Update status button */}
                    <div id="update-status-menu" className="relative">
                      <button
                        type="button"
                        className="group flex items-center gap-x-2 py-2.5 px-4 text-sm text-[#1D192B] font-medium rounded-full transition-all active:scale-90 duration-300 bg-[#E8DEF8] shadow-none hover:shadow-md"
                        onClick={() => handleShowMenuStatusUpdates(order._id)}
                      >
                        <span className="text-lg text-[#1D192B]">
                          <GrDeliver />
                        </span>
                        Update status
                        <span className="text-base text-[#1D192B]">
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
                                  handleChangeVisibility(
                                    order?._id,
                                    "belum bayar"
                                  )
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
                                  handleChangeVisibility(
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
                                  handleChangeVisibility(order?._id, "dikirim")
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
                                  handleChangeVisibility(order?._id, "selesai")
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
                                  handleChangeVisibility(
                                    order?._id,
                                    "dibatalkan"
                                  )
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
                  </div>

                  {/* Total product */}
                  <h3 className="text-base line-clamp-2">
                    Total pesanan ({order.product.length} barang):{" "}
                    <span className="font-bold">Rp. 10.000,00</span>
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
