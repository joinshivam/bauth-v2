import React from "react";
import { Helmet } from "react-helmet-async";
import DotBounce from "../components/loader/dotBounce";
import {
    Github,
    Linkedin,
    Mail,
    Phone,
    Globe,
    MessageCircle,
    QrCode,
    Send,
    MapPin,
} from "lucide-react";

export default function DeveloperContactPage() {
    const socials = [
        {
            icon: <Github className="w-6 h-6" />,
            name: "GitHub",
            link: "https://github.com/joinshivam",
            color: "hover:text-white",
        },
        {
            icon: <Linkedin className="w-6 h-6" />,
            name: "LinkedIn",
            link: "https://linkedin.com/joinshivam",
            color: "hover:text-blue-400",
        },
        {
            icon: <Mail className="w-6 h-6" />,
            name: "Email",
            link: "mailto:joinshivam@proton.me",
            color: "hover:text-red-400",
        },
        {
            icon: <Globe className="w-6 h-6" />,
            name: "Website",
            link: "https://joinshivam-bauth.vercel.app",
            color: "hover:text-cyan-400",
        },
    ];

    return (
        <div className="min-h-screen bg-black text-white overflow-hidden relative">
            <Helmet>
                <title>Contact us - bauth</title>
                <link rel="canonical" href="https://joinshivam-bauth.vercel.app" />
            </Helmet>
            {/* Background Glow */}
            <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-500/20 blur-[140px]" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-purple-500/20 blur-[140px]" />

            {/* Floating Social Icons */}
            <div className="hidden lg:flex flex-col gap-5 fixed left-6 top-1/2 -translate-y-1/2 z-50">
                {socials.map((social, index) => (
                    <a
                        key={index}
                        href={social.link}
                        target="_blank"
                        rel="noreferrer"
                        className={`w-14 h-14 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-center text-gray-400 transition-all duration-300 hover:scale-110 ${social.color}`}
                    >
                        {social.icon}
                    </a>
                ))}
            </div>

            {/* Hero */}
            <section className="relative max-w-7xl mx-auto px-6 pt-24 pb-10">
                <div className="max-w-4xl">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-xl mb-6">
                        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />

                        <span className="text-sm text-gray-300">
                            Available For Collaboration & Projects
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-bold leading-tight">
                        Developer <span className="text-blue-500">Contact</span>
                    </h1>

                    <p className="mt-6 text-lg text-gray-400 leading-relaxed max-w-2xl">
                        Connect for authentication systems, SSO integrations,
                        multi-session infrastructure, backend architecture,
                        startup collaboration, and modern web application development.
                    </p>
                </div>
            </section>

            {/* Main Grid */}
            <section className="relative max-w-7xl mx-auto px-6 py-12 grid lg:grid-cols-2 gap-10">
                {/* Left Card */}
                <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">
                    <div className="flex items-center gap-5">
                        <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-4xl font-bold">
                            <img src="nb-profile-cutout-dark.png" alt="joinshivam.png" onDrag={(e) => {
                                e.preventDefault();
                                e.target.style.userDrag = "none"
                            }} />
                        </div>

                        <div>
                            <h2 className="text-3xl font-bold">
                                Shivam
                            </h2>

                            <p className="text-gray-400 mt-2">
                                Software Developer • Startup Builder • Backend Engineer
                            </p>
                        </div>
                    </div>

                    <div className="mt-10 space-y-5">
                        {/* Phone */}
                        <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-black/30">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                <Phone className="w-5 h-5" />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Phone Number
                                </p>

                                <a
                                    href="tel:+917065494501"
                                    className="text-lg font-medium hover:text-blue-400 transition-colors"
                                >
                                    +91 7065494501
                                </a>
                            </div>
                        </div>

                        {/* Email */}
                        <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-black/30">
                            <div className="w-12 h-12 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400">
                                <Mail className="w-5 h-5" />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Email Address
                                </p>

                                <a
                                    href="mailto:joinshivam@proton.me"
                                    className="text-lg font-medium hover:text-blue-400 transition-colors"
                                >
                                    joinshivam@proton.me
                                </a>
                            </div>
                        </div>

                        {/* WhatsApp */}
                        <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-black/30">
                            <div className="w-12 h-12 rounded-xl bg-green-500/10 flex items-center justify-center text-green-400">
                                <MessageCircle className="w-5 h-5" />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    WhatsApp
                                </p>

                                <a
                                    href="https://wa.me/917065494501"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-lg font-medium hover:text-blue-400 transition-colors"
                                >
                                    Chat on WhatsApp
                                </a>
                            </div>
                        </div>

                        {/* Website */}
                        <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-black/30">
                            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                                <Globe className="w-5 h-5" />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Website
                                </p>

                                <a
                                    href="https://joinshivam-bauth.vercel.app"
                                    target="_blank"
                                    rel="noreferrer"
                                    className="text-lg font-medium hover:text-blue-400 transition-colors break-all"
                                >
                                    joinshivam-bauth.vercel.app
                                </a>
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex items-center gap-4 p-5 rounded-2xl border border-white/10 bg-black/30">
                            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
                                <MapPin className="w-5 h-5" />
                            </div>

                            <div>
                                <p className="text-sm text-gray-500">
                                    Location
                                </p>

                                <p className="text-lg font-medium">
                                    Greater Noida, Uttar Pradesh , India
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* QR Card */}
                    <div className="mt-8 rounded-3xl border border-white/10 bg-gradient-to-br from-white/10 to-white/5 p-6">
                        <div className="flex items-center justify-between gap-5">
                            <div>
                                <h3 className="text-2xl font-semibold">
                                    Quick Connect
                                </h3>

                                <p className="text-gray-400 mt-2">
                                    Scan QR to instantly open WhatsApp or contact profile.
                                </p>
                            </div>

                            <div className="w-24 h-24 rounded-2xl bg-white text-black flex items-center justify-center">
                                {/* <QrCode className="w-14 h-14" /> */}
                                <DotBounce size={15} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Contact Form */}
                <div className="rounded-[32px] border border-white/10 bg-white/5 backdrop-blur-2xl p-8">
                    <h2 className="text-4xl font-bold">
                        Send Message
                    </h2>

                    <p className="text-gray-400 mt-3 mb-8">
                        Have a project idea, startup collaboration, backend
                        requirement, or authentication integration work?
                    </p>

                    <form className="space-y-6">
                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Full Name
                            </label>

                            <input
                                type="text"
                                placeholder="Enter your name"
                                className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Email Address
                            </label>

                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-blue-500 transition-all"
                            />
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Project Type
                            </label>

                            <select className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-blue-500 transition-all">
                                <option>Authentication System</option>
                                <option>SSO Integration</option>
                                <option>Backend Development</option>
                                <option>Startup Collaboration</option>
                                <option>Custom Project</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm text-gray-400 mb-2">
                                Message
                            </label>

                            <textarea
                                rows="6"
                                placeholder="Describe your project or idea..."
                                className="w-full px-5 py-4 rounded-2xl bg-black/40 border border-white/10 outline-none focus:border-blue-500 transition-all resize-none"
                            />
                        </div>

                        <button
                            type="submit"
                            className="w-full py-4 rounded-2xl bg-blue-600 hover:bg-blue-500 transition-all font-semibold flex items-center justify-center gap-3"
                        >
                            <Send className="w-5 h-5" />
                            Send Message
                        </button>
                    </form>
                </div>
            </section>

            {/* Bottom Socials */}
            <section className="max-w-7xl mx-auto px-6 pb-20">
                <div className="flex flex-wrap items-center justify-center gap-5">
                    {socials.map((social, index) => (
                        <a
                            key={index}
                            href={social.link}
                            target="_blank"
                            rel="noreferrer"
                            className="px-6 py-4 rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl flex items-center gap-3 text-gray-300 hover:bg-white/10 hover:scale-105 transition-all duration-300"
                        >
                            {social.icon}
                            {social.name}
                        </a>
                    ))}
                </div>
            </section>
        </div>
    );
}