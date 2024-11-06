import axios from "axios";
import React, { useEffect, useState } from "react";
import IconButton from "../Components/IconButton";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Expense = () => {
  const [expenses, setExpenses] = useState(null);

  useEffect(() => {
    const getAllExpenses = async () => {
      await axios
        .get("http://localhost:5000/api/expense")
        .then(({ data }) => {
          setExpenses(data.results);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAllExpenses();
  }, []);

  const handleDeleteExpense = async (id) => {
    await axios
      .delete(`http://localhost:5000/api/expense/${id}`)
      .then(({ data }) => {
        setExpenses((prev) => prev.filter((expense) => expense._id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium">Pengeluaran</h1>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pl-6 py-4 text-xs text-left font-medium">
              Nama pengeluaran
            </th>
            <th className="pl-6 py-4 text-xs text-left font-medium">Harga</th>
            <th className="pl-6 py-4 text-xs text-left font-medium">Tanggal</th>
            <th className="pl-6 py-4 text-xs text-left font-medium">Aksi</th>
          </tr>
        </thead>
        <tbody>
          {expenses &&
            expenses.map((expense, key) => {
              return (
                <tr key={key} className="border-b">
                  <td className="pl-6 py-6">
                    <p className="text-sm line-clamp-2">{expense.name}</p>
                  </td>
                  <td className="pl-6 py-6">
                    <p className="text-sm">
                      {expense.price.toLocaleString("id-ID", {
                        style: "currency",
                        currency: "IDR",
                      })}
                    </p>
                  </td>
                  <td className="pl-6 py-6">
                    <p className="text-xs">
                      {new Date(expense.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <div className="text-xs font-medium">Ditambahkan</div>
                  </td>
                  <td className="pl-6 py-6">
                    <div className="flex items-center gap-x-1">
                      <Link to={`/admin/expense/edit/${expense._id}`}>
                        <IconButton type="button">
                          <HiOutlinePencil className="text-lg" />
                        </IconButton>
                      </Link>
                      <IconButton
                        onClick={() => {
                          handleDeleteExpense(expense._id);
                        }}
                        type="button"
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
    </>
  );
};

export default Expense;
