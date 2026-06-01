"use client";

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  interface Window {
    YT: {
      Player: new (
        elementId: string,
        options: {
          videoId?: string;
          playerVars?: Record<string, unknown>;
          events?: {
            onReady?: (event: { target: YTPlayerInstance }) => void;
            onStateChange?: (event: { data: number; target: YTPlayerInstance }) => void;
          };
        }
      ) => YTPlayerInstance;
      PlayerState: { ENDED: number; PLAYING: number; PAUSED: number; BUFFERING: number };
    };
    onYouTubeIframeAPIReady: () => void;
  }
}

interface YTPlayerInstance {
  playVideo: () => void;
  pauseVideo: () => void;
  loadVideoById: (videoId: string) => void;
  getCurrentTime: () => number;
  getDuration: () => number;
  destroy: () => void;
}

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { Reveal, StaggerContainer, StaggerItem } from "@/components/animations";
import { FloatingHearts } from "@/components/floating-hearts";
import { SectionDivider } from "@/components/section-divider";
import { FoldCard, FoldSection } from "@/components/fold-card";
import { ImageModal } from "@/components/image-modal";
import { Starfield } from "@/components/starfield";
import { CustomCursor } from "@/components/custom-cursor";
import { AnniversaryCountdown } from "@/components/anniversary-countdown";
import { LoveCards } from "@/components/love-cards";
import { LoveMeter } from "@/components/love-meter";
import { EmojiRain } from "@/components/emoji-rain";
import { TypewriterText } from "@/components/typewriter-text";
import { Heart, Play, Pause, SkipForward, SkipBack, Music, Volume2, Sparkles, MessageCircle, Calendar, Trophy, RotateCcw, ChevronDown } from "lucide-react";
import Image from "next/image";

/*
  Timeline Events
*/
interface TimelineItem {
  emoji: string;
  time: string;
  date: string;
  title: string;
  description: string;
  image: string | null;
}

const TIMELINE: TimelineItem[] = [
  {
    emoji: "❤️",
    time: "14:56",
    date: "24th August 2025",
    title: "The BEEE Lab Spark",
    description:
      "Where our universe quietly began. Amidst the hum of electrical equipment, circuits, and lab manuals, our paths crossed in the BEEE Lab at exactly 2:56 PM. A simple, ordinary afternoon turned into the single most extraordinary moment of my life, lighting up a spark that would eventually guide us to one another.",
    image: null,
  },
  {
    emoji: "✨",
    time: "10:30",
    date: "25th August 2025",
    title: "The First Message",
    description:
      "The message that changed my digital world forever. It was from you, my love, my life, Avani! You reached out asking for help with Harkirat Singh's 100xDevs course. Little did we know, while trying to master coding, we were actually writing the opening lines of our own beautiful story. I'll forever be grateful to that course for bringing us closer.",
    image: null,
  },
  {
    emoji: "🌙",
    time: "01:00",
    date: "21st October 2025",
    title: "A Midnight Confession",
    description:
      "With a racing heart and trembling fingers, I poured my entire soul out to you on Instagram at 1:00 AM. In the quiet, magical stillness of the night, I told you that you are my everything. It was the moment I let you see the absolute depth of my love, hoping you would feel the same.",
    image: null,
  },
  {
    emoji: "💖",
    time: "01:05",
    date: "21st October 2025",
    title: "First \"I Love You\"",
    description:
      "On that very same magical night of my confession, those three sacred words left my lips. Saying 'I love you' to you felt like coming home the easiest, most natural truth my heart has ever known. A promise made under the stars that only grows stronger each day.",
    image: null,
  },
  {
    emoji: "💍",
    time: "12:15",
    date: "21st January 2026",
    title: "She Said YES!",
    description:
      "The moment the world stood perfectly still. In the Tutorial Room (Tut Room), surrounded by whispers of our shared dreams, you looked into my eyes and said the most beautiful word in the English language: 'YES'. My heart skipped a beat, and in that split second, all my dreams became a beautiful reality.",
    image: null,
  },
  {
    emoji: "🌟",
    time: "12:20",
    date: "21st January 2026",
    title: "Making It Official",
    description:
      "Right there in the Tut Room, we made our love official. No longer just two souls walking parallel lines, but one united front, ready to take on the world hand-in-hand. The start of our forever, officially locked in our hearts.",
    image: null,
  },
  {
    emoji: "xR",
    time: "16:00",
    date: "18th February 2026",
    title: "Our First Valentine & Perfect Kiss 💋",
    description:
      "Without a doubt, one of the absolute best, most magical days of my entire life. We celebrated our love by exchanging sweet gifts, and then came that breathtaking kiss. A moment where the rest of the universe completely faded away, leaving only the warmth of your lips, the beating of our hearts, and a memory etched in gold forever.",
    image: null,
  },
];

/*
  Floating words
*/
const FLOATING_WORDS = [
  "Avani",
  "My Love",
  "BEEE Lab",
  "100xDevs",
  "Tut Room",
  "Kiss",
  "Forever",
  "My Life",
  "Official",
  "My Soulmate",
];

/*
  Reasons why I love Avani
*/
const LOVE_REASONS = [
  "The way your eyes light up whenever you are happy or excited.",
  "Your beautiful, pure smile that can instantly turn my darkest days into pure gold.",
  "How incredibly supportive you are, especially when you asked for help with Harkirat's course.",
  "The breathtaking warmth of your kiss on that magical 18th of February.",
  "Your beautiful soul, kind heart, and the gentle way you care for me.",
  "How safe and perfectly at home I feel whenever I am near you.",
  "The quiet, magical confidence of you saying 'YES' in the tutorial room.",
  "Because you are my love, my life, my forever, and my absolute everything.",
  "The way you make even the simplest lab class feel like an adventure of a lifetime.",
];

/*
  Romantic Tracks - real YouTube video IDs
*/
const PLAYLIST = [
  {
    title: "Perfect",
    artist: "Ed Sheeran",
    youtubeId: "2Vv-BfVoq4g",
    lyrics: [
      "Baby, I'm dancing in the dark with you between my arms...",
      "Barefoot on the grass, listening to our favorite song...",
      "I found a love, for me... darling just dive right in...",
      "Baby I'm perfect for you..."
    ],
  },
  {
    title: "Darkhaast",
    artist: "Arijit Singh & Sunidhi Chauhan",
    youtubeId: "kY411k4J42s",
    lyrics: [
      "Darkhaast hai ye... meri jaan...",
      "Sajde mein tere hi... sar jhuka...",
      "Meri har saans... teri aahaton ki pyaasi...",
      "Avani, you are my heart's ultimate prayer"
    ],
  },
  {
    title: "I Wanna Be Yours",
    artist: "Arctic Monkeys",
    youtubeId: "nyuo9-OjNNg",
    lyrics: [
      "I wanna be your vacuum cleaner, breathing in your dust...",
      "I wanna be your Ford Cortina, I will never rust...",
      "Secrets I have held in my heart are harder to hide...",
      "I wanna be yours, Avani... always yours"
    ],
  },
  {
    title: "Tum Se Hi",
    artist: "Mohit Chauhan (Jab We Met)",
    youtubeId: "mt9xg0mmt28",
    lyrics: [
      "Tum se hi din hota hai...",
      "Surmaiye shaam aati hai...",
      "Tum se hi, tum se hi...",
      "Avani, my life makes perfect sense only with you"
    ],
  },
  {
    title: "Tera Ban Jaunga",
    artist: "Akhil Sachdeva & Tulsi Kumar",
    youtubeId: "Qdz5n1Xe5Qo",
    lyrics: [
      "Main tera ban jaunga...",
      "Tu meri ban jaayegi...",
      "Ik dooje mein kho jaayenge...",
      "Avani, I am yours forever"
    ],
  },
];

/*
  Interactive Love Trivia Questions just for Avani
*/
interface QuizQuestion {
  question: string;
  options: string[];
  answer: string;
  successMsg: string;
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    question: "Where did we meet for the very first time?",
    options: ["Chemistry Lab", "BEEE Lab", "Tutorial Room", "Library"],
    answer: "BEEE Lab",
    successMsg: "Exactly! At 2:56 PM in the BEEE Lab... where our electrical spark ignited!",
  },
  {
    question: "What did you ask help for in your first message?",
    options: ["Math assignment", "Physics quiz", "Harkirat Singh's 100xDevs Course", "Next.js structure"],
    answer: "Harkirat Singh's 100xDevs Course",
    successMsg: "Yes, bebuu! Trying to master web development ended up bringing us to our own beautiful forever!",
  },
  {
    question: "Where did you say YES to being my official girlfriend?",
    options: ["BEEE Lab", "Tutorial Room (Tut Room)", "Instagram DM", "Cafeteria"],
    answer: "Tutorial Room (Tut Room)",
    successMsg: "Yes, my love! January 21st in the Tut Room the happiest and most special moment ever!",
  },
  {
    question: "What magical milestone happened on February 18th?",
    options: ["First date", "Our First Valentine & Perfect Kiss", "Anniversary", "We met for the first time"],
    answer: "Our First Valentine & Perfect Kiss",
    successMsg: "Mwah! Exchanging gifts and that breathtaking kiss was one of the absolute best days of my life!",
  },
];

/*
  Memory Polaroid Deck
*/
interface MemoryCard {
  title: string;
  date: string;
  quote: string;
  bgColor: string;
}

const MEMORY_CARDS: MemoryCard[] = [
  {
    title: "BEEE Lab Meeting",
    date: "24 Aug 2025",
    quote: "A single glance in the lab room, and my heart coded a permanent loop for you.",
    bgColor: "bg-orchid-dark/40",
  },
  {
    title: "The First Text",
    date: "25 Aug 2025",
    quote: "Who knew Harkirat's 100xDevs course would lead to 100x more love every single day?",
    bgColor: "bg-plum-dark/40",
  },
  {
    title: "The Instagram Confession",
    date: "21 Oct 2025",
    quote: "Pouring my heart out at 1 AM was the best decision I ever made.",
    bgColor: "bg-tomato-dark/40",
  },
  {
    title: "The Sweet Yes",
    date: "21 Jan 2026",
    quote: "Hearing you say YES in that Tut Room turned my dream world into reality.",
    bgColor: "bg-powder-dark/40",
  },
  {
    title: "Our Golden Kiss",
    date: "18 Feb 2026",
    quote: "A perfect kiss, sweet gifts, and the feeling that we are invincible together.",
    bgColor: "bg-saffron-dark/40",
  },
];

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [modalImage, setModalImage] = useState<{ src: string; alt: string } | null>(null);
  
  // Real-time ticking love counter
  const [timeElapsed, setTimeElapsed] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  // Interactive love reason state
  const [currentReasonIdx, setCurrentReasonIdx] = useState<number | null>(null);

  // Love Letter open state
  const [isLetterOpen, setIsLetterOpen] = useState(false);

  // Simulated Music Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTrackIdx, setCurrentTrackIdx] = useState(0);
  const [songProgress, setSongProgress] = useState(0);
  const [lyricIdx, setLyricIdx] = useState(0);

  // YouTube IFrame API player reference
  const ytPlayerRef = useRef<YTPlayerInstance | null>(null);
  const [ytReady, setYtReady] = useState(false);
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Interactive Memory Deck States
  const [activeDeckIdx, setActiveDeckIdx] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Love Trivia Quiz States
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState<string | null>(null);
  const [quizFinished, setQuizFinished] = useState(false);

  // Emoji Rain celebration state
  const [showCelebration, setShowCelebration] = useState(false);

  // Scroll progress for nav
  const [scrollProgress, setScrollProgress] = useState(0);

  // Previous track
  const handlePrevTrack = () => {
    setCurrentTrackIdx((old) => (old - 1 + PLAYLIST.length) % PLAYLIST.length);
    setSongProgress(0);
    setLyricIdx(0);
  };

  // Use global useScroll window calculations to avoid target ref hydration errors
  const { scrollY } = useScroll();
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  const heroScale = useTransform(scrollY, [0, 300], [1, 0.95]);
  const heroY = useTransform(scrollY, [0, 300], [0, 100]);

  // Handle client-side mount + scroll progress
  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      const scrolled = window.scrollY;
      const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
      setScrollProgress(maxScroll > 0 ? (scrolled / maxScroll) * 100 : 0);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Together calculation: January 21, 2026 at 12:00 PM
  useEffect(() => {
    if (!mounted) return;
    const officialDate = new Date("2026-01-21T12:00:00");
    const interval = setInterval(() => {
      const now = new Date();
      const diff = now.getTime() - officialDate.getTime();
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const minutes = Math.floor((diff / (1000 * 60)) % 60);
      const seconds = Math.floor((diff / 1000) % 60);
      
      setTimeElapsed({ days, hours, minutes, seconds });
    }, 1000);

    return () => clearInterval(interval);
  }, [mounted]);

  // Load YouTube IFrame API once mounted
  useEffect(() => {
    if (!mounted) return;

    const initYTPlayer = () => {
      if (ytPlayerRef.current) return;
      ytPlayerRef.current = new window.YT.Player("yt-player-hidden", {
        videoId: PLAYLIST[0].youtubeId,
        playerVars: {
          autoplay: 0,
          controls: 0,
          modestbranding: 1,
          rel: 0,
          iv_load_policy: 3,
          disablekb: 1,
        },
        events: {
          onReady: () => {
            setYtReady(true);
          },
          onStateChange: (event: { data: number }) => {
            // 0 = ENDED
            if (event.data === 0) {
              setCurrentTrackIdx((old) => (old + 1) % PLAYLIST.length);
              setSongProgress(0);
              setLyricIdx(0);
            }
          },
        },
      });
    };

    if (window.YT && window.YT.Player) {
      initYTPlayer();
    } else {
      window.onYouTubeIframeAPIReady = initYTPlayer;
      if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
        const tag = document.createElement("script");
        tag.src = "https://www.youtube.com/iframe_api";
        document.head.appendChild(tag);
      }
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  }, [mounted]);

  // When track changes, load new YouTube video
  useEffect(() => {
    if (!ytPlayerRef.current || !ytReady) return;
    ytPlayerRef.current.loadVideoById(PLAYLIST[currentTrackIdx].youtubeId);
    setSongProgress(0);
    setLyricIdx(0);
    if (!isPlaying) {
      setTimeout(() => ytPlayerRef.current?.pauseVideo(), 800);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentTrackIdx, ytReady]);

  // Sync play/pause with YouTube player + poll for progress
  useEffect(() => {
    if (!ytPlayerRef.current || !ytReady) return;

    if (progressTimerRef.current) clearInterval(progressTimerRef.current);

    if (isPlaying) {
      ytPlayerRef.current.playVideo();
      progressTimerRef.current = setInterval(() => {
        const player = ytPlayerRef.current;
        if (!player) return;
        try {
          const duration = player.getDuration();
          if (duration > 0) {
            const prog = (player.getCurrentTime() / duration) * 100;
            setSongProgress(prog);
            const lyricsCount = PLAYLIST[currentTrackIdx].lyrics.length;
            setLyricIdx(Math.min(Math.floor((prog / 100) * lyricsCount), lyricsCount - 1));
          }
        } catch (_) { /* player may not be ready */ }
      }, 500);
    } else {
      ytPlayerRef.current.pauseVideo();
    }

    return () => {
      if (progressTimerRef.current) clearInterval(progressTimerRef.current);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPlaying, ytReady, currentTrackIdx]);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#07050d] flex items-center justify-center">
        <Heart className="h-10 w-10 text-plum animate-pulse" />
      </div>
    );
  }

  const handleNextTrack = () => {
    setCurrentTrackIdx((old) => (old + 1) % PLAYLIST.length);
    setSongProgress(0);
    setLyricIdx(0);
  };

  const generateReason = () => {
    let nextIdx = Math.floor(Math.random() * LOVE_REASONS.length);
    while (nextIdx === currentReasonIdx) {
      nextIdx = Math.floor(Math.random() * LOVE_REASONS.length);
    }
    setCurrentReasonIdx(nextIdx);
  };

  // Trivia handling
  const handleAnswerOptionClick = (option: string) => {
    if (quizFeedback) return;
    setSelectedOption(option);
    const correctAns = QUIZ_QUESTIONS[currentQuestionIdx].answer;
    if (option === correctAns) {
      setQuizScore((prev) => prev + 1);
      setQuizFeedback(QUIZ_QUESTIONS[currentQuestionIdx].successMsg);
    } else {
      setQuizFeedback("Oops, not quite! Try to remember that special moment! 😢");
    }
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    setQuizFeedback(null);
    if (currentQuestionIdx + 1 < QUIZ_QUESTIONS.length) {
      setCurrentQuestionIdx((prev) => prev + 1);
    } else {
      setQuizFinished(true);
    }
  };

  const resetQuiz = () => {
    setQuizStarted(false);
    setCurrentQuestionIdx(0);
    setSelectedOption(null);
    setQuizScore(0);
    setQuizFeedback(null);
    setQuizFinished(false);
  };

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-[#07050d] pb-28 text-white">
      {/* Premium Background & Cursor */}
      <Starfield />
      <CustomCursor />
      <FloatingHearts />
      <EmojiRain active={showCelebration} />

      {/* """"""""""" SCROLL PROGRESS BAR """"""""""" */}
      <div className="fixed top-0 left-0 right-0 z-[55] h-[2px]">
        <motion.div
          className="h-full bg-gradient-to-r from-orchid via-plum to-tomato"
          style={{ width: `${scrollProgress}%` }}
          transition={{ duration: 0.1 }}
        />
      </div>

      {/* """"""""""" FLOATING NAV """"""""""" */}
      <motion.nav
        className="fixed top-3 left-1/2 z-50 -translate-x-1/2 rounded-full border border-white/10 bg-[#07050d]/70 px-1 py-1 backdrop-blur-xl shadow-2xl"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5, duration: 0.6, ease: "easeOut" }}
      >
        <div className="flex items-center gap-0.5">
          {[
            { label: "Story", href: "#our-story" },
            { label: "Memories", href: "#memories" },
            { label: "Trivia", href: "#trivia" },
            { label: "Promises", href: "#promises" },
            { label: "Love", href: "#love-meter" },
            { label: "Letter", href: "#letter" },
          ].map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-3 py-1.5 text-[10px] font-medium text-white/50 transition-all duration-300 hover:bg-white/10 hover:text-white sm:px-4 sm:text-xs"
            >
              {item.label}
            </a>
          ))}
        </div>
      </motion.nav>

      {/* """"""""""" HERO SECTION """"""""""" */}
      <section
        className="relative flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-4 text-center sm:px-6"
      >
        {/* Glow Effects */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute left-1/4 top-1/4 h-64 w-64 rounded-full bg-orchid/20 blur-[100px] sm:h-96 sm:w-96 sm:blur-[140px]" />
          <div className="absolute bottom-1/4 right-1/4 h-56 w-56 rounded-full bg-tomato/15 blur-[90px] sm:h-80 sm:w-80 sm:blur-[120px]" />
          <div className="absolute left-1/2 top-1/2 h-44 w-44 -translate-x-1/2 -translate-y-1/2 rounded-full bg-plum/20 blur-[80px] sm:h-72 sm:w-72 sm:blur-[100px]" />
        </div>

        <motion.div
          style={{ opacity: heroOpacity, scale: heroScale, y: heroY }}
          className="relative z-10 max-w-4xl"
        >
          <Reveal variant="fadeDown" duration={0.8}>
            <div className="flex flex-col items-center gap-2">
              <motion.span
                className="inline-flex items-center gap-1.5 rounded-full border border-tomato/30 bg-tomato/15 px-4 py-1 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-tomato backdrop-blur-sm"
                animate={{ scale: [1, 1.06, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                xR Happy Girlfriend&apos;s Day, Bebuu! xR
              </motion.span>
              <motion.p
                className="text-xs font-semibold tracking-[0.3em] uppercase text-plum sm:text-sm mt-1"
                animate={{ opacity: [0.6, 1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                My Forever & Always ❤️
              </motion.p>
            </div>
          </Reveal>

          <Reveal variant="scaleUp" delay={0.2} duration={1.2}>
            <h1 className="mt-4 font-display text-6xl leading-tight tracking-tight sm:mt-6 sm:text-8xl md:text-9xl">
              <motion.span
                className="bg-gradient-to-r from-plum via-tomato to-saffron bg-[length:300%_100%] bg-clip-text text-transparent"
                animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                Avani
              </motion.span>
            </h1>
          </Reveal>

          <Reveal variant="blur" delay={0.5}>
            <p className="mx-auto mt-4 max-w-sm font-signature text-2xl text-plum/90 sm:mt-6 sm:max-w-lg sm:text-3xl md:text-4xl">
              my girlfriend, my love, my life, my everything
              <span className="inline-block animate-pulse text-tomato"> "</span>
            </p>
          </Reveal>

          {/* Dynamic Live Counter */}
          <Reveal variant="fadeUp" delay={0.7}>
            <div className="mx-auto mt-8 max-w-md rounded-2xl border border-white/10 bg-white/[0.02] p-5 backdrop-blur-md shadow-2xl">
              <span className="text-[10px] font-semibold uppercase tracking-[0.2em] text-saffron/80">
                Time Spent Loving You:
              </span>
              <div className="mt-3 grid grid-cols-4 gap-2">
                {[
                  { label: "Days", val: timeElapsed.days },
                  { label: "Hours", val: timeElapsed.hours },
                  { label: "Mins", val: timeElapsed.minutes },
                  { label: "Secs", val: timeElapsed.seconds },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex flex-col items-center rounded-xl bg-white/[0.01] p-2.5 border border-white/5 shadow-inner"
                  >
                    <span className="font-mono text-xl font-bold text-plum sm:text-3xl">
                      {String(item.val).padStart(2, "0")}
                    </span>
                    <span className="text-[9px] uppercase tracking-wider text-white/40">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
              <p className="mt-3 text-[10px] text-white/40 italic">
                Since we made it official on 21st Jan 2026 "
              </p>
            </div>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.9}>
            <motion.a
              href="#our-story"
              className="animate-pulse-glow group mt-8 inline-flex items-center gap-2 rounded-full border border-orchid/30 bg-orchid/20 px-6 py-2.5 text-xs font-medium text-plum backdrop-blur-sm transition-all duration-300 hover:border-orchid/60 hover:bg-orchid/40 sm:mt-10 sm:px-8 sm:py-3 sm:text-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Explore Our Story
              <motion.span
                animate={{ y: [0, 6, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                 ❤️
              </motion.span>
            </motion.a>
          </Reveal>
        </motion.div>

        {/* Bottom Fade */}
        <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#07050d] to-transparent sm:h-32" />
      </section>

      {/* """"""""""" ANNIVERSARY COUNTDOWN """"""""""" */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-3xl">
          <AnniversaryCountdown />
        </div>
      </section>

      <SectionDivider />

      {/* """"""""""" OUR TIMELINE """"""""""" */}
      <section id="our-story" className="relative px-4 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-3xl">
          <Reveal variant="fadeUp">
            <h2 className="text-center font-heading text-4xl tracking-wide text-plum sm:text-5xl md:text-6xl">
              <motion.span
                whileInView={{ backgroundSize: ["0% 2px", "100% 2px"] }}
                viewport={{ once: true }}
                transition={{ duration: 0.8, delay: 0.3 }}
                style={{
                  backgroundImage: "linear-gradient(to right, #FFAAEA, #98C1D9)",
                  backgroundRepeat: "no-repeat",
                  backgroundPosition: "bottom center",
                  backgroundSize: "0% 2px",
                  paddingBottom: 4,
                }}
              >
                Our Sacred Milestones
              </motion.span>
            </h2>
            <p className="mt-3 text-center text-xs text-white/50 sm:mt-4 sm:text-sm">
              The chapters of our love, coded in memories and written in our hearts.
            </p>
          </Reveal>

          <div className="relative mt-12 sm:mt-20">
            {/* Vertical timeline line */}
            <motion.div
              className="absolute left-1/2 top-0 hidden h-full w-px sm:block"
              style={{
                background: "linear-gradient(to bottom, rgba(99,29,118,0.7), rgba(255,170,234,0.4), transparent)",
                transformOrigin: "top",
              }}
              initial={{ scaleY: 0 }}
              whileInView={{ scaleY: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.5, ease: "easeOut" }}
            />

            {TIMELINE.map((item, i) => (
              <FoldCard key={i} index={i} className="relative mb-8 last:mb-0 sm:mb-16">
                <div
                  className={`flex flex-col sm:flex-row items-stretch sm:gap-16 ${
                    i % 2 === 0 ? "" : "sm:flex-row-reverse sm:text-right"
                  }`}
                >
                  {/* Timeline node */}
                  <div className="absolute left-1/2 top-6 z-10 hidden h-4 w-4 -translate-x-1/2 -translate-y-1/2 items-center justify-center sm:flex">
                    <motion.span
                      className="absolute h-4 w-4 rounded-full border-2 border-orchid bg-[#07050d]"
                      whileInView={{ scale: [0, 1.2, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: i * 0.1 }}
                    />
                    <motion.span
                      className="absolute h-2 w-2 rounded-full bg-plum"
                      whileInView={{ scale: [0, 1] }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: i * 0.1 + 0.2 }}
                    />
                  </div>

                  {/* Content card */}
                  <div
                    className={`w-full overflow-hidden rounded-2xl border border-white/5 bg-white/[0.01] p-6 transition-all duration-300 hover:border-orchid/30 hover:bg-white/[0.04] sm:w-[calc(50%-2rem)] ${
                      i % 2 === 0 ? "" : "sm:ml-auto"
                    }`}
                  >
                    <div
                      className={`flex items-center gap-2 mb-3 sm:gap-3 ${
                        i % 2 !== 0 ? "sm:flex-row-reverse" : ""
                      }`}
                    >
                      <motion.span
                        className="flex h-8 w-8 items-center justify-center rounded-lg bg-orchid/20 text-base"
                        whileInView={{ rotate: [0, 15, -15, 0] }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: i * 0.15 }}
                      >
                        {item.emoji}
                      </motion.span>
                      <div className="flex flex-col text-left">
                        <time className="text-[10px] font-semibold tracking-wider text-saffron/90 uppercase">
                          {item.time}
                        </time>
                        <span className="text-[10px] text-white/30">{item.date}</span>
                      </div>
                    </div>

                    <h3 className="font-display text-xl text-white sm:text-2xl">{item.title}</h3>
                    <p className="mt-2 text-xs leading-relaxed text-white/60 sm:text-sm">
                      {item.description}
                    </p>
                  </div>
                </div>
              </FoldCard>
            ))}
          </div>
        </div>
      </section>

      <SectionDivider />

      {/* """"""""""" INTERACTIVE POLAROID SHUFFLE GALLERY """"""""""" */}
      <section id="memories" className="relative px-4 py-20 sm:px-6 sm:py-28">
        <div className="mx-auto max-w-lg text-center">
          <Reveal variant="fadeUp">
            <h2 className="font-heading text-3xl text-plum sm:text-4xl">Our Memory Deck 🎴</h2>
            <p className="mt-2 text-xs text-white/40 mb-10">
              Flip the card to read the sweet message behind each magical milestone.
            </p>
          </Reveal>

          <Reveal variant="scaleUp" delay={0.2}>
            <div className="flex flex-col items-center">
              {/* Card Container with 3D perspective */}
              <div className="perspective-1000 relative h-72 w-56 cursor-pointer" onClick={() => setIsFlipped(!isFlipped)}>
                <motion.div
                  className="relative h-full w-full rounded-2xl shadow-2xl transition-transform duration-500 transform-style-3d"
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                >
                  {/* Front Side */}
                  <div className={`absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10 ${MEMORY_CARDS[activeDeckIdx].bgColor} p-4 backface-hidden`}>
                    <div className="flex justify-between items-center text-[10px] uppercase font-semibold tracking-wider text-white/60">
                      <span>Milestone {activeDeckIdx + 1}</span>
                      <span>{MEMORY_CARDS[activeDeckIdx].date}</span>
                    </div>
                    
                    <div className="my-auto text-center font-display text-2xl text-white">
                      {MEMORY_CARDS[activeDeckIdx].title}
                    </div>

                    <div className="text-center text-[10px] text-white/30 italic">
                      Tap to flip card a
                    </div>
                  </div>

                  {/* Back Side */}
                  <div className="absolute inset-0 flex flex-col justify-between rounded-2xl border border-white/10 bg-[#0e0b16] p-4 rotate-y-180 backface-hidden">
                    <span className="text-[10px] text-saffron/80 uppercase font-semibold">Behind the Memory xR"</span>
                    
                    <p className="my-auto font-signature text-xl text-plum leading-relaxed text-center">
                      "{MEMORY_CARDS[activeDeckIdx].quote}"
                    </p>

                    <span className="text-[9px] text-white/30 text-center">Tap to flip back</span>
                  </div>
                </motion.div>
              </div>

              {/* Shuffle Controls */}
              <div className="mt-8 flex gap-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveDeckIdx((prev) => (prev - 1 + MEMORY_CARDS.length) % MEMORY_CARDS.length);
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white"
                >
                    Prev
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setIsFlipped(false);
                    setActiveDeckIdx((prev) => (prev + 1) % MEMORY_CARDS.length);
                  }}
                  className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-xs text-white/70 hover:bg-white/10 hover:text-white"
                >
                  Next ➡️
                </button>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider />

      {/* """"""""""" LOVE TRIVIA MINI-GAME SECTION """"""""""" */}
      <section id="trivia" className="relative px-4 py-20 sm:px-6 sm:py-28 bg-[#0c0915]">
        <div className="mx-auto max-w-xl">
          <div className="text-center mb-10">
            <h2 className="font-heading text-3xl text-plum sm:text-4xl">Our Love Trivia</h2>
            <p className="mt-2 text-xs text-white/40">
              A playful little game to test our memory, just for my Bebuu.
            </p>
          </div>

          {!quizStarted ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 text-center shadow-lg">
              <Trophy className="mx-auto h-12 w-12 text-saffron animate-bounce mb-4" />
              <h3 className="font-display text-xl text-white">How well do you remember us?</h3>
              <p className="text-xs text-white/50 mt-2 mb-6">
                Answer the special questions about our sweet milestones and unlock a hidden celebration!
              </p>
              <button
                type="button"
                onClick={() => setQuizStarted(true)}
                className="rounded-full bg-plum/20 hover:bg-plum/30 border border-plum/30 px-6 py-2.5 text-xs font-semibold text-plum transition-all hover:scale-105"
              >
                Start Love Trivia
              </button>
            </div>
          ) : quizFinished ? (
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-8 text-center shadow-lg">
              <Sparkles className="mx-auto h-12 w-12 text-plum mb-4" />
              <h3 className="font-display text-2xl text-plum">Trivia Completed!</h3>
              <p className="text-xs text-white/60 mt-2">
                You got <strong className="text-saffron">{quizScore} / {QUIZ_QUESTIONS.length}</strong> correct!
              </p>
              <p className="text-xs text-white/40 mt-3 italic">
                {quizScore === QUIZ_QUESTIONS.length
                  ? "Bebuu, you got a perfect score! You are my absolute soulmate! 😍"
                  : "You did amazing, Bebuu! I love you so much!"}
              </p>
              <button
                type="button"
                onClick={() => {
                  resetQuiz();
                  setShowCelebration(false);
                }}
                className="mt-6 inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs text-white/60 hover:text-white hover:bg-white/10"
              >
                <RotateCcw className="h-3 w-3" /> Play Again
              </button>
            </div>
          ) : (
            <div className="rounded-2xl border border-white/5 bg-white/[0.01] p-6 sm:p-8 shadow-lg">
              <div className="flex justify-between items-center text-[10px] text-white/40 mb-4">
                <span>Question {currentQuestionIdx + 1} of {QUIZ_QUESTIONS.length}</span>
                <span>Score: {quizScore}</span>
              </div>

              <h3 className="text-sm sm:text-base font-semibold text-white mb-6">
                {QUIZ_QUESTIONS[currentQuestionIdx].question}
              </h3>

              <div className="space-y-3">
                {QUIZ_QUESTIONS[currentQuestionIdx].options.map((option, i) => {
                  let optStyle = "border-white/10 bg-white/[0.02] hover:bg-white/5";
                  if (selectedOption) {
                    const isCorrect = option === QUIZ_QUESTIONS[currentQuestionIdx].answer;
                    if (isCorrect) {
                      optStyle = "border-emerald-500/55 bg-emerald-500/10 text-emerald-300";
                    } else if (option === selectedOption) {
                      optStyle = "border-rose-500/55 bg-rose-500/10 text-rose-300";
                    } else {
                      optStyle = "border-white/5 bg-white/[0.01] opacity-50";
                    }
                  }
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={!!selectedOption}
                      onClick={() => handleAnswerOptionClick(option)}
                      className={`w-full text-left rounded-xl border p-3.5 text-xs transition-all ${optStyle}`}
                    >
                      {option}
                    </button>
                  );
                })}
              </div>

              {quizFeedback && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-6 border-t border-white/10 pt-4"
                >
                  <p className="text-xs text-white/70 italic leading-relaxed">
                    {quizFeedback}
                  </p>
                  <button
                    type="button"
                    onClick={handleNextQuestion}
                    className="mt-4 w-full rounded-full bg-white/10 hover:bg-white/20 py-2 text-xs font-semibold text-white transition-all"
                  >
                    {currentQuestionIdx + 1 === QUIZ_QUESTIONS.length ? "Finish Quiz" : "Next Question ➡️"}
                  </button>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </section>

      <SectionDivider />

      {/* """"""""""" REASONS I LOVE YOU """"""""""" */}
      <section className="relative px-4 py-16 sm:px-6 sm:py-24">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-tomato/5 blur-[90px]" />
        </div>

        <div className="relative mx-auto max-w-lg text-center">
          <Reveal variant="fadeUp">
            <h2 className="font-heading text-3xl text-plum sm:text-4xl">Just For My Avani "</h2>
            <p className="mt-2 text-xs text-white/40">
              Need a reminder of how incredibly loved you are? Tap below.
            </p>
          </Reveal>

          <Reveal variant="scaleUp" delay={0.2}>
            <div className="mt-6 flex flex-col items-center">
              <button
                type="button"
                onClick={generateReason}
                className="group relative flex items-center gap-2 rounded-full bg-tomato/20 hover:bg-tomato/30 border border-tomato/30 px-6 py-3 text-xs font-semibold text-white transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-tomato/10"
              >
                <Heart className="h-4 w-4 text-tomato fill-tomato group-hover:scale-125 transition-transform" />
                Show Me a Reason I Love You
              </button>

              <AnimatePresence mode="wait">
                {currentReasonIdx !== null && (
                  <motion.div
                    key={currentReasonIdx}
                    initial={{ opacity: 0, y: 15, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -15, scale: 0.95 }}
                    transition={{ duration: 0.3 }}
                    className="mt-6 w-full rounded-2xl border border-white/10 bg-white/[0.02] p-6 backdrop-blur-sm shadow-xl"
                  >
                    <Sparkles className="mx-auto h-5 w-5 text-saffron animate-spin-slow mb-3" />
                    <p className="font-signature text-xl text-plum leading-relaxed text-center">
                      "{LOVE_REASONS[currentReasonIdx]}"
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </Reveal>
        </div>
      </section>

      <SectionDivider />

      {/* """"""""""" LOVE CARDS / ETERNAL VOWS """"""""""" */}
      <section id="promises" className="relative px-4 py-16 sm:px-6 sm:py-20">
        <div className="mx-auto max-w-5xl">
          <LoveCards />
        </div>
      </section>

      <SectionDivider />

      {/* """"""""""" LOVE COMPATIBILITY METER """"""""""" */}
      <section id="love-meter" className="relative px-4 py-20 sm:px-6 sm:py-28 bg-[#0c0915]">
        <div className="mx-auto max-w-lg">
          <Reveal variant="fadeUp">
            <h2 className="text-center font-heading text-3xl text-plum sm:text-4xl mb-2">Love Compatibility 💕</h2>
            <p className="text-center text-xs text-white/40 mb-8">Let the universe calculate what we already know...</p>
          </Reveal>
          <LoveMeter />
        </div>
      </section>

      <SectionDivider />

      {/* """"""""""" YOU & ME """"""""""" */}
      <FoldSection className="relative px-4 py-16 sm:px-6 sm:py-28">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 rounded-full bg-orchid/10 blur-[100px]" />
        </div>

        <div className="relative mx-auto max-w-lg text-center">
          {/* Floating words */}
          <div className="relative mx-auto mb-10 h-56 w-56 sm:h-64 sm:w-64">
            {FLOATING_WORDS.map((word, i) => {
              const angle = (360 / FLOATING_WORDS.length) * i;
              const radius = 40;
              return (
                <motion.span
                  key={word}
                  className="absolute left-1/2 top-1/2 font-signature text-xs text-white/20 sm:text-sm"
                  style={{
                    x: `calc(-50% + ${Math.cos((angle * Math.PI) / 180) * radius}%)`,
                    y: `calc(-50% + ${Math.sin((angle * Math.PI) / 180) * radius}%)`,
                  }}
                  animate={{
                    opacity: [0.15, 0.45, 0.15],
                    scale: [0.95, 1.1, 0.95],
                  }}
                  transition={{
                    duration: 5 + i * 0.4,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.5,
                  }}
                >
                  {word}
                </motion.span>
              );
            })}

            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <motion.span
                className="text-6xl"
                animate={{
                  scale: [1, 1.18, 1],
                  filter: [
                    "drop-shadow(0 0 10px rgba(255,170,234,0.3))",
                    "drop-shadow(0 0 25px rgba(255,170,234,0.6))",
                    "drop-shadow(0 0 10px rgba(255,170,234,0.3))",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                💖"
              </motion.span>
            </div>
          </div>

          <Reveal variant="fadeUp">
            <h2 className="font-heading text-4xl text-plum sm:text-5xl">You & Me</h2>
            <p className="mt-2 font-signature text-xl text-white/40">this is just our opening act</p>
          </Reveal>

          <Reveal variant="fadeUp" delay={0.2}>
            <div className="mt-8 space-y-3 sm:space-y-4">
              <p className="text-sm leading-relaxed text-white/50 sm:text-base">
                I don&apos;t know what tomorrow looks like,
              </p>
              <p className="text-sm leading-relaxed text-white/50 sm:text-base">
                but I know who I want next to me when it comes.
              </p>
              <p className="pt-2 font-signature text-xl text-plum/70 sm:text-2xl">
                <TypewriterText
                  text="it's you, Avani. it was always you."
                  speed={60}
                  delay={800}
                  className="animate-text-glow"
                />
              </p>
            </div>
          </Reveal>

          <Reveal variant="scaleUp" delay={0.4}>
            <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.03] px-5 py-2">
              <span className="text-xs tracking-widest text-white/40 uppercase">
                S Day 1 of Forever S
              </span>
            </div>
          </Reveal>
        </div>
      </FoldSection>

      <SectionDivider />

      {/* """"""""""" INTERACTIVE OPENING LOVE LETTER """"""""""" */}
      <section id="letter" className="px-4 py-20 sm:px-6 sm:py-32">
        <div className="mx-auto max-w-xl">
          <Reveal variant="fadeUp">
            <h2 className="text-center font-heading text-3xl text-plum mb-8">
              A Private Letter For You
            </h2>
          </Reveal>

          <div className="relative flex justify-center">
            <motion.div
              className={`w-full overflow-hidden rounded-2xl border border-white/10 bg-white/[0.02] p-8 shadow-2xl transition-all duration-500 ${
                isLetterOpen ? "max-h-[800px]" : "max-h-[160px] cursor-pointer hover:bg-white/[0.04]"
              }`}
              onClick={() => {
                if (!isLetterOpen) setIsLetterOpen(true);
              }}
              layout
            >
              {!isLetterOpen ? (
                <div className="flex flex-col items-center justify-center py-4">
                  <MessageCircle className="h-8 w-8 text-plum animate-bounce mb-2" />
                  <span className="text-sm font-semibold tracking-wider text-plum">
                    Tap to Break the Seal & Open Letter
                  </span>
                  <span className="text-[10px] text-white/30 mt-1">
                    Strictly for Avani&apos;s eyes only "
                  </span>
                </div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-4">
                    <span className="font-signature text-2xl text-plum">Dearest Avani,</span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setIsLetterOpen(false);
                      }}
                      className="text-xs text-white/40 hover:text-white/80 border border-white/15 rounded-full px-3 py-1 bg-white/5"
                    >
                      Close Letter
                    </button>
                  </div>

                  <div className="space-y-4 font-sans text-xs leading-relaxed text-white/70 sm:text-sm">
                    <p>
                      Avani, my love, my life, my absolute everything. Ever since that beautiful BEEE Lab class
                      on the 24th of August, my life has found its true North. You are the prettiest, kindest, and
                      most incredible soul I have ever known.
                    </p>
                    <p>
                      What started as a simple conversation about Harkirat&apos;s coding course has bloomed into the
                      most beautiful, unbreakable promise. Our midnight confession on Instagram and the magical afternoon
                      in the Tutorial Room where you finally said YES are memories I hold closer than breath itself.
                    </p>
                    <p>
                      Our first Valentine&apos;s on February 18th, with those gorgeous gifts and the perfect sweetness of our kiss,
                      was easily one of the best days of my entire life.
                    </p>
                    <p>
                      I promise to love you, respect you, stand by you, and walk hand-in-hand with you through every loop,
                      every lab, and every beautiful sunrise. I am yours, forever and always.
                    </p>
                  </div>

                  <div className="border-t border-white/10 mt-6 pt-4 text-right">
                    <p className="font-signature text-2xl text-saffron">Forever & always yours,</p>
                    <p className="text-[10px] text-white/30 mt-1">Your Love</p>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Hidden YouTube IFrame player - must be in DOM for the API to work */}
      <div
        id="yt-player-hidden"
        style={{
          position: "fixed",
          bottom: 0,
          right: 0,
          width: 1,
          height: 1,
          opacity: 0,
          pointerEvents: "none",
          zIndex: -1,
        }}
      />

      {/* """"""""""" AMBIENT GLASSMORPHIC MUSIC PLAYER WIDGET """"""""""" */}
      <div className="fixed bottom-4 left-1/2 z-50 w-[92%] max-w-md -translate-x-1/2 rounded-2xl border border-white/10 bg-[#07050d]/80 p-3.5 backdrop-blur-md shadow-2xl shadow-plum/5 sm:bottom-6">
        <div className="flex items-center gap-3">
          {/* Spinning Vinyl Record */}
          <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full border border-white/15 bg-black">
            <motion.div
              className="flex h-full w-full items-center justify-center text-plum"
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ duration: 3.5, repeat: Infinity, ease: "linear" }}
            >
              <Music className="h-5 w-5" />
            </motion.div>
            <div className="absolute inset-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#07050d] border border-white/10" />
          </div>

          {/* Track Details */}
          <div className="flex-1 min-w-0">
            <h4 className="truncate text-xs font-semibold text-white">
              {PLAYLIST[currentTrackIdx].title}
            </h4>
            <p className="truncate text-[10px] text-white/40">
              {PLAYLIST[currentTrackIdx].artist}
            </p>
            {/* Live Lyric scrolling */}
            <p className="truncate text-[10px] font-medium text-plum/90 mt-0.5 italic">
              {isPlaying ? PLAYLIST[currentTrackIdx].lyrics[lyricIdx] : (ytReady ? "Press play ▶️ to listen" : "Loading player...")}
            </p>
          </div>

          {/* Audio Visualizer Waves */}
          {isPlaying && (
            <div className="flex items-end gap-0.5 h-4 px-1.5">
              {[...Array(5)].map((_, i) => (
                <motion.span
                  key={i}
                  className="w-0.5 bg-plum rounded-full"
                  animate={{ height: [3, 14, 3] }}
                  transition={{
                    duration: 0.5 + i * 0.1,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                />
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={handlePrevTrack}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipBack className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setIsPlaying(!isPlaying)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-plum/30 to-tomato/20 text-plum hover:from-plum/40 hover:to-tomato/30 transition-all shadow-lg shadow-plum/10"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4 ml-0.5" />}
            </button>
            <button
              type="button"
              onClick={handleNextTrack}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-white/5 text-white/60 hover:text-white hover:bg-white/10 transition-colors"
            >
              <SkipForward className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="relative mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
          <motion.div
            className="h-full bg-gradient-to-r from-plum to-tomato"
            style={{ width: `${songProgress}%` }}
          />
        </div>
      </div>

      {/* """"""""""" FOOTER """"""""""" */}
      <footer className="relative border-t border-white/5 py-16 text-center">
        <Reveal variant="fadeUp">
          <motion.div
            className="mx-auto mb-6 flex items-center justify-center gap-3"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
          >
            {["💖", "🌹", "💍", "🌹", "💖"].map((e, i) => (
              <motion.span
                key={i}
                className="text-lg"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 2, delay: i * 0.2, repeat: Infinity }}
              >
                {e}
              </motion.span>
            ))}
          </motion.div>
          <p className="font-signature text-3xl text-plum/50 animate-text-glow">
            Made with <motion.span
              className="inline-block text-tomato/80"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ duration: 1.2, repeat: Infinity }}
            >
              ♥
            </motion.span> for Avani
          </p>
          <p className="mt-3 text-xs text-white/30">Your little corner of the internet, forever and always</p>
          <p className="mt-1 text-[10px] text-white/15">Since 24th August 2025  Built with every beat of my heart</p>
          <motion.div
            className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/5 bg-white/[0.02] px-4 py-1.5"
            whileInView={{ opacity: [0, 1] }}
            viewport={{ once: true }}
          >
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-[10px] text-white/25">This love is live and running forever</span>
          </motion.div>
        </Reveal>
      </footer>
    </main>
  );
}

