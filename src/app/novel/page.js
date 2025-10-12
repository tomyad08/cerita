"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { listLink } from "@/utils/listLink";
import { LatexRenderer } from "./latexRender";
import { motion } from "framer-motion";

export default function TeksDanVideo() {
  const router = useRouter();
  const [data, setData] = useState(null);
  const [selectedSubjudul, setSelectedSubjudul] = useState(null);
  const [loading, setLoading] = useState(true);
  const [namaSamaran, setNamaSamaran] = useState("");
  const [avatar, setAvatar] = useState("");

  const goToTest = () => router.push("/tes");

  // Ambil subjudul dan data user dari sessionStorage
  useEffect(() => {
    const subjudulFromStorage = sessionStorage.getItem("select");
    const nama = sessionStorage.getItem("nama_samaran") || "Anonim";
    const avatarUrl =
      sessionStorage.getItem("avatar") ||
      "https://api.dicebear.com/7.x/bottts/svg?seed=default";

    setSelectedSubjudul(subjudulFromStorage);
    setNamaSamaran(nama);
    setAvatar(avatarUrl);
  }, []);

  // Fetch data sesuai subjudul
  useEffect(() => {
    if (!selectedSubjudul) return;
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(listLink.TEKS);
        const result = await res.json();
        const getSubjudul = result.find(
          (value) => value.subjudul === selectedSubjudul
        );
        setData(getSubjudul || null);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubjudul]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-50 text-gray-800 px-5 md:px-10 py-10 font-[Poppins]">
      {/* HEADER USER */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex justify-between items-center mb-8"
      >
        <div className="flex items-center gap-4">
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
            <h1 className="text-xl font-semibold text-gray-700">
              📖 Hello,{" "}
              <span className="font-bold bg-gradient-to-r from-blue-600 to-pink-500 bg-clip-text text-transparent">
                {namaSamaran}
              </span>
            </h1>
            <p className="text-sm text-gray-500">
              Yuk, baca dulu materinya biar makin paham!
            </p>
          </div>
        </div>
      </motion.div>

      {/* KONTEN */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-5xl mx-auto backdrop-blur-md bg-white/60 border border-white/40 rounded-3xl shadow-xl p-8"
      >
        {loading ? (
          <p className="text-center font-bold text-gray-600 animate-pulse">
            ⏳ Sedang memuat materi...
          </p>
        ) : !data ? (
          <p className="text-center font-bold text-red-600">
            ❌ Materi tidak ditemukan.
          </p>
        ) : (
          <>
            {/* Judul Subjudul */}
            <h2 className="text-2xl md:text-3xl font-extrabold text-center mb-8 text-gray-800">
              {data.subjudul}
            </h2>

            {/* Konten Utama */}
            <div className="grid md:grid-cols-2 gap-10">
              {/* Kolom kiri */}
              <div className="space-y-6 leading-relaxed text-justify text-gray-700">
                {data.psatu && <LatexRenderer text={data.psatu} />}

                {data.gsatu && (
                  <div className="text-center">
                    <img
                      src={data.gsatu}
                      alt="ilustrasi 1"
                      className="rounded-xl shadow-md mx-auto mb-2"
                    />
                    <p className="text-sm font-semibold text-gray-500">
                      {data.ketsatu}
                    </p>
                  </div>
                )}

                {data.pdua && <LatexRenderer text={data.pdua} />}
                {data.ptiga && <LatexRenderer text={data.ptiga} />}
              </div>

              {/* Kolom kanan */}
              <div className="space-y-6 leading-relaxed text-justify text-gray-700">
                {data.gdua && (
                  <div className="text-center">
                    <img
                      src={data.gdua}
                      alt="ilustrasi 2"
                      className="rounded-xl shadow-md mx-auto mb-2"
                    />
                    <p className="text-sm font-semibold text-gray-500">
                      {data.ketdua}
                    </p>
                  </div>
                )}

                {data.pempat && <LatexRenderer text={data.pempat} />}

                {/* Tombol Latihan Soal */}
                <div className="mt-8 text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={goToTest}
                    className="px-6 py-3 bg-gradient-to-r from-purple-500 to-blue-500 text-white rounded-xl font-bold shadow-lg hover:shadow-xl transition-all"
                  >
                    🧠 Yuk, Latihan Soal!
                  </motion.button>
                </div>
              </div>
            </div>
          </>
        )}
      </motion.div>
    </div>
  );
}
