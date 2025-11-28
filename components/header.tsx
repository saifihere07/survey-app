import Link from "next/link";
import AuthButtons from "./auth-buttons";
import { auth } from "@/auth";

export default async function Header() {
  const session = await auth();
  return (
    <>
      <header className="border-b bg-white/50 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-linear-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">S</span>
            </div>
            <span className="font-bold text-xl">SurveyPro</span>
          </Link>

          <nav className="hidden md:flex items-center space-x-8">
            <Link
              href="#"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Features
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="#"
              className="text-sm font-medium hover:text-blue-600 transition-colors"
            >
              About
            </Link>
          </nav>

          <AuthButtons session={session} />
        </div>
      </header>
    </>
  );
}
