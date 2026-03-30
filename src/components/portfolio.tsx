"use client";

import React, { useState, useEffect } from "react";
import {
  Github,
  ExternalLink,
  Mail,
  Linkedin,
  Code,
  Database,
  Globe,
  ChevronRight,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Star,
  ArrowUp,
  Terminal,
  Cpu,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface Project {
  id: number;
  title: string;
  description: string;
  tech_stack?: string[];
  tech?: string[];
  features?: string[];
  github_url?: string;
  github?: string;
  demo_url?: string;
  demo?: string;
  image_emoji?: string;
  image?: string;
  category: string;
  year?: number;
  status?: string;
}

interface Skill {
  name: string;
  icon: React.ReactElement;
  techs: string[];
  proficiency: number;
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
  honeypot?: string;
}

interface ContactStatus {
  type: string;
  message: string;
}

// Background Blob Component - Static rendering to prevent scroll lag
const BackgroundBlobs = () => {
  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none z-[-1] bg-[#030305]">
      {/* Optimized static blobs to prevent GPU overhead during scroll */}
      <div
        className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/20 rounded-full blur-[80px]"
        style={{ willChange: "transform" }}
      />
      <div
        className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-pink-600/20 rounded-full blur-[100px]"
        style={{ willChange: "transform" }}
      />
    </div>
  );
};

// Falling Typewriter Component
const FallingTypewriterText = ({ text, delay = 0 }: { text: string, delay?: number }) => {
  const [typedCount, setTypedCount] = useState(0);
  const [fallingIndices, setFallingIndices] = useState<Set<number>>(new Set());
  const [phase, setPhase] = useState<'typing' | 'waiting' | 'falling' | 'resetting'>('typing');

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (phase === 'typing') {
      if (typedCount < text.length) {
        timeout = setTimeout(() => setTypedCount((prev) => prev + 1), 100);
      } else {
        timeout = setTimeout(() => setPhase('waiting'), 3000); // 3 seconds before fall
      }
    } else if (phase === 'waiting') {
      setPhase('falling');
    } else if (phase === 'falling') {
      const remainingIndices = Array.from({ length: text.length }, (_, i) => i).filter(
        (i) => !fallingIndices.has(i) && text[i] !== ' '
      );

      if (remainingIndices.length > 0) {
        // Drop a random character
        const randomIndex = remainingIndices[Math.floor(Math.random() * remainingIndices.length)];
        timeout = setTimeout(() => {
          setFallingIndices((prev) => new Set(prev).add(randomIndex));
        }, 100); // speed of drops
      } else {
        timeout = setTimeout(() => setPhase('resetting'), 1000);
      }
    } else if (phase === 'resetting') {
      setTypedCount(0);
      setFallingIndices((prev) => (prev.size > 0 ? new Set() : prev));
      timeout = setTimeout(() => setPhase('typing'), 500);
    }

    return () => clearTimeout(timeout);
  }, [phase, typedCount, fallingIndices, text]);

  return (
    <div className="relative inline-flex justify-center text-left">
      {/* Invisible placeholder for size */}
      <div className="opacity-0 pointer-events-none flex whitespace-pre">
        {text}
        <span className="w-[0.1em] ml-1"></span>
      </div>

      {/* Text layer with Gradient */}
      <div className="absolute top-0 left-0 flex whitespace-pre w-full h-full">
        {text.split('').map((char, index) => {
          const isTyped = index < typedCount;
          const isFalling = fallingIndices.has(index);
          
          return (
            <div key={`char-${index}`} className="relative inline-block">
              <motion.span
                initial={{ y: 0, opacity: 0, rotate: 0 }}
                animate={
                  isFalling
                    ? { y: 200, opacity: 0, rotate: index % 2 === 0 ? 45 : -45 }
                    : isTyped
                    ? { y: 0, opacity: 1, rotate: 0 }
                    : { y: 0, opacity: 0, rotate: 0 }
                }
                transition={isFalling ? { duration: 0.6, ease: "easeIn" } : { duration: 0.05 }}
                className="inline-block bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent"
              >
                {char}
              </motion.span>
            </div>
          );
        })}
      </div>

      {/* Cursor layer without Gradient clip */}
      <div className="absolute top-0 left-0 flex whitespace-pre pointer-events-none w-full h-full text-transparent">
        {text.split('').map((char, index) => {
          return (
            <div key={`cursor-${index}`} className="relative inline-block">
              <span className="inline-block">{char}</span>
              {phase === 'typing' && index === typedCount && (
                <motion.span
                  animate={{ opacity: [1, 0, 1] }}
                  transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
                  className="absolute left-0 top-0 h-[1em] w-[0.1em] bg-blue-400"
                />
              )}
            </div>
          );
        })}
        {phase !== 'resetting' && typedCount >= text.length && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
            className="inline-block h-[1em] w-[0.1em] bg-blue-400 ml-1 mt-auto mb-auto"
            style={{ display: phase === 'typing' || phase === 'waiting' ? 'inline-block' : 'none' }}
          />
        )}
      </div>
    </div>
  );
};

// Section Header Component
const SectionHeader = ({ title, subtitle }: { title: string; subtitle?: string }) => (
  <div className="mb-16 text-center">
    <motion.h2
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-blue-400 via-cyan-400 to-emerald-400 bg-clip-text text-transparent"
    >
      {title}
    </motion.h2>
    {subtitle && (
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.1 }}
        className="text-slate-400 text-lg"
      >
        {subtitle}
      </motion.p>
    )}
  </div>
);

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Static data
  const projects: Project[] = [
    {
      id: 1,
      title: "Market Days",
      description: "A location-based web application that helps users discover local markets and preview market days in their area. Built with modern web technologies and real-time data integration.",
      tech_stack: ["HTML", "CSS", "Vanilla JS"],
      features: ["Location-based search", "Market day previews", "Real-time data", "Mobile responsive"],
      github_url: "https://github.com/Afolstee/market-days",
      demo_url: "https://market-days.vercel.app/",
      image_emoji: "🏪",
      category: "Frontend"
    },
    {
      id: 2,
      title: "Trading Simulator",
      description: "A comprehensive paper trading platform with user authentication, real-time market data, and portfolio management. Enables risk-free trading education and strategy testing.",
      tech_stack: ["Next.js", "Python", "FastAPI", "WebSocket"],
      features: ["User authentication", "Portfolio tracking", "Performance analytics", "Risk management"],
      github_url: "https://github.com/Afolstee/trading-simulator",
      demo_url: "https://trading-sim-brown.vercel.app",
      image_emoji: "📈",
      category: "Full Stack"
    },
    {
      id: 3,
      title: "Crypto Dashboard",
      description: "A real-time cryptocurrency tracking dashboard featuring live price updates, market news, and portfolio management. Integrates with multiple APIs for comprehensive market data.",
      tech_stack: ["Next.js", "Python", "CoinGecko API", "CryptoCompare API", "WebSocket", "Chart.js", "Redis"],
      features: ["Live price tracking", "Market news", "Portfolio management", "Price alerts", "AI Technical analysis"],
      github_url: "https://github.com/Afolstee/analyse-crypto",
      demo_url: "https://analyse-crypto-nine.vercel.app/",
      image_emoji: "₿",
      category: "Full Stack"
    },
    {
      id: 4,
      title: "Book a Stay",
      description: "A modern hotel booking platform with elegant design, advanced search functionality, and seamless user experience. Features comprehensive property management and booking system.",
      tech_stack: ["HTML", "CSS", "JavaScript"],
      features: ["Advanced search", "Availability Filter", "Review system"],
      github_url: "https://github.com/Afolstee/book-stay",
      demo_url: "http://book-stay-99sx.vercel.app",
      image_emoji: "🏨",
      category: "Frontend"
    },
    {
      id: 5,
      title: "Dakuzon",
      description: "A modern e-commerce platform with elegant design, advanced search functionality, and seamless user experience. Features comprehensive property management and booking system.",
      tech_stack: ["HTML", "CSS", "JavaScript"],
      features: ["Advanced search", "Availability Filter", "Review system"],
      github_url: "https://github.com/Afolstee/dakuzon",
      demo_url: "https://dakuzon.vercel.app/",
      image_emoji: "🛒",
      category: "Frontend"
    },
    {
      id: 6,
      title: "Online-Shop",
      description: "A modern online shoe shopping platform with elegant design, advanced search functionality, and seamless user experience. Features comprehensive property management and booking system.",
      tech_stack: ["HTML", "CSS", "JavaScript"],
      features: ["Advanced search", "Availability Filter", "Review system"],
      github_url: "https://github.com/Afolstee/online-shop",
      demo_url: "https://online-shop-flame.vercel.app/",
      image_emoji: "👟",
      category: "Frontend"
    }
  ];

  const skills: Skill[] = [
    {
      name: "Frontend Development",
      icon: <Globe className="w-5 h-5" />,
      techs: ["React", "Next.js", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind CSS", "Bootstrap"],
      proficiency: 95
    },
    {
      name: "Backend Development",
      icon: <Terminal className="w-5 h-5" />,
      techs: ["Python", "FastAPI", "Node.js", "Express.js", "GraphQL", "WebSocket"],
      proficiency: 90
    },
    {
      name: "Database & Storage",
      icon: <Database className="w-5 h-5" />,
      techs: ["PostgreSQL", "MongoDB", "Redis", "SQLAlchemy", "Prisma", "Firebase"],
      proficiency: 88
    },
    {
      name: "DevOps & Tools",
      icon: <Cpu className="w-5 h-5" />,
      techs: ["Git", "Vercel", "Railway", "Render"],
      proficiency: 85
    }
  ];

  const [scrollTimeout, setScrollTimeout] = useState<NodeJS.Timeout | null>(null);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
    honeypot: "",
  });
  const [contactStatus, setContactStatus] = useState<ContactStatus>({
    type: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          const shouldShow = window.scrollY > 300;
          setShowScrollTop(shouldShow);

          if (scrollTimeout) {
            clearTimeout(scrollTimeout);
          }

          if (shouldShow) {
            const newTimeout = setTimeout(() => {
              setShowScrollTop(false);
            }, 2000);
            setScrollTimeout(newTimeout);
          }

          const sections = ["home", "about", "experience", "projects", "skills", "contact"];
          const currentSection = sections.find((section) => {
            const element = document.getElementById(section);
            if (element) {
              const rect = element.getBoundingClientRect();
              return rect.top <= 150 && rect.bottom >= 150;
            }
            return false;
          });

          if (currentSection) {
            setActiveSection(currentSection);
          }
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimeout) clearTimeout(scrollTimeout);
    };
  }, [scrollTimeout]);

  useEffect(() => {
    setTimeout(() => setIsLoading(false), 500); // Simulate brief load for smooth entry
  }, []);

  const handleContactSubmit = async () => {
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({ type: "error", message: "Please fill in all fields" });
      return;
    }
    setIsSubmitting(true);
    setContactStatus({ type: "", message: "" });
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(contactForm),
      });
      const result = await response.json();
      if (response.ok) {
        setContactStatus({ type: "success", message: result.message || "Message sent successfully!" });
        setContactForm({ name: "", email: "", message: "", honeypot: "" });
      } else {
        setContactStatus({ type: "error", message: result.error || "Failed to send message." });
      }
    } catch (error) {
      setContactStatus({ type: "error", message: "Failed to send message. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({ ...contactForm, [e.target.name]: e.target.value });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
    if (scrollTimeout) clearTimeout(scrollTimeout);
    setShowScrollTop(false);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(sectionId);
  };

  const downloadCV = () => {
    const link = document.createElement("a");
    link.href = "/media/TemiladeAfolabiAResume.pdf";
    link.download = "TemiladeAfolabi_CV.pdf";
    link.click();
  };

  const navItems = ["home", "about", "experience", "projects", "skills", "contact"];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#030305] flex items-center justify-center">
        <div className="relative w-20 h-20 flex items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 rounded-full border-t-2 border-b-2 border-blue-500 blur-[2px]"
          />
          <motion.div
            animate={{ rotate: -360 }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            className="absolute inset-2 rounded-full border-l-2 border-r-2 border-cyan-400 blur-[1px]"
          />
          <Code className="text-white relative z-10 w-8 h-8" />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-blue-500/30 font-sans">
      <BackgroundBlobs />

      {/* Floating Navigation Dock */}
      <motion.nav 
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4"
      >
        <div className="glass-card flex items-center px-6 py-3 rounded-full shadow-2xl shadow-blue-900/20">
          {/* Mobile Menu Toggle */}
          <button className="md:hidden text-slate-300" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => scrollToSection(item)}
                className={`relative px-4 py-2 text-sm font-medium capitalize transition-colors duration-300 ${
                  activeSection === item ? "text-white" : "text-slate-400 hover:text-slate-200"
                }`}
              >
                {activeSection === item && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item}</span>
              </button>
            ))}
          </div>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-24 left-4 right-4 z-40 md:hidden glass-card rounded-2xl p-4 flex flex-col space-y-2 shadow-2xl"
          >
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => {
                  scrollToSection(item);
                  setIsMenuOpen(false);
                }}
                className={`px-4 py-3 text-left rounded-xl capitalize font-medium ${
                  activeSection === item ? "bg-white/10 text-white" : "text-slate-400 hover:bg-white/5"
                }`}
              >
                {item}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Scroll to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            onClick={scrollToTop}
            className="fixed bottom-8 right-8 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 hover:scale-110 text-white p-3 rounded-full shadow-lg shadow-black/50 transition-all duration-300 z-50"
          >
            <ArrowUp className="w-5 h-5" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 relative pt-20">
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-5 pointer-events-none" />
        <div className="text-center max-w-5xl mx-auto z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
            className="inline-flex items-center space-x-2 bg-white/5 border border-white/10 rounded-full px-4 py-1.5 mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-sm font-medium text-slate-300">Available for new opportunities</span>
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-5xl md:text-7xl lg:text-8xl font-extrabold mb-6 tracking-tight leading-tight flex flex-col items-center"
          >
            <span className="block mb-2 text-white">Hi, I'm</span>
            <FallingTypewriterText text="Afolabi Temilade" delay={800} />
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-xl md:text-2xl text-slate-400 mb-10 max-w-2xl mx-auto leading-relaxed"
          >
            Crafting beautiful, high-performance web experiences with Python, Next.js, and cutting-edge technologies.
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row justify-center items-center gap-4"
          >
            <button
              onClick={() => scrollToSection("projects")}
              className="group relative px-8 py-4 bg-white text-black rounded-full font-semibold overflow-hidden w-full sm:w-auto hover:scale-105 transition-transform duration-300"
            >
              <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-blue-100 to-pink-100 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <span className="relative flex items-center justify-center gap-2">
                View My Work
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </span>
            </button>
            <button
              onClick={downloadCV}
              className="group glass-card px-8 py-4 rounded-full font-semibold hover:bg-white/10 w-full sm:w-auto flex items-center justify-center gap-2 transition-all duration-300"
            >
              <Download className="w-4 h-4 text-slate-400 group-hover:text-white transition-colors" />
              <span>Download CV</span>
            </button>
          </motion.div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-24 px-4 relative">
        <div className="max-w-5xl mx-auto">
          <SectionHeader title="About Me" subtitle="A brief introduction to who I am and what I do" />
          
          <div className="grid md:grid-cols-5 gap-8 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-2 relative group"
            >
              <div className="absolute inset-0 bg-gradient-to-tr from-blue-500 to-purple-500 rounded-3xl blur-2xl opacity-40 group-hover:opacity-60 transition-opacity duration-500" />
              <div className="relative glass-card rounded-3xl overflow-hidden aspect-square flex items-center justify-center border border-white/20">
                <div className="text-9xl transform group-hover:scale-110 transition-transform duration-500">
                  👨‍💻
                </div>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="md:col-span-3 space-y-6"
            >
              <div className="glass-card p-8 rounded-3xl">
                <p className="text-lg text-slate-300 leading-relaxed mb-6">
                  As a full-stack developer, I specialize in building comprehensive web solutions using React and NextJS for frontend development, along with Python and FastAPI for robust backend systems. 
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  My proven track record of collaborating with cross-functional teams and delivering high-quality applications makes me a valuable asset to any organization seeking to elevate their web development capabilities. When I am not coding, you can find me exploring new technologies or mentioning aspiring developers.
                </p>
                
                <div className="mt-8 pt-8 border-t border-white/10 grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {[
                    { label: "Experience", value: "3+ Years" },
                    { label: "Projects", value: "15+ Done" },
                    { label: "Focus", value: "Full Stack" }
                  ].map((stat, i) => (
                    <div key={i} className="text-center sm:text-left">
                      <div className="text-sm text-slate-400 mb-1">{stat.label}</div>
                      <div className="text-xl font-semibold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <SectionHeader title="Experience & Education" subtitle="My professional journey so far" />
          
          <div className="relative border-l border-white/10 ml-4 md:ml-0 md:pl-0 space-y-12">
            {[
              {
                role: "Frontend Engineer",
                company: "Capriquota • Remote",
                date: "Jan 2023 - Aug 2023",
                points: [
                  "Deployed server-side rendering (SSR) using Next.js to improve page load times by 10% and SEO performance.",
                  "Partnered with senior developers in reducing development time by 25%.",
                  "Achieved a 20% increase in user engagement through intuitive UI implementations."
                ]
              },
              {
                role: "Frontend Engineer Intern",
                company: "Dev Career • Ibadan",
                date: "Sep 2022 - Dec 2022",
                points: [
                  "Assisted in developing and maintaining front-end components using React.",
                  "Collaborated to develop responsive web applications optimized for multi-screen sizes."
                ]
              },
              {
                role: "Master Degree",
                company: "University of Ibadan, Nigeria",
                date: "2023 - 2025",
                points: ["Focusing on advanced computing concepts and modern software architecture."]
              },
              {
                role: "Bachelor Degree",
                company: "University of Ibadan, Nigeria",
                date: "2018 - 2022",
                points: ["Graduated with honors, establishing strong fundamentals in computer science."]
              }
            ].map((exp, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={idx}
                className="relative pl-8 md:pl-0"
              >
                {/* Timeline dot */}
                <div className="absolute left-[-5px] md:left-[-5px] top-1.5 w-3 h-3 bg-blue-500 rounded-full ring-4 ring-blue-500/20" />
                
                <div className="md:ml-12 glass-card p-6 md:p-8 rounded-2xl group hover:border-blue-500/30 transition-colors">
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-4 gap-2">
                    <div>
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {exp.role}
                      </h3>
                      <p className="text-blue-300 font-medium">{exp.company}</p>
                    </div>
                    <span className="text-sm font-mono text-slate-400 bg-white/5 px-3 py-1 rounded-full w-fit">
                      {exp.date}
                    </span>
                  </div>
                  <ul className="space-y-3 mt-4">
                    {exp.points.map((point, k) => (
                      <li key={k} className="text-slate-300 text-sm flex items-start gap-3">
                        <ChevronRight className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="py-24 px-4 relative z-10">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Featured Projects" subtitle="A selection of my recent work" />
          
          <div className="grid md:grid-cols-2 gap-6">
            {projects.map((project, idx) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                key={project.id || idx}
                className="group glass-card rounded-3xl p-6 md:p-8 hover:-translate-y-2 transition-transform duration-500 flex flex-col h-full overflow-hidden relative"
              >
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-b from-blue-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative z-10 flex flex-col h-full">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center text-3xl border border-white/10 group-hover:scale-110 group-hover:rotate-3 transition-all">
                        {project.image_emoji || project.image || "🚀"}
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors">
                          {project.title}
                        </h3>
                        <span className="text-xs font-medium text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded-full">
                          {project.category}
                        </span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all">
                          <Github className="w-5 h-5" />
                        </a>
                      )}
                      {project.demo_url && (
                        <a href={project.demo_url} target="_blank" rel="noreferrer" className="p-2 text-slate-400 hover:text-white hover:bg-white/10 rounded-full transition-all">
                          <ExternalLink className="w-5 h-5" />
                        </a>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-slate-300 text-sm leading-relaxed mb-6 flex-grow">
                    {project.description}
                  </p>
                  
                  <div className="space-y-4 mt-auto">
                    <div className="flex flex-wrap gap-2">
                      {(project.tech_stack || project.tech || []).map((tech, i) => (
                        <span key={i} className="text-xs font-medium text-slate-300 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <SectionHeader title="Technical Skills" subtitle="Technologies I frequently use" />
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                key={index}
                className="glass-card p-6 rounded-3xl group hover:border-blue-500/40 transition-colors"
              >
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                  {skill.icon}
                </div>
                <h3 className="text-lg font-bold text-white mb-4">{skill.name}</h3>
                <div className="flex flex-wrap gap-2">
                  {skill.techs.map((tech, idx) => (
                    <span
                      key={idx}
                      className="text-xs font-mono text-slate-400 bg-black/20 border border-white/5 px-2 py-1 rounded"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-24 px-4 relative">
        <div className="max-w-3xl mx-auto">
          <SectionHeader title="Let's Connect" subtitle="Ready to start your next project with me?" />
          
          <div className="glass-card p-8 md:p-12 rounded-3xl">
            {contactStatus.message && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`mb-8 p-4 rounded-xl flex items-center space-x-3 text-sm font-medium border ${
                  contactStatus.type === "success"
                    ? "bg-emerald-500/10 border-emerald-500/20 text-emerald-400"
                    : "bg-red-500/10 border-red-500/20 text-red-400"
                }`}
              >
                {contactStatus.type === "success" ? <CheckCircle className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                <span>{contactStatus.message}</span>
              </motion.div>
            )}

            <div className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Name</label>
                  <input
                    type="text"
                    name="name"
                    value={contactForm.name}
                    onChange={handleContactChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans"
                    placeholder="John Doe"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-400 ml-1">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans"
                    placeholder="john@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-400 ml-1">Message</label>
                <textarea
                  name="message"
                  rows={5}
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="w-full bg-black/40 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-all font-sans resize-none"
                  placeholder="Tell me about your project..."
                />
              </div>

               <input type="text" name="honeypot" value={contactForm.honeypot} onChange={handleContactChange} className="hidden" tabIndex={-1} autoComplete="off" />

               <button
                  onClick={handleContactSubmit}
                  disabled={isSubmitting}
                  className="w-full group relative overflow-hidden rounded-xl p-[1px] font-semibold"
                >
                  <span className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl opacity-70 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="relative bg-black/50 backdrop-blur-md px-6 py-4 rounded-xl flex items-center justify-center gap-2 border border-white/10 transition-colors group-hover:bg-black/20">
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin text-white" />
                        <span className="text-white">Sending...</span>
                      </>
                    ) : (
                      <>
                        <Mail className="w-5 h-5 text-white" />
                        <span className="text-white">Send Message</span>
                      </>
                    )}
                  </div>
                </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-20">
        <div className="max-w-6xl mx-auto px-4 py-12 flex flex-col md:flex-row items-center justify-between gap-6">
          <p className="text-slate-500 text-sm">
            © {new Date().getFullYear()} Afolabi Temilade. Designed & Built with Next.js & Framer Motion.
          </p>
          <div className="flex items-center gap-4">
            {[
              { icon: Github, href: "https://github.com/Afolstee" },
              { icon: Linkedin, href: "https://www.linkedin.com/in/temilade-afolabi-aa7b7430b/" },
              { icon: Mail, href: "mailto:teedaku@gmail.com" }
            ].map((social, i) => (
              <a
                key={i}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                className="w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 text-slate-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all hover:-translate-y-1"
              >
                <social.icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;
