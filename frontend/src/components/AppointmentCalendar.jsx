import { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import axios from "axios";
import { useLanguage } from "../context/LanguageContext";

export default function AppointmentCalendar() {
    const API_URL = import.meta.env.VITE_API_URL || "http://127.0.0.1:8000";
    const { t, language } = useLanguage();

    const [date, setDate] = useState(new Date());
    const [time, setTime] = useState(null);
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [name, setName] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);

    const timeSlots = [
        "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00",
    ];

    const tileDisabled = ({ date }) => {
        const day = date.getDay();
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        // Disable past dates and non-weekend days
        return date < today || (day !== 0 && day !== 6);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!time) {
            setMessage(`warning:${t("appointments.selectTime")}`);
            return;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            setMessage(`warning:${t("appointments.invalidEmail")}`);
            return;
        }

        const phoneRegex = /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/;
        const cleanedPhone = phone.replace(/[\s.-]/g, "");

        if (!phoneRegex.test(phone) || cleanedPhone.length < 10) {
            setMessage(`warning:${t("appointments.invalidPhone")}`);
            return;
        }

        setLoading(true);
        setMessage("");

        try {
            const [hours, minutes] = time.split(":");
            const appointmentDate = new Date(date);
            appointmentDate.setHours(parseInt(hours, 10), parseInt(minutes, 10), 0, 0);
            const startAt = appointmentDate.toISOString();

            await axios.post(
                `${API_URL}/api/appointments`,
                {
                    clientName: name,
                    clientEmail: email,
                    clientPhone: cleanedPhone,
                    startAt: startAt,
                    status: "PENDING",
                    language: language,
                },
                {
                    headers: {
                        "Content-Type": "application/ld+json",
                    },
                }
            );

            setMessage(`success:${t("appointments.success")}`);
            setName("");
            setEmail("");
            setPhone("");
            setTime(null);
        } catch (error) {
            console.error("Erreur lors de la réservation:", error);

            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;

                if (status === 422 && data.violations) {
                    const messages = data.violations.map(v => v.message).join(' ');
                    setMessage(`error:${messages}`);
                } else if (status === 400) {
                    setMessage(`error:${t("appointments.invalidData")}`);
                } else if (status === 409) {
                    setMessage(`error:${t("appointments.slotTaken")}`);
                } else {
                    setMessage(`error:${t("appointments.unexpectedError")}`);
                }
            } else if (error.request) {
                setMessage(`error:${t("appointments.serverError")}`);
            } else {
                setMessage(`error:${t("appointments.unexpectedError")}`);
            }
        } finally {
            setLoading(false);
        }
    };

    const getMessageType = () => {
        if (!message) return null;
        return message.split(":")[0];
    };

    const getMessageText = () => {
        if (!message) return "";
        return message.split(":").slice(1).join(":");
    };

    return (
        <div className="grid lg:grid-cols-2 gap-8 items-start">
            {/* Left Column - Calendar & Time */}
            <div className="space-y-8">
                {/* Calendar */}
                <div className="bg-white dark:bg-espresso p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-8 rounded-full bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-display text-lg flex items-center justify-center">
                            1
                        </span>
                        <h3 className="font-display text-2xl text-chocolate dark:text-cream">
                            {t("appointments.step1")}
                        </h3>
                    </div>
                    <p className="font-body text-sm text-espresso/60 dark:text-cream/60 mb-6">
                        {t("appointments.weekendOnly")}
                    </p>
                    <Calendar
                        onChange={(d) => {
                            setDate(d);
                            setTime(null);
                        }}
                        value={date}
                        tileDisabled={tileDisabled}
                        className="nailyse-calendar w-full"
                    />
                </div>

                {/* Time Slots */}
                <div className="bg-white dark:bg-espresso p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <span className="w-8 h-8 rounded-full bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-display text-lg flex items-center justify-center">
                            2
                        </span>
                        <h3 className="font-display text-2xl text-chocolate dark:text-cream">
                            {t("appointments.step2")}
                        </h3>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                        {timeSlots.map((slot) => (
                            <button
                                key={slot}
                                type="button"
                                onClick={() => setTime(slot)}
                                className={`py-3 px-4 font-body text-sm tracking-wider transition-all duration-300 ${
                                    time === slot
                                        ? "bg-wine dark:bg-rosegold text-cream dark:text-chocolate"
                                        : "bg-champagne/50 dark:bg-chocolate text-chocolate dark:text-cream hover:bg-champagne dark:hover:bg-burgundy/30"
                                }`}
                            >
                                {slot}
                            </button>
                        ))}
                    </div>
                    {!time && (
                        <p className="text-sm text-wine/80 dark:text-rosegold/80 mt-4 font-body">
                            {t("appointments.selectSlot")}
                        </p>
                    )}
                </div>
            </div>

            {/* Right Column - Form */}
            <div className="bg-white dark:bg-espresso p-8 lg:sticky lg:top-32">
                <div className="flex items-center gap-3 mb-6">
                    <span className="w-8 h-8 rounded-full bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-display text-lg flex items-center justify-center">
                        3
                    </span>
                    <h3 className="font-display text-2xl text-chocolate dark:text-cream">
                        {t("appointments.step3")}
                    </h3>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Name */}
                    <div>
                        <label className="block font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60 mb-2">
                            {t("appointments.fullName")}
                        </label>
                        <input
                            type="text"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full px-4 py-3 bg-cream dark:bg-chocolate border border-espresso/10 dark:border-cream/10 text-chocolate dark:text-cream font-body focus:outline-none focus:border-wine dark:focus:border-rosegold transition-colors"
                            placeholder={t("appointments.fullName")}
                        />
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60 mb-2">
                            {t("appointments.email")}
                        </label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-3 bg-cream dark:bg-chocolate border border-espresso/10 dark:border-cream/10 text-chocolate dark:text-cream font-body focus:outline-none focus:border-wine dark:focus:border-rosegold transition-colors"
                            placeholder="votre@email.com"
                        />
                    </div>

                    {/* Phone */}
                    <div>
                        <label className="block font-body text-sm tracking-wider uppercase text-espresso/60 dark:text-cream/60 mb-2">
                            {t("appointments.phone")}
                        </label>
                        <input
                            type="tel"
                            required
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            className="w-full px-4 py-3 bg-cream dark:bg-chocolate border border-espresso/10 dark:border-cream/10 text-chocolate dark:text-cream font-body focus:outline-none focus:border-wine dark:focus:border-rosegold transition-colors"
                            placeholder="06 12 34 56 78"
                        />
                    </div>

                    {/* Summary */}
                    <div className="p-4 bg-champagne/30 dark:bg-chocolate border border-rosegold/20">
                        <p className="font-body text-sm text-espresso/60 dark:text-cream/60 mb-1">
                            {t("appointments.yourAppointment")}
                        </p>
                        <p className="font-display text-xl text-chocolate dark:text-cream">
                            {date.toLocaleDateString(language === "fr" ? "fr-FR" : "en-US", {
                                weekday: "long",
                                day: "numeric",
                                month: "long",
                            })}{" "}
                            {t("appointments.at")}{" "}
                            <span className="text-wine dark:text-rosegold">
                                {time || "--:--"}
                            </span>
                        </p>
                    </div>

                    {/* Message */}
                    {message && (
                        <div
                            className={`p-4 font-body text-sm ${
                                getMessageType() === "success"
                                    ? "bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800"
                                    : getMessageType() === "warning"
                                    ? "bg-amber-50 dark:bg-amber-900/20 text-amber-800 dark:text-amber-300 border border-amber-200 dark:border-amber-800"
                                    : "bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800"
                            }`}
                        >
                            {getMessageText()}
                        </div>
                    )}

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading || !time}
                        className="group relative w-full py-4 bg-wine dark:bg-rosegold text-cream dark:text-chocolate font-body text-sm tracking-wider uppercase overflow-hidden transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <span className="relative z-10">
                            {loading ? t("appointments.sending") : t("appointments.confirm")}
                        </span>
                        <div className="absolute inset-0 bg-burgundy dark:bg-champagne translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                    </button>
                </form>
            </div>
        </div>
    );
}
