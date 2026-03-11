"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { paketTO } from "@/data/paket-to";

export default function PaketTOPage() {
  const [namaSamaran, setNamaSamaran] = useState("");
  const [avatar, setAvatar] = useState("");

  const router = useRouter();

  useEffect(() => {
    const nama = sessionStorage.getItem("nama_samaran");
    if (!nama) {
      router.push("/");
    }
    const avatarUrl =
      sessionStorage.getItem("avatar") ||
      "https://api.dicebear.com/7.x/bottts/svg?seed=default";

    setNamaSamaran(nama);
    setAvatar(avatarUrl);
  }, []);

  const handleClick = (item) => {
    sessionStorage.setItem("id_to", item);
    router.push("/tryout");
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-blue-50 to-purple-50 relative overflow-hidden">
      {/* Background Awan */}
      <div className="absolute top-10 left-10 w-40 h-20 bg-white rounded-full blur-2xl opacity-70"></div>
      <div className="absolute top-40 right-20 w-60 h-24 bg-white rounded-full blur-2xl opacity-70"></div>
      <div className="absolute bottom-20 left-1/3 w-72 h-28 bg-white rounded-full blur-2xl opacity-70"></div>
      {/* Header User */}
      <div className="flex items-center justify-between m-5">
        <div className="flex items-center space-x-4">
          {avatar && (
            <motion.img
              src={avatar}
              alt="avatar"
              className="w-14 h-14 rounded-full border-2 border-blue-200 shadow-sm"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 120 }}
            />
          )}
          <div>
            <h1 className="text-2xl font-semibold text-gray-500">
              👋 Welcome,
              <span className="font-bold bg-gradient-to-r from-blue-400 to-pink-400 bg-clip-text text-transparent">
                {namaSamaran}
              </span>
            </h1>
            <p className="text-sm text-gray-500">
              Yuk lanjut pilih paket TO untuk latihan hari ini 💪
            </p>
          </div>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 py-5 relative z-10">
        <div className="flex flex-col md:flex-row gap-8 justify-center items-center">
          {paketTO.map((item) => (
            <div
              key={item.id}
              onClick={() => handleClick(item.id)}
              className="w-full md:w-56"
            >
              <motion.div
                whileHover={{
                  scale: 1.08,
                  rotateX: 5,
                  rotateY: -5,
                }}
                transition={{ type: "spring", stiffness: 200 }}
                className="relative bg-white/70 backdrop-blur-xl rounded-2xl 
                shadow-xl p-6 cursor-pointer flex flex-col items-center
                border border-purple-200
                hover:border-purple-400
                hover:shadow-purple-200/50
                transition-all duration-300"
              >
                {/* Glow Aura */}
                <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-purple-300/20 to-pink-300/20 blur-xl opacity-0 hover:opacity-100 transition"></div>

                {/* Energy Ring */}
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 12,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                  className="absolute w-32 h-32 border-2 border-purple-300/40 rounded-full"
                />

                {/* Floating Character */}
                <motion.div
                  animate={{ y: [0, -12, 0] }}
                  transition={{
                    duration: 3,
                    repeat: Infinity,
                  }}
                  className="relative z-10"
                >
                  <Image
                    loading="lazy"
                    src={item.img}
                    alt={item.nama_paket}
                    width={120}
                    height={120}
                    className="rounded-full drop-shadow-xl"
                  />
                </motion.div>

                {/* Paket Name */}
                <h2
                  className="mt-5 text-lg font-bold text-center 
                bg-gradient-to-r from-purple-500 to-pink-500 
                bg-clip-text text-transparent"
                >
                  {item.nama_paket}
                </h2>

                {/* Gaming Button */}
                <div
                  className="mt-4 text-sm font-semibold px-4 py-2 rounded-full
                bg-gradient-to-r from-purple-400 to-pink-400
                text-white shadow-md"
                >
                  OK, GASSS!
                </div>
              </motion.div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
