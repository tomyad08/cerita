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

  // Fetch list bab
  // useEffect(() => {
  //   const fetchData = async () => {
  //     try {
  //       const res = await fetch(listLink.TEKS);
  //       const result = await res.json();
  //       setData(result);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 flex items-center justify-center px-4 py-10">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-3xl backdrop-blur-lg bg-white/70 shadow-xl border border-white/40 rounded-3xl p-8"
      >
        {/* Hero Banner */}
        {/* {click ? (
          <div>
            <motion.div
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7 }}
              className="mb-8 bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 p-4 rounded-3xl shadow-md text-center"
            >
              <div
                className="flex justify-end text-black font-bold"
                onClick={() => setClick(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  fill="red"
                  className="bi bi-x-circle"
                  viewBox="0 0 16 16"
                >
                  <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                  <path d="M4.646 4.646a.5.5 0 0 1 .708 0L8 7.293l2.646-2.647a.5.5 0 0 1 .708.708L8.707 8l2.647 2.646a.5.5 0 0 1-.708.708L8 8.707l-2.646 2.647a.5.5 0 0 1-.708-.708L7.293 8 4.646 5.354a.5.5 0 0 1 0-.708" />
                </svg>
              </div>
              <div className="p-4">
                <h1 className="md:text-3xl text-lg font-extrabold text-gray-800 mb-2 text-center">
                  Berani Uji Nalarmu? 💣
                </h1>

                <p className="text-gray-700 max-w-xl mx-auto text-justify">
                  Ikuti{" "}
                  <span className="font-semibold text-blue-700">
                    kelas penalaran umum online
                  </span>{" "}
                  gratis, seru, dan bikin otakmu kerja lembur dengan cara
                  menyenangkan. Siap tantang logikamu?
                </p>

                <div className="text-start mt-4 text-sm text-gray-600">
                  📅{" "}
                  <span className="font-semibold">Senin, 27 Oktober 2025</span>{" "}
                  <br />
                  🕗 Pukul{" "}
                  <span className="font-semibold">20.00 – 21.30 WIB</span>{" "}
                  <br />
                  📍 Melalui{" "}
                  <span className="font-semibold text-green-700">
                    Google Meet
                  </span>
                </div>

                <button
                  className="mt-5 w-full py-3 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-500 
  text-white font-bold rounded-xl shadow-md hover:shadow-lg hover:scale-[1.03] 
  transition-all duration-300"
                >
                  🚀 Daftar Sekarang
                </button>
              </div>

              <img
            src="/arena-hero.png"
            alt="Arena Hero"
            className="mx-auto mt-4 w-56 h-auto rounded-2xl shadow-lg"
          />
            </motion.div>
          </div>
        ) : (
          ""
        )} */}

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
              <h1 className="text-2xl font-semibold text-gray-700">
                👋 Welcome,
                <span className="font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                  {namaSamaran}
                </span>
                <span className="bg-pink-300 rounded-full p-2 text-sm mb-2 mx-2 font-bold">
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
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
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
          <h2 className="text-xl font-bold text-gray-700 mb-4">
            🏆 Top 5 Kasta
          </h2>
          {ranking.length === 0 ? (
            <p className="text-gray-500 text-sm italic">
              Sedang menghitung kasta...
            </p>
          ) : (
            <div className="space-y-3">
              {ranking.slice(0, 5).map((r, i) => {
                const rank = i + 1;

                // Tentukan ukuran avatar berdasarkan peringkat
                const sizeMap = {
                  1: "w-14 h-14",
                  2: "w-12 h-12",
                  3: "w-10 h-10",
                  4: "w-9 h-9",
                  5: "w-8 h-8",
                };
                const avatarSize = sizeMap[rank] || "w-8 h-8";

                // Tentukan medali berdasarkan ranking
                const medal =
                  rank === 1
                    ? "🥇"
                    : rank === 2
                    ? "🥈"
                    : rank === 3
                    ? "🥉"
                    : "";

                // Warna latar dinamis
                const bgClass =
                  r.nama === namaSamaran
                    ? "bg-yellow-100 border-2 border-yellow-300"
                    : "bg-white border border-gray-100";

                return (
                  <motion.div
                    key={r.nama}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-xl ${bgClass}`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="font-bold text-lg text-gray-600 w-7 text-center">
                        #{rank}
                      </span>

                      <img
                        src={r.avatar}
                        alt={r.nama}
                        className={`${avatarSize} rounded-full border border-gray-300 shadow-sm`}
                      />

                      <div className="flex items-center space-x-1">
                        {medal && <span className="text-lg">{medal}</span>}
                        <span className="font-semibold text-gray-700 truncate max-w-[120px]">
                          {r.nama}
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-600 font-medium">{r.total}</span>
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
