"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { listLink } from "@/utils/listLink";
import { LatexRenderer } from "./latexRender";

const TeksDanVideo = () => {
  const router = useRouter();
  const goToTest = () => {
    router.push("/tes");
  };

  const [data, setData] = useState(null);
  const [selectedSubjudul, setSelectedSubjudul] = useState(null);
  const [loading, setLoading] = useState(true);

  // Ambil subjudul dari sessionStorage
  useEffect(() => {
    const subjudulFromStorage = sessionStorage.getItem("select");
    setSelectedSubjudul(subjudulFromStorage);
  }, []);

  // Fetch data sesuai subjudul
  useEffect(() => {
    if (!selectedSubjudul) return; // jangan fetch kalau belum ada
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await fetch(listLink.TEKS);
        const result = await res.json();
        const getSubjudul = result.find(
          (value) => value.subjudul === selectedSubjudul
        );
        setData(getSubjudul || null);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [selectedSubjudul]);

  return (
    <div className="bg-pink-100 min-h-screen md:p-10 p-5 text-gray-800">
      {loading ? (
        <p className="text-center font-bold">Loading...</p>
      ) : !data ? (
        <p className="text-center font-bold text-red-600">
          Data tidak ditemukan.
        </p>
      ) : (
        <>
          <h1 className="text-2xl mb-5 font-bold text-center">
            {data.subjudul}
          </h1>
          <div className="md:flex md:justify-center md:gap-10">
            {/* Bagian kiri */}
            <div className="md:w-1/2 w-full">
              {data.psatu && (
                <div className="pb-5 text-justify">
                  <LatexRenderer text={data.psatu} />
                </div>
              )}
              {data.gsatu && (
                <>
                  <img
                    src={data.gsatu}
                    alt="ilustrasi 1"
                    className="rounded-xl shadow-md"
                  />
                  <p className="text-center font-bold text-sm">
                    {data.ketsatu}
                  </p>
                </>
              )}

              {data.pdua && (
                <div className="py-5 text-justify">
                  <LatexRenderer text={data.pdua} />
                </div>
              )}
              {data.ptiga && (
                <div className="pb-5 text-justify">
                  <LatexRenderer text={data.ptiga} />
                </div>
              )}
            </div>

            {/* Bagian kanan */}
            <div className="md:w-1/2 w-full">
              {data.gdua && (
                <>
                  <img
                    src={data.gdua}
                    alt="ilustrasi 2"
                    className="rounded-xl shadow-md"
                  />
                  <p className="font-bold text-sm text-center">{data.ketdua}</p>
                </>
              )}
              {data.pempat && (
                <div className="py-5 text-justify">
                  <LatexRenderer text={data.pempat} />
                </div>
              )}
              <div className="mt-10 flex justify-end">
                <div onClick={goToTest} className="cursor-pointer">
                  <p className="font-bold mb-2">Yuk, kita latihan soal!</p>
                  <button className="p-2 w-full rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-xl font-bold hover:scale-105 transition">
                    Gass!
                  </button>
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default TeksDanVideo;
