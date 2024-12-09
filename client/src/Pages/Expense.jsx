import React, { useEffect, useState } from "react";
import axios from "axios";
import IconButton from "../Components/IconButton";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import { Link, useSearchParams } from "react-router-dom";
import Loader from "../Components/Loader";
import Filter from "../Components/Filter";
import { IoMdClose } from "react-icons/io";

const Expense = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState(null);

  const [searchParams, setSearchParams] = useSearchParams();
  const currentParams = Object.fromEntries(searchParams.entries());

  const [nameParams, setNameParams] = useState(currentParams?.name || "");
  const [minPriceParams, setMinPriceParams] = useState(
    currentParams?.minPrice || 0
  );
  const [maxPriceParams, setMaxPriceParams] = useState(
    currentParams?.maxPrice || 0
  );

  // Get all expenses
  useEffect(() => {
    setIsLoading(true);

    const getAllExpenses = async () => {
      await axios
        .get(`${import.meta.env.VITE_API_BASE_URL}/api/expense?${searchParams}`)
        .then(({ data }) => {
          setExpenses(data.results);
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    };

    getAllExpenses();
  }, [searchParams]);

  const handleDeleteExpense = async (id) => {
    setIsLoading(true);

    await axios
      .delete(`${import.meta.env.VITE_API_BASE_URL}/api/expense/${id}`)
      .then(({ data }) => {
        setExpenses((prev) => prev.filter((expense) => expense.id !== id));
      })
      .catch((err) => {
        console.log(err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  return (
    <>
      {isLoading && <Loader />}

      <h1 className="text-2xl md:text-[28px] leading-9 font-medium mb-3 md:mb-6">
        Pengeluaran
      </h1>

      {/* Filter */}
      <div className="border-y py-3 mb-1">
        <h5 className="text-sm font-semibold mb-2.5">Filter berdasarkan:</h5>

        <div className="flex items-center gap-x-2 overflow-x-auto md:overflow-visible">
          {/* Expense Name Filter */}
          <Filter
            id="name-filter"
            headerTitle="Nama pengeluaran"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                {currentParams?.name ? (
                  <>
                    Nama pengeluaran: {currentParams?.name}
                    <span
                      title="Hapus filter nama pengeluaran"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["name"];

                        setSearchParams(updatedParams);
                        setNameParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Nama pengeluaran"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({
                ...currentParams,
                name: nameParams,
              })
            }
            disabledButton={nameParams === "" ? true : false}
          >
            <label htmlFor="name" className="block text-xs font-medium">
              Masukkan nama pengeluaran
            </label>

            <input
              autoFocus
              id="name"
              type="text"
              placeholder="Nama pengeluaran"
              className="outline-none pt-3 pb-1 text-sm border-b w-full"
              value={nameParams}
              onChange={(e) => setNameParams(e.target.value)}
            />
          </Filter>

          {/* Price Filter */}
          <Filter
            id="price-filter"
            headerTitle="Harga"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                {currentParams?.minPrice && currentParams?.maxPrice ? (
                  <>
                    Harga: {currentParams?.minPrice}-{currentParams?.maxPrice}
                    <span
                      title="Hapus filter harga"
                      className="p-1 rounded-full bg-black/[.15] ml-2"
                      onClick={(e) => {
                        e.stopPropagation();

                        const updatedParams = { ...currentParams };
                        delete updatedParams["minPrice"];
                        delete updatedParams["maxPrice"];

                        setSearchParams(updatedParams);
                        setMinPriceParams("");
                        setMaxPriceParams("");
                      }}
                    >
                      <IoMdClose className="text-sm" />
                    </span>
                  </>
                ) : (
                  "Harga"
                )}
              </button>
            }
            onClick={() =>
              setSearchParams({
                ...currentParams,
                minPrice: minPriceParams,
                maxPrice: maxPriceParams,
              })
            }
            disabledButton={
              minPriceParams === 0 && maxPriceParams === 0 ? true : false
            }
          >
            <div className="flex items-center gap-x-2">
              <div>
                <label
                  htmlFor="min-price"
                  className="block text-xs font-medium"
                >
                  Minimal
                </label>

                <input
                  autoFocus
                  id="min-price"
                  type="number"
                  placeholder="Min"
                  min={0}
                  className="outline-none pt-3 pb-1 text-sm border-b w-full"
                  value={minPriceParams}
                  onChange={(e) => setMinPriceParams(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="max-price"
                  className="block text-xs font-medium"
                >
                  Maximal
                </label>

                <input
                  id="max-price"
                  type="number"
                  placeholder="Max"
                  min={0}
                  className="outline-none pt-3 pb-1 text-sm border-b w-full"
                  value={maxPriceParams}
                  onChange={(e) => setMaxPriceParams(e.target.value)}
                />
              </div>
            </div>
          </Filter>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="pl-0 md:pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Nama pengeluaran
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Harga
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Tanggal
              </th>
              <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {expenses &&
              expenses.map((expense, key) => {
                return (
                  <tr key={key} className="border-b">
                    <td className="pl-0 md:pl-6 py-6 whitespace-nowrap">
                      <p className="text-sm line-clamp-2">{expense?.name}</p>
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <p className="text-sm">
                        {expense?.price?.toLocaleString("id-ID", {
                          style: "currency",
                          currency: "IDR",
                        })}
                      </p>
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <p className="text-xs">
                        {new Date(expense?.createdAt).toLocaleDateString(
                          "id-ID",
                          {
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                          }
                        )}
                      </p>
                      <div className="text-xs font-medium">Ditambahkan</div>
                    </td>
                    <td className="pl-6 py-6 whitespace-nowrap">
                      <div className="flex items-center gap-x-1">
                        <Link to={`/admin/expense/edit/${expense?.id}`}>
                          <IconButton type="button" buttonType="icon">
                            <HiOutlinePencil className="text-lg" />
                          </IconButton>
                        </Link>
                        <IconButton
                          onClick={() => {
                            handleDeleteExpense(expense?.id);
                          }}
                          type="button"
                          buttonType="icon"
                        >
                          <HiOutlineTrash className="text-lg" />
                        </IconButton>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default Expense;
