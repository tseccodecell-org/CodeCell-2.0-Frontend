import { CyberGrid } from "@/components/layout/CyberGrid";
import RegistrationPage from "@/components/sections/RegistrationPage";

export const metadata = {
    title: "Weekly Challenges Registration",
    description: "Register for the weekly strategic challenge events.",
};

export default function RegisterPage() {
    return (
        <main className="relative min-h-screen flex flex-col justify-between overflow-x-hidden bg-black font-sans">
            <CyberGrid />
            <RegistrationPage />
        </main>
    );
}
