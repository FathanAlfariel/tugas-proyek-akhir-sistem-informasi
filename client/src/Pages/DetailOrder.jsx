import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";
import { GoPerson } from "react-icons/go";
import { IoCallOutline } from "react-icons/io5";
import Loader from "../Components/Loader";
import { BsFileText } from "react-icons/bs";
import { MdMoneyOff } from "react-icons/md";
import { PiPackage } from "react-icons/pi";
import { AiOutlineTruck } from "react-icons/ai";
import { IoIosArrowBack, IoIosCheckmarkCircleOutline } from "react-icons/io";
import HomePageHeader from "../Components/HomePageHeader";

const DetailOrder = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const [orderDetail, setOrderDetail] = useState({});

  useEffect(() => {
    setIsLoading(true);

    const getOrderDataById = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/order/${id}`)
        .then(({ data }) => {
          setOrderDetail(data.results);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    getOrderDataById();
  }, []);

  return (
    <>
      {isLoading && <Loader />}

      <header className="flex items-center bg-white py-4 mx-4 md:mx-6 z-10 bg-white">
        <div className="block md:hidden">
          <Link to="/" className="flex items-center gap-x-2">
            <IoIosArrowBack className="text-xl" />

            <p className="text-sm font-medium">Kembali ke halaman utama</p>
          </Link>
        </div>

        <div className="hidden md:block w-full">
          <HomePageHeader />
        </div>
      </header>

      <main className="max-w-screen-xl mt-3 mx-6 lg:mx-auto mb-8">
        <h1 className="text-2xl md:text-[28px] leading-9 font-medium mb-4">
          Detail pesanan
        </h1>

        <div className="flex justify-between items-start">
          {/* Receipt number */}
          <h3 className="text-lg md:text-xl font-medium line-clamp-1">
            No. Resi: {orderDetail?.trackingReceipt}
          </h3>
        </div>

        {/* Tanggal pemesanan dilakukan */}
        <p className="text-xs md:text-sm text-[#606060] mt-3 md:mt-1">
          Dibuat pada:{" "}
          {new Date(orderDetail?.createdAt).toLocaleString("id-ID", {
            dateStyle: "full",
            timeStyle: "short",
          })}
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 mt-5">
          <div className="flex flex-col gap-y-4">
            <div className="p-4 rounded-2xl border border-black/[.1]">
              {/* Orderer's name */}
              <div className="flex flex-col gap-y-2.5">
                {/* Title */}
                <h5 className="text-lg font-semibold">Pemesan</h5>

                <div className="flex items-center gap-x-2">
                  <span>
                    <GoPerson className="text-lg" />
                  </span>
                  <p className="text-sm">{orderDetail?.name}</p>
                </div>
              </div>

              {/* Orderer's contact */}
              <div className="flex flex-col gap-y-2.5 mt-5">
                {/* Title */}
                <h5 className="text-lg font-semibold">Informasi kontak</h5>

                <div className="flex items-center gap-x-2">
                  <span>
                    <IoCallOutline className="text-lg" />
                  </span>
                  <p className="text-sm">{orderDetail?.phone}</p>
                </div>
              </div>

              {/* Shipping address */}
              <div className="flex flex-col gap-y-2.5 mt-5">
                {/* Title */}
                <h5 className="text-lg font-semibold">Alamat pengiriman</h5>

                <div className="flex flex-col gap-y-0.5">
                  <p className="text-sm">
                    {orderDetail?.address?.address}{" "}
                    {orderDetail?.address?.otherDetails !== ""
                      ? orderDetail?.address?.otherDetails
                      : null}
                  </p>
                  <p className="text-sm">
                    {orderDetail?.address?.city},{" "}
                    {orderDetail?.address?.postalCode}
                  </p>
                  <p className="text-sm">
                    {orderDetail?.address?.province},{" "}
                    {orderDetail?.address?.country}
                  </p>
                </div>
              </div>
            </div>

            {/* Ordered products */}
            <div className="flex flex-col gap-y-4 p-4 rounded-2xl border border-black/[.1]">
              {/* Title */}
              <h5 className="text-lg font-semibold">Produk yang dipesan</h5>

              <div className="flex flex-col gap-y-3 max-h-56 overflow-y-auto">
                {/* List of products purchased */}
                {orderDetail?.orderProducts?.map((prod, key) => {
                  return (
                    <div key={key} className="flex items-start gap-x-3">
                      <div className="shrink-0">
                        <img
                          src={`${
                            import.meta.env.VITE_API_BASE_URL
                          }/public/images/${
                            prod?.productVariant?.product?.images[0]?.name
                          }`}
                          alt={prod?.productVariant?.product?.images[0]?.name}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-xl object-cover"
                        />
                      </div>

                      <div className="grow flex flex-col gap-y-0.5 py-0.5 md:py-1">
                        <p className="text-sm line-clamp-1 md:line-clamp-2">
                          {prod?.productVariant?.product?.name}
                        </p>
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
                          {prod?.productVariant?.price.toLocaleString("id-ID", {
                            style: "currency",
                            currency: "IDR",
                          })}
                        </h3>
                        <p className="text-xs text-[#606060] text-right">
                          (
                          {(
                            prod?.productVariant?.price * prod.quantity
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
            </div>

            {/* Order price details */}
            <div className="rounded-2xl border border-black/[.1] overflow-hidden">
              {/* Title */}
              <div className="p-4">
                <h5 className="text-lg font-semibold">Detail harga pesanan</h5>
              </div>

              {/* Price details */}
              <div className="flex flex-col gap-y-2 px-4 pt-2 pb-3">
                {/* Subtotal */}
                <div className="flex justify-between items-center text-sm">
                  Subtotal
                  <span>
                    {orderDetail?.subTotal?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </span>
                </div>

                {/* Discount */}
                <div className="flex justify-between items-center text-sm">
                  Discount
                  <span>
                    -
                    {orderDetail?.discount?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </span>
                </div>

                {/* Shipping fee */}
                <div className="flex justify-between items-center text-sm">
                  Biaya ongkir
                  <span>
                    {orderDetail?.shippingFee?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </span>
                </div>

                {/* Total */}
                <div className="flex justify-between items-center text-sm font-medium">
                  Total
                  <span>
                    {orderDetail?.totalPrice?.toLocaleString("id-ID", {
                      style: "currency",
                      currency: "IDR",
                    })}
                  </span>
                </div>
              </div>

              {/* Payment and shipping method */}
              <div className="flex flex-col gap-y-2 p-4 border-t border-t-black/[.1]">
                {/* Payment method */}
                <div className="flex justify-between items-center">
                  <p className="text-sm">Metode pembayaran</p>
                  <span className="text-sm">{orderDetail?.paymentMethod}</span>
                </div>

                {/* Shipping method */}
                <div className="flex justify-between items-center">
                  <p className="text-sm">Metode pengiriman</p>
                  <span className="text-sm">{orderDetail?.shippingMethod}</span>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-y-4 mt-4 md:mt-0">
            {/* Additional note */}
            <div className="flex flex-col gap-y-2.5 p-4 rounded-2xl border border-black/[.1]">
              {/* Title */}
              <h5 className="text-lg font-semibold">Catatan</h5>

              <p className="text-sm">
                {orderDetail?.additionalNotes
                  ? orderDetail?.additionalNotes
                  : "Tidak ada catatan"}
              </p>
            </div>

            {/* Order history*/}
            <div className="flex flex-col gap-y-2.5 p-4 rounded-2xl border border-black/[.1]">
              {/* Title */}
              <h5 className="text-lg font-semibold">Riwayat pesanan</h5>

              <ul className="flex flex-col gap-y-4">
                {orderDetail?.orderStatus?.map((status, key) => {
                  const order_status = status?.status?.split("_").join(" ");

                  return (
                    <li key={key} className="flex items-start gap-x-3">
                      <div className="mt-0.5">
                        {status?.status === "belum_bayar" ? (
                          <MdMoneyOff
                            className={`text-lg ${
                              status?.status === orderDetail?.status
                                ? "text-green-500"
                                : "text-zinc-500"
                            }`}
                          />
                        ) : status?.status === "sedang_dikemas" ? (
                          <PiPackage
                            className={`text-lg ${
                              status?.status === orderDetail?.status
                                ? "text-green-500"
                                : "text-zinc-500"
                            }`}
                          />
                        ) : status?.status === "dikirim" ? (
                          <AiOutlineTruck
                            className={`text-lg ${
                              status?.status === orderDetail?.status
                                ? "text-green-500"
                                : "text-zinc-500"
                            }`}
                          />
                        ) : status?.status === "selesai" ? (
                          <IoIosCheckmarkCircleOutline
                            className={`text-lg ${
                              status?.status === orderDetail?.status
                                ? "text-green-500"
                                : "text-zinc-500"
                            }`}
                          />
                        ) : null}
                      </div>

                      <div>
                        <p
                          className={`capitalize text-xs md:text-sm font-medium ${
                            status?.status === orderDetail?.status
                              ? "text-green-500"
                              : "text-zinc-500"
                          }`}
                        >
                          {order_status}
                        </p>
                        <p
                          className={`text-xs md:text-sm ${
                            status?.status === orderDetail?.status
                              ? "text-green-500"
                              : "text-zinc-500"
                          }`}
                        >
                          {status?.status === "belum_bayar"
                            ? "Pesanan Anda belum diproses. Silakan selesaikan pembayaran agar pesanan dapat segera diproses."
                            : status?.status === "sedang_dikemas"
                            ? "Pesanan Anda sedang diproses dan dikemas."
                            : status?.status === "dikirim"
                            ? "Pesanan Anda sedang dalam perjalanan menuju alamat tujuan."
                            : status?.status === "selesai"
                            ? "Pesanan Anda telah berhasil diterima."
                            : null}
                        </p>
                        <p
                          className={`text-xs md:text-sm mt-0.5 ${
                            status?.status === orderDetail?.status
                              ? "text-green-500"
                              : "text-zinc-500"
                          }`}
                        >
                          {new Date(status?.createdAt).toLocaleString("id-ID", {
                            dateStyle: "full",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                    </li>
                  );
                })}
                <li className="flex items-start gap-x-3">
                  <div className="mt-0.5">
                    <BsFileText className="text-lg text-zinc-500" />
                  </div>

                  <div>
                    <p className="text-xs md:text-sm text-zinc-500 font-medium">
                      Pesanan Dibuat
                    </p>
                    <p className="text-xs md:text-sm text-zinc-500">
                      Pesanan Dibuat
                    </p>
                    <p className="text-xs md:text-sm text-zinc-500 mt-0.5">
                      {new Date(orderDetail?.createdAt).toLocaleString(
                        "id-ID",
                        {
                          dateStyle: "full",
                          timeStyle: "short",
                        }
                      )}
                    </p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default DetailOrder;
