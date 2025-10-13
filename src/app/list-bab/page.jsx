"use client";

import { listLink } from "@/utils/listLink";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function BabListPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [namaSamaran, setNamaSamaran] = useState("");
  const [avatar, setAvatar] = useState(null); // ✅ ubah default ke null

  const router = useRouter();

  // Ambil data dari sessionStorage
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
  }, []);

  // Fetch list bab
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(listLink.TEKS);
        const result = await res.json();
        setData(result);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const filteredData = data.filter((value) =>
    value.judul.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelection = (selectedSubjudul) => {
    sessionStorage.setItem("select", selectedSubjudul);
    router.push("/novel");
  };

  const [showOptions, setShowOptions] = useState(false);

  const handleSelect = (choice) => {
    // Simpan pilihan ke sessionStorage
    sessionStorage.setItem("pushrankChoice", choice);
    // Tutup popup
    setShowOptions(false);
    // Arahkan ke halaman /pushrank
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
        {/* Header User */}
        <div className="flex items-center justify-between mb-1">
          <div className="flex items-center space-x-4">
            {/* ✅ Render avatar hanya jika src valid */}
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
                👋 Welcome,{" "}
                <span className="font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                  {namaSamaran}
                </span>
              </h1>
              <p className="text-sm text-gray-500">
                Yuk lanjut pilih bab untuk latihan hari ini 💪
              </p>
            </div>
          </div>
        </div>
        <div className="flex justify-end mb-8 relative">
          {/* Tombol utama */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowOptions(!showOptions)}
            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-5 py-2 rounded-xl shadow-md hover:shadow-lg transition-all"
          >
            🚀 Pushrank
          </motion.button>

          {/* Popup pilihan */}
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
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
        ){/* Input Pencarian */}
        <div className="relative mb-8">
          <input
            type="text"
            placeholder="🔍 Cari nama bab..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full px-5 py-3 text-gray-700 border border-gray-200 rounded-2xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent"
          />
          <motion.span
            initial={{ opacity: 0 }}
            animate={{ opacity: search ? 1 : 0 }}
            className="absolute right-4 top-3.5 text-sm text-gray-400 italic"
          >
            {filteredData.length} hasil
          </motion.span>
        </div>
        {/* Daftar Bab */}
        <div className="space-y-4">
          {loading ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-gray-500 text-center"
            >
              ⏳ Sedang memuat data...
            </motion.p>
          ) : filteredData.length > 0 ? (
            filteredData.map((value, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0px 4px 20px rgba(147, 197, 253, 0.3)",
                }}
                className="p-4 bg-white rounded-2xl border border-gray-100 cursor-pointer transition-all hover:bg-gradient-to-r hover:from-blue-50 hover:to-pink-50"
                onClick={() => handleSelection(value.subjudul)}
              >
                <h2 className="text-lg font-semibold text-gray-800">
                  {value.judul}
                </h2>
                <p className="text-sm text-gray-500">{value.subjudul}</p>
              </motion.div>
            ))
          ) : (
            <p className="text-gray-400 text-center">
              Tidak ada bab yang cocok dengan pencarianmu 😅
            </p>
          )}
        </div>
      </motion.div>
    </div>
  );
}
