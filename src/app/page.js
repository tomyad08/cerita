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
    <div
      className="relative min-h-screen flex items-center justify-center text-gray-700 overflow-hidden"
      style={{
        backgroundColor: "#F4F4F4",
        fontFamily: "Satoshi, sans-serif",
      }}
    >
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
            className="relative z-10 w-[90%] max-w-md m-5 p-8 backdrop-blur-xl border border-white/60 rounded-3xl shadow-[0_0_25px_rgba(147,197,253,0.4)]"
            style={{ backgroundColor: "#F4F4F4" }}
          >
            <div className="flex justify-between">
              <h2 className="text-3xl mt-4 font-extrabold text-center mb-6 tracking-tight bg-gradient-to-r from-blue-500 via-purple-200 to-pink-400 bg-clip-text text-transparent">
                Login
              </h2>
              <img
                src="logo_tulip_192x192.png"
                alt=""
                className="w-20 h-20 rounded-full"
              />
            </div>

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
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Nama Samaran
                </label>
                <input
                  type="text"
                  name="namaSamaran"
                  value={form.namaSamaran}
                  onChange={handleChange}
                  placeholder="Masukkan nama samaran"
                  required
                  className="
      w-full 
      px-2 py-2 
      bg-transparent
      border-b 
      border-gray-300 
      focus:border-gray-600 
      focus:outline-none 
      transition-all 
      text-gray-700 
      placeholder-gray-400
    "
                />
              </div>

              {/* Input Kode Rahasia */}
              <div className="space-y-1">
                <label className="text-sm font-medium text-gray-500">
                  Kode Rahasia
                </label>
                <input
                  type="password"
                  name="kode"
                  value={form.kode}
                  onChange={handleChange}
                  placeholder="Masukkan kode"
                  required
                  className="
      w-full 
      px-2 py-2
      bg-transparent
      border-b 
      border-gray-300 
      focus:border-gray-600
      focus:outline-none
      transition-all
      text-gray-700
      placeholder-gray-400
    "
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
                  boxShadow: "0 0 20px rgba(200,200,200,0.6)",
                }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="relative w-full py-3 font-bold text-gray-700 rounded-xl bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 transition-all duration-300"
              >
                Login
              </motion.button>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  );
}
