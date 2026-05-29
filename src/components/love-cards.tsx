"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Smile, Heart, Sparkles, Clock, Compass, X } from "lucide-react";

interface LoveCardData {
  title: string;
  preview: string;
  message: string;
  icon: any;
  gradient: string;
  glowColor: string;
  accentColor: string;
}

const LOVE_CARDS: LoveCardData[] = [
  {
    title: "My Safe Haven 🏡",
    preview: "In a world of noise, you are my absolute peace, my quiet harbor...",
    message: "Bebuu, the world can be incredibly chaotic, fast-paced, and overwhelming at times, but the very second I hold your hand or hear your voice, all that noise completely fades into the background. You have become my absolute sanctuary. Every hug from you feels like coming home. In your eyes, I find a calm that no storm can ever disturb. Thank you for being my peace, my shelter, and the safest place in my entire universe. I am forever anchored in your love.",
    icon: ShieldCheck,
    gradient: "from-[#631D76]/15 via-white/[0.01] to-[#FFAAEA]/10",
    glowColor: "rgba(99,29,118,0.2)",
    accentColor: "text-plum",
  },
  {
    title: "Laughter & Joy ☀️",
    preview: "You make my heart smile in ways nobody else ever could...",
    message: "My beautiful Avani, you possess this magical ability to light up the darkest of my days with just a single smile or an inside joke. From our sweet giggles in the lab to our late-night chats, every moment spent with you is filled with pure, unfiltered happiness. You make me laugh when I've forgotten how to, and you fill my life with a warmth that rivals the summer sun. Loving you is so incredibly easy because you bring so much joy into my existence. I promise to spend the rest of our days keeping that gorgeous smile on your face.",
    icon: Smile,
    gradient: "from-[#EAC435]/15 via-white/[0.01] to-[#FFAAEA]/10",
    glowColor: "rgba(234,196,53,0.15)",
    accentColor: "text-saffron",
  },
  {
    title: "The Sacred Choice 💍",
    preview: "I choose you today, tomorrow, and for every single lifetime to come...",
    message: "Avani, love isn't just a fleeting feeling for me; it is a sacred, conscious choice that I make every single morning I wake up. I choose you in your quiet moments, in your triumphs, and through any challenges life throws our way. I choose your laughter, your tears, your dreams, and your fears. There is not a single version of my future where I don't see your hand in mine. You are my absolute soulmate, my best friend, and my ultimate destination. Today, tomorrow, and for all the lifetimes that follow, I will keep choosing you, without hesitation, in a heartbeat.",
    icon: Heart,
    gradient: "from-[#FB4D3D]/15 via-white/[0.01] to-[#FFAAEA]/10",
    glowColor: "rgba(251,77,61,0.2)",
    accentColor: "text-tomato",
  },
  {
    title: "Growing Together 🌱",
    preview: "Two minds, two hearts, chasing our biggest dreams side by side...",
    message: "From debugging code to debugging life's little challenges, growing alongside you has been the most beautiful journey. You inspire me to be the absolute best version of myself, Avani. Your strength, your passion, and your brilliant mind leave me in absolute awe every day. As we conquer our studies, our careers, and our individual aspirations, I promise to stand by you as your biggest cheerleader, your loyal partner, and your rock. We are a team, my love, and together, there is absolutely nothing we cannot achieve.",
    icon: Sparkles,
    gradient: "from-[#98C1D9]/15 via-white/[0.01] to-[#FFAAEA]/10",
    glowColor: "rgba(152,193,217,0.2)",
    accentColor: "text-powder",
  },
  {
    title: "My Endless Love ⏳",
    preview: "My love for you grows with every beat of my heart, every single second...",
    message: "Bebuu, they say time is linear, but when I am with you, it feels both infinite and beautifully still. Every single second that ticks by on our love counter is a testament to how deeply my love for you has taken root. It isn't a stagnant feeling; it is a living, breathing devotion that grows stronger, deeper, and wider with every single breath I take. You hold the key to my heart, and as time rolls on, I only find myself falling more desperately in love with everything that you are. You are my forever.",
    icon: Clock,
    gradient: "from-[#631D76]/15 via-white/[0.01] to-[#FB4D3D]/10",
    glowColor: "rgba(99,29,118,0.2)",
    accentColor: "text-plum",
  },
  {
    title: "Our Shared Future 🌅",
    preview: "To all the unwritten chapters, the morning coffees, and the adventures ahead...",
    message: "My darling, when I look at you, I don't just see the beautiful present—I see a lifetime of breathtaking sunrises, quiet Sunday mornings with coffee, cozy evenings, and infinite adventures waiting for us. I look forward to building a home with you, traveling to places we've only dreamed of, and writing countless new chapters in our book of love. Every step I take toward the future is exciting because I am taking it with you. Hand in hand, heart to heart, we are heading toward a beautiful forever, and I cannot wait.",
    icon: Compass,
    gradient: "from-[#EAC435]/15 via-white/[0.01] to-[#98C1D9]/10",
    glowColor: "rgba(234,196,53,0.15)",
    accentColor: "text-saffron",
  },
];

/* ─── Premium 3D Tilt Card ─── */
function LoveCard({ card, index, onOpen }: { card: LoveCardData; index: number; onOpen: () => void }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const box = cardRef.current.getBoundingClientRect();
    const x = e.clientX - box.left - box.width / 2;
    const y = e.clientY - box.top - box.height / 2;
    
    // Limits rotation to roughly -8deg to +8deg
    setRotateX(-y / (box.height / 16));
    setRotateY(x / (box.width / 16));
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const Icon = card.icon;

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={onOpen}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        default: { duration: 0.65, delay: index * 0.1 },
        rotateX: { type: "spring", stiffness: 350, damping: 25 },
        rotateY: { type: "spring", stiffness: 350, damping: 25 },
      }}
      className={`group relative cursor-pointer overflow-hidden rounded-2xl border border-white/5 bg-gradient-to-br ${card.gradient} p-6 shadow-lg backdrop-blur-md transition-all duration-300 hover:border-white/15`}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      {/* Dynamic Glow Overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-2xl"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${card.glowColor} 0%, transparent 70%)`,
        }}
      />

      {/* Card Content (Lifted up in 3D Space) */}
      <div style={{ transform: "translateZ(30px)" }} className="relative z-10 flex flex-col h-full justify-between">
        <div>
          {/* Icon Circle */}
          <div className="mb-5 flex items-center justify-center w-12 h-12 rounded-xl bg-white/[0.03] border border-white/10 shadow-inner">
            <Icon className={`w-5 h-5 ${card.accentColor}`} strokeWidth={1.8} />
          </div>

          {/* Title */}
          <h3 className="font-heading text-xl text-white tracking-wide mb-2 group-hover:text-plum transition-colors">
            {card.title}
          </h3>

          {/* Short description */}
          <p className="text-xs text-white/50 leading-relaxed font-sans pr-4 group-hover:text-white/70 transition-colors">
            {card.preview}
          </p>
        </div>

        {/* Action cue */}
        <div className="mt-6 flex items-center gap-1.5 text-[10px] uppercase tracking-widest text-plum/40 group-hover:text-plum/80 transition-colors">
          <span>Read Vow</span>
          <span className="translate-x-0 group-hover:translate-x-1 transition-transform">➡️</span>
        </div>
      </div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export function LoveCards() {
  const [activeCard, setActiveCard] = useState<LoveCardData | null>(null);

  return (
    <section className="relative w-full py-20 px-4 sm:px-6 lg:px-8">
      {/* Ambient background decoration */}
      <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[500px] opacity-15 blur-[120px] rounded-full bg-gradient-to-tr from-orchid via-tomato to-saffron" />

      {/* Header */}
      <motion.div
        className="text-center mb-16 relative z-10"
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <div className="inline-flex items-center gap-2 rounded-full border border-plum/10 bg-plum/5 px-4 py-1.5 text-xs text-plum mb-4 shadow-sm backdrop-blur-sm">
          <span>💝</span>
          <span className="font-medium tracking-wide">For My Gorgeous Avani</span>
        </div>
        <h2 className="font-heading text-3xl sm:text-4xl md:text-5xl text-plum mb-3 tracking-wide drop-shadow-[0_0_15px_rgba(255,170,234,0.15)]">
          My Eternal Vows & Love Cards 🌹
        </h2>
        <p className="font-signature text-lg sm:text-xl text-saffron/80 max-w-lg mx-auto">
          Six promises engraved in the cosmos, crafted exclusively for you.
        </p>
      </motion.div>

      {/* Grid */}
      <div className="relative z-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
        {LOVE_CARDS.map((card, index) => (
          <LoveCard
            key={index}
            card={card}
            index={index}
            onOpen={() => setActiveCard(card)}
          />
        ))}
      </div>

      {/* Heartfelt Letter Modal overlay */}
      <AnimatePresence>
        {activeCard && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.9, y: 20, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-lg overflow-hidden rounded-3xl border border-white/10 bg-[#07050d] p-6 shadow-2xl shadow-plum/15 sm:p-8"
            >
              {/* Outer Glow Border Effect */}
              <div
                className="absolute inset-0 pointer-events-none opacity-20 blur-xl"
                style={{
                  background: `radial-gradient(circle at 50% 0%, ${activeCard.glowColor} 0%, transparent 60%)`,
                }}
              />

              {/* Close Button */}
              <button
                type="button"
                onClick={() => setActiveCard(null)}
                className="absolute right-4 top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-white/10 bg-white/5 text-white/40 hover:bg-white/10 hover:text-white transition-all shadow-md"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Letter Heading */}
              <div className="flex items-center gap-3 border-b border-white/10 pb-4 mb-5">
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/[0.03] border border-white/10">
                  <activeCard.icon className={`h-5 w-5 ${activeCard.accentColor}`} />
                </div>
                <div>
                  <h4 className="font-heading text-lg text-white">{activeCard.title}</h4>
                  <p className="text-[10px] uppercase tracking-widest text-white/30">Vow of Devotion</p>
                </div>
              </div>

              {/* Personal Handwriting Script Letter */}
              <div className="relative rounded-2xl bg-white/[0.01] border border-white/[0.03] p-5 shadow-inner">
                {/* Visual Flourish Quote Mark */}
                <span className="absolute top-1 left-2 text-6xl font-serif text-white/[0.02] pointer-events-none">“</span>
                
                <p className="font-signature text-xl leading-relaxed text-plum/90 drop-shadow-[0_0_8px_rgba(255,170,234,0.15)] text-justify">
                  {activeCard.message}
                </p>

                {/* Signature Block */}
                <div className="border-t border-white/5 mt-6 pt-4 flex flex-col items-end">
                  <span className="font-signature text-2xl text-saffron">Forever Yours,</span>
                  <span className="font-heading text-xs tracking-wider text-white/40 mt-1 uppercase">Gagan Kumar</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
