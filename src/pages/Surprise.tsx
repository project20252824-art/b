import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import Confetti from "react-confetti";
import { useNavigate } from "react-router-dom";

export default function Surprise() {
  const navigate = useNavigate();
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [stage, setStage] = useState<"box" | "fireworks" | "card">("box");
  const [boxOpen, setBoxOpen] = useState(false);

  const fireworkAudioRef = useRef<HTMLAudioElement | null>(null);
  const bgMusicRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const handle = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handle();
    window.addEventListener("resize", handle);
    return () => window.removeEventListener("resize", handle);
  }, []);

  // ❤️ Floating hearts (always visible)
  const Heart = ({ color, delay }: { color: string; delay: number }) => (
    <motion.div
      className="absolute bottom-0 text-3xl"
      initial={{ y: size.height, opacity: 0 }}
      animate={{ y: -200, opacity: 1 }}
      transition={{
        duration: 5 + Math.random() * 2,
        delay,
        repeat: Infinity,
        ease: "easeOut",
      }}
      style={{
        left: `${Math.random() * size.width}px`,
        color,
        fontSize: `${25 + Math.random() * 25}px`,
      }}
    >
      ❤️
    </motion.div>
  );

  // 🎆 Firework explosion (circular burst)
  const FireworkExplosion = ({ x, y }: { x: number; y: number }) => {
    const colors = ["red", "yellow", "blue", "green", "purple", "white"];
    const particles = 20;
    return (
      <>
        {[...Array(particles)].map((_, i) => {
          const angle = (i / particles) * 2 * Math.PI;
          const distance = 120 + Math.random() * 50;
          const dx = Math.cos(angle) * distance;
          const dy = Math.sin(angle) * distance;
          const color = colors[Math.floor(Math.random() * colors.length)];

          return (
            <motion.div
              key={i}
              className="absolute rounded-full"
              initial={{ x, y, scale: 0, opacity: 1 }}
              animate={{ x: x + dx, y: y + dy, scale: 1, opacity: 0 }}
              transition={{ duration: 1.8, ease: "easeOut" }}
              style={{
                width: 10,
                height: 10,
                backgroundColor: color,
                boxShadow: `0 0 8px ${color}, 0 0 16px ${color}`,
              }}
            />
          );
        })}
      </>
    );
  };

  // 🎵 Handle background + firework sounds
  useEffect(() => {
    const fireworkAudio = fireworkAudioRef.current;
    const bgMusic = bgMusicRef.current;

    // Play background music softly on mount
    if (bgMusic) {
      bgMusic.volume = 0.4;
      bgMusic.play().catch(() => console.log("Autoplay blocked"));
    }

    if (stage === "fireworks" && fireworkAudio) {
      fireworkAudio.currentTime = 0;
      fireworkAudio.volume = 0.6;
      fireworkAudio.play().catch(() => console.log("Autoplay blocked"));
    }

    // Stop firework sound + fade out bg music when card appears
    if (stage === "card") {
      if (fireworkAudio) {
        fireworkAudio.pause();
        fireworkAudio.currentTime = 0;
      }

      if (bgMusic) {
        const fadeOut = setInterval(() => {
          if (bgMusic.volume > 0.05) {
            bgMusic.volume -= 0.05;
          } else {
            clearInterval(fadeOut);
            bgMusic.pause();
          }
        }, 200);
      }
    }
  }, [stage]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-red-200 relative overflow-hidden text-center">
      {/* 🔊 Audio Elements */}
      <audio ref={fireworkAudioRef} src="/music/fireworks.mpeg" preload="auto" />
      

      {/* ❤️ Floating hearts */}
      {[...Array(20)].map((_, i) => (
        <Heart key={i} color={i % 2 === 0 ? "red" : "white"} delay={i * 0.5} />
      ))}

      {/* 🎁 Gift Box Stage */}
      {stage === "box" && (
        <motion.div
          className="relative w-40 h-40 bg-pink-500 rounded-b-lg shadow-lg cursor-pointer"
          onClick={() => {
            setBoxOpen(true);
            setTimeout(() => setStage("fireworks"), 1500);
            setTimeout(() => setStage("card"), 4000);
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1 }}
        >
          {/* Lid */}
          <motion.div
            className="absolute top-0 left-0 w-full h-12 bg-red-600 rounded-t-lg shadow-md"
            animate={boxOpen ? { rotateX: [-10, -120, -100] } : { rotateX: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{
              transformOrigin: "top",
              transformStyle: "preserve-3d",
            }}
          />

          {/* Box Body */}
          <div className="absolute top-12 left-0 w-full h-[calc(100%-3rem)] bg-pink-500 rounded-b-lg shadow-inner"></div>

          {/* Ribbon */}
          <div className="absolute inset-y-0 left-1/2 -translate-x-1/2 w-6 bg-yellow-300"></div>
        </motion.div>
      )}

      {/* 🎆 Fireworks Stage */}
      {stage === "fireworks" && (
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(8)].map((_, i) => (
            <FireworkExplosion
              key={i}
              x={Math.random() * size.width}
              y={Math.random() * size.height * 0.5}
            />
          ))}
        </div>
      )}

      {/* 💌 Card Stage */}
      {stage === "card" && (
        <>
          <Confetti width={size.width} height={size.height} />
          <motion.div
            className="mt-10 bg-white rounded-2xl shadow-2xl p-8 max-w-md"
            initial={{ rotateY: 90, opacity: 0 }}
            animate={{ rotateY: 0, opacity: 1 }}
            transition={{ duration: 1.2, ease: "easeOut" }}
            style={{
              transformStyle: "preserve-3d",
              backfaceVisibility: "hidden",
            }}
          >
            <h2 className="text-3xl font-bold text-pink-600 mb-4">
              🎁 Surprise! 🎁
            </h2>
            <p className="text-lg text-gray-700 leading-relaxed">
              You’ll get your surprise today when we meet — and not just one, but two! 😄
              For now, just read this sweet message. 💖
              Abhaa, you are truly one of a kind 💖  
              May your life always be filled with love, joy, and endless smiles.  
              You deserve all the happiness in the world ✨
            </p>

            {/* 🌸 Next Surprise Button */}
            <motion.button
              onClick={() => navigate("/closing")}
              className="mt-8 px-6 py-3 bg-purple-600 text-white rounded-full shadow hover:bg-purple-700 transition"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              💌 Closing message
            </motion.button>
          </motion.div>
        </>
      )}
    </div>
  );
}
