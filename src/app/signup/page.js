"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { listLink } from "@/utils/listLink";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    namaLengkap: "",
    namaSamaran: "",
    kode: "",
    nomor_wa: "",
    jurusan: "",
  });
  const [avatar, setAvatar] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // update avatar otomatis berdasarkan nama samaran
  useEffect(() => {
    if (form.namaSamaran.trim()) {
      setAvatar(
        `https://api.dicebear.com/7.x/adventurer/svg?seed=${encodeURIComponent(
          form.namaSamaran
        )}`
      );
    } else {
      setAvatar("");
    }
  }, [form.namaSamaran]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    try {
      const fd = new FormData();
      fd.append("nama_lengkap", form.namaLengkap);
      fd.append("nama_samaran", form.namaSamaran);
      fd.append("kode", form.kode);
      fd.append("jurusan", form.jurusan);
      fd.append("no_whatsaap", form.nomor_wa);

      const res = await fetch(listLink.DATABASE, {
        method: "POST",
        body: fd,
      });

      // jika gagal (res.ok === false), jangan pindah halaman
      if (!res.ok) {
        const text = await res.text();
        console.error("Response error:", text);
        throw new Error("Gagal menyimpan data ke server. Silakan coba lagi.");
      }

      // simpan semua data ke sessionStorage
      sessionStorage.setItem("nama_lengkap", form.namaLengkap);
      sessionStorage.setItem("nama_samaran", form.namaSamaran);
      sessionStorage.setItem("avatar", avatar);

      // pindah halaman hanya jika fetch berhasil
      router.push("/list-bab");
    } catch (err) {
      console.error("Error:", err);
      setErrorMsg(err.message || "Terjadi kesalahan saat mengirim data.");
    } finally {
      setLoading(false);
    }
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
          🌈 Join To The Arena
        </h2>

        {/* avatar preview */}
        {avatar && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 120 }}
            className="flex justify-center mb-4"
          >
            <img
              src={avatar}
              alt="avatar"
              className="w-24 h-24 rounded-full border-4 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.6)]"
            />
          </motion.div>
        )}

        {/* form login */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <InputField
            label="Nama Lengkap"
            name="namaLengkap"
            color="blue"
            value={form.namaLengkap}
            onChange={handleChange}
            placeholder="Masukkan nama lengkap..."
          />

          <InputField
            label="Nama Samaran"
            name="namaSamaran"
            color="pink"
            value={form.namaSamaran}
            onChange={handleChange}
            placeholder="Masukkan nama samaran..."
          />

          <InputField
            label="Kode Rahasia"
            name="kode"
            color="purple"
            type="password"
            value={form.kode}
            onChange={handleChange}
            placeholder="Masukkan kode rahasia..."
          />

          <InputField
            label="Pilihan Jurusan dan Universitas"
            name="jurusan"
            color="purple"
            value={form.jurusan}
            onChange={handleChange}
            placeholder="Misal: Teknik Mesin - ITB"
          />

          <InputField
            label="Nomor WhatsApp"
            name="nomor_wa"
            color="violet"
            value={form.nomor_wa}
            onChange={handleChange}
            placeholder="Misal: 085772xxxxx..."
          />

          {errorMsg && (
            <p className="text-red-500 text-sm text-center font-semibold">
              ⚠️ {errorMsg}
            </p>
          )}

          <motion.button
            whileHover={{
              scale: 1.05,
              boxShadow: "0 0 20px rgba(147,197,253,0.6)",
            }}
            whileTap={{ scale: 0.95 }}
            disabled={loading}
            type="submit"
            className={`relative w-full py-3 font-bold text-white rounded-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-300 ${
              loading ? "opacity-70 cursor-not-allowed" : ""
            }`}
          >
            {loading ? "⏳ Mengirim data..." : "🚀 Submit"}
          </motion.button>
        </form>

        <p className="text-center mt-6 text-sm text-gray-500">
          💡 Tip: Gunakan nama samaran unik biar avatarmu tampil beda!
        </p>
      </motion.div>
    </div>
  );
}

/* Komponen InputField agar lebih rapi */
function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  color = "blue",
}) {
  return (
    <div>
      <label className={`block mb-1 font-semibold text-${color}-600`}>
        {label}
      </label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required
        className={`w-full px-4 py-2 bg-white/60 border border-${color}-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-${color}-400 text-gray-700 placeholder-gray-400`}
      />
    </div>
  );
}
