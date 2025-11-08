import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";
import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const [showGallery, setShowGallery] = useState(false);
  const [count, setCount] = useState(10);
  const [showMain, setShowMain] = useState(false);
  const [showTextIndex, setShowTextIndex] = useState<number | null>(null);
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

  // ⏳ Countdown logic + sound
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

  // 🎶 When “Happy Birthday Bestie” appears → play birthday audio
  useEffect(() => {
    const birthdayAudio = birthdayAudioRef.current;
    if (showMain && birthdayAudio) {
      birthdayAudio.currentTime = 0;
      birthdayAudio.volume = 0.8;
      birthdayAudio.play().catch(() => console.log("Autoplay blocked"));
    }
  }, [showMain]);

  // 🎵 Play background gallery music
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

  // ❤️ Heart animation
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
    visible: { opacity: 1, transition: { duration: 0.8, ease: "easeInOut" } },
    exit: { opacity: 0, transition: { duration: 0.6, ease: "easeInOut" } },
  };

  const videoVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.9 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { delay: i * 0.4, duration: 0.8, ease: "easeOut" },
    }),
  };

  return (
    <div className="flex flex-col items-center justify-center text-center py-20 min-h-screen bg-gradient-to-b from-pink-100 to-pink-200 relative overflow-hidden">
      <Confetti width={size.width} height={size.height} />

      {/* 🔊 Audio files */}
      <audio ref={countdownAudioRef} src="/music/countdown.mpeg" preload="auto" />
      <audio ref={audioRef} src="/music/gallery-theme.mpeg" loop preload="auto" />
      
      <audio ref={birthdayAudioRef} src="/music/birthday-theme.mp4" preload="auto" />

      {showGallery &&
        [...Array(20)].map((_, i) => (
          <Heart key={i} color={i % 2 === 0 ? "red" : "white"} delay={i * 0.5} />
        ))}

      <AnimatePresence mode="wait">
        {!showMain ? (
          // ⏳ Countdown section
          <motion.div
            key="countdown"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
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
          // 🎉 Birthday message section
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
          // 📸 Gallery section (same as before)
          <motion.div
            key="gallery"
            variants={pageVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className="mt-10 w-full"
          >
            <h2 className="text-3xl font-bold text-pink-700 mb-6">📸 Our Memories 📸</h2>

            <div className="flex flex-wrap justify-center gap-6 mb-10">
              {[
                { src: "/videos/galleryclip.mp4", text: "That first laugh ❤️,Remember that day? The first time I came early in the morning — when I shook hands with you but kept my head down? You hadn’t even slept that night, remember?🤣🤣🤣😂" },
                { src: "/videos/clip2.mp4", text: "Pure chaos 😂,Since our first trip together, it’s been more of an adventure than just a trip 🤣🤣🤣. Forget Velankanni Beach — the real adventure was in that jungle, where there was even a monkey named Ankit 🤣🤣🤣." },
                { src: "/videos/clip3.mp4", text: "Dance vibes 💃,And then came a new character — Zoro (Prince)! 🤣 The first time he came swimming with us… remember that funny moment when you and Shruti slipped and fell? 🤣🤣🤣 We were laughing so hard!." },
                { src: "/videos/clip4.mp4", text: "Unplanned adventures 🌈,Even though it was a planned trip, it turned into an unplanned adventure! 😄 Remember that small cave where some kids went in first, and then we followed? And when Zoro almost slipped — I saved him (and kinda slipped too 😎), but managed to hold on! The most surprising thing was… we all got tired, but you didn’t! 💪👏👏" },
                { src: "/videos/clip5.mp4", text: "Happy tears 😭,“Woow woow!” — Shruti and Zoro were shouting, while you and I were recording the video. I was the cameraman, so obviously I didn’t appear in it 😎. It was totally scripted and planned… but shhhh 🤐🤫" },
                { src: "/videos/clip6.mp4", text: "Goofy moments 🤪,That surprise we gave to Zoro was literally next level! 😎 Then came God’s own plan — it suddenly started raining and we all got drenched 😂. Even the skies wanted to join in our fun! 🌧️ We kept laughing and enjoying every moment. Later on the train, those uncles were watching us and laughing too — but who cares, right? 😎" },
                { src: "/videos/clip7.mp4", text: "Best day ever ✨,Haha yeah! They have said the driving test would be at 11:30, but it actually happened around 2:00 😅. But it’s okay — when you’re with friends, time just flies by! And with a friend like you, even 24 hours wouldn’t be enough ❤️✨" },
              ].map((clip, i) => (
                <motion.div
                  key={i}
                  custom={i}
                  variants={videoVariants}
                  initial="hidden"
                  animate="visible"
                  className="relative group w-60 h-60 rounded-2xl overflow-hidden shadow-lg border-4 border-pink-400"
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
  onClick={() =>
    setShowTextIndex(showTextIndex === i ? null : i)
    
  } // ✅ Toggle on tap
  whileHover={{ scale: 1.1 }}
  initial={{ opacity: 0 }}
  animate={{ opacity: showTextIndex === i ? 1 : 0 }} // ✅ Show/hide
  className="absolute inset-0 bg-black/40 flex items-center justify-center 
             text-white text-xs md:text-sm font-semibold px-2 text-center cursor-pointer"
>
  {clip.text}
</motion.div>



                </motion.div>
              ))}
            </div>

            {/* images */}
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { src: "/images/pic1.jpeg", text: "Unforgettable Day 💕,Haha yes! I still remember — on our way back from Velankanni Beach, every time the bus hit a bump, we’d all jump up and laugh like crazy 🤣. Then after reaching Mira Road, we went straight to our favorite Boom Boom Café, ordered pizza and chocolate milkshakes 😋. I don’t remember much after that, but I’m sure once you see this, you’ll remind me of the rest too 😄💫" },
                { src: "/images/pic0.jpeg", text: "Special Moments 🎉,What an amazing game — it kept us all connected even when we were far apart. In the beginning, we used to play it till 2 a.m., remember? 😄 Those random late-night messages of mine… and because of this game, We got two amazing virtual friends — Papa and Gloss 💫🎮" },
                { src: "/images/pic2.jpeg", text: "Bestie Forever ✨,Sitting inside the swimming pool, trying to learn swimming — but honestly, having fun was our real target, not swimming! 😂" },
                { src: "/images/pic3.jpeg", text: "Crazy Memories 😍,The national park — we’ve created so many memories there that words can’t even describe them. From the vlogging moments to the crazy “saver” part and everything in between… endless memories were made in that place. 🌿🎥💫" },
                { src: "/images/pic4.jpeg", text: "Special Moments 🎉,After playing cards, we went to Gokul — I don’t even remember whose plan it was, but it turned out to be perfect. I didn’t eat much since I wasn’t feeling well, but you, Zoro, and Shruti did — and of course, The Manish! 😄 I used to think Gokul was just called “Manish” before that! I’ll never forget those card games — thank you for teaching me, Abha ❤️🃏" },
                { src: "/images/pic5.jpeg", text: "One of the special day💕💕,No words can truly describe it — countless and unforgettable memories that will stay in my heart forever 💖✨" },
                { src: "/images/pic6.jpeg", text: "Special Moments 🎉,When I saw your scooty for the first time and visited your house for the first time — met your mom and brother — then we went to Shruti’s house for the pooja. That was the moment when your scooty-riding journey was about to begin. 🛵✨" },
                { src: "/images/pic7.jpeg", text: "B'day special🥳,I can never forget this day — one of the best birthday celebration moments of my life. 💕❤️ First of all, thank you so much! The gifts from you all — Zoro, you, and Shruti — were amazing. Visiting Dilara’s house for Ganpati darshan and then going to all the temples… People say you should visit temples on your birthday, and I did — but the best part was doing it with all of you. 🙏🎉" },
                { src: "/images/pic8.jpeg", text: "Garba special💜,How can we ever forget the Garba festival? At first, I said I wouldn’t be able to come — but still, I showed up for 4 to 5 days! The last day’s Garba at Sector 3 will never be forgotten, along with the one at Shruti’s building — and last but not least, the Garba at your place… and riding the scooty too. 💃🕺✨" },
              ].map((img, i) => {
                const isWide = [
                  "/images/pic1.jpeg",
                  "/images/pic3.jpeg",
                  "/images/pic4.jpeg",
                  
                  "/images/pic7.jpeg",
                ].includes(img.src);

                return (
                  <motion.div
                    key={i}
                    className={`relative group rounded-2xl overflow-hidden shadow-lg border-4 border-pink-400 ${
                      isWide ? "w-[1040px] h-[468px]" : "w-60 h-60"
                    }`}
                    initial={{ opacity: 0, scale: 0.9, y: 30 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    transition={{ delay: i * 0.3, duration: 0.8, ease: "easeOut" }}
                  >
                    <img
                      src={img.src}
                      alt={`memory-${i}`}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition duration-500"
                    />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center text-white text-sm font-semibold opacity-0 group-hover:opacity-100 transition duration-500">
                      {img.text}
                    </div>
                  </motion.div>
                );
              })}
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
