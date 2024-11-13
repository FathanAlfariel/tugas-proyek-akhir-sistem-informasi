import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderDetail = () => {
  const { id } = useParams();

  const [orderDetail, setOrderDetail] = useState([]);

  useEffect(() => {
    const getOrderDataById = async () => {
      await axios
        .get(`http://localhost:5000/api/order/${id}`)
        .then(({ data }) => {
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getOrderDataById();
  });

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-4">Detail pesanan</h1>
    </>
  );
};

export default OrderDetail;
