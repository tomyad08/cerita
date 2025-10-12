"use client";

import { useState, useEffect } from "react";
import { listLink } from "@/utils/listLink";
import { LatexRenderer } from "../novel/latexRender";
import { useRouter } from "next/navigation";

export default function Page() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(7 * 60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [data, setData] = useState([]);

  const router = useRouter();

  // Ambil data user
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");

  // Ambil data user dari sessionStorage
  useEffect(() => {
    const savedName = sessionStorage.getItem("nama_samaran") || "Anonymous";
    const savedAvatar = sessionStorage.getItem("avatar") || null;
    setNickname(savedName);
    setAvatar(savedAvatar);
  }, []);

  // Ambil soal berdasarkan subjudul
  useEffect(() => {
    const fetchData = async () => {
      try {
        const selected = sessionStorage.getItem("select");
        const response = await fetch(listLink.TEST);
        if (!response.ok) throw new Error("Gagal mengambil data");

        const result = await response.json();
        if (!Array.isArray(result)) return;

        const filteredData = result.filter(
          (item) => item.subjudul === selected
        );
        setData(filteredData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  // Timer
  useEffect(() => {
    if (showScore || timeLeft <= 0) return;
    const timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, showScore]);

  const handleSelect = (nomor, pilihan) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [nomor]: pilihan,
    }));
  };

  const calculateScore = () => {
    let benar = 0;
    data.forEach((soal) => {
      if (selectedAnswers[soal.nomor] === soal.jawaban) benar++;
    });
    return benar;
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleSubmit = () => {
    setShowScore(true);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 9000);
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 text-gray-700">
        <p>Memuat soal...</p>
      </div>
    );
  }

  const soal = data[currentIndex];
  const score = calculateScore();
  const scorePercent = (score / data.length) * 100;

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-pink-50 to-blue-50 text-gray-800 p-5 md:p-10 flex flex-col items-center">
      {/* Header user */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {avatar && (
            <img
              src={avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-sky-300 shadow-sm"
            />
          )}
          <div>
            <p className="text-gray-600 text-sm">Welcome back,</p>
            <h2 className="font-bold text-lg text-sky-700">{nickname}</h2>
          </div>
        </div>

        <div className="bg-sky-500 text-white font-semibold px-3 py-1 rounded-xl text-sm shadow-md">
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* Kartu Soal */}
      <div className="bg-white/90 backdrop-blur-sm w-full md:w-3/4 rounded-2xl shadow-xl p-6 md:p-8 text-black">
        <h1 className="font-bold text-xl mb-3">Soal {soal.nomor}</h1>

        {soal.gambar && (
          <div className="flex justify-center mb-4">
            <img
              src={soal.gambar}
              alt={`Soal ${soal.nomor}`}
              className="max-h-60 rounded-lg shadow-md"
            />
          </div>
        )}

        <div className="mb-4 text-justify">
          <LatexRenderer text={soal.soal} />
        </div>

        <div className="space-y-3">
          {["A", "B", "C", "D", "E"].map((pilihan) => (
            <label
              key={pilihan}
              className={`flex items-center gap-2 p-3 rounded-xl border cursor-pointer transition ${
                selectedAnswers[soal.nomor] === pilihan
                  ? "bg-sky-100 border-sky-400"
                  : "hover:bg-gray-50 border-gray-200"
              }`}
            >
              <input
                type="radio"
                name={`soal-${soal.nomor}`}
                value={pilihan}
                checked={selectedAnswers[soal.nomor] === pilihan}
                onChange={() => handleSelect(soal.nomor, pilihan)}
              />
              <LatexRenderer text={soal[`pilihan_${pilihan}`]} />
            </label>
          ))}
        </div>

        {showScore && (
          <div className="mt-4 text-sm font-semibold">
            {selectedAnswers[soal.nomor] === soal.jawaban ? (
              <p className="text-green-600">✅ Jawaban Benar</p>
            ) : (
              <p className="text-red-600">❌ Salah (Kunci: {soal.jawaban})</p>
            )}
            <div className="flex justify-end">
              <button
                className="bg-purple-200 text-black p-2 rounded-lg"
                onClick={() => router.push("/list-bab")}
              >
                Home
              </button>
            </div>
          </div>
        )}

        {/* Navigasi Soal */}
        <div className="flex justify-end gap-3 mt-6">
          <button
            onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
            disabled={currentIndex === 0}
            className="px-4 py-2 bg-gray-200 rounded-xl text-gray-700 disabled:opacity-50"
          >
            Back
          </button>
          <button
            onClick={() =>
              setCurrentIndex((i) => Math.min(data.length - 1, i + 1))
            }
            disabled={currentIndex === data.length - 1}
            className="px-4 py-2 bg-sky-500 text-white rounded-xl shadow hover:scale-105 transition disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Tombol Kirim (pojok kanan bawah) */}
      <button
        onClick={handleSubmit}
        className="fixed bottom-0 w-full mx-2 bg-gradient-to-r from-blue-500 to-sky-400 text-white font-bold px-6 py-3 rounded shadow-lg hover:scale-110 transition"
      >
        Kirim
      </button>

      {/* Popup Hasil */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-2xl text-center w-80 animate-fadeIn">
            <h2 className="text-xl font-bold mb-2 text-gray-800">
              🎯 Hasil Tes
            </h2>
            <p className="text-lg font-semibold mb-3 text-gray-800">
              Skor Kamu: {score} / {data.length} ({Math.round(scorePercent)}%)
            </p>
            {scorePercent > 70 ? (
              <p className="text-green-600 font-bold text-lg">
                💥 Gacor abis, otakmu ngebul nih! 🔥
              </p>
            ) : (
              <p className="text-red-600 font-bold text-lg">
                😢 Belum maksimal, tapi semangat terus ya! 💪
              </p>
            )}
            <button
              className="w-full bg-purple-200 text-black p-2 rounded-lg"
              onClick={() => router.push("/list-bab")}
            >
              Home
            </button>
            <p className="text-gray-500 mt-3 text-sm">
              (Popup akan tertutup otomatis)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
