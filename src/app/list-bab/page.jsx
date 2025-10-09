"use client";
import { listLink } from "@/utils/listLink";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function BabListPage() {
  const [search, setSearch] = useState("");
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(listLink.TEKS); // fetch API
        const result = await res.json(); // ubah ke JSON
        setData(result); // simpan hasil ke state
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter sesuai input search
  const filteredData = data.filter((value) =>
    value.judul.toLowerCase().includes(search.toLowerCase())
  );

  // Simpan pilihan ke sessionStorage dan redirect
  const handleSelection = (selectedSubjudul) => {
    sessionStorage.setItem("select", selectedSubjudul);
    router.push("/novel");
  };

  return (
    <div className="min-h-screen bg-white px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex justify-end">
          <button
            className="bg-red-600 p-2 rounded-xl"
            onClick={() => router.push("/pushrank")}
          >
            Pushrank
          </button>
        </div>
        <h1 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-purple-600 via-pink-500 to-blue-400 bg-clip-text text-transparent">
          📚 Daftar Bab
        </h1>

        {/* Input filter */}
        <input
          type="text"
          placeholder="Cari nama bab..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full px-4 py-2 mb-6 text-black border-2 border-gray-200 rounded-xl focus:outline-none focus:border-purple-500"
        />

        {/* List bab */}
        <div className="space-y-3">
          {loading ? (
            <p>Loadingg ...</p>
          ) : filteredData.length > 0 ? (
            filteredData.map((value, i) => (
              <div
                key={i}
                className="p-2 border rounded-lg hover:bg-gray-50 cursor-pointer"
                onClick={() => handleSelection(value.subjudul)}
              >
                <h1 className="text-xl font-bold text-gray-600">
                  {value.judul}
                </h1>
                <p className="text-sm text-gray-600">{value.subjudul}</p>
              </div>
            ))
          ) : (
            <p className="text-gray-500">Tidak ada bab yang cocok.</p>
          )}
        </div>
      </div>
    </div>
  );
}
