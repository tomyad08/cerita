"use client";

import { listLink } from "@/utils/listLink";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { dataBab } from "@/data/pilihBab";

export default function BabListPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  // const [loading, setLoading] = useState(true);
  const [namaSamaran, setNamaSamaran] = useState("");
  const [avatar, setAvatar] = useState(null);
  const [nilai, setNilai] = useState("0");
  const [ranking, setRanking] = useState([]);

  const router = useRouter();

  useEffect(() => {
    const nama = sessionStorage.getItem("nama_samaran");
    if (!nama) {
      router.push("/");
    }
    const avatarUrl =
      sessionStorage.getItem("avatar") ||
      "https://api.dicebear.com/7.x/bottts/svg?seed=default";

    setNamaSamaran(nama);
    setAvatar(avatarUrl);

    const fetchData = async () => {
      try {
        const res = await fetch(listLink.NILAI);
        const data = await res.json();

        // 💡 Hitung total nilai per nama
        const totalPerNama = data.reduce((acc, item) => {
          const nama = item.nama_samaran?.trim();
          const nilai = Number(item.nilai || 0);
          acc[nama] = (acc[nama] || 0) + nilai;
          return acc;
        }, {});

        // 💡 Ubah jadi array dan urutkan dari tertinggi
        const sortedRanking = Object.entries(totalPerNama)
          .map(([nama, total]) => ({
            nama,
            total,
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(
              nama
            )}`,
          }))
          .sort((a, b) => b.total - a.total);

        setRanking(sortedRanking);

        // 💡 Hitung total nilai user aktif
        const nilaiSiswa = totalPerNama[nama] || 0;
        setNilai(nilaiSiswa);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      }
    };

    fetchData();
  }, []);

  const filteredData = dataBab.filter((value) =>
    value.bab.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelection = (babIsSelected) => {
    sessionStorage.setItem("select", babIsSelected);
    router.push("/tes");
  };

  const [showOptions, setShowOptions] = useState(false);

  const handleSelect = (choice) => {
    sessionStorage.setItem("pushrankChoice", choice);
    setShowOptions(false);
    router.push("/pushrank");
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 py-10 "
      style={{
        backgroundColor: "#F4F4F4",
        fontFamily: "Satoshi, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl backdrop-blur-lg shadow-xl border border-white/40 rounded-3xl p-8"
      >
        {/* Header User */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-4">
            {avatar && (
              <motion.img
                src={avatar}
                alt="avatar"
                className="w-14 h-14 rounded-full border-2 border-blue-200 shadow-sm"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
              />
            )}
            <div>
              <h1 className="text-2xl font-semibold text-gray-500">
                👋 Welcome,
                <span className="font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
                  {namaSamaran}
                </span>
                <span className="bg-pink-200 rounded-full p-2 text-sm mb-2 mx-2 font-bold">
                  {nilai}
                </span>
              </h1>
              <p className="text-sm text-gray-500">
                Yuk lanjut pilih bab untuk latihan hari ini 💪
              </p>
            </div>
          </div>
        </div>

        {/* Tombol Pushrank */}
        <div className="flex justify-end mb-8 relative">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOptions(!showOptions)}
            className="bg-gradient-to-r from-blue-200 to-purple-300 font-bold text-gray-600 px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            🚀 Pushrank
          </motion.button>

          <AnimatePresence>
            {showOptions && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="absolute top-12 right-0 bg-white rounded-xl shadow-lg p-4 w-40 z-50"
              >
                <p className="text-gray-700 font-semibold mb-2 text-center">
                  Pilih Mode:
                </p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleSelect("TKA")}
                    className="px-4 py-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-700 font-medium transition-all"
                  >
                    TKA
                  </button>
                  <button
                    onClick={() => handleSelect("BING")}
                    className="px-4 py-2 rounded-lg bg-purple-100 hover:bg-purple-200 text-purple-700 font-medium transition-all"
                  >
                    BING
                  </button>
                  <button
                    onClick={() => handleSelect("PENALARAN")}
                    className="px-4 py-2 rounded-lg bg-pink-100 hover:bg-pink-200 text-pink-700 font-medium transition-all"
                  >
                    PENALARAN
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* ⚡️ Top 5 Ranking */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-gray-600 mb-4">
            🏆 Top 5 Kasta
          </h2>

          {ranking.length === 0 ? (
            <p className="text-gray-500 text-sm italic">
              Sedang menghitung kasta...
            </p>
          ) : (
            <div className="space-y-4">
              {ranking.slice(0, 5).map((r, i) => {
                const rank = i + 1;

                const medal =
                  rank === 1
                    ? "🥇"
                    : rank === 2
                    ? "🥈"
                    : rank === 3
                    ? "🥉"
                    : "";

                return (
                  <motion.div
                    key={r.nama}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: i * 0.05 }}
                    className={`
              flex items-center justify-between 
              p-4 rounded-2xl 
              bg-white/70 backdrop-blur-sm 
              border border-gray-100
              shadow-sm hover:shadow-md transition-all cursor-pointer
              ${r.nama === namaSamaran ? "ring-2 ring-blue-200" : ""}
            `}
                  >
                    {/* Kiri */}
                    <div className="flex items-center space-x-4">
                      <span className="text-lg font-semibold text-gray-500 w-6">
                        {rank}
                      </span>

                      <img
                        src={r.avatar}
                        alt={r.nama}
                        className="w-10 h-10 rounded-full border border-gray-200 shadow-sm"
                      />

                      <div className="flex flex-col">
                        <div className="flex items-center space-x-2">
                          {medal && <span>{medal}</span>}
                          <span className="font-semibold text-gray-700 max-w-[130px] truncate">
                            {r.nama}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Nilai */}
                    <span className="text-gray-700 font-semibold text-lg">
                      {r.total}
                    </span>
                  </motion.div>
                );
              })}
            </div>
          )}
        </div>

        {/* Input Pencarian */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="🔍 Cari nama bab..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 text-gray-700 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
        </div>

        {/* Daftar Bab */}
        <div className="space-y-4">
          {filteredData.map((value) => (
            <div
              className="border-b-2 dropshadow-xl p-5 rounded-xl"
              key={value.id}
              onClick={() => handleSelection(value.bab)}
            >
              <h1 className="font-bold text-2xl text-gray-600">{value.bab}</h1>
              <p className="text-sm text-gray-400">{value.keterangan}</p>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
