"use client";

import React, { useState, useEffect } from "react";

import {
    User, School, BookOpen, MapPin,
    ArrowLeft, Send, CheckCircle2, AlertTriangle
} from "lucide-react";
import { useRouter } from "next/navigation";
import { LOGIN_URL } from "@/lib/api-client";
import { useAuth } from "@/hooks/useAuth";

export function RegistrationForm() {
    const { profile, isAuthenticated, isLoading, refresh } = useAuth();
    const router = useRouter();
    const [activeStep, setActiveStep] = useState(1);
    const [submitError, setSubmitError] = useState("");
    const [formData, setFormData] = useState({
        fullName: "",
        collegeName: "",
        yearOfStudy: "",
        course: "",
        location: "",
    });

    const [errors, setErrors] = useState<Record<string, string>>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isRegistered, setIsRegistered] = useState(false);
    const [focusedField, setFocusedField] = useState<string | null>(null);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        if (errors[name]) {
            setErrors((prev) => ({ ...prev, [name]: "" }));
        }
    };

    const selectYearOfStudy = (year: string) => {
        setFormData((prev) => ({ ...prev, yearOfStudy: year }));
        if (errors.yearOfStudy) {
            setErrors((prev) => ({ ...prev, yearOfStudy: "" }));
        }
    };

    const validateStep2 = () => {
        const stepErrors: Record<string, string> = {};

        if (!formData.fullName.trim()) {
            stepErrors.fullName = "Full name is required";
        }

        if (!formData.collegeName.trim()) {
            stepErrors.collegeName = "College name is required";
        }

        if (!formData.yearOfStudy) {
            stepErrors.yearOfStudy = "Year of study is required";
        }

        if (!formData.course.trim()) {
            stepErrors.course = "Course / Field of study is required";
        }

        if (!formData.location.trim()) {
            stepErrors.location = "Location is required";
        }

        setErrors(stepErrors);
        return Object.keys(stepErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateStep2()) return;

        setIsSubmitting(true);
        setSubmitError("");

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({
                    name: formData.fullName,
                    college_name: formData.collegeName,
                    year: formData.yearOfStudy,
                    course: formData.course,
                    location: formData.location,
                }),
            });

            const body = await response.json().catch(() => null);

            if (!response.ok || body?.success === false) {
                setSubmitError(
                    body?.error?.message ||
                    (response.status === 401
                        ? "Your sign in has expired. Please sign in with Google again."
                        : "Registration failed. Please try again.")
                );
                return;
            }

            setIsRegistered(true);
            refresh();
            setTimeout(() => router.replace("/events/weekly-challenges/timeline"), 2500);
        } catch (err) {
            console.error(err);
            setSubmitError("Something went wrong. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
        if (isAuthenticated) {
            setActiveStep(2);
            setFormData((prev) => ({
                ...prev,
                fullName: prev.fullName || profile?.name || "",
            }));
        } else if (!isLoading) {
            setActiveStep(1);
        }
    }, [isAuthenticated, isLoading, profile]);

    return (
        <div className="w-full max-w-xl mx-auto px-4 md:px-6">
            {/* Colorful Gradient Border Wrapper Card */}
            <div
                className="relative group p-[1px] rounded-3xl bg-gradient-to-br from-[#D4AF37] via-[#F5E6A3] to-[#eab308] shadow-[0_0_40px_rgba(212,175,55,0.15)] hover:shadow-[0_0_50px_rgba(212,175,55,0.25)] transition-all duration-500 ease-out"
            >
                <div className="relative bg-[#0d0d0d]/90 backdrop-blur-2xl rounded-[23px] p-6 md:p-8 overflow-hidden z-10">

                    {/* Subtle inside gradient background overlays for premium feel */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-3xl pointer-events-none" />
                    <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#eab308]/10 rounded-full blur-3xl pointer-events-none" />

                    {/* Sleek Step Progress Bar */}
                    {!isRegistered && (
                        <div className="mb-6 relative z-10">
                            <div className="flex justify-between items-center text-xs text-zinc-400 mb-2">
                                <span className="font-semibold uppercase tracking-wider text-[#D4AF37]">
                                    {activeStep === 1 ? "Identity Verification" : "Profile Details"}
                                </span>
                                <span className="font-medium text-zinc-400">Step {activeStep} of 2</span>
                            </div>
                            <div className="h-[3px] w-full bg-zinc-900 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#eab308] transition-all duration-500 ease-out"
                                    style={{ width: `${(activeStep / 2) * 100}%` }}
                                />
                            </div>
                        </div>
                    )}

                    {/* Elegant Loading overlay */}
                    {isSubmitting && (
                        <div className="absolute inset-0 bg-[#0d0d0d]/95 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4 transition-all duration-300 rounded-[23px]">
                            <div className="w-10 h-10 border-2 border-zinc-800 border-t-[#4BE2C4] rounded-full animate-spin" />
                            <p className="text-xs text-zinc-300 font-medium tracking-wide">
                                Submitting registration...
                            </p>
                        </div>
                    )}

                    {/* Success Layout */}
                    {isRegistered ? (
                        <div className="py-4 flex flex-col items-center text-center space-y-6 relative z-10">
                            <div className="relative flex items-center justify-center">
                                <div className="absolute inset-0 rounded-full bg-[#4BE2C4]/15 blur-lg scale-125" />
                                <CheckCircle2 className="w-14 h-14 text-[#4BE2C4] relative z-10" />
                            </div>

                            <div className="space-y-1">
                                <h2 className="font-display text-xl sm:text-2xl font-bold text-white tracking-tight">
                                    Registration Confirmed
                                </h2>
                                <p className="text-sm text-zinc-400 max-w-sm mx-auto leading-relaxed">
                                    Thank you for registering. Your details are recorded for the upcoming weekly challenges.
                                </p>
                            </div>

                            {/* WhatsApp Group Invite CTA */}
                            <div className="w-full relative group/wa p-[1px] rounded-2xl bg-gradient-to-r from-[#25D366] to-[#128C7E] shadow-[0_0_20px_rgba(37,211,102,0.15)] hover:shadow-[0_0_25px_rgba(37,211,102,0.35)] transition-all duration-300">
                                <a
                                    href="https://chat.whatsapp.com/DpTJbCjcbTlHF4JAz2pLrG"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-center gap-3.5 bg-[#0e0e0e]/95 hover:bg-[#141414] transition-colors py-3.5 px-5 rounded-[15px] text-white cursor-pointer"
                                >
                                    <svg className="w-5 h-5 fill-current text-[#25D366] flex-shrink-0" viewBox="0 0 24 24">
                                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L0 24l6.335-1.662c1.746.953 3.71 1.458 5.704 1.459h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                                    </svg>
                                    <div className="flex flex-col items-start text-left leading-snug">
                                        <span className="text-xs font-bold text-white tracking-wide">Join the WhatsApp Group</span>
                                        <span className="text-[10px] text-zinc-400">Receive instant updates, challenges, and announcements</span>
                                    </div>
                                </a>
                            </div>

                            {/* Profile Ticket Display */}
                            <div className="w-full bg-[#141414]/90 border border-zinc-800/80 rounded-2xl p-6 text-left space-y-4 relative overflow-hidden">
                                {/* Micro glow spots for the ticket */}
                                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-[#4BE2C4]/10 to-[#E8FF00]/10 rounded-full blur-2xl pointer-events-none" />

                                <div className="flex items-center gap-3.5 border-b border-zinc-800/80 pb-4 relative z-10">
                                    {false ? (
                                        <img
                                            src=""
                                            alt={formData.fullName}
                                            className="w-10 h-10 rounded-full border border-zinc-800"
                                        />
                                    ) : (
                                        <div className="w-10 h-10 rounded-full bg-[#4BE2C4]/10 border border-[#4BE2C4]/20 flex items-center justify-center text-[#4BE2C4] font-bold text-sm">
                                            {formData.fullName ? formData.fullName[0].toUpperCase() : "U"}
                                        </div>
                                    )}
                                    <div>
                                        <h4 className="font-bold text-white text-sm leading-snug">{formData.fullName}</h4>
                                        <span className="text-xs text-zinc-400">{profile?.email}</span>
                                    </div>
                                </div>

                                <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs relative z-10">
                                    <div>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-0.5">Institution</span>
                                        <span className="font-medium text-zinc-200">{formData.collegeName}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-0.5">Course / Major</span>
                                        <span className="font-medium text-zinc-200">{formData.course}</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-0.5">Year of Study</span>
                                        <span className="font-medium text-zinc-200">{formData.yearOfStudy} Year</span>
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-zinc-500 uppercase tracking-wider block mb-0.5">Location</span>
                                        <span className="font-medium text-zinc-200">{formData.location}</span>
                                    </div>
                                </div>
                            </div>


                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6 relative z-10">

                            {/* STEP 1: AUTHENTICATION */}
                            {activeStep === 1 && (
                                <div className="flex flex-col items-center text-center py-6 space-y-6">
                                    <div className="space-y-2">
                                        <h3 className="font-display text-lg sm:text-xl text-white font-bold tracking-tight">
                                            Verify Your Account
                                        </h3>
                                        <p className="text-sm text-zinc-400 max-w-sm leading-relaxed">
                                            Please authenticate using your Google account to proceed to the academic form.
                                        </p>
                                    </div>



                                    <button
                                        type="button"
                                        onClick={() => (window.location.href = LOGIN_URL)}
                                        className="w-full max-w-sm flex items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-[#141414] hover:border-zinc-700 hover:bg-[#1a1a1a] py-3.5 px-5 transition-all duration-300 cursor-pointer shadow-md"
                                    >
                                        <svg className="w-5 h-5 flex-shrink-0" viewBox="0 0 48 48">
                                            <path
                                                fill="#EA4335"
                                                d="M24 9.5c3.54 0 6.73 1.22 9.24 3.61l6.9-6.9C35.94 2.52 30.42 0 24 0 14.62 0 6.51 5.38 2.56 13.22l8.03 6.24C12.48 13.54 17.76 9.5 24 9.5z"
                                            />
                                            <path
                                                fill="#4285F4"
                                                d="M46.5 24.55c0-1.63-.15-3.2-.42-4.72H24v8.94h12.67c-.55 2.95-2.2 5.45-4.69 7.13l7.2 5.58c4.2-3.87 6.62-9.57 6.62-16.93z"
                                            />
                                            <path
                                                fill="#FBBC05"
                                                d="M10.59 28.54a14.48 14.48 0 010-9.08l-8.03-6.24A24.03 24.03 0 000 24c0 3.84.92 7.48 2.56 10.78l8.03-6.24z"
                                            />
                                            <path
                                                fill="#34A853"
                                                d="M24 48c6.48 0 11.92-2.14 15.9-5.82l-7.2-5.58c-2 1.34-4.56 2.14-8.7 2.14-6.24 0-11.52-4.04-13.4-9.96l-8.03 6.24C6.5 42.62 14.62 48 24 48z"
                                            />
                                        </svg>
                                        <span className="text-sm font-semibold text-zinc-200">
                                            Continue with Google
                                        </span>
                                    </button>

                                    <p className="text-[11px] text-zinc-500 max-w-[270px] leading-relaxed">
                                        Identity verification ensures accurate leaderboard tracking and competition fairness.
                                    </p>
                                </div>
                            )}

                            {/* STEP 2: PROFILE DETAILS */}
                            {activeStep === 2 && (
                                <div className="space-y-5">

                                    {/* Linked Account Banner */}
                                    {profile && (
                                        <div className="flex items-center gap-3.5 bg-[#141414]/90 border border-zinc-800/80 rounded-2xl p-3.5 mb-4 relative overflow-hidden">
                                            <div className="absolute right-0 top-0 w-16 h-16 bg-[#4BE2C4]/5 rounded-full blur-xl pointer-events-none" />
                                            {false ? (
                                                <img
                                                    src=""
                                                    alt="Avatar"
                                                    className="w-10 h-10 rounded-full border border-zinc-800"
                                                />
                                            ) : (
                                                <div className="w-10 h-10 rounded-full bg-[#4BE2C4]/10 border border-[#4BE2C4]/20 flex items-center justify-center text-[#4BE2C4] font-bold text-sm">
                                                    {profile.name ? profile.name[0].toUpperCase() : "U"}
                                                </div>
                                            )}
                                            <div className="flex flex-col min-w-0">
                                                <span className="text-[9px] text-[#4BE2C4] uppercase font-bold tracking-wider block">Verified Account</span>
                                                <span className="text-xs font-bold text-zinc-100 truncate pr-2 mt-0.5">{profile.name || profile.username}</span>
                                                <span className="text-[10px] text-zinc-400 truncate leading-none mt-1">{profile.email}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* FULL NAME INPUT (Read only) */}
                                    <div className="space-y-1.5">
                                        <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block ml-0.5">
                                            Full Name
                                        </label>
                                        <div className="relative group">
                                            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-zinc-500">
                                                <User className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                name="fullName"
                                                value={formData.fullName}
                                                readOnly
                                                className="w-full bg-[#161616]/40 border border-zinc-900 rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-400 placeholder-zinc-700 focus:outline-none cursor-not-allowed opacity-80"
                                            />
                                        </div>
                                    </div>

                                    {/* COLLEGE NAME INPUT */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block ml-0.5">
                                                College / University
                                            </label>
                                            {errors.collegeName && (
                                                <span className="text-red-400 flex items-center text-[10px] font-semibold">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    {errors.collegeName}
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-250 ${focusedField === "collegeName" ? "text-[#4BE2C4]" : "text-zinc-500"}`}>
                                                <School className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                name="collegeName"
                                                value={formData.collegeName}
                                                onChange={handleInputChange}
                                                onFocus={() => setFocusedField("collegeName")}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="Your college / university"
                                                className={`w-full bg-[#141414] border ${errors.collegeName
                                                    ? "border-red-500/40 focus:border-red-500"
                                                    : focusedField === "collegeName"
                                                        ? "border-[#4BE2C4] shadow-[0_0_12px_rgba(75,226,196,0.15)]"
                                                        : "border-zinc-800 hover:border-zinc-700"
                                                    } rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all duration-300`}
                                            />
                                        </div>
                                    </div>

                                    {/* COURSE / MAJOR */}
                                    <div className="space-y-1.5">
                                        <div className="flex justify-between items-center">
                                            <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block ml-0.5">
                                                Course / Field of study
                                            </label>
                                            {errors.course && (
                                                <span className="text-red-400 flex items-center text-[10px] font-semibold">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    {errors.course}
                                                </span>
                                            )}
                                        </div>
                                        <div className="relative group">
                                            <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-250 ${focusedField === "course" ? "text-[#4BE2C4]" : "text-zinc-500"}`}>
                                                <BookOpen className="w-4 h-4" />
                                            </div>
                                            <input
                                                type="text"
                                                name="course"
                                                value={formData.course}
                                                onChange={handleInputChange}
                                                onFocus={() => setFocusedField("course")}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="e.g. B.E. Computer Engineering"
                                                className={`w-full bg-[#141414] border ${errors.course
                                                    ? "border-red-500/40 focus:border-red-500"
                                                    : focusedField === "course"
                                                        ? "border-[#4BE2C4] shadow-[0_0_12px_rgba(75,226,196,0.15)]"
                                                        : "border-zinc-800 hover:border-zinc-700"
                                                    } rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all duration-300`}
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

                                        {/* YEAR OF STUDY CUSTOM SELECTOR */}
                                        <div className="space-y-1.5 md:col-span-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block ml-0.5">
                                                    Year of study
                                                </label>
                                                {errors.yearOfStudy && (
                                                    <span className="text-red-400 flex items-center text-[10px] font-semibold">
                                                        {errors.yearOfStudy}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="grid grid-cols-5 gap-1.5">
                                                {["1st", "2nd", "3rd", "4th", "Other"].map((yr) => {
                                                    const isSelected = formData.yearOfStudy === yr;
                                                    return (
                                                        <button
                                                            key={yr}
                                                            type="button"
                                                            onClick={() => selectYearOfStudy(yr)}
                                                            className={`py-2 px-0.5 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer text-center ${isSelected
                                                                ? "bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#eab308] border-transparent text-[#0d0d0d] font-bold shadow-[0_0_10px_rgba(212,175,55,0.25)]"
                                                                : "bg-[#141414] border-zinc-800 hover:border-zinc-700 text-zinc-450 hover:text-zinc-200"
                                                                }`}
                                                        >
                                                            {yr}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        </div>

                                        {/* LOCATION INPUT */}
                                        <div className="space-y-1.5 md:col-span-1">
                                            <div className="flex justify-between items-center">
                                                <label className="text-[10px] font-bold uppercase tracking-wider text-zinc-400 block ml-0.5">
                                                    Location / Region
                                                </label>
                                                {errors.location && (
                                                    <span className="text-red-400 flex items-center text-[10px] font-semibold">
                                                        {errors.location}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="relative group">
                                                <div className={`absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none transition-colors duration-250 ${focusedField === "location" ? "text-[#D4AF37]" : "text-zinc-500"}`}>
                                                    <MapPin className="w-4 h-4" />
                                                </div>
                                                <input
                                                    type="text"
                                                    name="location"
                                                    value={formData.location}
                                                    onChange={handleInputChange}
                                                    onFocus={() => setFocusedField("location")}
                                                    onBlur={() => setFocusedField(null)}
                                                    placeholder="e.g. Mumbai, India"
                                                    className={`w-full bg-[#141414] border ${errors.location
                                                        ? "border-red-500/40 focus:border-red-500"
                                                        : focusedField === "location"
                                                            ? "border-[#D4AF37] shadow-[0_0_12px_rgba(212,175,55,0.2)]"
                                                            : "border-zinc-800 hover:border-zinc-700"
                                                        } rounded-xl py-2.5 pl-10 pr-4 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all duration-300`}
                                                />
                                            </div>
                                        </div>

                                    </div>

                                    {submitError && (
                                        <div className="rounded-xl border border-red-500/20 bg-red-500/5 px-4 py-3 text-xs text-red-300">
                                            <div className="flex items-center gap-2">
                                                <AlertTriangle className="w-4 h-4 shrink-0 text-red-400" />
                                                <span>{submitError}</span>
                                            </div>
                                        </div>
                                    )}

                                    {/* Navigation Buttons */}
                                    <div className="grid grid-cols-3 gap-3.5 pt-4">
                                        <button
                                            type="button"
                                            onClick={() => setActiveStep(1)}
                                            className="col-span-1 py-3.5 bg-transparent hover:bg-zinc-900 border border-zinc-805 text-zinc-400 hover:text-zinc-200 font-semibold rounded-xl text-xs transition duration-300 flex items-center justify-center gap-1.5 cursor-pointer"
                                        >
                                            <ArrowLeft className="w-4 h-4" />
                                            <span>Back</span>
                                        </button>

                                        <button
                                            type="submit"
                                            className="col-span-2 py-3.5 bg-gradient-to-r from-[#D4AF37] via-[#F5E6A3] to-[#eab308] hover:shadow-[0_0_20px_rgba(212,175,55,0.35)] text-[#0d0d0d] font-bold rounded-xl uppercase tracking-wider text-[11px] transition-all duration-300 transform active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer"
                                        >
                                            <span>Complete Registration</span>
                                            <Send className="w-4 h-4 text-[#0d0d0d]" />
                                        </button>
                                    </div>

                                </div>
                            )}
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}
