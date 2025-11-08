import { motion } from "framer-motion";
import { useEffect, useState, useRef } from "react";

export default function A() {
  const [size, setSize] = useState({ width: 0, height: 0 });
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [showTextIndex, setShowTextIndex] = useState<number | null>(null);


  useEffect(() => {
    const handle = () =>
      setSize({ width: window.innerWidth, height: window.innerHeight });
    handle();
    window.addEventListener("resize", handle);

    // 🎵 Auto-play background music when component mounts
    const audio = audioRef.current;
    if (audio) {
      audio.volume = 0.4;
      const playAudio = () => {
        audio.play().catch(() => {
          console.log("Autoplay blocked, waiting for user interaction");
        });
        window.removeEventListener("click", playAudio);
      };
      audio.play().catch(() => window.addEventListener("click", playAudio));
    }

    return () => {
      window.removeEventListener("resize", handle);
      if (audio) {
        audio.pause();
        audio.currentTime = 0;
      }
    };
  }, []);

  // ❤️ Floating hearts
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

  // 🖼 Gallery images
  const gallery = [
    { src: "/images/img1.jpeg", message: "Our happiest smile together 😄,Bot yaad hai yehi wali photo jab tu aayi thi St.paul's kidhar fhir aapn pheli baar milega bass u and me🫠🫠😘" },
    { src: "/images/img2.jpeg", message: "Unforgettable day 💕,Humara phela trip to Ghodbundhar fort...aur dmart pizza🤤🤤 khaye the...scooty rides🛵🛵 23 August i wont forget the date💕💕😚" },
    { src: "/images/img3.jpeg", message: "Pure friendship vibes 🌸,A random photo that turn to be one of the best picture..isliye toh whatsapp chat pe bhi yehi rakh diya tha😚😚..." },
    { src: "/images/img4.jpeg", message: "Laughter that never ends 😍,Hahaaa marines maja aaya tha baarish mein bhigg kar aur fir joh thandii lag rahi thi🥶🥶..first time tera hath pakad tha🫣🤭🤭" },
    { src: "/images/img5.jpeg", message: "Forever my favorite person 💖,Humlog ka second movie Conjuring wala..Joh bikul bhi darawana nahi tha😒..but still maja aaya becozz tumlog the isliye...aur isbar tune pheli baar mera haath pakad tha voh bhi aache se🫣🫣😳😳" },
    { src: "/images/img7.jpeg", message: "Forever my favorite person 💖,natural park halki iss time aapn itne close nahi the but still bahut maja aaya tha...phele group trip joh tha aapna😎🫠" },
    { src: "/images/img6.jpeg", message: "The best memories live here ✨,Humara phele movie 23 September🎥🎥...maja aaya tha halki movie dekhne k jada toh humari bahut sari baat hui but koi naa starting aache se dekhe the🍿🍿📽️...aur next time starting mein bahut sari baat hui aur after interval dekha movie matlab humlog ne full movie toh dekhi but 2 baar jaa k😂😂🤣🤣..Laughing hardly..🤣😂🤣🤣😂" },
  ];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-pink-100 to-red-200 relative overflow-hidden text-center p-6">
      {/* 🎵 Background Music */}
      <audio ref={audioRef} src="/music/b.mpeg" loop preload="auto" />

      {/* Floating hearts */}
      {[...Array(20)].map((_, i) => (
        <Heart key={i} color={i % 2 === 0 ? "red" : "white"} delay={i * 0.5} />
      ))}

      {/* Secret message card */}
      <motion.div
        className="bg-white bg-opacity-80 rounded-2xl shadow-2xl p-10 max-w-lg border-2 border-pink-300"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <h1 className="text-4xl font-extrabold text-pink-600 mb-4">
          💖 Secret Message 💖
        </h1>
        <p className="text-lg text-gray-700 leading-relaxed">
          You found the secret surprise! 🌸  
          These moments are precious because of <em>you</em>.  
          Thank you for filling my life with happiness, laughter, and love ❤️  
          Bass bahut english bol liya aab bass...Bottttt kabse abha abha kar raha hu thak gaya  
          Aab bolunga Bottt😎😎 
        </p>
      </motion.div>

      {/* 🖼 Image Gallery Section */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-10 max-w-4xl"
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
      >
        {gallery.map((item, index) => {
          const isSpecial = item.src.includes("img6");
          return (
            <motion.div
              key={index}
              className={`relative rounded-xl overflow-hidden shadow-lg cursor-pointer ${
                isSpecial
                  ? "col-span-2 md:col-span-3 justify-self-center"
                  : ""
              }`}
              whileHover={{ scale: 1.05 }}
            >
              <img
                src={item.src}
                alt={`memory-${index + 1}`}
                className={`rounded-xl w-full ${
                  isSpecial
                    ? "h-60 md:h-72 object-contain mx-auto"
                    : "h-full object-cover"
                }`}
              />
             <motion.div
  onClick={() =>
    setShowTextIndex(showTextIndex === index ? null : index)
  } // ✅ Toggle on tap
  whileHover={{ scale: 1.1 }}
  initial={{ opacity: 0 }}
  animate={{ opacity: showTextIndex === index ? 1 : 0 }} // ✅ Show/hide
  className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center 
             text-white text-sm md:text-lg px-3 text-center cursor-pointer"
>
  <p>{item.message}</p>
</motion.div>


            </motion.div>
          );
        })}
      </motion.div>

      {/* 🏠 Back to Home Button */}
      <motion.button
        className="mt-10 px-6 py-3 bg-pink-500 hover:bg-pink-600 text-white font-semibold rounded-full shadow-lg transition-all duration-300"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => window.location.href = "/"} // navigate to homepage
      >
        ⬅️ Back to Home
      </motion.button>
    </div>
  );
}
