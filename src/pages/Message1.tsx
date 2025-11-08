import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

export default function Message() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [showMessage, setShowMessage] = useState(false);
  const [videoIndex, setVideoIndex] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    const handle = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  // ❤️ Floating Hearts
  const Heart = ({ color, delay }: { color: string; delay: number }) => (
    <motion.div
      className="absolute bottom-0 text-4xl"
      initial={{ y: size.height, opacity: 0 }}
      animate={{ y: -150, opacity: 1 }}
      transition={{
        duration: 6 + Math.random() * 3,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
      style={{
        left: `${Math.random() * size.width}px`,
        color,
        fontSize: `${30 + Math.random() * 30}px`,
      }}
    >
      ❤️
    </motion.div>
  );

  // 🎞️ List of videos
  const videos = [
    "/videos/clip11.mp4",
    "/videos/clip8.mp4",
    "/videos/clip9.mp4",
    "/videos/clip10.mp4",
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-red-100 to-pink-200 relative overflow-hidden text-center">
      {/* 🌸 Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-40"
      >
        <source src="/videos/background.mp4" type="video/mp4" />
      </video>

      {/* 🎉 Confetti only after click */}
      {showMessage && <Confetti width={size.width} height={size.height} />}

      {!showMessage ? (
        // Stage 1 → 💌 pulsing button
        <motion.button
          onClick={() => setShowMessage(true)}
          className="px-8 py-4 bg-pink-600 text-white text-3xl rounded-full shadow-lg hover:bg-pink-700 transition"
          animate={{ scale: [1, 1.2, 1] }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
          whileTap={{ scale: 0.9 }}
        >
          💌
        </motion.button>
      ) : (
        // Stage 2 → Hearts + Message + Videos + Surprise
        <>
          {[...Array(25)].map((_, i) => (
            <Heart
              key={i}
              color={i % 2 === 0 ? "red" : "white"}
              delay={i * 0.5}
            />
          ))}

          <motion.h1
            className="text-5xl font-extrabold text-red-600 drop-shadow relative z-10"
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1 }}
          >
            💌 A Special Message 💌
          </motion.h1>

          <motion.p
            className="mt-6 text-xl text-gray-800 max-w-2xl bg-white/70 p-6 rounded-xl shadow-lg relative z-10"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1 }}
          >
            You are the most amazing person in my life ❤️  
            May this year bring you endless love, joy, and blessings.  
            Always keep smiling, Abha! ✨
          </motion.p>

          {/* 🎬 Video Player with sound */}
          <motion.video
            key={videoIndex}
            className="mt-8 rounded-2xl shadow-lg w-80 h-60 object-cover border-4 border-pink-400 relative z-10"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            autoPlay
            loop
            controls // ✅ Added for volume/sound control
            playsInline
          >
            <source src={videos[videoIndex]} type="video/mp4" />
          </motion.video>

          {/* ▶️ Next Video Button */}
          {videoIndex < videos.length - 1 && (
            <motion.button
              onClick={() => setVideoIndex((prev) => prev + 1)}
              className="mt-6 px-6 py-2 bg-pink-600 text-white rounded-full shadow hover:bg-pink-700 transition relative z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              ▶️ Next Video
            </motion.button>
          )}

          {/* 🎁 Show Surprise Button after last video */}
          {videoIndex === videos.length - 1 && (
            <motion.button
              onClick={() => navigate("/surprise")}
              className="mt-10 px-8 py-3 bg-purple-600 text-white text-lg rounded-full shadow-lg hover:bg-purple-700 transition relative z-10"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              🎁 Surprise
            </motion.button>
          )}
        </>
      )}
    </div>
  );
}
