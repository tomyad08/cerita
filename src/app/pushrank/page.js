"use client";

import { useState, useEffect } from "react";
import { listLink } from "@/utils/listLink";
import { LatexRenderer } from "../novel/latexRender";

export default function Page() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showScore, setShowScore] = useState(false);
  const [timeLeft, setTimeLeft] = useState(5 * 60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [data, setData] = useState([]);
  const [showHint, setShowHint] = useState(false);
  const [hintCount, setHintCount] = useState(0);
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  // === Fetch & Shuffle Data ===
  const fetchData = async () => {
    try {
      const response = await fetch(listLink.PUSHRANK);
      if (!response.ok) throw new Error("Gagal mengambil data dari API");

      const result = await response.json();
      if (!Array.isArray(result)) throw new Error("Response bukan array");

      const shuffled = result.sort(() => Math.random() - 0.5);
      setData(shuffled);
      setSelectedAnswers({});
      setShowScore(false);
      setTimeLeft(5 * 60);
      setCurrentIndex(0);
      setHintCount(0);
      setAnsweredQuestions([]);
    } catch (error) {
      console.error("Terjadi kesalahan saat fetch data:", error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // === Timer ===
  useEffect(() => {
    if (showScore) return;
    if (timeLeft <= 0) {
      handleAutoSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, showScore]);

  // === Fungsi Utama ===
  const handleSelect = (nomor, pilihan) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [nomor]: pilihan,
    }));

    // Tambahkan ke daftar soal yang dijawab jika belum ada
    setAnsweredQuestions((prev) =>
      prev.includes(nomor) ? prev : [...prev, nomor]
    );

    // Pindah otomatis ke soal berikutnya
    if (currentIndex < data.length - 1) {
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
      }, 300);
    } else {
      handleAutoSubmit();
    }
  };

  const calculateScore = () => {
    let benar = 0;
    let dijawab = 0;

    data.forEach((soal) => {
      if (selectedAnswers[soal.nomor]) {
        dijawab++;
        if (selectedAnswers[soal.nomor] === soal.jawaban) benar++;
      }
    });

    let totalSkor = benar * 10 - hintCount * 5;
    if (totalSkor < 0) totalSkor = 0;

    const scorePercent = dijawab > 0 ? Math.round((benar / dijawab) * 100) : 0;

    return { benar, dijawab, totalSkor, scorePercent };
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleAutoSubmit = () => {
    setShowScore(true);
    setShowPopup(true);
    setTimeout(() => setShowPopup(false), 8000);

    // Filter hanya soal yang dijawab untuk mode review
    const answeredOnly = data.filter((soal) =>
      Object.keys(selectedAnswers).includes(soal.nomor.toString())
    );
    setData(answeredOnly);
    setCurrentIndex(0);
  };

  const handleHint = () => {
    setShowHint(true);
    setHintCount((prev) => prev + 1);
  };

  const handleRestart = () => {
    fetchData();
  };

  if (!data || data.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-indigo-200 via-sky-100 to-pink-100 text-gray-700">
        <p>Memuat soal...</p>
      </div>
    );
  }

  const soal = data[currentIndex];
  const { benar, dijawab, totalSkor, scorePercent } = calculateScore();
  const isAnswered = selectedAnswers[soal.nomor] !== undefined;

  return (
    <div className="flex justify-center min-h-screen items-start bg-gradient-to-br from-purple-300 via-sky-200 to-pink-200 p-6 relative font-[Poppins]">
      <div className="flex-1 max-w-2xl w-full">
        <div className="bg-white/60 backdrop-blur-md p-6 rounded-2xl drop-shadow-2xl border border-white/30 relative">
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-800">
              Soal {currentIndex + 1}
            </h2>
            {!showScore && (
              <div className="flex items-center gap-3">
                <div className="px-3 py-1 bg-indigo-500 text-white rounded-xl text-xs shadow">
                  {formatTime(timeLeft)}
                </div>
                <button
                  onClick={handleHint}
                  className="px-3 py-1 bg-yellow-400 hover:bg-yellow-500 text-black rounded-xl font-semibold text-xs shadow"
                >
                  Hint
                </button>
              </div>
            )}
          </div>

          {/* Gambar Soal */}
          {soal.gambar && (
            <div className="mb-4 flex justify-center">
              <img
                src={soal.gambar}
                alt={`Soal ${soal.nomor}`}
                className="max-h-48 rounded-lg shadow-md"
              />
            </div>
          )}

          {/* Teks Soal */}
          <div className="p-2 text-black rounded-xl mb-4 bg-white/50">
            <LatexRenderer text={soal.soal} />
          </div>

          {/* Pilihan Jawaban */}
          {["A", "B", "C", "D", "E"].map((pilihan) => {
            const uniqueName = `soal-${currentIndex}`;
            const isSelected = selectedAnswers[soal.nomor] === pilihan;
            const isCorrect = soal.jawaban === pilihan;

            let bgColor = "hover:bg-indigo-100";
            if (showScore && isAnswered) {
              if (isCorrect) bgColor = "bg-green-300";
              else if (isSelected && !isCorrect) bgColor = "bg-red-300";
            } else if (isSelected) {
              bgColor = "bg-sky-200";
            }

            return (
              <label
                key={pilihan}
                className={`flex items-center gap-2 m-2 p-3 text-black rounded-xl cursor-pointer transition-all duration-200 ${bgColor}`}
              >
                <input
                  type="radio"
                  name={uniqueName}
                  value={pilihan}
                  checked={isSelected}
                  disabled={showScore}
                  onChange={() => handleSelect(soal.nomor, pilihan)}
                />
                <LatexRenderer text={soal[`pilihan_${pilihan}`]} />
              </label>
            );
          })}

          {/* Navigasi saat review */}
          {showScore && (
            <div className="flex justify-between mt-6">
              <button
                onClick={() => setCurrentIndex((i) => Math.max(0, i - 1))}
                disabled={currentIndex === 0}
                className="px-4 py-2 rounded-xl bg-gray-300 text-black font-semibold disabled:opacity-50 shadow"
              >
                ⬅ Back
              </button>
              <button
                onClick={() =>
                  setCurrentIndex((i) => Math.min(data.length - 1, i + 1))
                }
                disabled={currentIndex === data.length - 1}
                className="px-4 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-600 text-white font-semibold shadow disabled:opacity-50"
              >
                Next ➡
              </button>
            </div>
          )}

          {/* Tombol Ulangi Tes */}
          {showScore && currentIndex === data.length - 1 && (
            <div className="flex justify-center mt-6">
              <button
                onClick={handleRestart}
                className="px-6 py-2 bg-gradient-to-r from-green-500 to-lime-400 hover:opacity-90 text-white rounded-xl font-bold shadow-lg"
              >
                🔁 Ulangi Tes
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Popup Score */}
      {showPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white/80 backdrop-blur-md p-6 rounded-xl shadow-xl text-center w-80 animate-fadeIn border border-white/30">
            <h2 className="text-xl font-bold mb-2 text-gray-800">Hasil Tes</h2>
            <p className="text-lg font-semibold mb-3 text-gray-800">
              Skor: {totalSkor} ({scorePercent}%)
            </p>
            <p className="text-gray-700 font-semibold mb-2">
              Jawaban Benar: {benar} dari {dijawab} dijawab
            </p>
            <p className="text-gray-700 font-semibold mb-2">
              Hint digunakan: {hintCount}x
            </p>
            {scorePercent > 70 ? (
              <p className="text-green-600 font-bold">
                🎉 Hebat! Otakmu gacor banget! 🧠🔥
              </p>
            ) : (
              <p className="text-red-600 font-bold">
                😢 Belum maksimal, ayo belajar lagi!
              </p>
            )}
            <p className="text-gray-500 mt-3 text-sm">
              (Popup tertutup otomatis)
            </p>
          </div>
        </div>
      )}

      {/* Popup Hint */}
      {showHint && (
        <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg w-96">
            <h2 className="text-lg font-bold text-gray-800 mb-3 text-center">
              💡 Hint
            </h2>
            {soal.hint ? (
              <div className="text-black text-sm">
                <LatexRenderer text={soal.hint} />
              </div>
            ) : (
              <p className="text-gray-600 italic text-center">
                Tidak ada hint untuk soal ini.
              </p>
            )}
            <div className="mt-4 flex justify-center">
              <button
                onClick={() => setShowHint(false)}
                className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
