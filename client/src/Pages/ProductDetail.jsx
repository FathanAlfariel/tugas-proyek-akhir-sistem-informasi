import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import { IoShareOutline } from "react-icons/io5";
import IconButton from "../Components/IconButton";

const ProductDetail = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedVariant, setSelectedVariant] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const fetchProductById = async () => {
      await axios
        .get(`http://localhost:5000/api/product/${id}`)
        .then(({ data }) => {
          setProduct(data.results);
          setSelectedVariant(data.results.variants[0]);
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

      <div className="grid grid-cols-12 gap-x-5 mx-4 md:mx-6 mt-5 mb-8">
        {/* Images */}
        <div className="col-span-4 flex items-start gap-x-4 max-h-[34rem]">
          <div className="inline-flex flex-col gap-y-2">
            {product?.images?.map((img, key) => {
              return (
                <div
                  key={key}
                  onMouseEnter={() => setSelectedImage(key)}
                  className={`${
                    selectedImage === key ? "ring-2 ring-[#6750A4]" : ""
                  } ring-offset-2 rounded-lg`}
                >
                  <img
                    src={`http://localhost:5000/public/images/${img?.name}`}
                    alt={img?.name}
                    className="min-w-12 w-12  min-h-12 h-12 rounded-lg object-cover"
                  />
                </div>
              );
            })}
          </div>

          <img
            src={`http://localhost:5000/public/images/${product?.images[selectedImage]?.name}`}
            alt={product?.images[selectedImage]?.name}
            className="w-full h-full object-cover"
          />
        </div>

        <div className="col-span-4">
          <div className="flex justify-between items-start gap-x-2">
            <h1 title={product?.name} className="text-xl line-clamp-4">
              {product?.name} Lorem ipsum dolor sit amet, consectetur
              adipisicing elit. Corrupti quidem praesentium, quaerat perferendis
              nostrum molestiae voluptas impedit aliquam quia modi adipisci
              unde. Consequuntur voluptas quos iusto odio dolore doloremque
              voluptatem eius eos? Beatae neque commodi quis iure, natus eveniet
              nisi ipsam sequi reprehenderit animi nesciunt. Ea, qui nisi? Et
              rerum suscipit eligendi at ducimus veniam laudantium tenetur,
              velit temporibus incidunt vitae unde error assumenda quis minima,
              aliquam obcaecati vero molestias pariatur est illum quisquam?
              Tempore ipsum voluptate facere repellendus delectus iure?
              Dignissimos esse maiores labore! Exercitationem, rerum? Modi quo
              porro nam vero, facere maiores enim deserunt? Officia aliquam
              recusandae nulla.
            </h1>

            <IconButton type="button" buttonType="icon" title="Share">
              <IoShareOutline />
            </IconButton>
          </div>

          {/* Divider */}
          <div className="w-full h-px bg-[#CAC4D0] mt-3 mb-4"></div>

          {/* Price */}
          <p className="text-2xl font-medium">
            {selectedVariant?.price.toLocaleString("id-ID", {
              style: "currency",
              currency: "IDR",
            })}
          </p>

          {/* Variant */}
          <div className="mt-4">
            <p className="text-sm">
              Variant:{" "}
              <span className="before:content-['('] after:content-[')'] font-semibold">{`${selectedVariant?.color}: ${selectedVariant?.length}cm x ${selectedVariant?.width}
                        cm x ${selectedVariant?.height}cm`}</span>
            </p>

            <ul className="flex items-center flex-wrap gap-2 mt-3">
              {product?.variants?.map((variant, key) => {
                return (
                  <li key={key}>
                    <label
                      htmlFor={"variant" + key}
                      className="block flex flex-col py-2.5 px-3 rounded-xl border has-[:checked]:border-[#6750A4] has-[:checked]:ring-2 has-[:checked]:ring-[#6750A4] has-[:checked]:ring-offset-2 has-[:checked]:bg-[#6750A4]/[.12] has-[:checked]:text-[#6750A4] has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed transition-all duration-300 cursor-pointer"
                    >
                      <p className="text-xs font-medium text-nowrap">
                        Warna: {variant?.color}
                      </p>
                      <p className="text-xs text-nowrap">
                        Ukuran: {variant?.length}cm x {variant?.width}
                        cm x {variant?.height}cm
                      </p>

                      <input
                        id={"variant" + key}
                        type="radio"
                        name="variant"
                        value={variant?.id}
                        className="hidden"
                        checked={
                          variant?.id === selectedVariant?.id ? true : false
                        }
                        onChange={() => setSelectedVariant(variant)}
                      />
                    </label>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
