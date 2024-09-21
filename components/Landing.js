'use client'
import { useRouter } from "next/navigation";

export default function Landing() {

    const router = useRouter();

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-400 via-pink-600 to-purple-600 text-white flex flex-col items-center">

        <main className="flex-grow flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">welcome to kupl</h1>
            <p className="text-lg md:text-2xl mb-10 max-w-xl">
            upload your dms. understand your relationship.
            </p>
            <button className="bg-white text-pink-500 font-semibold py-2 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300" onClick={() => router.push('/home')}>
            get started
            </button>
            <p className="text-md mt-2">or <span className="underline cursor-pointer" onClick={() => router.push('/home')}>log in</span></p>
        </main>

        <div className="flex justify-center items-center flex-col">
            <p className="text-gray-200 mb-2 text-2xl">how it works</p>
            <div className="animate-bounce">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
            </svg>
            </div>
        </div>

        <footer className="py-6">
            <p className="text-gray-300">&copy; 2024 kupl. all rights reserved.</p>
        </footer>
        </div>
    );
}