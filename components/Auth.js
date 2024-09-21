'use client'
import { useAuthState } from "react-firebase-hooks/auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { auth, googleProvider, firestore } from "../firebase/firebase";
import { signInWithPopup, signOut } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

export default function Auth() {
    const [user, loading, error] = useAuthState(auth);
    const router = useRouter();

    const handleSignIn = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            const userRef = doc(firestore, 'users', user.uid);
            await setDoc(userRef, {
                uid: user.uid,
                email: user.email, 
                displayName: user.displayName,
            }, { merge: true });
            
            router.push("/home");
        } catch (error) {
            console.log(error);
        }
    };



    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-500 via-pink-400 to-purple-400 text-white flex flex-col items-center justify-center">
            <div className="bg-white text-pink-500 rounded-lg shadow-lg p-8 max-w-sm w-full text-center">
            <h1 className="text-3xl font-bold mb-6">Sign In to Kupl</h1>
            <button
                onClick={handleSignIn}
                className="flex items-center justify-center bg-pink-500 text-white py-2 px-4 rounded-full shadow hover:bg-pink-600 transition duration-300 w-full"
            >
                <svg
                className="w-6 h-6 mr-2"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 48 48"
                width="48px"
                height="48px"
                >
                <path
                    fill="#4285F4"
                    d="M24 9.5c1.93 0 3.68.67 5.07 1.79l3.78-3.78C30.68 5.6 27.54 4 24 4 17.66 4 12.19 7.95 9.92 13.34l4.54 3.52C15.59 12.7 19.47 9.5 24 9.5z"
                />
                <path
                    fill="#34A853"
                    d="M24 44c5.91 0 10.88-2.16 14.52-5.67l-4.73-3.98C31.96 37.8 28.24 39.5 24 39.5c-4.72 0-8.69-2.98-10.31-7.15l-4.61 3.55C12.11 40.85 17.61 44 24 44z"
                />
                <path
                    fill="#FBBC05"
                    d="M43.54 20H24v8.5h11.15c-1.47 4.25-5.54 7-11.15 7-6.86 0-12.48-5.5-12.48-12.5S17.14 10.5 24 10.5c3.15 0 5.82 1.07 7.98 2.83l5.89-5.89C34.15 3.85 29.36 2 24 2 12.95 2 4 10.95 4 22s8.95 20 20 20c11.41 0 19.96-8.27 19.96-20 0-1.34-.14-2.64-.42-3.91L43.54 20z"
                />
                <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                Sign in with Google
            </button>
            </div>
        </div>
    )

}