import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { GoPerson } from "react-icons/go";
import { IoCallOutline } from "react-icons/io5";
import { TiPrinter } from "react-icons/ti";
import IconButton from "../Components/IconButton";

const OrderDetail = () => {
  const { id } = useParams();

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const getOrderDataById = async () => {
      await axios
        .get(`http://localhost:5000/api/order/${id}`)
        .then(({ data }) => {
          setOrderDetail(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getOrderDataById();
  }, []);

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-4">Detail pesanan</h1>

      <div className="flex justify-between items-start">
        {/* Receipt number and status */}
        <div className="flex flex-col md:flex-row items-start md:items-center gap-y-1.5 md:gap-y-0 gap-x-4">
          {/* No. Resi */}
          <h3 className="text-lg md:text-xl font-medium line-clamp-1">
            No. Resi: {orderDetail?.trackingReceipt}
          </h3>

          {/* Order status */}
          {orderDetail?.status === "belum bayar" ? (
            <span className="px-3 py-1.5 bg-[#ECEFF1] rounded-full first-letter:uppercase text-xs text-[#546E7A] font-semibold whitespace-nowrap">
              {orderDetail?.status}
            </span>
          ) : orderDetail?.status === "sedang dikemas" ? (
            <span className="px-3 py-1.5 bg-[#FFE0B2] rounded-full first-letter:uppercase text-xs text-[#F57C00] font-semibold whitespace-nowrap">
              {orderDetail?.status}
            </span>
          ) : orderDetail?.status === "dikirim" ? (
            <span className="px-3 py-1.5 bg-[#BBDEFB] rounded-full first-letter:uppercase text-xs text-[#1976D2] font-semibold whitespace-nowrap">
              {orderDetail?.status}
            </span>
          ) : orderDetail?.status === "selesai" ? (
            <span className="px-3 py-1.5 bg-[#C8E6C9] rounded-full first-letter:uppercase text-xs text-[#388E3C] font-semibold whitespace-nowrap">
              {orderDetail?.status}
            </span>
          ) : orderDetail?.status === "selesai" ? (
            <span className="px-3 py-1.5 bg-[#FFCDD2] rounded-full first-letter:uppercase text-xs text-[#D32F2F] font-semibold whitespace-nowrap">
              {orderDetail?.status}
            </span>
          ) : null}
        </div>

        {/* Print receipt button */}
        <IconButton type="button" buttonType="primary">
          <TiPrinter />
        </IconButton>
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
          {/* Ordered products */}
          <div className="flex flex-col gap-y-4 p-4 rounded-2xl border border-black/[.1]">
            {/* Title */}
            <h5 className="text-lg font-semibold">Produk yang dipesan</h5>

            {/* List of products purchased */}
            {orderDetail?.product?.map((prod, key) => {
              return (
                <div key={key} className="flex items-start gap-x-3">
                  <img
                    src={`http://localhost:5000/public/images/${prod.images[0]}`}
                    alt={prod.images[0]}
                    className="w-20 h-20 rounded-xl object-cover"
                  />

                  <div className="grow flex flex-col gap-y-0.5 py-1">
                    <p className="text-sm line-clamp-2">{prod.name}</p>
                    <p className="text-xs text-[#606060] line-clamp-1">
                      Variasi:{" "}
                      <span>
                        {prod.variant.color}(
                        {`${prod.variant.size.length} cm x ${prod.variant.size.width} cm x ${prod.variant.size.height} cm`}
                        )
                      </span>
                    </p>
                    <p className="text-xs text-[#606060]">x{prod.total}</p>
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
                      {(prod.variant.size.price * prod.total).toLocaleString(
                        "id-ID",
                        {
                          style: "currency",
                          currency: "IDR",
                        }
                      )}
                      )
                    </p>
                  </div>
                </div>
              );
            })}
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
                  {orderDetail?.totalVariantPrice?.toLocaleString("id-ID", {
                    style: "currency",
                    currency: "IDR",
                  })}
                </span>
              </div>

              {/* Subtotal */}
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

            {/* Payment method */}
            <div className="flex justify-between items-center p-4 border-t border-t-black/[.1] text-sm">
              Metode pembayaran
              <span>COD</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-y-4 mt-4 md:mt-0">
          {/* Additional note */}
          <div className="flex flex-col gap-y-2.5 p-4 rounded-2xl border border-black/[.1]">
            {/* Title */}
            <h5 className="text-lg font-semibold">Catatan</h5>

            <p className="text-sm">Catatan tambahan</p>
          </div>

          {/* Orderer's name */}
          <div className="flex flex-col gap-y-2.5 p-4 rounded-2xl border border-black/[.1]">
            {/* Title */}
            <h5 className="text-lg font-semibold">Pemesan</h5>

            <div className="flex items-center gap-x-2">
              <span>
                <GoPerson className="text-lg" />
              </span>
              <p className="text-sm">{orderDetail?.name}</p>
            </div>
          </div>

          {/* Orderer's name */}
          <div className="flex flex-col gap-y-2.5 p-4 rounded-2xl border border-black/[.1]">
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
          <div className="flex flex-col gap-y-2.5 p-4 rounded-2xl border border-black/[.1]">
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
                {orderDetail?.address?.city}, {orderDetail?.address?.postalCode}
              </p>
              <p className="text-sm">
                {orderDetail?.address?.province},{" "}
                {orderDetail?.address?.country}
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderDetail;
