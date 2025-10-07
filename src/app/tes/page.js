"use client";

import { useState, useEffect } from "react";

import { listLink } from "@/utils/listLink";
import { LatexRenderer } from "../novel/latexRender";

export default function Page() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [panelOpen, setPanelOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [data, setData] = useState([]);

  // Ambil data berdasarkan subjudul yang disimpan di sessionStorage
  useEffect(() => {
    const fetchData = async () => {
      try {
        const selected = sessionStorage.getItem("select");

        // Ambil data dari endpoint API
        const response = await fetch(listLink.TEST);
        if (!response.ok) {
          throw new Error("Gagal mengambil data dari API");
        }

        const result = await response.json();

        // Pastikan result berupa array
        if (!Array.isArray(result)) {
          console.error("Response dari API bukan array!");
          return;
        }

        // Filter data sesuai subjudul yang dipilih
        const filteredData = result.filter(
          (item) => item.subjudul === selected
        );

        setData(filteredData);
      } catch (error) {
        console.error("Terjadi kesalahan saat fetch data:", error);
      }
    };

    fetchData();
  }, []);

  // Timer
  useEffect(() => {
    if (showScore) return;
    if (timeLeft <= 0) {
      setShowScore(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

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
    setTimeout(() => setShowPopup(false), 10000);
  };

  // Pastikan data sudah ada
  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-blue-100 text-gray-700">
        <p>Memuat soal...</p>
      </div>
    );
  }

  const soal = data[currentIndex];
  const score = calculateScore();
  const scorePercent = (score / data.length) * 100;

  return (
    <div className="flex flex-col gap-2 md:flex-row justify-center min-h-screen items-start bg-blue-100 p-6 relative">
      {/* Panel soal kiri */}
      <div className="flex-1 w-full">
        <div className="bg-white p-5 rounded-xl drop-shadow-xl">
          <div className="flex justify-between items-center mb-4">
            <div className="font-bold text-black">Soal {soal.nomor}</div>
            <div className="px-3 py-1 bg-blue-500 text-white rounded-xl text-xs">
              {formatTime(timeLeft)}
            </div>
          </div>

          {/* Tampilkan gambar jika ada */}
          {soal.gambar && (
            <div className="mb-4 flex justify-center">
              <img
                src={soal.gambar}
                alt={`Soal ${soal.nomor}`}
                className="max-h-48 rounded-lg"
              />
            </div>
          )}

          <div className="p-2 text-black rounded-xl mb-4">
            <LatexRenderer text={soal.soal} />
          </div>

          {["A", "B", "C", "D", "E"].map((pilihan) => (
            <label
              key={pilihan}
              className={`flex items-center gap-2 m-2 p-2 text-black rounded-xl cursor-pointer ${
                selectedAnswers[soal.nomor] === pilihan
                  ? "bg-sky-200"
                  : "hover:bg-sky-100"
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

          <div className="mt-3 font-semibold text-sm text-gray-700">
            {showScore &&
              (selectedAnswers[soal.nomor] === soal.jawaban
                ? "✅ Benar"
                : `❌ Salah (Kunci: ${soal.jawaban})`)}
          </div>

          {/* Tombol navigasi */}
          <div className="flex justify-end gap-2 mt-6">
            <button
              onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
              disabled={currentIndex === 0}
              className="px-4 py-2 rounded-xl bg-gray-300 text-black disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={() =>
                setCurrentIndex((i) => Math.min(data.length - 1, i + 1))
              }
              disabled={currentIndex === data.length - 1}
              className="px-4 py-2 rounded-xl bg-sky-600 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      </div>

      {/* Panel Kontrol */}
      <div
        className={`
          bg-white drop-shadow-xl rounded-t-xl md:rounded-xl
          transition-transform duration-300 ease-in-out
          fixed md:static bottom-0 left-0 w-full md:w-1/4
          ${panelOpen ? "translate-y-0" : "translate-y-[80%] md:translate-y-0"}
        `}
      >
        <div
          className="p-3 bg-sky-600 text-white font-bold text-center rounded-t-xl cursor-pointer md:cursor-default"
          onClick={() => setPanelOpen(!panelOpen)}
        >
          {formatTime(timeLeft)}
        </div>

        <div className="p-4 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Nomor soal indikator */}
          <div className="gap-2 columns-5">
            {data.map((soal) => (
              <div
                key={soal.nomor}
                className={`p-2 rounded-xl text-center mb-2 drop-shadow cursor-pointer ${
                  selectedAnswers[soal.nomor] ? "bg-green-300" : "bg-blue-300"
                }`}
                onClick={() => setCurrentIndex(soal.nomor - 1)}
              >
                {soal.nomor}
              </div>
            ))}
          </div>

          {/* Tombol Kirim */}
          <div className="flex justify-center">
            <button
              onClick={handleSubmit}
              className="w-5/12 bg-sky-800 text-white p-2 rounded-xl text-center font-bold drop-shadow cursor-pointer"
            >
              Kirim
            </button>
          </div>

          {showScore && (
            <div className="mt-4 text-center text-black font-bold text-lg">
              Skor Kamu: {score} / {data.length}
            </div>
          )}
        </div>
      </div>

      {/* Popup */}
      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl text-center w-80 animate-fadeIn">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Hasil Tes</h2>
            <p className="text-lg font-semibold mb-3 text-gray-800">
              Skor Kamu: {score} / {data.length} ({Math.round(scorePercent)}%)
            </p>
            {scorePercent > 70 ? (
              <div>
                <p className="text-green-600 font-bold text-lg">
                  🎉 Mantap! gacorr juga otak kamuu! 🐉✨
                </p>
              </div>
            ) : (
              <div>
                <p className="text-red-600 font-bold text-lg">
                  😢🐉 Yah, kecill.. gak apa-apa. coba pelajari lagi yaaa..
                </p>
              </div>
            )}
            <p className="text-gray-500 mt-3 text-sm">
              (Popup akan tertutup otomatis)
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
