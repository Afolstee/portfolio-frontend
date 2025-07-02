"use client";

import React, { useState } from 'react';
import { Github, ExternalLink, Mail, Linkedin, Code, Database, Globe, Smartphone, ChevronRight, Menu, X, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import { portfolioApi } from './lib/api';

const Portfolio = () => {
  const [activeSection, setActiveSection] = useState('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [contactForm, setContactForm] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [contactStatus, setContactStatus] = useState({ type: '', message: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Static data for the portfolio
  const projects = [
    {
      id: 1,
      title: "Market Days",
      description: "A location-based web application that helps users discover local markets and preview market days in their area.",
      tech_stack: ["Next.js", "React", "Node.js", "Express", "Tailwind CSS"],
      features: ["Location-based search", "Market day previews", "Real-time data", "Mobile responsive"],
      github_url: "https://github.com/yourusername/market-days",
      demo_url: "https://market-days.vercel.app/",
      image_emoji: "🏪",
      category: "Full Stack"
    },
    {
      id: 2,
      title: "Trading Simulator",
      description: "A comprehensive paper trading platform with user authentication, real-time market data, and portfolio management.",
      tech_stack: ["React", "Python", "FastAPI", "PostgreSQL", "JWT Auth"],
      features: ["User authentication", "Real-time trading", "Portfolio tracking", "Performance analytics"],
      github_url: "https://github.com/yourusername/trading-simulator",
      demo_url: "https://trading-sim-brown.vercel.app",
      image_emoji: "📈",
      category: "Full Stack"
    },
    {
      id: 3,
      title: "Task Management App",
      description: "A modern task management application with drag-and-drop functionality, team collaboration features, and real-time updates.",
      tech_stack: ["React", "TypeScript", "Node.js", "MongoDB", "Socket.io"],
      features: ["Drag & drop interface", "Team collaboration", "Real-time updates", "Task prioritization"],
      github_url: "https://github.com/yourusername/task-manager",
      demo_url: "https://task-manager-demo.vercel.app",
      image_emoji: "✅",
      category: "Full Stack"
    },
    {
      id: 4,
      title: "Weather Dashboard",
      description: "A responsive weather dashboard with location-based forecasts, interactive maps, and detailed weather analytics.",
      tech_stack: ["Vue.js", "Python", "Flask", "OpenWeather API", "Chart.js"],
      features: ["Location-based weather", "Interactive maps", "7-day forecasts", "Weather analytics"],
      github_url: "https://github.com/yourusername/weather-dashboard",
      demo_url: "https://weather-dashboard-demo.vercel.app",
      image_emoji: "🌤️",
      category: "Frontend"
    }
  ];

  const skills = [
    { 
      name: "Frontend", 
      icon: <Globe className="w-6 h-6" />, 
      techs: ["React", "Next.js", "TypeScript", "Tailwind CSS", "Vue.js", "JavaScript"] 
    },
    { 
      name: "Backend", 
      icon: <Database className="w-6 h-6" />, 
      techs: ["Python", "FastAPI", "Node.js", "PostgreSQL", "MongoDB", "Redis"] 
    },
    { 
      name: "Mobile", 
      icon: <Smartphone className="w-6 h-6" />, 
      techs: ["React Native", "Flutter", "Expo", "iOS", "Android"] 
    },
    { 
      name: "Tools", 
      icon: <Code className="w-6 h-6" />, 
      techs: ["Git", "Docker", "AWS", "Vercel", "GitHub Actions", "Jest"] 
    }
  ];

  const analytics = {
    total_views: 1247,
    monthly_views: 89,
    projects_count: projects.length
  };

  // Handle contact form submission (simulated)
  const handleContactSubmit = async () => {
    // Basic validation
    if (!contactForm.name || !contactForm.email || !contactForm.message) {
      setContactStatus({
        type: 'error',
        message: 'Please fill in all fields'
      });
      return;
    }

    setIsSubmitting(true);
    setContactStatus({ type: '', message: '' });

    // Simulate API call
    setTimeout(() => {
      setContactStatus({
        type: 'success',
        message: 'Message sent successfully! I\'ll get back to you soon.'
      });
      setContactForm({ name: '', email: '', message: '' });
      setIsSubmitting(false);
    }, 2000);
  };

  // Handle contact form input changes
  const handleContactChange = (e) => {
    setContactForm({
      ...contactForm,
      [e.target.name]: e.target.value
    });
  };

  const navItems = ['home', 'about', 'projects', 'skills', 'contact'];

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
                  onClick={() => setActiveSection(item)}
                  className={`capitalize hover:text-purple-300 transition-colors ${
                    activeSection === item ? 'text-purple-300' : 'text-white'
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
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
                    setActiveSection(item);
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

      {/* Hero Section */}
      {activeSection === 'home' && (
        <section className="min-h-screen flex items-center justify-center px-4 pt-16">
          <div className="text-center max-w-4xl mx-auto">
            <div className="mb-8">
              <h1 className="text-5xl md:text-7xl font-bold mb-4 bg-gradient-to-r from-purple-400 via-pink-400 to-blue-400 bg-clip-text text-transparent animate-pulse">
                Full Stack Developer
              </h1>
              <p className="text-xl md:text-2xl text-slate-300 mb-8">
                Building modern web applications with Python, Next.js, and cutting-edge technologies
              </p>
              <div className="flex justify-center space-x-6 mb-12">
                <button 
                  onClick={() => setActiveSection('projects')}
                  className="bg-purple-600 hover:bg-purple-700 px-8 py-3 rounded-lg font-semibold transition-colors flex items-center space-x-2"
                >
                  <span>View Projects</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button 
                  onClick={() => setActiveSection('contact')}
                  className="border border-purple-400 hover:bg-purple-400/10 px-8 py-3 rounded-lg font-semibold transition-colors"
                >
                  Contact Me
                </button>
              </div>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-purple-300">{projects.length}+</div>
                <div className="text-sm text-slate-400">Projects</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-purple-300">{skills.length * 5}+</div>
                <div className="text-sm text-slate-400">Technologies</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-purple-300">
                  {analytics.total_views}
                </div>
                <div className="text-sm text-slate-400">Project Views</div>
              </div>
              <div className="bg-white/5 backdrop-blur-sm rounded-lg p-4 border border-white/10">
                <div className="text-2xl font-bold text-purple-300">100%</div>
                <div className="text-sm text-slate-400">Commitment</div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* About Section */}
      {activeSection === 'about' && (
        <section className="min-h-screen flex items-center justify-center px-4 pt-16">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-4xl font-bold mb-8 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              About Me
            </h2>
            <div className="grid md:grid-cols-2 gap-12 items-center">
              <div>
                <div className="bg-gradient-to-br from-purple-600 to-pink-600 w-64 h-64 rounded-full mx-auto mb-8 flex items-center justify-center text-6xl">
                  👨‍💻
                </div>
              </div>
              <div className="space-y-6">
                <p className="text-lg text-slate-300 leading-relaxed">
                  I'm a passionate full-stack developer with expertise in modern web technologies. 
                  I love creating efficient, scalable applications that solve real-world problems.
                </p>
                <p className="text-lg text-slate-300 leading-relaxed">
                  My journey in tech started with curiosity about how things work, and has evolved 
                  into a deep understanding of both frontend and backend development. I'm particularly 
                  interested in fintech, market analysis, and creating user-friendly interfaces.
                </p>
                <div className="flex flex-wrap gap-4">
                  <span className="bg-purple-600/20 text-purple-300 px-4 py-2 rounded-full text-sm">
                    Problem Solver
                  </span>
                  <span className="bg-pink-600/20 text-pink-300 px-4 py-2 rounded-full text-sm">
                    Team Player
                  </span>
                  <span className="bg-blue-600/20 text-blue-300 px-4 py-2 rounded-full text-sm">
                    Continuous Learner
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Projects Section */}
      {activeSection === 'projects' && (
        <section className="min-h-screen py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 gap-8">
              {projects.map((project, index) => (
                <div key={project.id || index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="text-4xl mr-4">{project.image_emoji}</div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{project.title}</h3>
                      <span className="text-sm text-purple-300 bg-purple-600/20 px-2 py-1 rounded-full">
                        {project.category}
                      </span>
                    </div>
                  </div>
                  <p className="text-slate-300 mb-4 text-sm leading-relaxed">
                    {project.description}
                  </p>
                  <div className="mb-4">
                    <h4 className="text-sm font-semibold text-purple-300 mb-2">Key Features:</h4>
                    <ul className="text-xs text-slate-400 space-y-1">
                      {project.features.map((feature, idx) => (
                        <li key={idx} className="flex items-center">
                          <ChevronRight className="w-3 h-3 mr-1 text-purple-400" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {project.tech_stack.map((tech, idx) => (
                      <span key={idx} className="text-xs bg-slate-700/50 text-slate-300 px-2 py-1 rounded">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="flex space-x-4">
                    <a 
                      href={project.github_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-purple-300 hover:text-purple-200 transition-colors"
                    >
                      <Github className="w-4 h-4 mr-1" />
                      Code
                    </a>
                    <a 
                      href={project.demo_url} 
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-sm text-purple-300 hover:text-purple-200 transition-colors"
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
      )}

      {/* Skills Section */}
      {activeSection === 'skills' && (
        <section className="min-h-screen flex items-center justify-center px-4 pt-16">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Technical Skills
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {skills.map((skill, index) => (
                <div key={index} className="bg-white/5 backdrop-blur-sm rounded-xl p-6 border border-white/10 hover:border-purple-400/50 transition-all duration-300 hover:scale-105">
                  <div className="flex items-center mb-4">
                    <div className="text-purple-400 mr-3">
                      {skill.icon}
                    </div>
                    <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                  </div>
                  <div className="space-y-2">
                    {skill.techs.map((tech, idx) => (
                      <div key={idx} className="text-sm text-slate-300 bg-slate-700/30 px-3 py-1 rounded">
                        {tech}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Contact Section */}
      {activeSection === 'contact' && (
        <section className="min-h-screen flex items-center justify-center px-4 pt-16">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-4xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Let's Connect
            </h2>
            <p className="text-xl text-slate-300 mb-12">
              I'm always open to discussing new opportunities and interesting projects
            </p>
            <div className="flex justify-center space-x-8 mb-12">
              <a href="mailto:teedaku@gmail.com" className="flex items-center space-x-2 bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg transition-colors">
                <Mail className="w-5 h-5" />
                <span>Email Me</span>
              </a>
              <a href="https://www.linkedin.com/in/temilade-afolabi-aa7b7430b/" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 px-6 py-3 rounded-lg transition-colors">
                <Linkedin className="w-5 h-5" />
                <span>LinkedIn</span>
              </a>
              <a href="https://github.com/Afolstee" target="_blank" rel="noopener noreferrer" className="flex items-center space-x-2 bg-gray-700 hover:bg-gray-600 px-6 py-3 rounded-lg transition-colors">
                <Github className="w-5 h-5" />
                <span>GitHub</span>
              </a>
            </div>
            <div className="bg-white/5 backdrop-blur-sm rounded-xl p-8 border border-white/10">
              <h3 className="text-2xl font-semibold mb-6 text-white">Get in Touch</h3>
              
              {/* Contact Status Messages */}
              {contactStatus.message && (
                <div className={`mb-6 p-4 rounded-lg flex items-center space-x-2 ${
                  contactStatus.type === 'success' 
                    ? 'bg-green-600/20 border border-green-500/50 text-green-300' 
                    : 'bg-red-600/20 border border-red-500/50 text-red-300'
                }`}>
                  {contactStatus.type === 'success' ? (
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
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                  />
                  <input
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={contactForm.email}
                    onChange={handleContactChange}
                    className="bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                  />
                </div>
                <textarea
                  name="message"
                  placeholder="Your Message"
                  rows={4}
                  value={contactForm.message}
                  onChange={handleContactChange}
                  className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-slate-400 focus:outline-none focus:border-purple-400"
                ></textarea>
                <button
                  onClick={handleContactSubmit}
                  disabled={isSubmitting}
                  className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 px-8 py-3 rounded-lg font-semibold transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>Sending...</span>
                    </>
                  ) : (
                    <span>Send Message</span>
                  )}
                </button>
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Portfolio;