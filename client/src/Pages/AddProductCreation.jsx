import { useEffect, useState } from "react";
import Input from "../Components/Input";
import Select from "../Components/Select";
import axios from "axios";
import { FiPlus } from "react-icons/fi";

const AddProductCreation = () => {
  const [availableTailors, setAvailableTailors] = useState([]);

  useEffect(() => {
    const getAvailableTailors = async () => {
      await axios
        .get("http://localhost:5000/api/tailor")
        .then(({ data }) => {
          setAvailableTailors(
            data.results.filter((item) => item.available === true)
          );
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAvailableTailors();
  }, []);

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium mb-6">
        Tambah pembuatan produk
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-0 md:gap-x-6">
        <div>
          <Input
            id="name"
            label="Nama produk"
            type="text"
            name="name"
            placeholder="Masukkan nama produk"
          />
        </div>

        <div>
          <div className="mb-5">
            <h5 className="text-lg font-medium mb-2.5">Pilih penjahit</h5>

            <Select
              id="tailor"
              label="Penjahit"
              placeholder="Pilih penjahit"
              selectMenu={availableTailors.map((item) => ({
                label: item.name,
                value: item.id,
              }))}
            />
          </div>

          <div>
            <h5 className="text-lg font-medium mb-2.5">Bahan-bahan</h5>

            <button
              type="button"
              className="flex justify-center items-center gap-x-2 text-sm font-medium items-center w-full p-4 border-2 border-dashed rounded-xl transition-all active:scale-90 duration-300"
            >
              <span className="text-xl">
                <FiPlus />
              </span>
              Tambah bahan
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddProductCreation;
