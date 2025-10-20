"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { listLink } from "@/utils/listLink";

export default function LoginPage() {
  const router = useRouter();

  // --- STATE ---
  const [form, setForm] = useState({
    namaSamaran: "",
    kode: "",
  });
  const [avatar, setAvatar] = useState("");
  const [siswa, setSiswa] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // --- FETCH DATA SISWA ---
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(listLink.DATABASE);
        const data = await res.json();
        setSiswa(data);
      } catch (err) {
        console.error("Gagal fetch data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // --- UPDATE AVATAR OTOMATIS ---
  useEffect(() => {
    if (form.namaSamaran) {
      setAvatar(
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
          form.namaSamaran
        )}`
      );
    }
  }, [form.namaSamaran]);

  // --- HANDLE INPUT CHANGE ---
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // --- HANDLE SUBMIT ---
  const handleSubmit = (e) => {
    e.preventDefault();

    const user = siswa.find(
      (value) =>
        form.namaSamaran === value.nama_samaran &&
        form.kode === String(value.kode)
    );

    if (user) {
      if (typeof window !== "undefined") {
        sessionStorage.setItem("nama_samaran", form.namaSamaran);
        sessionStorage.setItem("avatar", avatar);
      }

      setError("");
      router.push("/list-bab");
    } else {
      setError("❌ Nama samaran atau kode salah!");
    }
  };

  // --- RENDER ---
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 text-gray-700 overflow-hidden">
      {/* Efek partikel lembut */}
      <div className="absolute inset-0 bg-[radial-gradient(#dbeafe,transparent_1px)] [background-size:16px_16px] opacity-50 animate-[pulse_6s_infinite]" />
      {loading ? (
        <div>Loading ...</div>
      ) : (
        <div>
          {/* Kartu login */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="relative z-10 w-full max-w-md m-5 p-8 backdrop-blur-xl bg-white/80 border border-white/60 rounded-3xl shadow-[0_0_25px_rgba(147,197,253,0.4)]"
          >
            <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
              🌈 Welcome to The Arena
            </h2>

            {/* Avatar Preview */}
            {form.namaSamaran.trim() && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 120 }}
                className="flex justify-center mb-4"
              >
                <img
                  src={avatar || undefined}
                  alt="avatar"
                  className="w-24 h-24 rounded-full border-4 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
                />
              </motion.div>
            )}

            {/* Form Login */}
            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Input Nama Samaran */}
              <div>
                <label className="block mb-1 font-semibold text-pink-600">
                  Nama Samaran
                </label>
                <input
                  type="text"
                  name="namaSamaran"
                  value={form.namaSamaran}
                  onChange={handleChange}
                  placeholder="Masukkan nama samaran..."
                  required
                  className="w-full px-4 py-2 bg-white/60 border border-pink-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-pink-400 text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Input Kode Rahasia */}
              <div>
                <label className="block mb-1 font-semibold text-purple-600">
                  Kode Rahasia
                </label>
                <input
                  type="password"
                  name="kode"
                  value={form.kode}
                  onChange={handleChange}
                  placeholder="Masukkan kode rahasia..."
                  required
                  className="w-full px-4 py-2 bg-white/60 border border-purple-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 text-gray-700 placeholder-gray-400"
                />
              </div>

              {/* Error Message */}
              {error && (
                <p className="text-center text-sm text-red-500 font-medium">
                  {error}
                </p>
              )}

              {/* Tombol Submit */}
              <motion.button
                whileHover={{
                  scale: 1.05,
                  boxShadow: "0 0 20px rgba(147,197,253,0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="relative w-full py-3 font-bold text-white rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300"
              >
                🚀 Enter The Arena
              </motion.button>
            </form>

            <p
              className="text-center mt-6 text-sm text-gray-500 hover:cursor-pointer"
              onClick={() => router.push("/signup")}
            >
              💡 Belum punya akun? silahkan klik disini.
            </p>
          </motion.div>
        </div>
      )}
    </div>
  );
}
