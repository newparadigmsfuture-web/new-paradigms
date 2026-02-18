import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      <div className="hidden md:flex md:w-1/2 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-12 flex-col justify-between">
        <Link href="/" className="flex items-center gap-2">
          <GraduationCap className="h-8 w-8 text-green-500" />
          <span className="text-xl font-bold text-white">New Paradigms</span>
        </Link>
        <div>
          <h1 className="text-4xl font-bold text-white mb-4">
            Empower Your Bitcoin Education Journey
          </h1>
          <p className="text-gray-300">
            Join the platform trusted by Bitcoin educators worldwide to manage
            appointments, track performance, and grow their impact.
          </p>
        </div>
        <p className="text-gray-500 text-sm">
          New Paradigms - Bitcoin Education Platform
        </p>
      </div>
      <div className="flex-1 flex items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-md">
          <div className="md:hidden flex items-center justify-center gap-2 mb-8">
            <GraduationCap className="h-8 w-8 text-green-500" />
            <span className="text-xl font-bold">New Paradigms</span>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
