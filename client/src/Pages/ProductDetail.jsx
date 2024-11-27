import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Components/Loader";

const ProductDetail = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    setIsLoading(true);

    const fetchProductById = async () => {
      await axios
        .get(`http://localhost:5000/api/product/${id}`)
        .then(({ data }) => {
          setProduct(data.results);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    fetchProductById();
  }, []);

  return (
    <>
      {isLoading && <Loader />}

      <div className="mx-4 md:mx-6 mt-5 mb-8">
        <div className="inline-flex flex-col">
          {product?.images?.map((img, key) => {
            return (
              <div key={key} onMouseEnter={() => setSelectedImage(key)}>
                <img
                  src={`http://localhost:5000/public/images/${img?.name}`}
                  alt={img?.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
              </div>
            );
          })}
        </div>

        <img
          src={`http://localhost:5000/public/images/${product?.images[selectedImage]?.name}`}
          alt={product?.images[selectedImage]?.name}
          className="w-64 h-64 object-cover"
        />
      </div>
    </>
  );
};

export default ProductDetail;
