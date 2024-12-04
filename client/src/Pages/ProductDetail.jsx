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

  console.log(selectedVariant);

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

  const handleShareToWhatsApp = (product) => {
    const message = `
      Nama Product: ${product.name}
      Variant: ${product.variant}
      Harga: Rp. ${product.price}
      Total: Rp. ${product.total}
      Gambar Produk: ${product.imageUrl}
  `;

    // Encode the message so that it handles special characters
    const encodedMessage = encodeURIComponent(message);

    // WhatsApp sharing URL
    const url = `https://wa.me/?text=${encodedMessage}`;
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
                      src={`http://localhost:5000/public/images/${img?.name}`}
                      alt={img?.name}
                      className="min-w-14 lg:min-w-12 w-14 lg:w-12 min-h-14 lg:min-h-12 h-14 lg:h-12 rounded-lg object-cover"
                    />
                  </div>
                );
              })}
            </div>

            <div className="order-first lg:order-none w-full h-80 lg:h-[34rem]">
              <img
                src={`http://localhost:5000/public/images/${product?.images[selectedImage]?.name}`}
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
                      className="text-xs"
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
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Facere
              iste dolore dicta iusto tenetur voluptate sint labore recusandae
              illo eius nostrum error doloribus fugiat quibusdam unde ducimus
              eveniet, omnis laborum, dolorem quis rem deleniti, distinctio
              doloremque! Earum possimus ex, quis itaque autem soluta nesciunt
              assumenda accusantium cupiditate. Tempora nisi quidem ipsum optio
              quae soluta sed facilis quis nihil porro voluptatibus non rem ad,
              temporibus, reiciendis pariatur vero ducimus quasi ipsam
              cupiditate esse totam recusandae! Placeat, incidunt magni! Unde
              optio totam at. Non sapiente laboriosam aspernatur, animi culpa
              earum enim veniam nam explicabo id mollitia voluptate. Nobis,
              sequi! Sit magni necessitatibus facere voluptas, sed officia
              officiis voluptatibus perspiciatis commodi porro expedita,
              laboriosam ullam dolores debitis, tempore totam ipsam fugit
              eveniet ex iusto odio dicta pariatur repellendus! Nisi, amet
              veritatis, deleniti vero sapiente laborum, quia dolores nostrum
              beatae non sed dicta veniam in repudiandae adipisci expedita?
              Dolore obcaecati aperiam eius dolor quidem distinctio molestiae
              fuga earum! Cupiditate, corrupti ducimus repudiandae itaque magni
              nobis optio alias. Est facilis voluptates delectus. Maiores
              consectetur quae inventore tempore tempora incidunt nihil,
              provident quod dolorum fuga distinctio at perspiciatis aut
              similique ad laboriosam sed adipisci debitis repellendus nisi
              voluptatibus, eligendi id? Ipsam, adipisci sint quos qui veniam
              quas. Nostrum, quidem ea ab impedit eos illo quo eligendi tempore
              voluptatem in veritatis commodi saepe eius fugiat vero
              reprehenderit repudiandae pariatur nihil mollitia eaque quas hic
              assumenda? Quasi molestiae aut eum amet dolorem eligendi at vitae
              distinctio corrupti voluptas quibusdam nesciunt quia porro eveniet
              dolores fugit accusamus expedita, nisi cum optio vel quas ipsam
              numquam officiis. Harum voluptates at, nobis nihil tempora placeat
              fugiat sint fuga hic incidunt quod veniam asperiores iusto
              debitis, voluptatibus tempore! Ullam, qui voluptates modi
              perspiciatis sunt odio fugiat. Dolorem voluptas fuga tempore
              beatae at quasi magni sequi mollitia reprehenderit consectetur
              repellat architecto dolores cumque necessitatibus obcaecati
              numquam accusamus quis, iusto odio est aliquam saepe quisquam
              esse. Impedit, totam rem! Dignissimos laboriosam iste ducimus!
              Facilis, ex ab error numquam deserunt perspiciatis laudantium
              tenetur modi vero veritatis impedit libero repellendus repudiandae
              dolorem harum voluptatibus nostrum et quia ad iure itaque! Quas
              mollitia nesciunt sit repudiandae quibusdam reprehenderit,
              suscipit dolores, dolorum vero facilis consectetur placeat commodi
              sint quaerat impedit natus doloremque voluptas id sed magnam?
              Nulla placeat quod maxime sunt quas id, sint ducimus vero magni
              quae architecto. Sequi iste modi, molestias alias quos iusto,
              minima harum praesentium eaque ad magnam illo dolores cum vitae
              neque ex repudiandae quibusdam nisi quis ab eos voluptatibus
              cupiditate. Excepturi quae explicabo ex numquam, quidem dolores
              architecto modi enim sequi est autem nisi. Corporis ratione ex
              sapiente iste praesentium sed a explicabo labore quidem asperiores
              eveniet, dicta nesciunt quasi consequuntur repudiandae maiores
              repellat est? Rem velit voluptates veritatis hic inventore rerum,
              non porro? Minima ducimus eligendi soluta. Modi eligendi cum
              pariatur voluptates eum autem. Labore nam ad consequuntur, eos
              laudantium vel totam expedita dicta repellendus quasi. Aut
              consequatur sapiente culpa dicta, exercitationem quisquam deserunt
              minima vitae similique fugit ea perferendis officia quia aliquid
              tempore ipsam adipisci labore blanditiis totam voluptates et
              dolorum temporibus dolore quas. Est aliquid provident dolorum
              voluptatum facere nihil hic doloribus? Quas hic sit unde quia
              mollitia fugiat, quisquam id deleniti ea. Illo ipsam
              exercitationem distinctio similique dolorum odio provident,
              laboriosam vero. Nesciunt neque nulla pariatur qui dolore,
              reiciendis maxime. Dignissimos quam, nam quo deserunt quisquam
              neque repudiandae asperiores architecto consequatur eaque et
              nostrum consectetur ratione repellendus atque consequuntur tempora
              cum! Voluptatum qui, vero iure consectetur facere modi earum ipsam
              consequatur recusandae enim minus expedita provident eveniet iusto
              quidem non hic esse quod doloremque quaerat nemo et! Dicta, earum
              ratione. Quas quisquam at dolore reprehenderit sed soluta quae,
              nam fugiat similique, architecto necessitatibus accusantium in,
              ullam esse quam voluptatum amet ex tenetur deserunt omnis non illo
              laudantium blanditiis. Maiores beatae nostrum obcaecati corporis
              soluta illo rerum minus in autem qui, quos placeat laborum
              blanditiis expedita. Dolores at quo officiis totam excepturi,
              distinctio esse dolorum rerum itaque. Non asperiores eum facilis
              optio nihil accusantium ullam aut possimus vitae ea. Voluptas
              harum, delectus illo animi tempore maxime quod nesciunt
              dignissimos velit culpa, commodi, adipisci autem deserunt dolore
              aliquid. Tempora nam dignissimos eligendi aspernatur incidunt
              iure, unde amet odit eos alias natus consequatur voluptatibus,
              corrupti ullam culpa repellat molestiae harum aperiam totam
              doloremque velit nostrum temporibus? Ipsum maiores quis blanditiis
              hic libero odio quo adipisci, quos vel natus, nostrum at optio
              deleniti quod iure eos eaque officiis fugiat, quasi ad quidem.
              Est, iusto provident molestias dignissimos error delectus beatae
              ex natus quia nulla, placeat minus laboriosam expedita ullam?
              Magnam accusantium eaque ullam quas nulla suscipit debitis, neque
              minima exercitationem nostrum ducimus provident rerum eum et quam,
              perferendis labore ipsum unde qui corporis culpa doloribus iure
              amet optio? Nihil excepturi commodi molestiae alias,
              necessitatibus architecto. Nostrum, autem minus praesentium minima
              natus perspiciatis repudiandae quos dolore quasi error perferendis
              nesciunt corrupti corporis vitae maiores, officiis quis distinctio
              magnam mollitia dignissimos quae. Laborum cumque, molestias
              suscipit enim officia architecto perspiciatis veniam cum quam
              omnis quasi odit nesciunt esse dolorem iste fugit vel, laboriosam
              nihil minima dolor minus! Minima dolore ex aliquam nihil illo quis
              consequatur iusto, placeat tempore earum repellat reiciendis iste
              eum numquam error dignissimos. Iusto, officiis quasi fugit sit
              tempore hic reprehenderit accusamus unde velit error autem nam
              reiciendis dolorem itaque alias quisquam tenetur deleniti, nobis
              consequuntur animi doloremque perferendis. Dicta ea assumenda
              mollitia eveniet nemo, obcaecati velit facilis voluptatem! Magnam
              ullam consequuntur ipsa saepe necessitatibus nihil eius nulla nisi
              perferendis. Recusandae sit exercitationem soluta doloremque
              minima! Nobis culpa modi accusamus dolorum fugiat perferendis
              fugit molestiae laudantium aperiam soluta pariatur, fuga ratione
              reprehenderit dolore libero natus ipsum. Rerum deleniti tempora,
              saepe, autem fugiat aliquid minus itaque adipisci in, recusandae
              sit ex voluptates dicta. Ipsa quia facere, reiciendis
              reprehenderit aspernatur fuga rem id consequuntur qui at
              doloremque blanditiis obcaecati sit nulla, laborum ut adipisci
              provident illum! Aliquid suscipit ipsa odit eos expedita. Dolore
              repudiandae nesciunt magni dolores porro quis, ad aspernatur
              debitis. Excepturi impedit nihil quia voluptates, corrupti
              expedita accusamus! At dolorum esse ipsam adipisci velit! Repellat
              non distinctio tempore officiis dolorem nam maxime reprehenderit
              dolor rem totam eos ipsum veritatis architecto adipisci eius, quas
              inventore ducimus accusantium a recusandae corporis tenetur ad
              nesciunt. Sapiente distinctio modi natus esse consequatur cum
              reiciendis neque alias quae soluta. Exercitationem est,
              voluptatibus laborum distinctio sed consequatur nobis quo beatae,
              maiores mollitia esse, eaque culpa ullam molestiae aliquid
              asperiores dicta odio cumque nemo. Optio commodi mollitia iusto,
              molestiae ex fuga, natus sed dolorum saepe at dolorem adipisci
              est. Quidem dolore nam, quia corrupti voluptas quos veniam. Soluta
              distinctio facere illo dolorum ipsum, vero eos numquam explicabo
              voluptatem est sit saepe labore, natus consequuntur magni
              voluptates! Esse ipsum perferendis aliquid dolor laborum quae rem
              praesentium ea provident consequuntur corporis, adipisci facilis
              quam numquam ratione laboriosam eum. Incidunt quis nisi eum
              maiores dolore error, obcaecati accusantium aut? Aut veritatis
              doloribus repellendus fugiat dignissimos delectus, quam explicabo,
              nesciunt maiores sit aliquam molestiae, nisi quo beatae
              voluptatibus. Tempore, delectus cupiditate? Culpa accusamus aut ut
              possimus nam delectus impedit voluptatibus sapiente soluta
              quisquam. Quas labore soluta natus. Sunt in vitae at! Facere
              aperiam corporis deleniti nam dolores laudantium minus id, labore
              tempora suscipit molestias dolorum nobis rerum impedit, laboriosam
              autem at? Omnis illum consequuntur dolorem ad, totam ipsam, autem
              ducimus et unde cumque odit at quas perferendis quia atque? Animi
              quos, repudiandae esse temporibus quasi quidem velit nesciunt
              rerum adipisci voluptatibus ex, nihil eveniet amet unde libero
              ratione tenetur eius ducimus delectus excepturi earum. Iste
              repellat magnam dolores beatae, nesciunt corporis dolorem omnis
              soluta tempore veniam velit, quod, qui quam? Debitis reprehenderit
              tenetur dolores, vero iste rerum consequatur placeat aut natus
              ipsum earum aperiam dolor ratione porro eaque fugit consectetur
              dolorum, mollitia quod. Neque animi, at veniam laborum assumenda
              consequuntur in libero esse dicta, provident pariatur nemo? Omnis
              tempora nostrum, quod, ut necessitatibus cumque quaerat, illo
              deleniti unde consequatur fugit vero id minima suscipit esse! Quam
              omnis tempora nihil quos ipsum itaque dolorem impedit! Harum error
              ut dolores qui doloribus ducimus repudiandae mollitia sint fuga
              nisi at officia ipsa, quos obcaecati. Eligendi culpa at, veniam
              laboriosam, aspernatur assumenda, amet numquam velit voluptas
              deleniti veritatis tempora dicta error cum! Itaque voluptatum
              iusto hic repudiandae quisquam maxime incidunt fugiat veritatis
              maiores animi ipsa tempore magni recusandae ullam dicta id,
              architecto corporis voluptatibus sapiente vero explicabo
              consectetur assumenda. Dolorem error sunt harum voluptatem
              blanditiis recusandae consequuntur, eius consectetur sapiente
              aperiam quam, est velit dignissimos quod nesciunt accusamus modi
              nobis animi reiciendis perferendis delectus sint saepe quae!
              Eveniet, perspiciatis! Sequi pariatur aperiam officia deleniti
              obcaecati accusantium nesciunt, quidem dolorem ea consequatur sit
              sunt, dignissimos laboriosam, incidunt ullam necessitatibus.
              Molestiae ullam repellendus illum tempora nisi possimus. Veritatis
              harum omnis facilis recusandae aperiam distinctio ea maiores, in
              unde eligendi nihil aspernatur, eius voluptatem quos saepe vel?
              Fugit dolor cum hic libero pariatur ex minima necessitatibus
              molestias similique vel explicabo, delectus numquam perferendis
              accusantium dicta suscipit expedita atque eveniet rerum. Porro
              expedita, earum et illo velit, perspiciatis repudiandae ipsam,
              sapiente quam laborum ipsa ullam nihil harum vitae dignissimos
              optio officia amet commodi est tempore quos ipsum nemo quis
              repellendus! Tempora corporis veritatis cum voluptas iure!
              Commodi, molestias earum? Fugit vel numquam tempora, praesentium
              ipsam eos facilis ex, id perspiciatis culpa excepturi at officiis
              consequuntur quis omnis maxime nobis reiciendis ad autem, ducimus
              nisi eum deserunt debitis. Accusantium doloremque corrupti error
              sit blanditiis veritatis asperiores dignissimos eius voluptates
              aliquid laborum exercitationem aliquam vel nihil, assumenda est
              rerum obcaecati, ratione et optio itaque recusandae vero. At a
              ipsa porro, ducimus incidunt nulla dignissimos hic provident magni
              beatae libero perferendis est explicabo quasi sint fuga sit
              possimus quaerat eos aperiam. Doloremque sed harum ipsum
              voluptatibus culpa a fugiat enim ducimus quod iusto, repudiandae
              excepturi possimus ab provident molestiae cupiditate libero!
              Doloremque molestias, quia fugiat eveniet cum reiciendis
              reprehenderit voluptatem facilis provident sit dolores. Facere
              asperiores, illo fugit eos placeat accusamus totam quae! Tenetur,
              voluptas alias. Debitis quis odio eos, illum deserunt nesciunt
              soluta eum, quasi mollitia consequatur at fugit! Voluptatibus
              explicabo molestias nobis in dolorum quod laudantium corporis
              nesciunt minima unde facere amet, impedit fuga. Iste placeat rem
              natus tenetur commodi aspernatur laboriosam iusto veniam
              praesentium ab dicta distinctio ipsum eius, repellendus temporibus
              nobis reiciendis illum expedita in dolorem itaque quae! Quidem,
              sint aut labore provident quo ea odio vitae minima totam assumenda
              deserunt neque quisquam tempore asperiores voluptatum dolorum
              veritatis libero dolores, eaque consequuntur autem harum. Ut
              libero exercitationem aliquid possimus ipsa sequi impedit
              voluptates magni dolor, consectetur soluta provident inventore
              aspernatur iusto esse, neque sed minus ducimus sint. In illum
              libero aspernatur blanditiis a quas praesentium distinctio,
              incidunt corrupti optio dolorum voluptates ipsum? Tenetur,
              inventore culpa quidem iusto cumque veritatis dolorum debitis,
              vel, aut ullam a dolorem doloribus exercitationem aspernatur!
              Accusantium nobis nulla inventore quae! Et explicabo impedit porro
              vel. Unde quisquam animi consequuntur natus sit tempora
              aspernatur! Odio nulla reprehenderit aliquam et excepturi, nobis
              nihil distinctio, cupiditate quis provident incidunt fuga
              accusamus, quo corporis sit quas id minus dolores voluptas
              recusandae similique! Impedit culpa tempora possimus unde ipsa
              fugit animi quasi excepturi corrupti, consequuntur sapiente,
              exercitationem similique ut molestiae odio nam incidunt et harum
              nesciunt vero commodi. Magnam, sequi sapiente repellat corrupti
              nemo cupiditate autem magni quas nostrum nam alias quisquam quis
              laborum vitae omnis vel architecto sint rem aut culpa dolorem
              soluta obcaecati consequuntur natus. Commodi alias cumque, ipsa
              delectus eum possimus eveniet. Distinctio corrupti maxime at sequi
              error, beatae nobis natus ullam unde. Temporibus ipsa magni, natus
              reprehenderit iusto architecto nobis deserunt ab veritatis atque
              dolorem quisquam ducimus nostrum perspiciatis nam amet aspernatur?
              Totam sapiente mollitia facilis quia incidunt illum fugiat,
              accusamus ipsa dignissimos error consequuntur dolor qui, inventore
              quibusdam blanditiis rerum deserunt magnam est tempora a, suscipit
              veniam sint? Animi facilis assumenda ullam porro distinctio id
              quasi in facere! Aspernatur quia consequuntur earum aut beatae
              autem asperiores voluptate nemo voluptates laudantium minus ipsa
              numquam magnam et vero provident adipisci perspiciatis, omnis
              recusandae debitis, minima reiciendis porro doloremque quae.
              Numquam ratione modi ea, vero voluptate autem voluptates quidem
              tempora eos dolore in? Sint quisquam natus quod ratione,
              consequatur, tempora assumenda vel distinctio eaque deleniti
              reprehenderit dolorum aperiam.
            </p>
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
