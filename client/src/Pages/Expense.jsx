import axios from "axios";
import React, { useEffect, useState } from "react";
import IconButton from "../Components/IconButton";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import { Link } from "react-router-dom";
import Loader from "../Components/Loader";
import Filter from "../Components/Filter";

const Expense = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [expenses, setExpenses] = useState(null);

  useEffect(() => {
    setIsLoading(true);

    const getAllExpenses = async () => {
      await axios
        .get("http://localhost:5000/api/expense")
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
  }, []);

  const handleDeleteExpense = async (id) => {
    setIsLoading(true);

    await axios
      .delete(`http://localhost:5000/api/expense/${id}`)
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

      <h1 className="text-[28px] leading-9 font-medium mb-4">Pengeluaran</h1>

      {/* Filter */}
      <div className="border-y py-3 mb-1">
        <h5 className="text-sm font-semibold mb-2.5">Filter berdasarkan:</h5>

        <div className="flex items-center gap-x-2 overflow-x-auto md:overflow-visible">
          {/* Expense Name Filter */}
          <Filter
            id="tracking-receipt-filter"
            headerTitle="Nama pengeluaran"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                Nama pengeluaran
              </button>
            }
          >
            <label
              htmlFor="tracking-receipt"
              className="block text-xs font-medium"
            >
              Masukkan nama pengeluaran
            </label>

            <input
              autoFocus
              id="tracking-receipt"
              type="text"
              placeholder="Nama pengeluaran"
              className="outline-none pt-3 pb-1 text-sm border-b w-full"
              // value={trackingReceiptParams}
              // onChange={(e) => setTrackingReceiptParams(e.target.value)}
            />
          </Filter>

          {/* Price Filter */}
          <Filter
            id="tracking-receipt-filter"
            headerTitle="Harga"
            button={
              <button
                type="button"
                className="flex items-center gap-x-2 py-2 px-4 text-sm font-medium border rounded-full transition duration-300 hover:bg-black/[.07] active:scale-90"
              >
                Harga
              </button>
            }
          >
            <div className="flex items-center gap-x-2">
              <div>
                <label
                  htmlFor="tracking-receipt"
                  className="block text-xs font-medium"
                >
                  Minimal
                </label>

                <input
                  autoFocus
                  id="tracking-receipt"
                  type="number"
                  placeholder="Min"
                  min={0}
                  className="outline-none pt-3 pb-1 text-sm border-b w-full"
                  // value={trackingReceiptParams}
                  // onChange={(e) => setTrackingReceiptParams(e.target.value)}
                />
              </div>

              <div>
                <label
                  htmlFor="tracking-receipt"
                  className="block text-xs font-medium"
                >
                  Maximal
                </label>

                <input
                  autoFocus
                  id="tracking-receipt"
                  type="number"
                  placeholder="Max"
                  min={0}
                  className="outline-none pt-3 pb-1 text-sm border-b w-full"
                  // value={trackingReceiptParams}
                  // onChange={(e) => setTrackingReceiptParams(e.target.value)}
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
