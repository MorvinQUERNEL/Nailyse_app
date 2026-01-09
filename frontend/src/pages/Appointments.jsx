import AppointmentCalendar from "../components/AppointmentCalendar";
import { useLanguage } from "../context/LanguageContext";

export default function Appointments() {
    const { t } = useLanguage();

    return (
        <div className="relative min-h-screen bg-cream dark:bg-chocolate pt-32 pb-20">
            {/* Background Decorations */}
            <div className="absolute top-0 left-0 w-1/3 h-96 bg-gradient-to-br from-blush/30 to-transparent dark:from-burgundy/20 pointer-events-none" />
            <div className="absolute bottom-0 right-0 w-1/2 h-64 bg-gradient-to-tl from-champagne/40 to-transparent dark:from-espresso/40 pointer-events-none" />

            <div className="relative max-w-7xl mx-auto px-6 lg:px-12">
                {/* Page Header */}
                <div className="text-center mb-16">
                    <span className="font-body text-sm tracking-[0.3em] uppercase text-rosegold mb-4 block">
                        {t("appointments.subtitle")}
                    </span>
                    <h1 className="font-display text-5xl md:text-6xl lg:text-7xl font-light text-chocolate dark:text-cream mb-6">
                        {t("appointments.title")}{" "}
                        <span className="italic text-wine dark:text-blush">
                            {t("appointments.titleHighlight")}
                        </span>
                    </h1>
                </div>

                {/* Calendar Component */}
                <AppointmentCalendar />

            </div>
        </div>
    );
}
