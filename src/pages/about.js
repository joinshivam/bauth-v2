import React from "react";
import {
  ShieldCheck,
  Users,
  Globe,
  LockKeyhole,
  ServerCog,
  LaptopMinimal,
} from "lucide-react";

import { Helmet } from "react-helmet-async";

export default function AboutPage() {
  const features = [
    {
      icon: <Users className="w-7 h-7" />,
      title: "Multi-Session Login",
      description:
        "Securely manage multiple active accounts and sessions across browsers, devices, and applications without conflicts.",
    },
    {
      icon: <Globe className="w-7 h-7" />,
      title: "Single Sign-On (SSO)",
      description:
        "Enable seamless authentication across connected apps using a single secure login experience.",
    },
    {
      icon: <ShieldCheck className="w-7 h-7" />,
      title: "Identity Provider (IDP)",
      description:
        "Centralized identity infrastructure supporting scalable authentication and authorization workflows.",
    },
    {
      icon: <LockKeyhole className="w-7 h-7" />,
      title: "Advanced Security",
      description:
        "Built with modern authentication standards, secure token handling, and session isolation mechanisms.",
    },
    {
      icon: <ServerCog className="w-7 h-7" />,
      title: "Developer APIs",
      description:
        "Flexible APIs and authentication tools designed for modern SaaS, enterprise, and web platforms.",
    },
    {
      icon: <LaptopMinimal className="w-7 h-7" />,
      title: "Account Management",
      description:
        "Manage accounts, connected apps, active sessions, and authentication activity from a unified platform.",
    },
  ];

  return (
    <div className="min-h-screen bg-black text-white">
      <Helmet>
        <title>BAuth - About us</title>
        <link rel="canonical" href="https://joinshivam-bauth.vercel.app" />
      </Helmet>
      {/* Hero Section */}
      <section className="relative overflow-hidden border-b border-white/10">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/20 via-purple-500/10 to-transparent blur-3xl" />

        <div className="relative max-w-7xl mx-auto px-6 py-28">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-md mb-6">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-sm text-gray-300">
                Modern Authentication Infrastructure
              </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold leading-tight">
              About <span className="text-blue-500">Bauth</span>
            </h1>

            <p className="mt-6 text-lg text-gray-400 leading-relaxed">
              Bauth is a modern authentication and identity platform providing
              multi-session login systems, Single Sign-On (SSO), Identity
              Provider (IDP) infrastructure, and advanced account management for
              modern applications.
            </p>

            <div className="mt-8 flex flex-wrap gap-4">
              <a
                href="https://joinshivam-bauth.vercel.app"
                target="_blank"
                rel="noreferrer"
                className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 transition-all font-medium"
              >
                Visit Website
              </a>

              <a
                href="#features"
                className="px-6 py-3 rounded-xl border border-white/10 hover:bg-white/5 transition-all font-medium"
              >
                Explore Features
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 py-24"
      >
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold">What Bauth Provides</h2>

          <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
            Powerful authentication and identity tools designed for startups,
            SaaS platforms, enterprises, and modern web applications.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group rounded-3xl border border-white/10 bg-white/5 p-8 hover:bg-white/10 transition-all duration-300 backdrop-blur-md"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-600/20 flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                {feature.icon}
              </div>

              <h3 className="text-2xl font-semibold mb-3">
                {feature.title}
              </h3>

              <p className="text-gray-400 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Vision Section */}
      <section className="border-y border-white/10 bg-white/[0.03]">
        <div className="max-w-6xl mx-auto px-6 py-24 grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <h2 className="text-4xl font-bold leading-tight">
              Authentication Built for the Modern Web
            </h2>

            <p className="mt-6 text-gray-400 leading-relaxed">
              Modern platforms require secure, scalable, and flexible identity
              systems. Bauth simplifies authentication architecture by providing
              centralized login management, secure identity flows, and seamless
              session handling across applications and devices.
            </p>

            <p className="mt-5 text-gray-400 leading-relaxed">
              Our mission is to help developers and businesses build secure user
              experiences without dealing with the complexity of fragmented
              authentication systems.
            </p>
          </div>

          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-blue-500/10 to-purple-500/10 p-10 backdrop-blur-md">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-blue-400 mt-2" />
                <p className="text-gray-300">
                  Multi-device secure session management
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-purple-400 mt-2" />
                <p className="text-gray-300">
                  Enterprise-ready SSO & IDP architecture
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-cyan-400 mt-2" />
                <p className="text-gray-300">
                  Secure authentication APIs for developers
                </p>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-3 h-3 rounded-full bg-pink-400 mt-2" />
                <p className="text-gray-300">
                  Privacy-focused account infrastructure
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-gray-500">
          <div>
            © {new Date().getFullYear()} Bauth. All rights reserved.
          </div>

          <a
            href="https://joinshivam-bauth.vercel.app"
            target="_blank"
            rel="noreferrer"
            className="hover:text-white transition-colors"
          >
            https://joinshivam-bauth.vercel.app
          </a>
        </div>
      </footer>
    </div>
  );
}