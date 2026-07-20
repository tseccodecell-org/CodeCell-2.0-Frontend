"use client";

import React, { useState,useEffect } from "react";
import {
    Mail, Lock, User, School, Calendar, BookOpen, MapPin,
    ArrowRight, ArrowLeft, Send, CheckCircle2, AlertTriangle
} from "lucide-react";
import { signIn,useSession } from "next-auth/react";

export function RegistrationForm() {
    const { data:session , status } = useSession();
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
        } else if (formData.fullName.trim().length < 3) {
            stepErrors.fullName = "Please enter your full name";
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

        try {
            const response = await fetch("/api/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    collegeName: formData.collegeName,
                    course: formData.course,
                    yearOfStudy: formData.yearOfStudy,
                    location: formData.location,
                }),
            });

            if (response.status === 409) {
                const data = await response.json();
                setSubmitError(data.error);
                return;
            }


            if (!response.ok) {
                throw new Error("Registration failed");
            }

            setIsRegistered(true);
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    useEffect(() => {
    if (status === "authenticated") {
        setActiveStep(2);

        setFormData((prev) => ({
            ...prev,
            fullName: session?.user?.name ?? "",
        }));
    }
}, [status, session]);

    return (
        <div className="w-full max-w-xl mx-auto pt-2 pb-12 px-4">
            <div className="relative bg-zinc-950/85 border border-zinc-900 rounded-3xl p-6 md:p-8 shadow-2xl overflow-hidden shadow-gold-glow/5">

                {/* Form Header */}
                <div className="relative flex items-center justify-between border-b border-zinc-900 pb-5 mb-6">
                    <div>
                        <span className="text-[10px] font-bold tracking-widest text-gold-primary uppercase block mb-1">
                            Event Pass Portal
                        </span>
                        <h2 className="font-serif text-xl md:text-2xl font-medium text-white tracking-tight uppercase">
                            {isRegistered ? "Registration Approved" : "Sign Up"}
                        </h2>
                    </div>

                    {/* Clean numeric page tabs */}
                    {!isRegistered && (
                        <div className="flex items-center space-x-1 text-xs">
                            <span className={`px-2.5 py-0.5 rounded-full ${activeStep === 1
                                ? "bg-gold-primary text-black font-semibold"
                                : "bg-zinc-900 text-zinc-550 border border-zinc-950"
                                }`}>
                                Step 1
                            </span>
                            <span className="text-zinc-700">/</span>
                            <span className={`px-2.5 py-0.5 rounded-full ${activeStep === 2
                                ? "bg-gold-primary text-black font-semibold"
                                : "bg-zinc-900 text-zinc-550 border border-zinc-950"
                                }`}>
                                Step 2
                            </span>
                        </div>
                    )}
                </div>

                {/* Elegant sleek spinner loader */}
                {isSubmitting && (
                    <div className="absolute inset-0 bg-black/90 backdrop-blur-md z-50 flex flex-col items-center justify-center space-y-4">
                        <div className="w-10 h-10 border-[3px] border-zinc-800 border-t-gold-primary rounded-full animate-spin" />
                        <p className="text-xs text-zinc-400 font-medium tracking-wide">
                            Please wait...
                        </p>
                    </div>
                )}

                {/* Success layout */}
                {isRegistered ? (
                    <div className="py-6 flex flex-col items-center text-center space-y-6">
                        <div className="relative">
                            <div className="absolute -inset-1.5 rounded-full bg-gold-primary/10 blur-sm opacity-60" />
                            <CheckCircle2 className="w-16 h-16 text-gold-bright relative z-10" />
                        </div>

                        <div className="space-y-2 max-w-sm">
                            <h3 className="font-serif text-xl font-medium text-white">Registration Complete</h3>
                            <p className="text-xs text-zinc-450 leading-relaxed font-medium">
                                We've successfully registered your details for the weekly challenges. Access has been provisioned to: <br />
                                <span className="text-gold-bright font-bold"></span>
                            </p>
                        </div>

                        {/* Clean receipt details */}
                        <div className="w-full bg-zinc-900/40 border border-zinc-900 rounded-2xl p-5 text-left text-xs text-zinc-400 space-y-3.5">
                            <div className="flex items-center justify-between text-[11px] text-zinc-500 border-b border-zinc-900 pb-2">
                                <span className="uppercase font-bold tracking-wider">Pass Receipt</span>
                                <span className="text-gold-primary font-bold">APPROVED</span>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <span className="text-[10px] text-zinc-500 block">Name</span>
                                    <span className="font-semibold text-zinc-200">{formData.fullName}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-zinc-550 block">Affiliation</span>
                                    <span className="font-semibold text-zinc-200">{formData.collegeName}</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-1">
                                <div>
                                    <span className="text-[10px] text-zinc-550 block">Specialization</span>
                                    <span className="font-semibold text-zinc-200">{formData.course}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-zinc-550 block">Academic Stage</span>
                                    <span className="font-semibold text-zinc-200">{formData.yearOfStudy} Year</span>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4 pt-1">
                                <div>
                                    <span className="text-[10px] text-zinc-550 block">Location</span>
                                    <span className="font-semibold text-zinc-200">{formData.location}</span>
                                </div>
                                <div>
                                    <span className="text-[10px] text-zinc-550 block">Security Status</span>
                                    <span className="font-semibold text-gold-bright">VERIFIED PLATINUM</span>
                                </div>
                            </div>
                        </div>

                        <div className="pt-2">
                            <button
                                onClick={() => {
                                    setFormData({
                                        fullName: "",
                                        collegeName: "",
                                        yearOfStudy: "",
                                        course: "",
                                        location: "",
                                    });
                                    setActiveStep(1);
                                    setIsRegistered(false);
                                }}
                                className="px-6 py-2.5 bg-zinc-900 border border-zinc-805 text-zinc-300 font-medium text-xs rounded-xl uppercase tracking-wider hover:bg-zinc-850 hover:text-white transition duration-300 cursor-pointer"
                            >
                                Create New Registration
                            </button>
                        </div>
                    </div>
                ) : (
                    // Form Steps
                    <form onSubmit={handleSubmit}>

                        {/* STEP 1: ACCOUNT CREDENTIALS */}
                        {activeStep === 1 && (
                            <div className="flex flex-col items-center text-center py-8 space-y-8">

                                <div className="space-y-3 max-w-sm">
                                    <h3 className="font-serif text-2xl text-white font-medium tracking-tight">
                                        Sign in to Continue
                                    </h3>

                                    <p className="text-sm text-zinc-400 leading-relaxed">
                                        Use your Google account to verify your identity before
                                        completing the registration form.
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        signIn("google", {
                                            callbackUrl: "/register",
                                        })
                                    }
                                    className="w-full max-w-sm flex items-center justify-center gap-3 rounded-xl border border-zinc-800 bg-zinc-950 hover:border-gold-primary/50 hover:bg-zinc-900 py-3 px-5 transition-all duration-300 shadow-[0_4px_20px_rgba(212,175,55,0.08)] cursor-pointer"
                                >
                                    {/* Google Logo */}
                                    <svg
                                        className="w-5 h-5"
                                        viewBox="0 0 48 48"
                                    >
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

                                    <span className="text-sm font-medium text-zinc-200 tracking-wide">
                                        Continue with Google
                                    </span>
                                </button>

                                <p className="text-[11px] text-zinc-600 max-w-xs leading-relaxed">
                                    Only Google accounts are accepted for participant registration.
                                </p>

                            </div>
                        )}

                        {/* STEP 2: PROFILE DETAILS */}
                        {activeStep === 2 && (
                            <div className="space-y-4">

                                {/* FULL NAME INPUT */}
                                <div className="relative">
                                    <label className="text-xs font-semibold text-zinc-400 block mb-1.5 flex items-center justify-between">
                                        <span>Full name</span>
                                        {errors.fullName && (
                                            <span className="text-red-400 flex items-center font-bold text-[10px]">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {errors.fullName}
                                            </span>
                                        )}
                                    </label>

                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === "fullName" ? "text-gold-bright" : "text-zinc-650"}`} />
                                        </div>
                                        <input
                                            type="text"
                                            name="fullName"
                                            value={formData.fullName}
                                            readOnly
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField("fullName")}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="Enter full name"
                                            className={`w-full bg-zinc-950 border ${errors.fullName
                                                ? "border-red-500/30 focus:border-red-500"
                                                : focusedField === "fullName"
                                                    ? "border-gold-bright shadow-[0_0_12px_rgba(245,211,130,0.15)]"
                                                    : "border-zinc-900"
                                                } rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all duration-300`}
                                        />
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {/* COLLEGE NAME INPUT */}
                                    <div className="relative">
                                        <label className="text-xs font-semibold text-zinc-400 block mb-1.5 flex items-center justify-between">
                                            <span>College name</span>
                                            {errors.collegeName && (
                                                <span className="text-red-400 flex items-center font-bold text-[10px]">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    {errors.collegeName}
                                                </span>
                                            )}
                                        </label>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <School className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === "collegeName" ? "text-gold-bright" : "text-zinc-650"}`} />
                                            </div>
                                            <input
                                                type="text"
                                                name="collegeName"
                                                value={formData.collegeName}
                                                onChange={handleInputChange}
                                                onFocus={() => setFocusedField("collegeName")}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="Your college / university"
                                                className={`w-full bg-zinc-950 border ${errors.collegeName
                                                    ? "border-red-500/30 focus:border-red-500"
                                                    : focusedField === "collegeName"
                                                        ? "border-gold-bright shadow-[0_0_12px_rgba(245,211,130,0.15)]"
                                                        : "border-zinc-900"
                                                    } rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all duration-300`}
                                            />
                                        </div>
                                    </div>

                                    {/* COURSE / PATH INPUT */}
                                    <div className="relative">
                                        <label className="text-xs font-semibold text-zinc-400 block mb-1.5 flex items-center justify-between">
                                            <span>Course</span>
                                            {errors.course && (
                                                <span className="text-red-400 flex items-center font-bold text-[10px]">
                                                    <AlertTriangle className="w-3 h-3 mr-1" />
                                                    {errors.course}
                                                </span>
                                            )}
                                        </label>

                                        <div className="relative">
                                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                                <BookOpen className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === "course" ? "text-gold-bright" : "text-zinc-650"}`} />
                                            </div>
                                            <input
                                                type="text"
                                                name="course"
                                                value={formData.course}
                                                onChange={handleInputChange}
                                                onFocus={() => setFocusedField("course")}
                                                onBlur={() => setFocusedField(null)}
                                                placeholder="Field of study"
                                                className={`w-full bg-zinc-950 border ${errors.course
                                                    ? "border-red-500/30 focus:border-red-500"
                                                    : focusedField === "course"
                                                        ? "border-gold-bright shadow-[0_0_12px_rgba(245,211,130,0.15)]"
                                                        : "border-zinc-900"
                                                    } rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all duration-300`}
                                            />
                                        </div>
                                    </div>
                                </div>

                                {/* YEAR OF STUDY SELECTOR (Custom buttons grid) */}
                                <div className="relative">
                                    <label className="text-xs font-semibold text-zinc-400 block mb-2 flex items-center justify-between">
                                        <span>Year of study</span>
                                        {errors.yearOfStudy && (
                                            <span className="text-red-400 flex items-center font-bold text-[10px]">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {errors.yearOfStudy}
                                            </span>
                                        )}
                                    </label>

                                    <div className="grid grid-cols-5 gap-2">
                                        {["1st", "2nd", "3rd", "4th", "Other"].map((yr) => {
                                            const isSelected = formData.yearOfStudy === yr;
                                            return (
                                                <button
                                                    key={yr}
                                                    type="button"
                                                    onClick={() => selectYearOfStudy(yr)}
                                                    className={`py-2 rounded-xl text-xs font-semibold tracking-wide transition-all duration-300 border cursor-pointer ${isSelected
                                                        ? "bg-gold-primary border-gold-primary text-black shadow-[0_4px_12px_rgba(212,175,55,0.2)]"
                                                        : "bg-zinc-950 border-zinc-900 hover:border-zinc-700 text-zinc-500 hover:text-zinc-300"
                                                        }`}
                                                >
                                                    {yr}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>

                                {/* LOCATION NODE WITH SUGGESTIONS CHIPS */}
                                <div className="relative">
                                    <label className="text-xs font-semibold text-zinc-400 block mb-1.5 flex items-center justify-between">
                                        <span>Location / Region</span>
                                        {errors.location && (
                                            <span className="text-red-400 flex items-center font-bold text-[10px]">
                                                <AlertTriangle className="w-3 h-3 mr-1" />
                                                {errors.location}
                                            </span>
                                        )}
                                    </label>

                                    <div className="relative mb-2">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin className={`w-4.5 h-4.5 transition-colors duration-200 ${focusedField === "location" ? "text-gold-bright" : "text-zinc-650"}`} />
                                        </div>
                                        <input
                                            type="text"
                                            name="location"
                                            value={formData.location}
                                            onChange={handleInputChange}
                                            onFocus={() => setFocusedField("location")}
                                            onBlur={() => setFocusedField(null)}
                                            placeholder="E.g. San Francisco, USA"
                                            className={`w-full bg-zinc-950 border ${errors.location
                                                ? "border-red-500/30 focus:border-red-500"
                                                : focusedField === "location"
                                                    ? "border-gold-bright shadow-[0_0_12px_rgba(245,211,130,0.15)]"
                                                    : "border-zinc-900"
                                                } rounded-xl py-2 pl-9 pr-4 text-xs text-zinc-200 placeholder-zinc-700 focus:outline-none transition-all duration-300`}
                                        />
                                    </div>

                                </div>

                                {submitError && (
                                    <div className="rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="w-4 h-4 shrink-0" />
                                            <span>{submitError}</span>
                                        </div>
                                    </div>
                                )}
                                
                                {/* Buttons Navigation */}
                                <div className="grid grid-cols-3 gap-3 pt-4">
                                    <button
                                        type="button"
                                        onClick={() => setActiveStep(1)}
                                        className="col-span-1 py-3 bg-zinc-950 hover:bg-zinc-900 border border-zinc-900 text-zinc-400 hover:text-zinc-200 font-semibold rounded-xl text-xs transition duration-300 flex items-center justify-center space-x-1 cursor-pointer"
                                    >
                                        <ArrowLeft className="w-4 h-4" />
                                        <span className="hidden md:inline">Back</span>
                                    </button>

                                    <button
                                        type="submit"
                                        className="col-span-2 py-3 bg-gradient-to-r from-gold-primary to-gold-bright hover:opacity-95 text-black font-bold rounded-xl uppercase tracking-wider text-[11px] transition-all duration-300 shadow-[0_4px_15px_rgba(212,175,55,0.15)] flex items-center justify-center space-x-2 cursor-pointer"
                                    >
                                        <span>Complete Registration</span>
                                        <Send className="w-4 h-4 text-black" />
                                    </button>
                                </div>
                            </div>
                        )}
                    </form>
                )}
            </div>
        </div>
    );
}
