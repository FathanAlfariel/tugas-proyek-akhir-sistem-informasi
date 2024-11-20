import React, { useState, useEffect } from "react";
import axios from "axios";
import IconButton from "../Components/IconButton";
import { HiOutlinePencil, HiOutlineTrash } from "react-icons/hi2";
import { Link } from "react-router-dom";

const Tailor = () => {
  const [tailors, setTailors] = useState(null);

  useEffect(() => {
    const getAllTailors = async () => {
      await axios
        .get("http://localhost:5000/api/tailor")
        .then(({ data }) => {
          setTailors(data.results);
          console.log(data);
        })
        .catch((err) => {
          console.log(err);
        });
    };

    getAllTailors();
  }, []);

  const handleDeleteTailor = async (id) => {
    await axios
      .delete(`http://localhost:5000/api/tailor/${id}`)
      .then(({ data }) => {
        setTailors((prev) => prev.filter((tailor) => tailor.id !== id));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium">Penjahit</h1>

      <table className="w-full">
        <thead>
          <tr className="border-b">
            <th className="pl-0 md:pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
              Nama penjahit
            </th>
            <th className="pl-6 py-4 text-xs text-left font-medium whitespace-nowrap">
              Status
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
          {tailors &&
            tailors.map((tailor, key) => {
              return (
                <tr key={key} className="border-b">
                  <td className="pl-0 md:pl-6 py-6 whitespace-nowrap">
                    <p className="text-sm">{tailor?.name}</p>
                  </td>
                  <td className="pl-6 py-6 whitespace-nowrap">
                    {tailor?.available === true ? (
                      <div className="inline-block px-3 py-1.5 bg-[#00712D]/[.12] rounded-full text-xs text-[#00712D] font-medium">
                        Ada
                      </div>
                    ) : (
                      <div className="inline-block px-3 py-1.5 bg-[#C62E2E]/[.12] rounded-full text-xs text-[#C62E2E] font-medium">
                        Tidak ada
                      </div>
                    )}
                  </td>
                  <td className="pl-6 py-6 whitespace-nowrap">
                    <p className="text-xs">
                      {new Date(tailor.createdAt).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-xs font-medium">Ditambahkan</p>
                  </td>
                  <td className="pl-6 py-6 whitespace-nowrap">
                    <div className="flex items-center gap-x-1">
                      <Link to={`/admin/tailor/edit/${tailor.id}`}>
                        <IconButton type="button" buttonType="icon">
                          <HiOutlinePencil className="text-lg" />
                        </IconButton>
                      </Link>
                      <IconButton
                        type="button"
                        onClick={() => handleDeleteTailor(tailor.id)}
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
    </>
  );
};

export default Tailor;
