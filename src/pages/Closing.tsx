import { motion } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Closing() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [fireworks, setFireworks] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const handleResize = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handleResize();
    window.addEventListener("resize", handleResize);

    // Fireworks for 4 seconds
    const timer = setTimeout(() => setFireworks(false), 4000);

    return () => {
      window.removeEventListener("resize", handleResize);
      clearTimeout(timer);
    };
  }, []);

  // Simple canvas-based fireworks
  useEffect(() => {
    if (!fireworks) return;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    document.body.appendChild(canvas);
    canvas.style.position = "fixed";
    canvas.style.top = "0";
    canvas.style.left = "0";
    canvas.style.zIndex = "0";
    canvas.style.pointerEvents = "none";
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    let particles: any[] = [];
    const colors = ["#ff4b5c", "#ffd166", "#06d6a0", "#118ab2", "#ef476f"];

    function createFirework() {
      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height * 0.5;
      const count = 30 + Math.random() * 50;
      for (let i = 0; i < count; i++) {
        const angle = (Math.PI * 2 * i) / count;
        const speed = 2 + Math.random() * 3;
        particles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          life: 80,
          color: colors[Math.floor(Math.random() * colors.length)],
        });
      }
    }

    function update() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.05; // gravity
        p.life--;
      });
      particles = particles.filter((p) => p.life > 0);
      particles.forEach((p) => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.fill();
      });
      requestAnimationFrame(update);
    }

    const fireworkInterval = setInterval(createFirework, 600);
    update();

    return () => {
      clearInterval(fireworkInterval);
      document.body.removeChild(canvas);
    };
  }, [fireworks]);

  return (
    <div className="flex flex-col items-center justify-center text-center min-h-screen bg-gradient-to-b from-purple-100 to-pink-200 relative overflow-hidden">
      {/* 🎶 Background Music */}
      <audio src="/music/a.mpeg" autoPlay loop />

      {/* 🎉 Continuous Confetti */}
      <Confetti width={size.width} height={size.height} recycle={true} numberOfPieces={250} />

      {/* 💖 Main Heart Animation */}
      <motion.div
        className="p-10 rounded-[50%] bg-pink-100 shadow-2xl border-4 border-pink-400"
        initial={{ scale: 0 }}
        animate={{ scale: [0, 1.1, 1] }}
        transition={{ duration: 1.5 }}
      >
        <motion.h1
          className="text-5xl font-extrabold text-pink-700 drop-shadow-lg"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ repeat: Infinity, duration: 2 }}
        >
          💖 Happy Birthday Once Again, Abha 💖
        </motion.h1>
      </motion.div>

      {/* ✨ Message Section */}
      <motion.p
        className="mt-8 text-xl text-gray-800 max-w-2xl font-medium"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2 }}
      >
        You’ve reached the end of your surprise 🎁 <br />
        You’re truly special and deserve all the happiness in the world ✨
      </motion.p>

      {/* 🏠 Back to Home Button */}
      <motion.button
        onClick={() => navigate("/")}
        className="mt-10 px-8 py-3 bg-gradient-to-r from-pink-500 to-purple-600 text-white text-lg font-semibold rounded-full shadow-lg hover:scale-110 transition-all"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
      >
        🏠 Back to Home
      </motion.button>

      {/* 💝 Hidden Button (Secret Page) */}
      <p className="mt-10 text-gray-700 text-lg">
        Enjoy your special day{" "}
        <button
          onClick={() => navigate("/a")}
          className="text-red-600 hover:scale-125 transition-transform duration-300 cursor-pointer bg-transparent border-none outline-none"
        >
          🥳
        </button>{" "}
        Bot
      </p>
    </div>
  );
}
