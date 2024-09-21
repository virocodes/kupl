'use client'
import { useAuthState } from "react-firebase-hooks/auth";
import { auth, googleProvider, firestore } from "@/firebase/firebase";
import Auth from "@/components/Auth";
import Homepage from "@/components/Homepage";

export default function Home() {
    const [user, loading, error] = useAuthState(auth);

    if (loading) {
        return "Loading..."
    } else if (!user) {
        return (
            <Auth />
        )
    } else {
        return (
            <Homepage />
        )
    }
}