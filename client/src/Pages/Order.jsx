import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";
import { GrDeliver } from "react-icons/gr";
import axios from "axios";
import { Link } from "react-router-dom";
import DropdownSelect from "../Components/DropdownSelect";
import IconButton from "../Components/IconButton";
import { IoMdMore } from "react-icons/io";
import Dropdown from "../Components/Dropdown";
import { MdOutlineCancel } from "react-icons/md";
import Loader from "../Components/Loader";
import Filter from "../Components/Filter";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);

    const getAllOrders = async () => {
      await axios
        .get("http://localhost:5000/api/order")
        .then(({ data }) => {
          setOrders(data.results);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    getAllOrders();
  }, []);

  const handleOrderStatus = async (id, status) => {
    setIsLoading(true);

    const { data } = await axios.put(
      `http://localhost:5000/api/order/status/${id}`,
      {
        status: status,
      }
    );

    setOrders((prev) => {
      return prev.map((item) => {
        return item.id === id ? { ...item, status: data.results.status } : item;
      });
    });

    setIsLoading(false);
  };

  const handleCancelOrder = async (id) => {
    setIsLoading(true);

    await axios
      .put(`http://localhost:5000/api/order/cancel/${id}`)
      .then(({ data }) => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <Loader />}

      <h1 className="text-[28px] leading-9 font-medium mb-4">Pesanan</h1>

      {/* Search and filter */}
      <div className="border-y py-3 mb-5">
        <h5 className="text-sm font-semibold mb-2.5">Filter berdasarkan:</h5>

        <div className="flex items-center gap-x-2 overflow-x-auto md:overflow-visible">
          {/* Resi Filter */}
          <Filter
            id="resi-filter"
            headerTitle="No. Resi"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                No. Resi
              </button>
            }
          >
            <label htmlFor="resi" className="block text-xs font-medium">
              Masukkan nomor resi
            </label>

            <input
              autoFocus
              id="resi"
              type="text"
              placeholder="No. Resi"
              className="outline-none pt-3 pb-1 text-sm border-b w-full"
              // value={titleParams}
              // onChange={(e) => setTitleParams(e.target.value)}
            />
          </Filter>

          {/* Status Filter */}
          <Filter
            id="status-filter"
            headerTitle="Status pesanan"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                Status pesanan
              </button>
            }
          >
            {/* Not paid checkbox */}
            <label
              htmlFor="not-paid"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="not-paid"
                type="checkbox"
                value="belum_bayar"
                // onChange={(e) => setTitleParams(e.target.value)}
              />
              Belum bayar
            </label>

            {/* Packed checkbox */}
            <label
              htmlFor="packed"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="packed"
                type="checkbox"
                value="sedang_dikemas"
                // onChange={(e) => setTitleParams(e.target.value)}
              />
              Sedang dikemas
            </label>

            {/* Delivered checkbox */}
            <label
              htmlFor="delivered"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="delivered"
                type="checkbox"
                value="dikirim"
                // onChange={(e) => setTitleParams(e.target.value)}
              />
              Dikirim
            </label>

            {/* Finish checkbox */}
            <label
              htmlFor="finish"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="finish"
                type="checkbox"
                value="selesai"
                // onChange={(e) => setTitleParams(e.target.value)}
              />
              Selesai
            </label>

            {/* Cancel checkbox */}
            <label
              htmlFor="cancel"
              className="block flex items-center gap-x-3 text-xs font-medium mb-2.5"
            >
              <input
                id="cancel"
                type="checkbox"
                value="dibatalkan"
                // onChange={(e) => setTitleParams(e.target.value)}
              />
              Dibatalkan
            </label>
          </Filter>

          {/* Customer Name Filter */}
          <Filter
            id="name-filter"
            headerTitle="Nama pemesan"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                Nama pemesan
              </button>
            }
          >
            <label htmlFor="name" className="block text-xs font-medium">
              Masukkan nama pemesan
            </label>

            <input
              autoFocus
              id="name"
              type="text"
              placeholder="Nama pemesan"
              className="outline-none pt-3 pb-1 text-sm border-b w-full"
              // value={titleParams}
              // onChange={(e) => setTitleParams(e.target.value)}
            />
          </Filter>

          {/* Order Date Filter */}
          <Filter
            id="date-filter"
            headerTitle="Tanggal pemesanan"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                Tanggal pemesanan
              </button>
            }
          >
            <label htmlFor="date" className="block text-xs font-medium">
              Masukkan tanggal pemesanan
            </label>

            <input
              autoFocus
              id="date"
              type="date"
              className="outline-none pt-3 pb-1 text-sm border-b w-full"
              // value={titleParams}
              // onChange={(e) => setTitleParams(e.target.value)}
            />
          </Filter>
        </div>
      </div>

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
                      {order?.trackingReceipt}
                    </p>
                  </div>

                  {/* Order status */}
                  {order?.status === "belum_bayar" ? (
                    <span className="px-3 py-1.5 bg-[#ECEFF1] rounded-full first-letter:uppercase text-xs text-[#546E7A] font-semibold">
                      {order?.status?.split("_").join(" ")}
                    </span>
                  ) : order?.status === "sedang_dikemas" ? (
                    <span className="px-3 py-1.5 bg-[#FFE0B2] rounded-full first-letter:uppercase text-xs text-[#F57C00] font-semibold">
                      {order?.status?.split("_").join(" ")}
                    </span>
                  ) : order?.status === "dikirim" ? (
                    <span className="px-3 py-1.5 bg-[#BBDEFB] rounded-full first-letter:uppercase text-xs text-[#1976D2] font-semibold">
                      {order?.status?.split("_").join(" ")}
                    </span>
                  ) : order?.status === "selesai" ? (
                    <span className="px-3 py-1.5 bg-[#C8E6C9] rounded-full first-letter:uppercase text-xs text-[#388E3C] font-semibold">
                      {order?.status?.split("_").join(" ")}
                    </span>
                  ) : order?.status === "dibatalkan" ? (
                    <span className="px-3 py-1.5 bg-[#FFCDD2] rounded-full first-letter:uppercase text-xs text-[#D32F2F] font-semibold">
                      {order?.status?.split("_").join(" ")}
                    </span>
                  ) : null}
                </div>

                <div
                  className={`grid ${
                    order?.orderProducts?.length > 1
                      ? "grid-cols-1 md:grid-cols-2 gap-x-12"
                      : "grid-cols-1"
                  } max-h-44 md:max-h-80 overflow-y-auto`}
                >
                  {order?.orderProducts?.map((prod, key) => {
                    return (
                      <div key={key} className="flex items-start gap-x-3 py-4">
                        <img
                          src={`http://localhost:5000/public/images/${prod?.productVariant?.product?.images[0]?.name}`}
                          alt={prod?.productVariant?.product?.images[0]?.name}
                          className="w-20 h-20 md:w-28 md:h-28 object-contain rounded-xl"
                        />

                        <div className="grow">
                          <h3 className="text-sm line-clamp-2">
                            {prod?.productVariant?.product?.name}
                          </h3>
                          <p className="text-xs text-[#606060] line-clamp-1">
                            Variasi:{" "}
                            <span>
                              {prod?.productVariant?.color}(
                              {`${prod?.productVariant?.length} cm x ${prod?.productVariant?.width} cm x ${prod?.productVariant?.height} cm`}
                              )
                            </span>
                          </p>
                          <p className="text-xs text-[#606060]">
                            x{prod?.quantity}
                          </p>
                        </div>

                        <div>
                          <h3 className="text-sm font-bold">
                            {prod?.productVariant?.price?.toLocaleString(
                              "id-ID",
                              {
                                style: "currency",
                                currency: "IDR",
                              }
                            )}
                          </h3>
                          <p className="text-xs text-[#606060] text-right">
                            (
                            {(
                              prod?.productVariant?.price * prod?.quantity
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
                    <Link to={`/admin/order/detail/${order?.id}`}>
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

                    {order?.status !== "dibatalkan" && (
                      <>
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
                              value: "belum_bayar",
                              handleMenuClicked: () =>
                                handleOrderStatus(order?.id, "belum_bayar"),
                            },
                            {
                              label: "Sedang dikemas",
                              value: "sedang_dikemas",
                              handleMenuClicked: () =>
                                handleOrderStatus(order?.id, "sedang_dikemas"),
                            },
                            {
                              label: "Dikirim",
                              value: "dikirim",
                              handleMenuClicked: () =>
                                handleOrderStatus(order?.id, "dikirim"),
                            },
                            {
                              label: "Selesai",
                              value: "selesai",
                              handleMenuClicked: () =>
                                handleOrderStatus(order?.id, "selesai"),
                            },
                          ]}
                          defaultValue={order?.status}
                        />

                        {/* Cancel order button */}
                        <button
                          type="button"
                          onClick={() => handleCancelOrder(order?.id)}
                          className="flex items-center gap-x-2 py-2.5 px-4 text-sm text-[#0f0f0f] font-medium rounded-full transition-all active:scale-90 duration-300 bg-black/[.05] hover:bg-black/[.1] whitespace-nowrap"
                        >
                          <span className="text-lg text-[#0f0f0f]">
                            <MdOutlineCancel />
                          </span>
                          Batal pemesanan
                        </button>
                      </>
                    )}
                  </div>

                  {/* Total product */}
                  <h3 className="text-sm line-clamp-1">
                    Total pesanan ({order?.orderProducts?.length} barang):{" "}
                    <span className="font-bold">
                      {order?.totalPrice?.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </span>
                  </h3>

                  <div className="block md:hidden">
                    <Dropdown
                      id={"action-menu" + key}
                      button={
                        <IconButton type="button" buttonType="icon">
                          <IoMdMore className="text-lg" />
                        </IconButton>
                      }
                      selectMenu={
                        order?.status === "dibatalkan"
                          ? [
                              {
                                type: "link",
                                url: `/admin/order/detail/${order?.id}`,
                                icon: <FiInfo />,
                                label: "Detail",
                              },
                            ]
                          : [
                              {
                                type: "link",
                                url: `/admin/order/detail/${order?.id}`,
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
                                    value: "belum_bayar",
                                    handleMenuClicked: () =>
                                      handleOrderStatus(
                                        order?.id,
                                        "belum_bayar"
                                      ),
                                  },
                                  {
                                    label: "Sedang dikemas",
                                    value: "sedang_dikemas",
                                    handleMenuClicked: () =>
                                      handleOrderStatus(
                                        order?.id,
                                        "sedang_dikemas"
                                      ),
                                  },
                                  {
                                    label: "Dikirim",
                                    value: "dikirim",
                                    handleMenuClicked: () =>
                                      handleOrderStatus(order?.id, "dikirim"),
                                  },
                                  {
                                    label: "Selesai",
                                    value: "selesai",
                                    handleMenuClicked: () =>
                                      handleOrderStatus(order?.id, "selesai"),
                                  },
                                ],
                                defaultValue: order?.status,
                              },
                              {
                                icon: <MdOutlineCancel />,
                                label: "Batal pemesanan",
                                handleMenuClicked: () =>
                                  handleCancelOrder(order?.id),
                              },
                            ]
                      }
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
