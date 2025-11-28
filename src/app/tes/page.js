"use client";

import { useState, useEffect } from "react";
import { listLink } from "@/utils/listLink";
import { LatexRenderer } from "../novel/latexRender";
import { useRouter } from "next/navigation";

export default function Page() {
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showHint, setShowHint] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);
  const [data, setData] = useState([]);
  const [lives, setLives] = useState(15);
  const [ask, setAsk] = useState(7);
  const [gameOver, setGameOver] = useState(false);
  const [reviewSoal, setReviewSoal] = useState(null);
  const [strikeCount, setStrikeCount] = useState(0);
  const [showStrikePopup, setShowStrikePopup] = useState(false);

  const router = useRouter();

  // User data
  const [nickname, setNickname] = useState("");
  const [avatar, setAvatar] = useState("");

  useEffect(() => {
    const nama = sessionStorage.getItem("nama_samaran");
    if (!nama) router.push("/");
    const savedAvatar = sessionStorage.getItem("avatar") || null;
    setNickname(nama);
    setAvatar(savedAvatar);
  }, []);

  // Fetch soal
  useEffect(() => {
    const fetchData = async () => {
      try {
        const selected = sessionStorage.getItem("select");
        const response = await fetch(listLink.PENALARAN);
        const result = await response.json();

        const filteredData = result.filter((item) => item.bab === selected);
        setData(filteredData);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  // Timer
  useEffect(() => {
    if (timeLeft <= 0 || gameOver) return;
    const timer = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, gameOver]);

  // Format waktu
  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // Hitung nilai
  const calculateScore = () => {
    return data.reduce((acc, soal) => {
      if (selectedAnswers[soal.nomor] === soal.jawaban) acc++;
      return acc;
    }, 0);
  };

  // Handling select jawaban
  const handleSelect = (nomor, pilihan) => {
    const soalSaatIni = data[currentIndex];
    const isCorrect = pilihan === soalSaatIni.jawaban;

    // Simpan jawaban
    setSelectedAnswers((prev) => ({
      ...prev,
      [nomor]: pilihan,
    }));

    // --- LOGIKA STRIKE ---
    if (isCorrect) {
      setStrikeCount((prev) => {
        const newCount = prev + 1;

        if (newCount === 3) {
          // Aktifkan STRIKE
          setShowStrikePopup(true);

          // Bonus berdasarkan level
          if (soalSaatIni.level === "easy") {
            setAsk((prevAsk) => prevAsk + 1);
          } else if (soalSaatIni.level === "medium") {
            setLives((prevLives) => prevLives + 1);
          } else if (soalSaatIni.level === "hard") {
            setAsk((prevAsk) => prevAsk + 1);
            setLives((prevLives) => prevLives + 1);
          }

          return 0; // reset setelah strike
        }

        return newCount;
      });
    } else {
      // Jawaban salah → reset strike dan kurangi nyawa
      setStrikeCount(0);
      setLives((prev) => {
        const newLives = prev - 1;
        if (newLives <= 0) setGameOver(true);
        return Math.max(newLives, 0);
      });
    }

    // Pindah otomatis
    setTimeout(() => {
      if (currentIndex < data.length - 1) {
        setCurrentIndex((i) => i + 1);
      } else {
        setShowWinPopup(true);
      }
    }, 500);
  };

  // Kirim nilai otomatis ketika user menyelesaikan semua soal
  useEffect(() => {
    if (showWinPopup && nickname) {
      const sendNilai = async () => {
        try {
          const fd = new FormData();
          fd.append("nama_samaran", nickname);
          fd.append("nilai", 300); // skor yang kamu mau kirim

          await fetch(listLink.NILAI, {
            method: "POST",
            body: fd,
          });

          console.log("Nilai berhasil dikirim!");
        } catch (error) {
          console.error("Gagal mengirim nilai:", error);
        }
      };

      sendNilai();
    }
  }, [showWinPopup, nickname]);

  // Jika nyawa habis → Game Over
  if (gameOver) {
    return (
      <div className="fixed inset-0 bg-black/60 flex justify-center items-center text-center">
        <div className="bg-white p-6 rounded-2xl shadow-2xl w-80 animate-bounce">
          <h2 className="text-3xl font-extrabold text-red-600 mb-3">
            💀 GAME OVER!
          </h2>
          <p className="text-black mb-4 font-semibold">
            Nyawamu habis… tapi bukan semangatmu. Ayo GAS lagi kan?? 😎🔥
          </p>
          <button
            onClick={() => router.push("/list-bab")}
            className="bg-purple-400 w-full p-2 rounded-lg font-bold shadow-md hover:scale-105 transition"
          >
            Kembali ke Home
          </button>
        </div>
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Memuat soal...
      </div>
    );
  }

  const soal = data[currentIndex];
  const score = calculateScore();
  const scorePercent = Math.round((score / data.length) * 100);

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-blue-200 via-pink-100 to-purple-200 p-5 md:p-10 flex flex-col items-center">
      {/* HEADER */}
      <div className="w-full flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          {avatar && (
            <img
              src={avatar}
              alt="Avatar"
              className="w-12 h-12 rounded-full border-2 border-purple-400 shadow-lg"
            />
          )}
          <div>
            <p className="text-gray-600 text-sm">Welcome back,</p>
            <h2 className="font-extrabold text-xl text-purple-700 tracking-wide drop-shadow">
              {nickname}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="bg-sky-600 text-white font-bold px-3 py-1 rounded-xl text-sm shadow-lg">
            ⏱ {formatTime(timeLeft)}
          </div>
          <div className="flex bg-purple-500 text-white font-bold px-3 py-1 rounded-xl text-sm shadow-lg animate-pulse">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              fill="currentColor"
              className="bi bi-person-raised-hand"
              viewBox="0 0 16 16"
            >
              <path d="M6 6.207v9.043a.75.75 0 0 0 1.5 0V10.5a.5.5 0 0 1 1 0v4.75a.75.75 0 0 0 1.5 0v-8.5a.25.25 0 1 1 .5 0v2.5a.75.75 0 0 0 1.5 0V6.5a3 3 0 0 0-3-3H6.236a1 1 0 0 1-.447-.106l-.33-.165A.83.83 0 0 1 5 2.488V.75a.75.75 0 0 0-1.5 0v2.083c0 .715.404 1.37 1.044 1.689L5.5 5c.32.32.5.754.5 1.207" />
              <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
            </svg>
            {ask}
          </div>

          <div className="bg-red-500 text-white font-bold px-3 py-1 rounded-xl text-sm shadow-lg animate-pulse">
            ❤️ {lives}
          </div>
        </div>
      </div>

      {/* KARTU SOAL */}
      <div className="bg-white/80 backdrop-blur-lg w-full md:w-3/4 rounded-2xl shadow-2xl p-6 md:p-8 border border-white/40">
        <div className="flex justify-between items-center mb-3">
          <h1 className="font-bold text-2xl drop-shadow text-purple-700">
            Soal {soal.nomor}
          </h1>

          <div className="flex gap-2">
            <div className="border px-3 text-black py-1 rounded-xl text-sm">
              {soal.level}
            </div>

            <button
              onClick={() => {
                setShowHint(true);
                setAsk((prev) => {
                  const newAsk = prev - 1;
                  if (newAsk <= 0) setGameOver(true);
                  return Math.max(newAsk, 0);
                });
              }}
              className="px-3 py-1 bg-yellow-300 text-gray-700 rounded-lg shadow-md hover:scale-105 transition"
            >
              💡 Hint
            </button>
          </div>
        </div>

        {/* GAMBAR */}
        {soal.gambar && (
          <div className="flex justify-center mb-4">
            <img
              src={soal.gambar}
              className="max-h-60 rounded-xl shadow-xl border"
            />
          </div>
        )}

        {/* TEKS SOAL */}
        <div className="mb-4 text-lg text-justify text-gray-800">
          <LatexRenderer text={soal.soal} />
        </div>

        {/* PILIHAN */}
        <div className="space-y-3 text-gray-800">
          {["A", "B", "C", "D", "E"].map((p) => (
            <label
              key={p}
              className="flex items-center gap-2 p-3 rounded-xl  dropshadow-b-xl bg-white cursor-pointer hover:bg-purple-100 transition shadow"
            >
              <input
                type="radio"
                name={`soal-${soal.nomor}`}
                value={p}
                checked={selectedAnswers[soal.nomor] === p}
                onChange={() => handleSelect(soal.nomor, p)}
              />
              <LatexRenderer text={soal[`pilihan_${p}`]} />
            </label>
          ))}
        </div>
      </div>

      {/* POPUP HINT */}
      {showHint && (
        <div className="fixed inset-0 bg-black/30 flex justify-center items-center z-50">
          <div className="bg-white p-5 rounded-xl shadow-xl w-72 text-center animate-fadeIn">
            <h3 className="font-bold text-lg mb-2 text-purple-700">Hint</h3>
            <p className="text-gray-700 text-sm mb-4">
              <LatexRenderer text={soal.hint} />
            </p>
            <button
              onClick={() => setShowHint(false)}
              className="w-full bg-yellow-300 p-2 rounded-lg"
            >
              Tutup
            </button>
          </div>
        </div>
      )}

      {/* POPUP MENANG */}
      {showWinPopup && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-2xl shadow-2xl w-96 max-h-[80vh] overflow-y-auto animate-fadeIn text-center">
            <h2 className="text-3xl font-extrabold text-purple-700 mb-3 drop-shadow">
              🏆 YOU WIN!
            </h2>

            <p className="text-lg font-semibold mb-3 text-gray-700">
              OYEEE!! Kamu ngelarin semua soal!!
              <span className="text-purple-600">🔥🔥 MANTAP PARAH!</span>
            </p>

            <p className="text-lg text-gray-700 font-bold">
              Skor: {score} / {data.length} ({scorePercent}%)
            </p>

            {/* Detail per soal */}
            <div className="text-left text-gray-700 mt-5 space-y-2">
              {data.map((s) => (
                <div
                  key={s.nomor}
                  onClick={() => setReviewSoal(s)}
                  className={`p-3 rounded-xl border cursor-pointer hover:scale-[1.02] transition ${
                    selectedAnswers[s.nomor] === s.jawaban
                      ? "bg-green-100 border-green-400"
                      : "bg-red-100 border-red-400"
                  }`}
                >
                  <p className="font-bold">Soal {s.nomor}</p>
                  <p>
                    Jawaban kamu:{" "}
                    <strong>{selectedAnswers[s.nomor] || "—"}</strong>
                  </p>
                  <p>
                    Kunci: <strong>{s.jawaban}</strong>
                  </p>
                </div>
              ))}
              {reviewSoal && (
                <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
                  <div className="bg-white w-[90%] md:w-[60%] max-h-[85vh] overflow-y-auto p-6 rounded-2xl shadow-2xl animate-fadeIn">
                    <h2 className="text-2xl font-extrabold text-purple-700 mb-4">
                      🔍 Review Soal {reviewSoal.nomor}
                    </h2>

                    {/* Gambar */}
                    {reviewSoal.gambar && (
                      <div className="flex justify-center mb-4">
                        <img
                          src={reviewSoal.gambar}
                          className="max-h-60 rounded-xl shadow-lg border"
                        />
                      </div>
                    )}

                    {/* Teks Soal */}
                    <div className="mb-4 text-lg text-justify text-gray-800">
                      <LatexRenderer text={reviewSoal.soal} />
                    </div>

                    {/* Pilihan Jawaban */}
                    <div className="space-y-3">
                      {["A", "B", "C", "D", "E"].map((p) => {
                        const isUser = selectedAnswers[reviewSoal.nomor] === p;
                        const isCorrect = reviewSoal.jawaban === p;

                        return (
                          <div
                            key={p}
                            className={`p-3 rounded-xl border ${
                              isCorrect
                                ? "bg-green-100 border-green-500"
                                : isUser
                                ? "bg-red-100 border-red-500"
                                : "bg-gray-50"
                            }`}
                          >
                            <strong>{p}.</strong>{" "}
                            <LatexRenderer text={reviewSoal[`pilihan_${p}`]} />
                          </div>
                        );
                      })}
                    </div>

                    <button
                      onClick={() => setReviewSoal(null)}
                      className="mt-6 w-full bg-purple-300 p-2 rounded-lg shadow-md font-bold hover:scale-105 transition"
                    >
                      Tutup Review
                    </button>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => router.push("/list-bab")}
              className="w-full bg-purple-300 p-2 mt-5 rounded-lg shadow-md font-bold hover:scale-105 transition"
            >
              Kembali ke Home
            </button>
          </div>
        </div>
      )}
      {showStrikePopup && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-[999]">
          <div
            className="relative bg-gradient-to-br from-yellow-300 via-orange-400 to-red-500 
                    p-8 rounded-3xl shadow-2xl text-center animate-bounce-slow 
                    border-4 border-white w-[90%] md:w-[450px]"
          >
            {/* Animasi confetti */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="animate-confetti absolute w-full h-full"></div>
            </div>

            <h1 className="text-5xl font-extrabold text-white drop-shadow-lg mb-3">
              🎉 STRIKE!!! 🎉
            </h1>

            <p className="text-xl font-bold text-white drop-shadow">
              Kamu menjawab 3 soal berturut-turut dengan benar!
            </p>

            <p className="text-lg text-purple-900 bg-white/70 mt-4 py-2 rounded-xl font-bold shadow">
              Bonus sudah ditambahkan 🔥🔥🔥
            </p>

            <button
              onClick={() => setShowStrikePopup(false)}
              className="mt-5 bg-white text-orange-600 font-bold w-full py-2 rounded-xl shadow-lg hover:scale-105 transition"
            >
              GAS LAGI!
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
