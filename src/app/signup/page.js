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

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

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

      if (!res.ok) throw new Error("Gagal menyimpan data.");

      sessionStorage.setItem("nama_lengkap", form.namaLengkap);
      sessionStorage.setItem("nama_samaran", form.namaSamaran);
      sessionStorage.setItem("avatar", avatar);

      router.push("/list-bab");
    } catch (err) {
      setErrorMsg(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center py-5 justify-center"
      style={{
        backgroundColor: "#F4F4F4",
        fontFamily: "Satoshi, sans-serif",
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8"
      >
        <div className="flex justify-between">
          <h2 className="text-3xl mt-4 font-extrabold text-center mb-6 tracking-tight bg-gradient-to-r from-blue-500 via-purple-200 to-pink-400 bg-clip-text text-transparent">
            Sign Up
          </h2>
          <img
            src="logo_tulip_192x192.png"
            alt=""
            className="w-20 h-20 rounded-full"
          />
        </div>

        {avatar && (
          <div className="flex justify-center mb-6">
            <img
              src={avatar}
              className="w-20 h-20 rounded-full border shadow-sm"
            />
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <InputField
            label="Nama Lengkap"
            name="namaLengkap"
            value={form.namaLengkap}
            onChange={handleChange}
            placeholder="Nama sesuai identitas"
          />

          <InputField
            label="Nama Samaran"
            name="namaSamaran"
            value={form.namaSamaran}
            onChange={handleChange}
            placeholder="Nama panggilan / alias"
          />

          <InputField
            label="Kode Rahasia"
            name="kode"
            type="password"
            value={form.kode}
            onChange={handleChange}
            placeholder="Kode akses"
          />

          <InputField
            label="Jurusan & Universitas Tujuan"
            name="jurusan"
            value={form.jurusan}
            onChange={handleChange}
            placeholder="Contoh: Teknik Mesin – ITB"
          />

          <InputField
            label="Nomor WhatsApp"
            name="nomor_wa"
            value={form.nomor_wa}
            onChange={handleChange}
            placeholder="08xxxxxxxxxx"
          />

          {errorMsg && (
            <p className="text-sm text-red-500 text-center">{errorMsg}</p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="relative w-full py-3 font-bold text-gray-600 rounded-xl bg-gradient-to-r from-blue-200 via-purple-200 to-pink-200 transition-all duration-300"
          >
            {loading ? "Memproses..." : "Daftar & Lanjutkan"}
          </button>
        </form>

        <p className="text-xs text-gray-400 text-center mt-5">
          Gunakan nama samaran untuk identitas belajar Anda.
        </p>
      </motion.div>
    </div>
  );
}
function InputField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
}) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium text-gray-600">{label}</label>
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
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
  );
}
