"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    namaLengkap: "",
    namaSamaran: "",
    kode: "",
  });
  const [avatar, setAvatar] = useState("");

  // update avatar otomatis berdasarkan nama samaran
  useEffect(() => {
    if (form.namaSamaran) {
      setAvatar(
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${form.namaSamaran}`
      );
    }
  }, [form.namaSamaran]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // simpan semua data ke sessionStorage
    sessionStorage.setItem("nama_lengkap", form.namaLengkap);
    sessionStorage.setItem("nama_samaran", form.namaSamaran);
    sessionStorage.setItem("kode", form.kode);
    sessionStorage.setItem("avatar", avatar);

    router.push("/list-bab");
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-white to-pink-50 text-gray-700 overflow-hidden">
      {/* efek partikel lembut */}
      <div className="absolute inset-0 bg-[radial-gradient(#dbeafe,transparent_1px)] [background-size:16px_16px] opacity-50 animate-[pulse_6s_infinite]" />

      {/* kartu login */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md backdrop-blur-xl m-5 bg-white/80 border border-white/60 rounded-3xl shadow-[0_0_25px_rgba(147,197,253,0.4)] p-8"
      >
        <h2 className="text-3xl font-extrabold text-center mb-6 tracking-tight bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 bg-clip-text text-transparent">
          🌈 Welcome to The Arena
        </h2>

        {/* avatar preview */}
        {form.namaSamaran.trim() && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="flex justify-center mb-4"
          >
            <img
              src={`https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
                form.namaSamaran
              )}`}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            />
          </motion.div>
        )}

        {/* form login */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block mb-1 font-semibold text-blue-600">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="namaLengkap"
              value={form.namaLengkap}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap..."
              required
              className="w-full px-4 py-2 bg-white/60 border border-blue-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-400 text-gray-700 placeholder-gray-400"
            />
          </div>

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

        <p className="text-center mt-6 text-sm text-gray-500">
          💡 Tip: Gunakan nama samaran unik biar avatarmu tampil beda!
        </p>
      </motion.div>
    </div>
  );
}
