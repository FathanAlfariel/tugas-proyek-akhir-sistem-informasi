import React from "react";

const Tailor = () => {
  return (
    <>
      <h1 className="text-[28px] leading-9 font-medium">Penjahit</h1>

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
        <tbody></tbody>
      </table>
    </>
  );
};

export default Tailor;
