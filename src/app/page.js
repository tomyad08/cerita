"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    namaLengkap: "",
    namaSamaran: "",
    kode: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sessionStorage.setItem("nama_lengkap", form.namaLengkap);
    sessionStorage.setItem("nama_samaran", form.namaSamaran);
    sessionStorage.setItem("kode", form.kode);
    router.push("/list-bab");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-white px-4">
      <div className="w-full max-w-md bg-white shadow-lg rounded-2xl p-6">
        <h2 className="text-2xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-400 bg-clip-text text-transparent">
          “Let’s Gooo! 🎉”
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block mb-1 font-semibold text-black">
              Nama Lengkap
            </label>
            <input
              type="text"
              name="namaLengkap"
              value={form.namaLengkap}
              onChange={handleChange}
              placeholder="Masukkan nama lengkap"
              required
              className="w-full px-3 py-2 text-black border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-black">
              Nama Samaran
            </label>
            <input
              type="text"
              name="namaSamaran"
              value={form.namaSamaran}
              onChange={handleChange}
              placeholder="Masukkan nama samaran"
              required
              className="w-full px-3 py-2 border-2 text-black border-gray-200 rounded-xl focus:outline-none focus:border-pink-500"
            />
          </div>

          <div>
            <label className="block mb-1 font-semibold text-black">Kode</label>
            <input
              type="password"
              name="kode"
              value={form.kode}
              onChange={handleChange}
              placeholder="Masukkan kode rahasia"
              required
              className="w-full px-3 py-2 text-black border-2 border-gray-200 rounded-xl focus:outline-none focus:border-blue-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 font-bold text-white rounded-xl bg-gradient-to-r from-purple-600 via-pink-500 to-blue-400 hover:scale-105 transition-transform"
          >
            Masuk
          </button>
        </form>
      </div>
    </div>
  );
}
