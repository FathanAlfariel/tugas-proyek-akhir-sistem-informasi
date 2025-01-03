import React, { useEffect, useState } from "react";
import { FiInfo } from "react-icons/fi";
import { IoChevronDownOutline } from "react-icons/io5";
import { GrDeliver } from "react-icons/gr";
import axios from "axios";
import { Link, useSearchParams } from "react-router-dom";
import DropdownSelect from "../Components/DropdownSelect";
import IconButton from "../Components/IconButton";
import { IoMdClose, IoMdMore } from "react-icons/io";
import Dropdown from "../Components/Dropdown";
import { MdOutlineCancel } from "react-icons/md";
import Loader from "../Components/Loader";
import Filter from "../Components/Filter";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [trackingReceiptParams, setTrackingReceiptParams] = useState(
    currentParams?.trackingReceipt || ""
  );
  const [orderStatusParams, setOrderStatusParams] = useState(
    currentParams?.orderStatus || []
  );
  const [nameParams, setNameParams] = useState(currentParams?.name || "");
  const [dateParams, setDateParams] = useState(currentParams?.date || "");

  // Get all orders
  useEffect(() => {
    setIsLoading(true);

    const getAllOrders = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/order?${searchParams}`)
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
  }, [searchParams]);

  const handleOrderStatus = async (id, status) => {
    setIsLoading(true);

    const { data } = await axios.put(
      `${import.meta.env.VITE_API_BASE_URL}/api/order/status/${id}`,
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
      .put(`${import.meta.env.VITE_API_BASE_URL}/api/order/cancel/${id}`)
      .then(({ data }) => {})
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const handleOrderStatusCheckboxChange = (e) => {
    const value = e.target.value;
    let updatedStatus;

    if (e.target.checked) {
      // Tambahkan status baru
      updatedStatus = [...orderStatusParams, value];
    } else {
      // Hapus status jika tidak dicentang
      updatedStatus = orderStatusParams.filter((status) => status !== value);
    }

    // Update state
    setOrderStatusParams(updatedStatus);
  };

  return (
    <>
      {isLoading && <Loader />}

      <h1 className="text-2xl md:text-[28px] leading-9 font-medium mb-3 md:mb-6">
        Pesanan
      </h1>

      {/* Filter */}
      <div className="border-y py-3 mb-5">
        <h5 className="text-sm font-semibold mb-2.5">Filter berdasarkan:</h5>

        <div className="flex items-center gap-x-2 overflow-x-auto md:overflow-visible">
          {/* Tracking Receipt Filter */}
          <Filter
            id="tracking-receipt-filter"
            headerTitle="No. Resi"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                {currentParams?.trackingReceipt ? (
                  <>
                    No. Resi: {currentParams.trackingReceipt}
                    <span
                      title="Hapus filter no.resi"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["trackingReceipt"];

                        setSearchParams(updatedParams);
                        setTrackingReceiptParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "No. Resi"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({
                ...currentParams,
                trackingReceipt: trackingReceiptParams,
              })
            }
            disabledButton={trackingReceiptParams === "" ? true : false}
          >
            <label
              htmlFor="tracking-receipt"
              className="block text-xs font-medium"
            >
              Masukkan nomor resi
            </label>

            <input
              autoFocus
              id="tracking-receipt"
              type="text"
              placeholder="No. Resi"
              className="outline-none pt-3 pb-1 text-sm border-b w-full"
              value={trackingReceiptParams}
              onChange={(e) => setTrackingReceiptParams(e.target.value)}
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
                {currentParams?.orderStatus ? (
                  <>
                    Status pesanan:{" "}
                    {currentParams?.orderStatus
                      .split(",") // Pisahkan berdasarkan koma
                      .map((item) => {
                        const formattedItem = item
                          .split("_") // Pisahkan berdasarkan underscore
                          .join(" "); // Gabungkan dengan spasi
                        return (
                          formattedItem.charAt(0).toUpperCase() +
                          formattedItem.slice(1)
                        ); // Kapitalisasi huruf pertama
                      })
                      .join(", ")}
                    <span
                      title="Hapus filter status pesanan"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["orderStatus"];

                        setSearchParams(updatedParams);
                        setOrderStatusParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Status pesanan"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({
                ...currentParams,
                orderStatus: orderStatusParams.join(","),
              })
            }
            disabledButton={orderStatusParams.length === 0 ? true : false}
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
                checked={orderStatusParams.includes("belum_bayar")}
                onChange={handleOrderStatusCheckboxChange}
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
                checked={orderStatusParams.includes("sedang_dikemas")}
                onChange={handleOrderStatusCheckboxChange}
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
                checked={orderStatusParams.includes("dikirim")}
                onChange={handleOrderStatusCheckboxChange}
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
                checked={orderStatusParams.includes("selesai")}
                onChange={handleOrderStatusCheckboxChange}
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
                checked={orderStatusParams.includes("dibatalkan")}
                onChange={handleOrderStatusCheckboxChange}
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
                {currentParams?.name ? (
                  <>
                    Nama pemesan: {currentParams?.name}
                    <span
                      title="Hapus filter nama pemesan"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["name"];

                        setSearchParams(updatedParams);
                        setNameParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Nama pemesan"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({
                ...currentParams,
                name: nameParams,
              })
            }
            disabledButton={nameParams === "" ? true : false}
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
              value={nameParams}
              onChange={(e) => setNameParams(e.target.value)}
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
                {currentParams?.date ? (
                  <>
                    Tanggal pemesanan: {currentParams?.date}
                    <span
                      title="Hapus filter tanggal pemesanan"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["date"];

                        setSearchParams(updatedParams);
                        setDateParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Tanggal pemesanan"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({
                ...currentParams,
                date: dateParams,
              })
            }
            disabledButton={dateParams === "" ? true : false}
          >
            <label htmlFor="date" className="block text-xs font-medium">
              Masukkan tanggal pemesanan
            </label>

            <input
              id="date"
              type="date"
              className="outline-none pt-3 pb-1 text-sm border-b w-full"
              value={dateParams}
              onChange={(e) => setDateParams(e.target.value)}
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
                          src={`${
                            import.meta.env.VITE_API_BASE_URL
                          }/public/images/${
                            prod?.productVariant?.product?.images[0]?.name
                          }`}
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

      {orders?.length === 0 && (
        <div className="text-sm text-center py-6 text-[#606060]">
          Tidak ada data yang ditemukan
        </div>
      )}
    </>
  );
};

export default Order;
