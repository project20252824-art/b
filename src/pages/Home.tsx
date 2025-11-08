import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [showGallery, setShowGallery] = useState(false);
  const [count, setCount] = useState(10);
  const [showMain, setShowMain] = useState(false);
  const [activeVideo, setActiveVideo] = useState<number | null>(null); // 👈 for mobile captions
  const navigate = useNavigate();

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const countdownAudioRef = useRef<HTMLAudioElement | null>(null);
  const birthdayAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Countdown logic
  useEffect(() => {
    const countdownAudio = countdownAudioRef.current;

    if (count === 10 && countdownAudio) {
      countdownAudio.currentTime = 0;
      countdownAudio.volume = 0.6;
      countdownAudio.play().catch(() => console.log("Autoplay blocked"));
    }

    if (count > 0) {
      const timer = setTimeout(() => setCount(count - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      if (countdownAudio) countdownAudio.pause();
      setShowMain(true);
    }
  }, [count]);

  // Birthday sound
  useEffect(() => {
    const birthdayAudio = birthdayAudioRef.current;
    if (showMain && birthdayAudio) {
      birthdayAudio.currentTime = 0;
      birthdayAudio.volume = 0.8;
      birthdayAudio.play().catch(() => console.log("Autoplay blocked"));
    }
  }, [showMain]);

  // Gallery background music
  useEffect(() => {
    const audio = audioRef.current;
    if (showGallery && audio) {
      const playMusic = async () => {
        try {
          await audio.play();
        } catch {
          console.log("Autoplay blocked — will play after click");
        }
      };
      playMusic();
    }
  }, [showGallery]);

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
      🎈
    </motion.div>
  );

  const pageVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } },
    exit: { opacity: 0, transition: { duration: 0.6 } },
  };

  const videoVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: { delay: i * 0.4, duration: 0.8 },
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 min-h-screen bg-gradient-to-b from-pink-100 to-pink-200 relative overflow-hidden">
      <Confetti width={size.width} height={size.height} />

      {/* 🔊 Audio */}
      <audio ref={countdownAudioRef} src="/music/countdown.mpeg" preload="auto" />
      <audio ref={audioRef} src="/music/gallery-theme.mpeg" loop preload="auto" />
      <audio ref={birthdayAudioRef} src="/music/birthday-theme.mp4" preload="auto" />

      {showGallery &&
        [...Array(20)].map((_, i) => (
          <Heart key={i} color={i % 2 === 0 ? "red" : "white"} delay={i * 0.5} />
        ))}

      <AnimatePresence mode="wait">
        {!showMain ? (
          <motion.div
            key="countdown"
            className="flex flex-col items-center justify-center h-screen text-pink-700"
          >
            <motion.h1
              key={count}
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1.6, opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.8 }}
              className="text-8xl font-extrabold drop-shadow"
            >
              {count}
            </motion.h1>
          </motion.div>
        ) : !showGallery ? (
          <motion.div
            key="home"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="flex flex-col items-center"
          >
            <motion.h1
              className="text-5xl font-extrabold text-pink-700 drop-shadow"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ duration: 0.9 }}
            >
              🎉 Happy Birthday Abha 💖
            </motion.h1>

            <motion.p
              className="mt-6 text-lg text-gray-800 max-w-2xl"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
            >
              Wishing you endless happiness, laughter & love on your special day! ✨
            </motion.p>

            <motion.button
              onClick={() => setShowGallery(true)}
              className="mt-10 px-6 py-3 bg-pink-600 text-white text-lg font-semibold rounded-full shadow-lg hover:bg-pink-700 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              📸 Open Gallery
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="gallery"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-10 w-full"
          >
            <h2 className="text-3xl font-bold text-pink-700 mb-6">📸 Our Memories 📸</h2>

            {/* 🎥 Video gallery */}
            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {[
                { src: "/videos/galleryclip.mp4", text: "That first laugh ❤️..." },
                { src: "/videos/clip2.mp4", text: "Pure chaos 😂..." },
                { src: "/videos/clip3.mp4", text: "Dance vibes 💃..." },
                { src: "/videos/clip4.mp4", text: "Unplanned adventures 🌈..." },
                { src: "/videos/clip5.mp4", text: "Happy tears 😭..." },
                { src: "/videos/clip6.mp4", text: "Goofy moments 🤪..." },
                { src: "/videos/clip7.mp4", text: "Best day ever ✨..." },
              ].map((clip, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={videoVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative group w-60 h-60 rounded-2xl overflow-hidden shadow-lg border-4 border-pink-400"
                  onClick={() =>
                    setActiveVideo(activeVideo === i ? null : i)
                  } // 👈 Tap to toggle caption
                >
                  <video
                    src={clip.src}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="w-full h-full object-cover"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{
                      opacity:
                        activeVideo === i
                          ? 1
                          : 0,
                    }}
                    className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-xs sm:text-sm font-semibold px-2 text-center p-3 leading-snug"
                  >
                    {clip.text}
                  </motion.div>
                </motion.div>
              ))}
            </div>

            {/* 🖼️ Image gallery */}
            <div className="flex flex-wrap justify-center gap-6">
              {[ // same image list as before ...
              ].map((img, i) => (
                <motion.div
                  key={i}
                  className="relative group rounded-2xl overflow-hidden shadow-lg border-4 border-pink-400 w-60 h-60 sm:w-[1040px] sm:h-[468px]"
                  initial={{ opacity: 0, scale: 0.9, y: 30 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: i * 0.3, duration: 0.8 }}
                >
                  <img
                    src={img.src}
                    alt={`memory-${i}`}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-black/60 text-white text-xs sm:text-sm font-semibold opacity-0 group-hover:opacity-100 p-3 leading-snug text-center sm:flex sm:items-center sm:justify-center transition duration-500">
                    {img.text}
                  </div>
                </motion.div>
              ))}
            </div>

            <motion.button
              onClick={() => navigate("/message")}
              className="mt-10 px-5 py-2 bg-green-500 text-white rounded-full shadow hover:bg-green-600 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              💌 Message
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
