import axios from "axios";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Loader from "../Components/Loader";
import { IoShareOutline } from "react-icons/io5";
import IconButton from "../Components/IconButton";
import { TbShoppingBagPlus } from "react-icons/tb";
import Button from "../Components/Button";

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
        <div className="col-span-12 md:col-span-6 lg:col-span-5 2xl:col-span-4">
          <div className="sticky top-5 flex flex-col lg:flex-row items-start gap-x-4">
            <div className="order-last lg:order-first flex flex-row lg:flex-col gap-2 mt-3 lg:mt-0 mb-5 lg:mb-0">
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
                      className="min-w-16 lg:min-w-12 w-16 lg:w-12 min-h-16 lg:min-h-12 h-16 lg:h-12 rounded-lg object-cover"
                    />
                  </div>
                );
              })}
            </div>

            <div className="w-full h-96 lg:h-[34rem]">
              <img
                src={`http://localhost:5000/public/images/${product?.images[selectedImage]?.name}`}
                alt={product?.images[selectedImage]?.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>

        {/* Product info */}
        <div className="col-span-12 md:col-span-6 lg:col-span-5 2xl:col-span-6">
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

          {/* Divider */}
          <div className="w-full h-px bg-[#CAC4D0] mt-3 mb-4"></div>

          {/* Description product */}
          <div>
            <h5 className="text-sm font-medium">Tentang produk ini</h5>

            <p className="text-sm mt-1">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Sint
              doloribus recusandae sapiente molestiae quae, numquam minima
              adipisci porro voluptatem temporibus quas voluptatum iste nostrum
              quo. Saepe atque, animi error perspiciatis ratione assumenda
              obcaecati fuga temporibus voluptates eos, possimus reiciendis
              totam quos ad sequi corrupti sunt doloribus aliquid, quibusdam
              iste! Porro accusantium, deserunt quaerat saepe quo perspiciatis
              in repellendus! Consectetur commodi assumenda natus laborum quod
              id autem doloremque provident excepturi expedita placeat maxime, a
              tempore consequuntur voluptates nulla modi quos. Labore sit porro
              vel beatae! Voluptates inventore ipsam eveniet, incidunt, in ut
              nihil sunt voluptas, dignissimos natus unde adipisci officiis eos
              accusantium provident quidem ab consequuntur numquam voluptatem
              esse fugit ipsum quam laudantium! Architecto tempore illo, nam
              nulla ducimus voluptatum ipsam voluptas eligendi a, beatae vero
              consequuntur eius delectus sit? Perspiciatis ab quas
              necessitatibus possimus, esse deserunt similique aperiam fugiat
              quo? Vitae sint soluta, fugit placeat neque, sunt explicabo velit
              nihil pariatur provident ea. Dicta, autem. Expedita dolores,
              reprehenderit nobis temporibus fugiat quaerat, nesciunt soluta
              velit reiciendis pariatur ullam dicta suscipit, similique minima
              voluptates laborum ratione facere veniam nihil possimus. Tempore
              sunt nesciunt quis, molestias earum reprehenderit molestiae
              nostrum et minima deleniti esse enim nulla alias? Natus, sit! Hic
              libero illum cupiditate quos voluptatem quibusdam distinctio
              neque, exercitationem architecto doloremque possimus ducimus
              quaerat expedita ipsa voluptatum totam laudantium, minima natus.
              Optio ea maiores incidunt culpa quos minima ipsa, distinctio
              consequatur sed soluta numquam a reprehenderit velit voluptatum
              provident? Optio, nemo! Qui, excepturi. Dolorem eveniet veritatis
              ad quae, illo omnis numquam molestias corporis sit consequatur,
              rerum, voluptas temporibus? Officiis illum fugit qui cupiditate
              reprehenderit incidunt? Qui eius, autem molestiae eaque cumque
              ratione porro rem? Maiores, doloribus neque sint corporis mollitia
              eveniet, ex officiis laudantium consectetur dignissimos rem
              ducimus dolorum natus aspernatur. Sapiente consequatur
              necessitatibus aspernatur amet totam, accusantium enim accusamus
              vero praesentium animi. Quisquam, a debitis mollitia deserunt
              laborum veritatis fuga dignissimos voluptate quod, sapiente vitae
              velit consectetur neque, repudiandae animi aliquid temporibus non.
              Pariatur a nostrum ullam corrupti aut voluptatum tempora totam
              iusto voluptates ratione! Magni delectus nobis corporis quaerat
              obcaecati sequi iste laudantium rerum similique vel aspernatur
              dignissimos voluptate explicabo perspiciatis dolor, mollitia, odio
              ad enim aut doloremque consequuntur nemo. Placeat sed praesentium
              quam aperiam voluptas, voluptates illum cupiditate a atque eius
              sunt est perferendis sapiente porro excepturi cumque magnam
              tempore culpa eos minima ratione quae, dignissimos debitis.
              Explicabo ut, laudantium a iusto illum necessitatibus esse ea
              recusandae voluptatibus doloremque possimus exercitationem
              consectetur vero impedit, tempora aliquid laborum consequatur.
              Mollitia cum, nihil hic sed excepturi officiis maiores amet
              sapiente pariatur, dicta ipsa atque facilis exercitationem
              necessitatibus provident quam. Quaerat deserunt quis velit
              necessitatibus consequuntur, maxime ad iste itaque excepturi qui
              repudiandae quae, dolorum nam saepe ratione! Officiis labore
              suscipit nisi enim ex, ab recusandae nihil facere aperiam, aliquam
              voluptatum dicta id sapiente reprehenderit? Aut, dignissimos
              nobis, commodi quam excepturi eum praesentium doloribus eligendi
              nam rerum est vel aliquid enim nisi voluptates nihil ratione
              nostrum quod consequatur deserunt unde! Dolore natus sint commodi
              placeat libero tempora provident, iusto consequatur. Omnis vitae
              atque quidem maiores quod nulla cumque accusantium ducimus quo
              quis tempore sunt, a itaque commodi nostrum sint adipisci officia
              modi beatae? Perspiciatis maxime consequatur iusto doloremque,
              ratione eveniet inventore voluptatem architecto possimus esse,
              voluptatibus, nobis dolorem voluptate aspernatur nisi unde! Atque
              accusamus autem possimus. Voluptas ipsa veniam unde autem enim
              quisquam obcaecati amet, at soluta est inventore sint dignissimos
              doloremque fuga asperiores exercitationem tempora nemo facere
              veritatis, molestiae facilis. Rem maiores enim maxime facilis amet
              repellendus sit sed ad dolorem. Nisi dignissimos porro, voluptate,
              nihil totam, obcaecati at blanditiis odit reprehenderit assumenda
              veniam animi autem maiores repudiandae dicta distinctio atque
              delectus dolorem. Voluptatibus dolore aliquam veniam, totam hic
              unde sed, explicabo architecto vel necessitatibus debitis
              molestias sapiente repellendus veritatis quod voluptatem non
              dolorum. Corrupti aliquid quos voluptate nobis debitis accusamus,
              dicta tempora est suscipit error at eos quae incidunt ducimus
              porro iste id dolorem quibusdam. Veniam minima, ipsum a nisi
              pariatur impedit. Quam voluptate accusamus adipisci. Asperiores,
              voluptatum. Magnam incidunt tempore pariatur! Consequatur deleniti
              ea neque. Expedita corrupti ipsum voluptate delectus dolorem
              tenetur a dicta corporis velit similique. Maxime perferendis
              quibusdam, quasi asperiores mollitia quod magni voluptas officiis
              repudiandae velit vero temporibus, adipisci cupiditate! Facilis,
              laboriosam illo. Voluptas, quos. Perspiciatis quasi ad ducimus.
              Placeat impedit maxime suscipit corrupti sit voluptatibus nostrum
              sint nihil eveniet iusto recusandae ad labore unde saepe debitis,
              dolor consectetur illum eius omnis laudantium! Voluptas voluptatum
              nisi, impedit ipsum expedita dicta excepturi totam veniam ducimus
              aspernatur, in quia, hic quasi officiis. Eius dolore tempora
              nesciunt quis nihil voluptatum, deleniti assumenda? Deserunt, quis
              maxime qui fuga repudiandae magnam ut laudantium, eos dolorem
              voluptatem nam totam sunt sequi rerum velit vel dolores dolore
              dolorum possimus. Nesciunt quod facilis repellat architecto
              impedit! Tempore facere vero, commodi molestiae modi veritatis
              dicta nam similique sunt quidem laborum odit voluptate nihil eum!
              Quam vero unde nihil fugit provident qui temporibus rem tenetur
              dolorum in a velit incidunt, magnam deleniti minima doloremque
              quod eum omnis, itaque placeat. Amet quisquam voluptate nobis
              cumque sit laborum odit possimus nisi ullam fugit suscipit
              doloribus deleniti distinctio aut quaerat recusandae minima
              cupiditate et tenetur, placeat aspernatur non. Tempora, quam et
              corporis laudantium maiores officiis reprehenderit harum molestias
              mollitia ea iste error deleniti voluptatibus quasi illo sit
              quibusdam accusantium perferendis! Quas aut a velit sit nobis
              nisi, totam voluptatem nam accusamus eum quidem, suscipit autem
              cupiditate adipisci vel ut! Laudantium culpa illo blanditiis
              laborum ipsam. Nesciunt omnis, cumque sed rerum expedita excepturi
              eius doloremque reprehenderit commodi nam sunt harum!
              Exercitationem, repellendus possimus! Nemo consequatur maiores
              explicabo optio deleniti corrupti nobis ipsam ducimus neque ipsa!
              Consectetur minima doloremque saepe fuga id ducimus veniam
              eligendi qui quia iusto. Eveniet culpa sequi facere. Eaque hic qui
              reiciendis! Blanditiis id rem, odit iusto earum nesciunt
              necessitatibus ea voluptatibus cumque dolores, assumenda
              reprehenderit consectetur perspiciatis. Similique nesciunt quasi
              iusto quas quod velit, minima ex! Dolor eveniet qui doloremque
              autem quis sint temporibus est, corporis recusandae amet magni
              aliquid, sed unde odio harum necessitatibus ratione, vel nemo
              tempora maxime iste. Fuga at magni molestiae aliquid?
            </p>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-2 2xl:col-span-2">
          <Button type="button" buttonStyle="filled" width="full">
            Beli dan bagikan ke WhatsApp
          </Button>
          <p className="inline-flex gap-x-1 before:content-['*'] text-xs text-[#49454F] font-medium mt-1">
            Pastikan anda sudah memilih produk dan variant yang sesuai
          </p>

          <div className="mt-6">
            <Button
              title="Bagikan tentang produk ini"
              type="button"
              buttonStyle="outlined-with-icon"
              width="full"
              icon={<IoShareOutline />}
            >
              Bagikan
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProductDetail;
