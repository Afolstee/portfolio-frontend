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
  Smartphone,
  ChevronRight,
  Menu,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
  Download,
  Calendar,
  Star,
  ArrowUp,
} from "lucide-react";
import { portfolioApi } from "../lib/api";

// Type definitions
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

interface Analytics {
  total_views: number;
  monthly_views: number;
  projects_count: number;
  years_experience: number;
}

interface ContactForm {
  name: string;
  email: string;
  message: string;
}

interface ContactStatus {
  type: string;
  message: string;
}

interface ApiSkill {
  name: string;
  technologies: string[];
  proficiency?: number;
}

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState("home");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<Project[]>([]);
  const [skills, setSkills] = useState<Skill[]>([]);
  const [analytics, setAnalytics] = useState<Analytics | null>(null);
  const [contactForm, setContactForm] = useState<ContactForm>({
    name: "",
    email: "",
    message: "",
  });
  const [contactStatus, setContactStatus] = useState<ContactStatus>({ type: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

  // Handle scroll to show/hide scroll to top button and update active section
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 300);

      // Update active section based on scroll position
      const sections = [
        "home",
        "about",
        "experience",
        "projects",
        "skills",
        "contact",
      ];
      const currentSection = sections.find((section) => {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          return rect.top <= 100 && rect.bottom >= 100;
        }
        return false;
      });

      if (currentSection) {
        setActiveSection(currentSection);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Helper function to get skill icons
  const getSkillIcon = (skillName: string): React.ReactElement => {
    const iconMap: { [key: string]: React.ReactElement } = {
      "Frontend Development": <Globe className="w-6 h-6" />,
      "Backend Development": <Database className="w-6 h-6" />,
      "Database & Storage": <Database className="w-6 h-6" />,
      "DevOps & Tools": <Code className="w-6 h-6" />,
      Mobile: <Smartphone className="w-6 h-6" />,
      Frontend: <Globe className="w-6 h-6" />,
      Backend: <Database className="w-6 h-6" />,
      Tools: <Code className="w-6 h-6" />,
    };
    return iconMap[skillName] || <Code className="w-6 h-6" />;
  };

  // Fallback data in case API fails
  const getDefaultProjects = (): Project[] => [
    {
      id: 1,
      title: "Market Days",
      description:
        "A location-based web application that helps users discover local markets and preview market days in their area.",
      tech_stack: ["Next.js", "React", "Node.js", "Express", "Tailwind CSS"],
      features: [
        "Location-based search",
        "Market day previews",
        "Real-time data",
        "Mobile responsive",
      ],
      github_url: "#",
      demo_url: "https://market-days.vercel.app/",
      image_emoji: "🏪",
      category: "Full Stack",
    },
    {
      id: 2,
      title: "Trading Simulator",
      description:
        "A comprehensive paper trading platform with user authentication, real-time market data, and portfolio management.",
      tech_stack: ["React", "Python", "FastAPI", "PostgreSQL", "JWT Auth"],
      features: [
        "User authentication",
        "Real-time trading",
        "Portfolio tracking",
        "Performance analytics",
      ],
      github_url: "#",
      demo_url: "https://trading-sim-brown.vercel.app",
      image_emoji: "📈",
      category: "Full Stack",
    },
  ];

  const getDefaultSkills = (): Skill[] => [
    {
      name: "Frontend",
      icon: <Globe className="w-6 h-6" />,
      techs: ["React", "Next.js", "TypeScript", "Tailwind CSS"],
      proficiency: 95,
    },
    {
      name: "Backend",
      icon: <Database className="w-6 h-6" />,
      techs: ["Python", "FastAPI", "Node.js", "PostgreSQL"],
      proficiency: 90,
    },
    {
      name: "Tools",
      icon: <Code className="w-6 h-6" />,
      techs: ["Git", "Docker", "AWS", "Vercel"],
      proficiency: 88,
    },
  ];

  // Fetch data from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch projects
        const projectsData = await portfolioApi.getProjects();
        setProjects(projectsData);

        // Fetch skills
        const skillsData: ApiSkill[] = await portfolioApi.getSkills();
        setSkills(
          skillsData.map((skill: ApiSkill): Skill => ({
            name: skill.name,
            icon: getSkillIcon(skill.name),
            techs: skill.technologies,
            proficiency: skill.proficiency || 85, // Default proficiency if not provided
          }))
        );

        // Fetch analytics
        const analyticsData = await portfolioApi.getAnalytics();
        setAnalytics(analyticsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        // Fallback to default data if API fails
        setProjects(getDefaultProjects());
        setSkills(getDefaultSkills());
        setAnalytics({
          total_views: 0,
          monthly_views: 0,
          projects_count: 2,
          years_experience: 3,
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Track project views
  const trackProjectView = async (projectId: number, projectTitle: string) => {
    try {
      await portfolioApi.trackView(projectId, {
        project_name: projectTitle,
        user_ip: null,
      });
    } catch (error) {
      console.error("Error tracking project view:", error);
    }
  };

  // Handle contact form submission
  const handleContactSubmit = async () => {
    // Basic validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({
        type: "error",
        message: "Please fill in all fields",
      });
      return;
    }

    setIsSubmitting(true);
    setContactStatus({ type: "", message: "" });

    try {
      const result = await portfolioApi.submitContact(contactForm);

      setContactStatus({
        type: "success",
        message: "Message sent successfully! I'll get back to you soon.",
      });
      setContactForm({ name: "", email: "", message: "" });
    } catch (error) {
      console.error("Contact submission error:", error);
      setContactStatus({
        type: "error",
        message: "Failed to send message. Please try again.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  // Handle contact form input changes
  const handleContactChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value,
    });
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setActiveSection(sectionId);
  };

  const downloadCV = () => {
    // Simulated CV download - replace with actual CV file
    const link = document.createElement("a");
    link.href = "/path-to-your-cv.pdf"; // Replace with actual CV path
    link.download = "Portfolio_CV.pdf";
    link.click();
  };

  const navItems = [
    "home",
    "about",
    "experience",
    "projects",
    "skills",
    "contact",
  ];

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading Portfolio...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-black/20 backdrop-blur-lg z-50 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="font-bold text-xl bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Portfolio
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex space-x-8">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => scrollToSection(item)}
                  className={`capitalize hover:text-purple-300 transition-colors ${
                    activeSection === item ? "text-purple-300" : "text-white"
                  }`}
                >
                  {item}
                </button>
              ))}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden bg-black/90 backdrop-blur-lg">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navItems.map((item) => (
                <button
                  key={item}
                  onClick={() => {
                    scrollToSection(item);
                    setIsMenuOpen(false);
                  }}
                  className="block px-3 py-2 text-base font-medium hover:text-purple-300 capitalize"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}
      </nav>

      {/* Scroll to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-full shadow-lg transition-all duration-300 z-50"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}

      {/* Hero Section */}
      <section
        id="home"
        className="min-h-screen flex items-center justify-center px-4 pt-16"
      >
        <div className="text-center max-w-4xl mx-auto">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
              Full Stack Developer
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-8">
              Building modern web applications with Python, Next.js, and
              cutting-edge technologies
            </p>
            <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6 mb-12">
              <button
                onClick={() => scrollToSection("projects")}
                className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <span>View Projects</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              <button
                onClick={() => scrollToSection("contact")}
                className="border border-purple-400 hover:bg-purple-400/10 px-8 py-3 rounded-lg font-semibold transition-colors"
              >
                Contact Me
              </button>
              <button
                onClick={downloadCV}
                className="bg-gradient-to-r from-pink-600 to-purple-600 hover:from-pink-700 hover:to-purple-700 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center justify-center space-x-2"
              >
                <Download className="w-4 h-4" />
                <span>Download CV</span>
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
              <div className="text-2xl font-bold text-purple-300">
                {projects.length}+
              </div>
              <div className="text-sm text-slate-400">Projects</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
              <div className="text-2xl font-bold text-purple-300">
                {analytics?.years_experience || "3"}+
              </div>
              <div className="text-sm text-slate-400">Years Experience</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
              <div className="text-2xl font-bold text-purple-300">
                {analytics?.total_views || "0"}
              </div>
              <div className="text-sm text-slate-400">Profile Views</div>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10 hover:border-purple-400/50 transition-all duration-300">
              <div className="text-2xl font-bold text-purple-300">
                {analytics?.monthly_views || "0"}
              </div>
              <div className="text-sm text-slate-400">Monthly Views</div>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section
        id="about"
        className="min-h-screen flex items-center justify-center px-4 pt-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            About Me
          </h2>
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-64 h-64 rounded-full mx-auto mb-8 flex items-center justify-center text-6xl shadow-2xl">
                👨‍💻
              </div>
              <div className="text-center space-y-4">
                <div className="flex justify-center space-x-4">
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <Star className="w-6 h-6 text-yellow-400" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <Code className="w-6 h-6 text-green-400" />
                  </div>
                  <div className="bg-white/10 backdrop-blur-sm rounded-lg p-3 border border-white/10">
                    <Database className="w-6 h-6 text-blue-400" />
                  </div>
                </div>
              </div>
            </div>
            <div className="space-y-6">
              <p className="text-lg text-slate-300 leading-relaxed">
                I'm a passionate full-stack developer with expertise in modern
                web technologies. I love creating efficient, scalable
                applications that solve real-world problems and deliver
                exceptional user experiences.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                My journey in tech started with curiosity about how things work,
                and has evolved into a deep understanding of both frontend and
                backend development. I'm particularly interested in fintech,
                market analysis, and creating user-friendly interfaces that make
                complex data accessible.
              </p>
              <p className="text-lg text-slate-300 leading-relaxed">
                When I'm not coding, you can find me exploring new technologies,
                contributing to open-source projects, or mentoring aspiring
                developers in my community.
              </p>
              <div className="flex flex-wrap gap-4">
                <span className="bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full text-sm border border-purple-600/30">
                  🧩 Problem Solver
                </span>
                <span className="bg-pink-600/20 text-pink-300 px-4 py-2 rounded-full text-sm border border-pink-600/30">
                  🤝 Team Player
                </span>
                <span className="bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-sm border border-blue-600/30">
                  📚 Continuous Learner
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section
        id="experience"
        className="min-h-screen flex items-center justify-center px-4 pt-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Experience
          </h2>
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-12 border border-white/10 text-center">
              <div className="text-6xl mb-6">🚀</div>
              <h3 className="text-2xl font-semibold text-white mb-4">
                Coming Soon
              </h3>
              <p className="text-lg text-slate-300 mb-6">
                I'm currently working on showcasing my professional experience
                in an interactive and engaging way.
              </p>
              <div className="flex items-center justify-center space-x-2 text-purple-300">
                <Calendar className="w-5 h-5" />
                <span>Stay tuned for updates!</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Projects Section */}
      <section id="projects" className="min-h-screen py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Featured Projects
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((project, index) => (
              <div
                key={project.id || index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-4xl mr-4">
                      {project.image_emoji || project.image || "🚀"}
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">
                        {project.title}
                      </h3>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-purple-300 bg-purple-600/20 px-2 py-1 rounded-full">
                          {project.category}
                        </span>
                        {project.year && (
                          <span className="text-xs text-slate-400">
                            {project.year}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center text-green-400 text-sm">
                    <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                    {project.status || "Live"}
                  </div>
                </div>
                <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>
                <div className="mb-4">
                  <h4 className="text-sm font-semibold text-purple-300 mb-2">
                    Key Features:
                  </h4>
                  <ul className="text-xs text-slate-400 space-y-1">
                    {(project.features || []).map((feature: string, idx: number) => (
                      <li key={idx} className="flex items-center">
                        <ChevronRight className="w-3 h-3 mr-1 text-purple-400" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {(project.tech_stack || project.tech || []).map(
                    (tech: string, idx: number) => (
                      <span
                        key={idx}
                        className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded border border-slate-600/30"
                      >
                        {tech}
                      </span>
                    )
                  )}
                </div>
                <div className="flex space-x-4">
                  <a
                    href={project.github_url || project.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-purple-300 hover:text-purple-200 transition-colors"
                    onClick={() =>
                      trackProjectView(project.id, project.title)
                    }
                  >
                    <Github className="w-4 h-4 mr-1" />
                    Code
                  </a>
                  <a
                    href={project.demo_url || project.demo}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center text-sm text-purple-300 hover:text-purple-200 transition-colors"
                    onClick={() =>
                      trackProjectView(project.id, project.title)
                    }
                  >
                    <ExternalLink className="w-4 h-4 mr-1" />
                    Live Demo
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section
        id="skills"
        className="min-h-screen flex items-center justify-center px-4 pt-16"
      >
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Technical Skills
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {skills.map((skill, index) => (
              <div
                key={index}
                className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center">
                    <div className="text-purple-400 mr-3">{skill.icon}</div>
                    <h3 className="text-xl font-semibold text-white">
                      {skill.name}
                    </h3>
                  </div>
                  <div className="text-sm text-purple-300 font-semibold">
                    {skill.proficiency || 85}%
                  </div>
                </div>
                <div className="w-full bg-slate-700/50 rounded-full h-2 mb-4">
                  <div
                    className="bg-gradient-to-r from-purple-500 to-pink-500 h-2 rounded-full transition-all duration-1000"
                    style={{ width: `${skill.proficiency || 85}%` }}
                  ></div>
                </div>
                <div className="space-y-2">
                  {skill.techs.map((tech: string, idx: number) => (
                    <div
                      key={idx}
                      className="text-sm text-slate-300 bg-slate-700/30 px-3 py-1 rounded border border-slate-600/20"
                    >
                      {tech}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* Contact Section */}
      <section
        id="contact"
        className="min-h-screen flex items-center justify-center px-4 pt-16"
      >
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            Let's Connect
          </h2>
          <p className="text-xl text-slate-300 mb-12">
            I'm always open to discussing new opportunities, interesting
            projects, and innovative ideas
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-8 mb-12">
            <a
              href="mailto:teedaku@gmail.com"
              className="flex items-center justify-center space-x-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors"
            >
              <Mail className="w-5 h-5" />
              <span>Email Me</span>
            </a>
            <a
              href="https://www.linkedin.com/in/temilade-afolabi-aa7b7430b/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors"
            >
              <Linkedin className="w-5 h-5" />
              <span>LinkedIn</span>
            </a>
            <a
              href="https://github.com/Afolstee"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center space-x-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors"
            >
              <Github className="w-5 h-5" />
              <span>GitHub</span>
            </a>
          </div>
          <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
            <h3 className="text-2xl font-semibold mb-6 text-white">
              Send me a message
            </h3>

            {/* Contact Status Messages */}
            {contactStatus.message && (
              <div
                className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                  contactStatus.type === "success"
                    ? "bg-green-600/20 border border-green-500/50 text-green-300"
                    : "bg-red-600/20 border border-red-500/50 text-red-300"
                }`}
              >
                {contactStatus.type === "success" ? (
                  <CheckCircle className="w-5 h-5" />
                ) : (
                  <AlertCircle className="w-5 h-5" />
                )}
                <span>{contactStatus.message}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <input
                  type="text"
                  name="name"
                  placeholder="Your Name"
                  value={contactForm.name}
                  onChange={handleContactChange}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 transition-colors"
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Your Email"
                  value={contactForm.email}
                  onChange={handleContactChange}
                  className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 transition-colors"
                />
              </div>
              <textarea
                name="message"
                placeholder="Your Message"
                rows={5}
                value={contactForm.message}
                onChange={handleContactChange}
                className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400 transition-colors"
              />
              <button
                onClick={handleContactSubmit}
                disabled={isSubmitting}
                className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 disabled:opacity-50 disabled:cursor-not-allowed px-6 py-3 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center space-x-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    <span>Send Message</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black/20 backdrop-blur-sm border-t border-white/10 py-12">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-slate-400">
              © 2024 Portfolio. Built with React & Tailwind CSS
            </div>
            <div className="flex space-x-6">
              <a
                href="https://github.com/Afolstee"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-purple-300 transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://www.linkedin.com/in/temilade-afolabi-aa7b7430b/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-slate-400 hover:text-purple-300 transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="mailto:teedaku@gmail.com"
                className="text-slate-400 hover:text-purple-300 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>
          <div className="mt-8 text-sm text-slate-500">
            <p>Crafted with ❤️ using modern web technologies</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Portfolio;