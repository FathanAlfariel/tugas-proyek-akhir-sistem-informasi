import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import { IoIosArrowBack } from "react-icons/io";
import IconButton from "../Components/IconButton";
import { TbShoppingBagPlus } from "react-icons/tb";
import Button from "../Components/Button";
import HomePageHeader from "../Components/HomePageHeader";
import { IoChevronDownOutline } from "react-icons/io5";
import DropdownSelect from "../Components/DropdownSelect";

const ProductDetail = () => {
  const { id } = useParams();

  const [isLoading, setIsLoading] = useState(false);
  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);

  const [selectedVariant, setSelectedVariant] = useState(null);
  const [showTotalMenu, setShowTotalMenu] = useState(false);
  const [selectedTotal, setSelectedTotal] = useState(1);

  useEffect(() => {
    setIsLoading(true);

    const fetchProductById = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/product/${id}`)
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

  const handleShareToWhatsApp = (product) => {
    const message = `
      Nama Product: ${product.name}
      Variant: ${
        selectedVariant.color +
        " " +
        `(${selectedVariant?.length}cm x ${selectedVariant?.width}cm x ${selectedVariant?.height}cm)`
      }
      Harga: Rp. ${selectedVariant.price}
      Quantity: ${selectedTotal}
  `;

    // Encode the message so that it handles special characters
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp sharing URL
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;

    // Redirect ke WhatsApp
    window.open(whatsappUrl, "_blank");
  };

  return (
    <>
      {isLoading && <Loader />}

      <header className="flex items-center bg-white py-4 mx-4 md:mx-6 z-10 bg-white">
        <div className="block md:hidden">
          <Link to="/" className="text-xl">
            <IoIosArrowBack />
          </Link>
        </div>

        <div className="hidden md:block w-full">
          <HomePageHeader />
        </div>
      </header>

      <main className="grid grid-cols-12 gap-x-5 mx-0 md:mx-6 mt-0 md:mt-6 pb-36 md:pb-0">
        {/* Images */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5 2xl:col-span-4">
          <div className="sticky top-5 flex flex-col lg:flex-row items-start gap-x-4">
            <div className="flex flex-row lg:flex-col gap-2 mt-3 lg:mt-0 mb-5 lg:mb-0 mx-4 md:mx-0">
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
                      src={`${
                        import.meta.env.VITE_API_BASE_URL
                      }/public/images/${img?.name}`}
                      alt={img?.name}
                      className="min-w-14 lg:min-w-12 w-14 lg:w-12 min-h-14 lg:min-h-12 h-14 lg:h-12 rounded-lg object-cover"
                    />
                  </div>
                );
              })}
            </div>

            <div className="order-first lg:order-none w-full h-80 lg:h-[34rem]">
              <img
                src={`${import.meta.env.VITE_API_BASE_URL}/public/images/${
                  product?.images[selectedImage]?.name
                }`}
                alt={product?.images[selectedImage]?.name}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Share */}
            <div className="order-last hidden md:block lg:hidden">
              <div className="w-full px-4 py-6 md:px-4 md:py-2 bg-white border-0 md:border rounded-2xl">
                <p className="inline-flex gap-x-1 before:content-['*'] text-xs text-[#49454F] font-medium mb-4">
                  Pastikan anda sudah memilih produk dan variant yang sesuai
                </p>

                <div className="flex flex-row md:flex-col items-center gap-x-2">
                  <div className="w-full">
                    <DropdownSelect
                      id="total-menu-tablet"
                      menuSize="small"
                      minWidth="min-w-full"
                      button={
                        <button
                          type="button"
                          className="w-full flex justify-between items-center gap-x-1 py-2 px-4 text-xs border rounded-lg shadow-sm"
                          onClick={() => setShowTotalMenu((prev) => !prev)}
                        >
                          Quantity: {selectedTotal}
                          <span>
                            <IoChevronDownOutline />
                          </span>
                        </button>
                      }
                      selectMenu={(() => {
                        const items = [];
                        for (let i = 1; i <= selectedVariant?.stock; i++) {
                          items.push({
                            label: i,
                            value: i,
                            handleMenuClicked: () => setSelectedTotal(i),
                          });
                        }

                        return items;
                      })()}
                      defaultValue={selectedTotal}
                    />
                  </div>

                  <div className="mt-0 md:mt-4">
                    <Button
                      type="button"
                      buttonStyle="filled"
                      width="full"
                      className="text-xs whitespace-nowrap"
                      onClick={() => handleShareToWhatsApp(product)}
                    >
                      Beli dan bagikan ke WhatsApp
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5 2xl:col-span-6 mx-4 md:mx-0 ">
          <h1 title={product?.name} className="text-xl line-clamp-4">
            {product?.name}
          </h1>

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

            <ul className="grid grid-cols-2 lg:grid-cols-5 gap-2 mt-3">
              {product?.variants?.map((variant, key) => {
                return (
                  <li key={key}>
                    <label
                      htmlFor={"variant" + key}
                      className="block flex flex-col py-2.5 px-3 rounded-xl border has-[:checked]:border-[#6750A4] has-[:checked]:ring-2 has-[:checked]:ring-[#6750A4] has-[:checked]:ring-offset-2 has-[:checked]:bg-[#6750A4]/[.12] has-[:checked]:text-[#6750A4] has-[:disabled]:opacity-50 has-[:disabled]:cursor-not-allowed transition-all duration-300 cursor-pointer"
                    >
                      <p
                        title={variant?.color}
                        className="text-xs font-medium text-nowrap line-clamp-1"
                      >
                        Warna: {variant?.color}
                      </p>
                      <p
                        title={`${variant?.length}cm x ${variant?.width}cm x ${variant?.height}cm`}
                        className="text-xs text-nowrap line-clamp-1"
                      >
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

          {/* Divider */}
          <div className="w-full h-px bg-[#CAC4D0] mt-3 mb-4"></div>

          {/* Description product */}
          <div>
            <h5 className="text-sm font-medium">Tentang produk ini</h5>

            <p className="text-sm mt-1">{product?.description}</p>
          </div>
        </div>

        {/* Share */}
        <div className="block md:hidden lg:block col-span-12 md:col-span-6 lg:col-span-2 2xl:col-span-2 sticky top-0">
          <div className="w-full fixed md:sticky bottom-0 md:top-5 left-0 px-4 py-6 md:px-4 md:py-2 bg-white border-0 md:border rounded-2xl">
            <p className="inline-flex gap-x-1 before:content-['*'] text-xs text-[#49454F] font-medium mb-4">
              Pastikan anda sudah memilih produk dan variant yang sesuai
            </p>

            <div className="flex flex-row md:flex-col items-center gap-x-2">
              <div className="w-full">
                <DropdownSelect
                  id="total-menu-desktop"
                  menuSize="small"
                  minWidth="min-w-full"
                  button={
                    <button
                      type="button"
                      className="w-full flex justify-between items-center gap-x-1 py-2 px-4 text-xs border rounded-lg shadow-sm"
                      onClick={() => setShowTotalMenu((prev) => !prev)}
                    >
                      Quantity: {selectedTotal}
                      <span>
                        <IoChevronDownOutline />
                      </span>
                    </button>
                  }
                  selectMenu={(() => {
                    const items = [];
                    for (let i = 1; i <= selectedVariant?.stock; i++) {
                      items.push({
                        label: i,
                        value: i,
                        handleMenuClicked: () => setSelectedTotal(i),
                      });
                    }

                    return items;
                  })()}
                  defaultValue={selectedTotal}
                />
              </div>

              <div className="w-full mt-0 md:mt-4">
                <Button
                  type="button"
                  buttonStyle="filled"
                  width="full"
                  className="text-xs whitespace-nowrap"
                  onClick={() => handleShareToWhatsApp(product)}
                >
                  Beli dan bagikan ke WhatsApp
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};

export default ProductDetail;
