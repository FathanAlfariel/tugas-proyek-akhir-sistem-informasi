import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Components/Loader";

const ShipmentReceipt = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);

  const [orderDetail, setOrderDetail] = useState([]);

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

  console.log(orderDetail);

  return (
    <>
      {isLoading && <Loader />}

      <div className="flex justify-center">
        <div className="border border-black pb-5">
          {/* Logo */}
          <div className="px-6">
            <img
              src="/logo.png"
              alt="logo"
              className="w-20 h-20 object-contain"
            />
          </div>

          {/* Buyer and Seller Address */}
          <div className="px-6 flex items-start gap-x-6 border-t border-dashed border-black pt-4">
            {/* Buyer Address */}
            <div>
              <p className="text-sm font-medium">
                Penerima: {orderDetail?.name}
              </p>
              <p className="text-sm">{orderDetail?.phone}</p>
              <p className="text-sm">
                {orderDetail?.address?.address}{" "}
                <span className="before:content-['('] after:content-[')']">
                  {orderDetail?.address?.otherDetails !== ""
                    ? orderDetail?.address?.otherDetails
                    : null}
                </span>
              </p>
              <p className="text-sm">
                {orderDetail?.address?.city}, {orderDetail?.address?.postalCode}
              </p>
              <p className="text-sm">
                {orderDetail?.address?.province},{" "}
                {orderDetail?.address?.country}
              </p>
            </div>

            {/* Seller Address */}
            <div>
              <p className="text-sm font-medium">Pengirim: WarniCollection</p>
              <p className="text-sm">6281331432858</p>
            </div>
          </div>

          {/* Payment Method and Additional Notes */}
          <div className="px-6 flex flex-col gap-0.5 mt-4">
            <div className="flex items-center gap-x-0.5">
              <div className="w-full py-0.5 flex justify-center text-sm uppercase border border-black">
                {orderDetail?.address?.city}
              </div>
              <div className="w-full py-0.5 flex justify-center text-sm uppercase border border-black">
                {orderDetail?.address?.province}
              </div>
            </div>

            <div className="flex gap-x-0.5">
              <div className="w-full py-0.5 flex justify-center text-sm font-medium border border-black">
                {orderDetail?.paymentMethod}
              </div>
              <div className="w-full py-0.5 flex justify-center text-sm font-medium border border-black">
                {orderDetail?.shippingMethod}
              </div>
            </div>

            <div className="min-h-[26px] py-0.5 flex items-center justify-center border border-black">
              {orderDetail?.additionalNotes !== "" ? (
                <p className="before:content-['*'] text-xs italic">
                  Catatan:
                  <span>{orderDetail?.additionalNotes}</span>
                </p>
              ) : (
                <p className="text-xs italic">Tidak ada catatan tambahan</p>
              )}
            </div>
          </div>

          {/* Price details */}
          <div className="px-6 flex flex-col gap-y-px border-t border-dashed border-black pt-4 mt-4">
            {/* Subtotal */}
            <div className="flex justify-between items-center text-xs">
              Subtotal
              <span>
                {orderDetail?.subTotal?.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </span>
            </div>

            {/* Discount */}
            <div className="flex justify-between items-center text-xs">
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
            <div className="flex justify-between items-center text-xs">
              Biaya ongkir
              <span>
                {orderDetail?.shippingFee?.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </span>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center text-xs font-semibold">
              Total
              <span>
                {orderDetail?.totalPrice?.toLocaleString("id-ID", {
                  style: "currency",
                  currency: "IDR",
                })}
              </span>
            </div>
          </div>

          {/* Order's Product */}
          <div className="px-6 flex items-start gap-x-6 border-t border-dashed border-black pt-4 mt-4">
            <table>
              <thead>
                <tr>
                  <th className="pr-6 text-xs font-medium text-left">#</th>
                  <th className="pr-6 text-xs font-medium text-left">
                    Nama Produk
                  </th>
                  <th className="pr-6 text-xs font-medium text-left">
                    Variasi
                  </th>
                  <th className="pr-6 text-xs font-medium text-left">Qty</th>
                </tr>
              </thead>
              <tbody>
                {orderDetail?.orderProducts?.map((product, key) => {
                  return (
                    <tr key={key} className="border-t border-black">
                      <td className="pr-6">
                        <p className="text-xs">{++key}</p>
                      </td>
                      <td className="pr-6">
                        <p className="text-xs line-clamp-2">
                          {product?.productVariant?.product?.name}
                        </p>
                      </td>
                      <td className="pr-6">
                        <p className="text-xs line-clamp-2">
                          {product?.productVariant?.color}
                        </p>
                      </td>
                      <td className="pr-6">
                        <p className="text-xs line-clamp-2">
                          {product?.quantity}
                        </p>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
};

export default ShipmentReceipt;
