import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useLanguage } from "../context/LanguageContext";

const FloatingBlob = ({ className, delay = 0 }) => (
    <div
        className={`absolute rounded-full blur-3xl opacity-30 dark:opacity-20 ${className}`}
        style={{
            animation: `blob 7s infinite ${delay}s`,
        }}
    />
);

const Home = () => {
    const [isVisible, setIsVisible] = useState(false);
    const { t } = useLanguage();

    useEffect(() => {
        setIsVisible(true);
    }, []);

    const services = [
        {
            title: t("home.services.items.manicure.title"),
            description: t("home.services.items.manicure.description"),
            duration: "45 min",
            icon: "01",
        },
        {
            title: t("home.services.items.gelUv.title"),
            description: t("home.services.items.gelUv.description"),
            duration: "1h30",
            icon: "02",
        },
        {
            title: t("home.services.items.nailArt.title"),
            description: t("home.services.items.nailArt.description"),
            duration: "2h",
            icon: "03",
        },
        {
            title: t("home.services.items.spa.title"),
            description: t("home.services.items.spa.description"),
            duration: "1h",
            icon: "04",
        },
    ];

    return (
        <div className="relative min-h-screen overflow-hidden bg-cream dark:bg-chocolate transition-colors duration-500">
            {/* Organic Background Shapes */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <FloatingBlob
                    className="w-[600px] h-[600px] -top-48 -right-48 bg-blush dark:bg-wine"
                    delay={0}
                />
                <FloatingBlob
                    className="w-[400px] h-[400px] top-1/2 -left-32 bg-champagne dark:bg-burgundy"
                    delay={2}
                />
                <FloatingBlob
                    className="w-[300px] h-[300px] bottom-32 right-1/4 bg-rosegold/40 dark:bg-rosegold/20"
                    delay={4}
                />
            </div>

            {/* Grain Texture Overlay */}
            <div
                className="absolute inset-0 opacity-[0.015] dark:opacity-[0.03] pointer-events-none"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />

            {/* Hero Section */}
            <section className="relative min-h-[90vh] flex items-center">
                <div className="max-w-7xl mx-auto px-6 lg:px-12 py-20 w-full">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        {/* Left Content */}
                        <div className="relative z-10">
                            <div
                                className={`transition-all duration-1000 ${
                                    isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                }`}
                            >
                                <span className="inline-block font-body text-sm tracking-[0.3em] uppercase text-rosegold dark:text-rosegold mb-6">
                                    {t("home.hero.salonLabel")}
                                </span>
                            </div>

                            <h1
                                className={`font-display text-6xl md:text-7xl lg:text-8xl font-light leading-[0.9] text-chocolate dark:text-cream mb-8 transition-all duration-1000 delay-150 ${
                                    isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                }`}
                            >
                                {t("home.hero.title1")}
                                <br />
                                <span className="italic text-wine dark:text-blush">
                                    {t("home.hero.title2")}
                                </span>
                                <br />
                                {t("home.hero.title3")}
                            </h1>

                            <p
                                className={`font-body text-lg text-espresso/70 dark:text-cream/70 max-w-md mb-10 leading-relaxed transition-all duration-1000 delay-300 ${
                                    isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                }`}
                            >
                                {t("home.hero.description")}
                            </p>

                            <div
                                className={`flex flex-wrap gap-4 transition-all duration-1000 delay-500 ${
                                    isVisible
                                        ? "opacity-100 translate-y-0"
                                        : "opacity-0 translate-y-8"
                                }`}
                            >
                                <Link
                                    to="/appointments"
                                    className="group relative inline-flex items-center gap-3 px-8 py-4 bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-body text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-wine/20 dark:hover:shadow-rosegold/20"
                                >
                                    <span className="relative z-10">{t("home.hero.cta1")}</span>
                                    <svg
                                        className="w-4 h-4 relative z-10 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                    <div className="absolute inset-0 bg-burgundy dark:bg-champagne translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                                </Link>

                                <Link
                                    to="/shop"
                                    className="group inline-flex items-center gap-3 px-8 py-4 border border-espresso/20 dark:border-cream/20 text-espresso dark:text-cream font-body text-sm tracking-wider uppercase transition-all duration-300 hover:border-wine dark:hover:border-rosegold hover:text-wine dark:hover:text-rosegold"
                                >
                                    <span>{t("home.hero.cta2")}</span>
                                    <svg
                                        className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        stroke="currentColor"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={1.5}
                                            d="M17 8l4 4m0 0l-4 4m4-4H3"
                                        />
                                    </svg>
                                </Link>
                            </div>
                        </div>

                        {/* Right Visual */}
                        <div
                            className={`relative transition-all duration-1000 delay-300 ${
                                isVisible
                                    ? "opacity-100 scale-100"
                                    : "opacity-0 scale-95"
                            }`}
                        >
                            <div className="relative aspect-[4/5] max-w-lg mx-auto">
                                {/* Decorative Frame */}
                                <div className="absolute inset-0 border border-rosegold/30 dark:border-rosegold/20 transform rotate-3" />
                                <div className="absolute inset-0 border border-wine/20 dark:border-blush/20 transform -rotate-3" />

                                {/* Main Visual Container */}
                                <div className="absolute inset-4 bg-gradient-to-br from-champagne via-blush to-rosegold/30 dark:from-espresso dark:via-burgundy/50 dark:to-wine/30 overflow-hidden">
                                    {/* Abstract Nail Art Shapes */}
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="relative w-32 h-48">
                                            {/* Stylized Nail Shape */}
                                            <div
                                                className="absolute inset-0 bg-gradient-to-b from-cream to-blush dark:from-cream/90 dark:to-blush/80 rounded-t-full animate-float"
                                                style={{
                                                    clipPath:
                                                        "ellipse(50% 45% at 50% 55%)",
                                                }}
                                            />
                                            <div
                                                className="absolute top-8 left-4 right-4 h-24 bg-wine/80 dark:bg-rosegold/80 rounded-t-full animate-float-delayed"
                                                style={{
                                                    clipPath:
                                                        "ellipse(50% 50% at 50% 60%)",
                                                }}
                                            />
                                            {/* Accent Dots */}
                                            <div className="absolute top-16 left-1/2 -translate-x-1/2 w-2 h-2 bg-cream dark:bg-cream rounded-full animate-pulse" />
                                            <div className="absolute top-24 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-cream/70 dark:bg-cream/70 rounded-full animate-pulse delay-150" />
                                        </div>
                                    </div>

                                    {/* Floating Decorative Elements */}
                                    <div className="absolute top-8 right-8 w-16 h-16 border border-cream/40 rounded-full animate-float-slow" />
                                    <div className="absolute bottom-12 left-8 w-8 h-8 bg-wine/40 dark:bg-rosegold/40 rounded-full animate-float-delayed" />
                                    <div className="absolute top-1/3 left-12 w-1 h-16 bg-cream/30 rotate-45" />
                                </div>

                                {/* Corner Accents */}
                                <div className="absolute -top-2 -left-2 w-8 h-8 border-t-2 border-l-2 border-wine dark:border-rosegold" />
                                <div className="absolute -bottom-2 -right-2 w-8 h-8 border-b-2 border-r-2 border-wine dark:border-rosegold" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Scroll Indicator */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-espresso/40 dark:text-cream/40">
                    <span className="font-body text-xs tracking-widest uppercase">
                        {t("home.hero.scroll")}
                    </span>
                    <div className="w-px h-12 bg-gradient-to-b from-current to-transparent" />
                </div>
            </section>

            {/* Services Section */}
            <section className="relative py-32">
                <div className="max-w-7xl mx-auto px-6 lg:px-12">
                    {/* Section Header */}
                    <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
                        <div>
                            <span className="font-body text-sm tracking-[0.3em] uppercase text-rosegold mb-4 block">
                                {t("home.services.label")}
                            </span>
                            <h2 className="font-display text-5xl md:text-6xl font-light text-chocolate dark:text-cream">
                                {t("home.services.title")}
                                <span className="italic text-wine dark:text-blush ml-4">
                                    {t("home.services.titleHighlight")}
                                </span>
                            </h2>
                        </div>
                        <p className="font-body text-espresso/60 dark:text-cream/60 max-w-md">
                            {t("home.services.description")}
                        </p>
                    </div>

                    {/* Services Grid */}
                    <div className="grid md:grid-cols-2 gap-px bg-espresso/10 dark:bg-cream/10">
                        {services.map((service, index) => (
                            <div
                                key={service.title}
                                className="group bg-cream dark:bg-chocolate p-10 md:p-12 transition-all duration-500 hover:bg-champagne dark:hover:bg-espresso"
                            >
                                <div className="flex items-start justify-between mb-8">
                                    <span className="font-display text-6xl font-light text-rosegold/30 dark:text-rosegold/20 group-hover:text-rosegold/50 transition-colors duration-300">
                                        {service.icon}
                                    </span>
                                    <span className="font-body text-xs tracking-wider uppercase text-espresso/40 dark:text-cream/40 px-3 py-1 border border-current rounded-full">
                                        {service.duration}
                                    </span>
                                </div>
                                <h3 className="font-display text-2xl md:text-3xl text-chocolate dark:text-cream mb-4 group-hover:text-wine dark:group-hover:text-rosegold transition-colors duration-300">
                                    {service.title}
                                </h3>
                                <p className="font-body text-espresso/60 dark:text-cream/60 leading-relaxed">
                                    {service.description}
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* CTA */}
                    <div className="mt-16 text-center">
                        <Link
                            to="/appointments"
                            className="inline-flex items-center gap-4 font-body text-wine dark:text-rosegold tracking-wider uppercase group"
                        >
                            <span className="relative">
                                {t("home.services.viewAll")}
                                <span className="absolute bottom-0 left-0 w-full h-px bg-current transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                            </span>
                            <svg
                                className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-2"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1.5}
                                    d="M17 8l4 4m0 0l-4 4m4-4H3"
                                />
                            </svg>
                        </Link>
                    </div>
                </div>
            </section>

            {/* Feature Banner */}
            <section className="relative py-24 overflow-hidden">
                <div className="absolute inset-0 bg-wine dark:bg-espresso" />
                <div
                    className="absolute inset-0 opacity-10"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 2px 2px, currentColor 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                    }}
                />

                <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
                    <div className="grid md:grid-cols-3 gap-12 md:gap-8 text-center">
                        {[
                            {
                                number: "500+",
                                label: t("home.stats.clients"),
                            },
                            {
                                number: "5",
                                label: t("home.stats.years"),
                            },
                            {
                                number: "100%",
                                label: t("home.stats.products"),
                            },
                        ].map((stat) => (
                            <div key={stat.label}>
                                <div className="font-display text-5xl md:text-6xl font-light text-cream dark:text-rosegold mb-2">
                                    {stat.number}
                                </div>
                                <div className="font-body text-sm tracking-wider uppercase text-cream/60 dark:text-cream/50">
                                    {stat.label}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Final CTA Section */}
            <section className="relative py-32">
                <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
                    <span className="font-body text-sm tracking-[0.3em] uppercase text-rosegold mb-6 block">
                        {t("home.cta.label")}
                    </span>
                    <h2 className="font-display text-4xl md:text-6xl font-light text-chocolate dark:text-cream mb-8 leading-tight">
                        {t("home.cta.title1")}
                        <br />
                        <span className="italic text-wine dark:text-blush">
                            {t("home.cta.title2")}
                        </span>
                    </h2>
                    <p className="font-body text-lg text-espresso/60 dark:text-cream/60 max-w-2xl mx-auto mb-12">
                        {t("home.cta.description")}
                    </p>

                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <Link
                            to="/appointments"
                            className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-body text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-wine/20 dark:hover:shadow-rosegold/20"
                        >
                            <span className="relative z-10">
                                {t("home.cta.button1")}
                            </span>
                            <div className="absolute inset-0 bg-burgundy dark:bg-champagne translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </Link>

                        <Link
                            to="/shop"
                            className="group inline-flex items-center justify-center gap-3 px-10 py-5 border border-espresso/20 dark:border-cream/20 text-espresso dark:text-cream font-body text-sm tracking-wider uppercase transition-all duration-300 hover:border-wine dark:hover:border-rosegold hover:text-wine dark:hover:text-rosegold"
                        >
                            {t("home.cta.button2")}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Footer Accent */}
            <div className="h-px bg-gradient-to-r from-transparent via-rosegold/50 to-transparent" />
        </div>
    );
};

export default Home;
