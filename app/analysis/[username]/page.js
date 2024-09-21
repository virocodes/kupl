'use client'
import { useParams, useRouter } from "next/navigation";
import { signOut } from "firebase/auth";
import { auth } from '@/firebase/firebase';
import React, { useState,useEffect } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import Analysis from "@/components/Analysis";

export default function AnalysisPage() {
    const [user, loading] = useAuthState(auth)
    const router = useRouter()
    const { username } = useParams();
    const decodedUser = decodeURIComponent(username)

    const [clicked, setClicked] = useState(false);

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        }
        router.push("/");
    };

    if (loading) {
        return <div class="flex justify-center"><h1>Loading...</h1></div>
      }

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-400 via-pink-600 to-purple-600 text-white flex flex-col items-center">
        <nav className="w-full py-6 px-10 flex justify-between items-center">
            <div className="flex items-center space-x-2">
            <img src="../kupl-plain.png" alt="Kupl Logo" className="h-10" />
            <span className="text-2xl font-bold">kupl</span>
            </div>
            <ul className="flex space-x-8">
            <li className="hover:text-gray-300 cursor-pointer\" onClick={handleSignOut}>sign out</li>
            </ul>
        </nav>

        <main className="flex-grow flex flex-col justify-center items-center text-center">
            <button
                onClick={() => router.push('/home')}
                className="absolute top-10 flex items-center space-x-2 text-white hover:text-gray-300"
            >
                <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M15 19l-7-7 7-7"
                    />
                </svg>
                <span>Back</span>
            </button>

            <h1 className="text-4xl md:text-6xl font-bold mb-6">analyze your dms with {decodedUser}</h1>
            {!clicked && <button className="bg-white text-pink-500 font-semibold py-2 px-8 rounded-full shadow-lg hover:bg-gray-100 transition duration-300" onClick={() => setClicked(true)}>
            get analysis
            </button>}
        </main>

        {clicked && <Analysis user1={user} user2={decodedUser} />}
        
        

        <footer className="py-6">
            <p className="text-gray-300">&copy; 2024 kupl. all rights reserved.</p>
        </footer>
        </div>
    )
}