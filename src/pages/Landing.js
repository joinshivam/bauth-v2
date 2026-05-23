import { Link, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";
import Slider from "react-slick";

import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Avatar from "../components/elements/avtar";
import {
    FiCheckCircle,
    FiUsers,
    FiZap,
    FiShield,
    FiLayers,
    FiMonitor
} from "react-icons/fi";
import {
    FaBell,
    FaCog,
    FaUserCircle,
    FaSignOutAlt,
    FaUser
} from "react-icons/fa";
import { Github, Linkedin, Mail, ExternalLink } from "lucide-react";
import { CgDetailsMore } from "react-icons/cg";
import { useAuth } from "../context/auth.context";
import { Helmet } from "react-helmet-async";

const apps = [
    { name: "Account", icon: <FaUserCircle /> },
    { name: "Drive", icon: "📁" },
    { name: "Gmail", icon: "✉️" },
    { name: "YouTube", icon: "▶️" },
    { name: "Maps", icon: "📍" },
    { name: "Calendar", icon: "📅" },
    { name: "Photos", icon: "🖼️" },
    { name: "Meet", icon: "📹" },
    { name: "Docs", icon: "📄" }
];

export default function LandingPage() {
    const { logout, user, USERNAME } = useAuth();
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const ref = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const close = e => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
            if (dropdownRef.current && !dropdownRef.current.contains(e.target))
                setOpenDropdown(false);
        };
        document.addEventListener("mousedown", close);
        return () => document.removeEventListener("mousedown", close);
    }, []);

    const carouselSettings = {
        dots: true,
        infinite: true,
        autoplay: true,
        speed: 1000,
        slidesToShow: 1,
        slidesToScroll: 1
    };

    return (
        <div className="w-full min-h-screen text-[var(--text-primary)] bg-[var(--surface)]">
            <Helmet>
                <title>Info - bauth</title>
                <link rel="canonical" href="https://joinshivam-bauth.vercel.app" />
            </Helmet>
            <header className="sticky top-0 z-50 bg-[var(--surface)] backdrop-blur-xl border-b border-white/20 dark:border-white/10 shadow-[0_8px_30px_rgba(0,0,0,0.08)]">
                <div className="max-w-7xl mx-auto flex items-center justify-between px-6 py-4">
                    <div className="flex items-baseline gap-1 cursor-pointer">
                        <img
                            src="../favicon.png"
                            alt="logo"
                            className="w-8 h-8 object-contain"
                        />
                        <h1 className="text-4xl font-extrabold bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-cyan-400 bg-clip-text text-transparent">
                            Auth
                        </h1>
                    </div>

                    <nav className="hidden md:flex gap-8 text-[var(--text-secondary)] font-medium">
                        <Link to="/about" className="hover:text-[var(--accent)]">
                            About
                        </Link>
                        <Link to="#projects" className="hover:text-[var(--accent)]">
                            Contribution
                        </Link>
                        <Link to="/contact" className="hover:text-[var(--accent)]">
                            Contact
                        </Link>
                        <Link to="#subscribe" className="hover:text-[var(--accent)]">
                            Subscribe
                        </Link>
                    </nav>

                    {user ? (
                        <div className="flex items-center gap-4" ref={ref}>
                            <Link
                                className="p-2 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur hover:bg-white dark:hover:bg-white/10 transition"
                                to={`/${USERNAME}/notifications`}
                            >
                                <FaBell />
                            </Link>

                            <button
                                className="p-2 rounded-xl bg-white/70 dark:bg-white/5 backdrop-blur hover:bg-white dark:hover:bg-white/10 transition"
                                onClick={() => setOpen(o => !o)}
                            >
                                <CgDetailsMore />
                                <div
                                    className={`absolute right-0 mt-3 w-72 rounded-2xl bg-white/80 dark:bg-[rgba(2,6,23,0.85)] backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] transition-all origin-top-right ${open
                                        ? "scale-100 opacity-100"
                                        : "scale-95 opacity-0 pointer-events-none"
                                        }`}
                                >
                                    <div className="grid grid-cols-3 gap-4 p-4">
                                        {apps.map(app => (
                                            <div
                                                key={app.name}
                                                className="flex flex-col items-center gap-1 p-3 rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition cursor-pointer"
                                            >
                                                <div className="text-3xl">{app.icon}</div>
                                                <span className="text-xs text-[var(--text-secondary)]">
                                                    {app.name}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </button>

                            <div className="relative" ref={dropdownRef}>
                                <button
                                    onClick={() => setOpenDropdown(o => !o)}
                                    className="flex flex-col items-center rounded-xl hover:bg-white/60 dark:hover:bg-white/10 transition"
                                >
                                    <Avatar disabled={true} />
                                </button>

                                {openDropdown && (
                                    <div className="absolute right-0 mt-2 w-48 bg-[var(--theme-dark)] backdrop-blur-xl rounded-xl border border-white/20 shadow-lg">
                                        <ul className="py-2">
                                            <li>
                                                <button
                                                    className="w-full flex gap-2 px-4 py-2 hover:bg-white/60 dark:hover:bg-white/10"
                                                    onClick={() => navigate(`/${USERNAME}`)}
                                                >
                                                    <FaUser /> Profile
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    className="w-full flex gap-2 px-4 py-2 hover:bg-white/60 dark:hover:bg-white/10"
                                                    onClick={() => navigate(`/${USERNAME}/settings`)}
                                                >
                                                    <FaCog /> Settings
                                                </button>
                                            </li>
                                            <li>
                                                <button
                                                    onClick={logout}
                                                    className="w-full flex gap-2 px-4 py-2 text-[var(--brand)] hover:text-[var(--accent-strong)]"
                                                >
                                                    <FaSignOutAlt /> Logout
                                                </button>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>
                    ) : (
                        <Link
                            to="/login"
                            className="px-6 py-2 rounded-xl bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] text-white font-semibold shadow-lg hover:scale-105 transition"
                        >
                            Login
                        </Link>
                    )}
                </div>
            </header>

            <section className="relative pt-32 pb-28 overflow-hidden">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.25),transparent_70%)]"></div>
                <div className="relative max-w-7xl mx-auto text-center px-6">
                    <h1 className="text-5xl md:text-6xl font-extrabold tracking-tight mb-6">
                        BAuth <span className="text-[var(--accent)]">–</span> Single Source of
                        Account Management
                    </h1>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto mb-12">
                        One auth system for all BAuth services. One account. One identity.
                    </p>

                    <div className="max-w-3xl mx-auto">
                        <Slider {...carouselSettings}>
                            {["BMailer", "Vichar", "Bypar"].map(title => (
                                <div key={title} className="p-6">
                                    <div className="p-12 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)]">
                                        <h3 className="text-2xl font-bold mb-4">{title}</h3>
                                        <p className="text-[var(--text-secondary)] mb-6">
                                            Coming soon with deep BAuth integration.
                                        </p>
                                        <button className="px-7 py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-cyan-500 text-white font-semibold shadow-lg hover:scale-105 transition">
                                            Coming soon →
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </Slider>
                    </div>
                </div>
            </section>

            <section id="projects" className="py-28">
                <div className="max-w-7xl mx-auto px-6">
                    <h2 className="text-4xl font-bold text-center mb-16">
                        Powerful Features
                    </h2>
                    <div className="grid md:grid-cols-3 gap-10">
                        <Feature title="BMailer" icon={<FiZap />} />
                        <Feature title="BoxBauth" icon={<FiLayers />} />
                        <Feature title="BAuth" icon={<FiShield />} />
                        <Feature title="PlayBio" icon={<FiMonitor />} />
                        <Feature title="Broom" icon={<FiUsers />} />
                        <Feature title="Bypar" icon={<FiCheckCircle />} />
                    </div>
                </div>
            </section>

            <footer className="bg-gradient-to-b from-[var(--gray-50)] to-[var(--gray-100)] text-[var(--gray-700)] py-14 mt-20">
                <div className="max-w-6xl mx-auto px-6 grid gap-10 md:grid-cols-3">

                    <div>
                        <div className="flex items-baseline cursor-pointer">
                            <h1 className="text-2xl font-extrabold bg-gradient-to-r from-[var(--brand)] via-[var(--accent)] to-cyan-400 bg-clip-text text-transparent">
                                oneM
                            </h1>
                            <img
                                src="../favicon.png"
                                alt="logo"
                                className="w-4 h-4 object-contain"
                            />
                        </div>
                        <p className="text-sm leading-relaxed text-[var(--gray-600)]">
                            oneMB is a developer-focused platform built with a passion for
                            clean architecture, secure authentication, and scalable web systems.
                        </p>
                    </div>
                    <div>
                        <h3 className="text-sm font-semibold text-[var(--gray-900)] mb-3">
                            Resources
                        </h3>
                        <ul className="space-y-2 text-sm">
                            <li>
                                <a
                                    href="https://github.com/joinshivam"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="hover:text-[var(--theme)] transition"
                                >
                                    GitHub Projects
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/resume"
                                    className="hover:text-[var(--theme)] transition"
                                >
                                    Resume
                                </a>
                            </li>
                            <li>
                                <a
                                    href="/about"
                                    className="hover:text-[var(--theme)] transition"
                                >
                                    About Platform
                                </a>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="text-sm font-semibold text-[var(--gray-900)] mb-3">
                            Connect
                        </h3>
                        <div className="flex items-center gap-4">
                            <a
                                href="https://github.com/joinshivam"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="GitHub"
                                className="hover:text-[var(--theme)] transition"
                            >
                                <Github size={20} />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                aria-label="LinkedIn"
                                className="hover:text-[var(--theme)] transition"
                            >
                                <Linkedin size={20} />
                            </a>
                            <a
                                href="mailto:shivam@example.com"
                                aria-label="Email"
                                className="hover:text-[var(--theme)] transition"
                            >
                                <Mail size={20} />
                            </a>
                            <a
                                href="/"
                                aria-label="Website"
                                className="hover:text-[var(--theme)] transition"
                            >
                                <ExternalLink size={20} />
                            </a>
                        </div>
                    </div>
                </div>
                <div className="mt-12 border-t border-[var(--gray-200)] pt-6 text-center text-xs text-[var(--gray-500)]">
                    © {new Date().getFullYear()} CodeShivam. All rights reserved. <br />
                    Built & maintained by <span className="text-[var(--gray-700)] font-medium">Shivam</span>.
                </div>
            </footer>
        </div>
    );
}

function Feature({ icon, title }) {
    return (
        <div className="p-8 rounded-3xl bg-white/70 dark:bg-white/5 backdrop-blur-xl border border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.15)] hover:-translate-y-1 transition">
            <div className="flex items-center gap-3 mb-4 text-indigo-500 text-3xl">
                {icon}
                <h3 className="text-2xl font-bold text-[var(--text-primary)]">
                    {title}
                </h3>
            </div>
            <p className="text-[var(--text-secondary)]">
                Modern, secure and scalable service powered by BAuth.
            </p>
        </div>
    );
}
