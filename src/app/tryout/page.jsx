"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { LatexRenderer } from "../novel/latexRender";
import { listLink } from "@/utils/listLink";
import { paketTO } from "@/data/paket-to";

export default function TryoutPage() {
  const router = useRouter();

  const [data, setData] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [flagged, setFlagged] = useState({});
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30 * 60);
  const [showResult, setShowResult] = useState(false);
  const [nickname, setNickname] = useState("");

  const STORAGE_KEY = "TRYOUT_NORMAL";

  // ================= LOAD USER =================
  useEffect(() => {
    const nama = sessionStorage.getItem("nama_samaran");
    if (!nama) router.push("/");
    setNickname(nama);
  }, []);

  // ================= FETCH SOAL =================
  useEffect(() => {
    const id_to = sessionStorage.getItem("id_to");

    if (!id_to) return;

    const selected = paketTO.find((item) => item.id === Number(id_to));

    if (!selected) return;

    const fetchData = async () => {
      const response = await fetch(selected.link_to);
      const result = await response.json();
      setData(result);

      const saved = sessionStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        setSelectedAnswers(parsed.answers || {});
        setFlagged(parsed.flagged || {});
        setTimeLeft(parsed.timeLeft || 30 * 60);
      }
    };

    fetchData();
  }, []);

  // ================= AUTOSAVE =================
  useEffect(() => {
    if (!data.length) return;

    sessionStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        answers: selectedAnswers,
        flagged,
        timeLeft,
      }),
    );
  }, [selectedAnswers, flagged, timeLeft]);

  // ================= TIMER =================
  useEffect(() => {
    if (timeLeft <= 0 && !showResult) {
      handleSubmit();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, "0");
    const s = (seconds % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  // ================= HANDLE SELECT + AUTO NEXT =================
  const handleSelect = (nomor, pilihan) => {
    setSelectedAnswers((prev) => ({
      ...prev,
      [nomor]: pilihan,
    }));

    // Auto pindah ke soal berikutnya
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, data.length - 1));
  };

  const toggleFlag = (nomor) => {
    setFlagged((prev) => ({
      ...prev,
      [nomor]: !prev[nomor],
    }));
  };

  const calculateScore = () => {
    return data.reduce((acc, soal) => {
      if (selectedAnswers[soal.nomor] === soal.jawaban) acc++;
      return acc;
    }, 0);
  };

  const handleSubmit = async () => {
    const score = calculateScore();

    const fd = new FormData();
    fd.append("nama_samaran", nickname);
    fd.append("nilai", score);

    await fetch(listLink.NILAI, {
      method: "POST",
      body: fd,
    });

    sessionStorage.removeItem(STORAGE_KEY);
    setShowResult(true);
  };

  if (!data.length) return <div className="p-10">Memuat soal...</div>;

  const soal = data[currentIndex];
  const score = calculateScore();
  const progress = (Object.keys(selectedAnswers).length / data.length) * 100;

  const benar = score;
  const salah = data.length - score;
  const kosong = data.length - Object.keys(selectedAnswers).length;

  const isAllAnswered = Object.keys(selectedAnswers).length === data.length;

  return (
    <div className="min-h-screen bg-slate-50 p-8 text-slate-800">
      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="font-semibold text-lg text-slate-700">{nickname}</h2>

        <div className="bg-white border border-slate-200 px-5 py-2 rounded-lg shadow-sm font-semibold text-indigo-600">
          ⏱ {formatTime(timeLeft)}
        </div>
      </div>

      {/* PROGRESS */}
      <div className="w-full bg-slate-200 rounded-full h-2 mb-8">
        <div
          className="bg-indigo-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        ></div>
      </div>

      {/* NAVIGASI NOMOR */}
      <div className="flex flex-wrap gap-2 mb-8">
        {data.map((s, i) => {
          const answered = selectedAnswers[s.nomor];
          const isFlagged = flagged[s.nomor];

          return (
            <button
              key={i}
              onClick={() => setCurrentIndex(i)}
              className={`
                w-10 h-10 rounded-md text-sm font-semibold transition
                ${
                  answered
                    ? "bg-indigo-100 text-indigo-700"
                    : "bg-white border border-slate-300 text-slate-600"
                }
                ${isFlagged ? "ring-2 ring-amber-400" : ""}
                ${currentIndex === i ? "ring-2 ring-indigo-600" : ""}
              `}
            >
              {s.nomor}
            </button>
          );
        })}
      </div>

      {/* CARD SOAL */}
      <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-200">
        <div className="flex justify-between items-center mb-4">
          <h1 className="font-semibold text-lg">Soal {soal.nomor}</h1>

          <button
            onClick={() => toggleFlag(soal.nomor)}
            className="text-sm px-3 py-1 rounded-md border border-amber-400 text-amber-600 hover:bg-amber-50 transition"
          >
            🚩 Tandai Ragu
          </button>
        </div>

        <div className="mb-6 leading-relaxed">
          <LatexRenderer text={soal.soal} />
        </div>

        <div className="space-y-3">
          {["A", "B", "C", "D", "E"].map((p) => (
            <label
              key={p}
              className="flex gap-3 p-3 border border-slate-200 rounded-md cursor-pointer hover:bg-slate-50 transition"
            >
              <input
                type="radio"
                checked={selectedAnswers[soal.nomor] === p}
                onChange={() => handleSelect(soal.nomor, p)}
              />
              <LatexRenderer text={soal[`pilihan_${p}`]} />
            </label>
          ))}
        </div>

        <div className="flex justify-end mt-8">
          <button
            disabled={!isAllAnswered}
            onClick={() => {
              if (confirm("Yakin ingin submit?")) handleSubmit();
            }}
            className={`px-6 py-2 rounded-md font-semibold transition
              ${
                isAllAnswered
                  ? "bg-indigo-600 hover:bg-indigo-700 text-white"
                  : "bg-slate-300 text-slate-500 cursor-not-allowed"
              }
            `}
          >
            Submit
          </button>
        </div>
      </div>

      {/* HASIL */}
      {showResult && (
        <div className="fixed m-5 inset-0 bg-black/50 flex justify-center items-center">
          <div className="bg-white p-8 rounded-xl shadow-xl w-96">
            <h2 className="text-xl font-semibold mb-4">Hasil Tryout</h2>

            <p>Benar: {benar}</p>
            <p>Salah: {salah}</p>
            <p>Kosong: {kosong}</p>

            <p className="mt-3 font-semibold text-indigo-600">
              Skor: {score} / {data.length}
            </p>

            <button
              onClick={() => router.push("/list-bab")}
              className="mt-6 bg-indigo-600 hover:bg-indigo-700 text-white w-full py-2 rounded-md"
            >
              Kembali ke Home
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
