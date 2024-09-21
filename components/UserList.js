import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { auth, firestore } from '@/firebase/firebase';
import { collection, getDocs } from 'firebase/firestore';
import { useAuthState } from 'react-firebase-hooks/auth';

export default function UserList() {
    const [user, loading, error] = useAuthState(auth);

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const router = useRouter();


    const fetchUsers = async () => {
        const userInboxRef = collection(firestore, `users/${user.uid}/inbox_metadata`)
        const snapshot = await getDocs(userInboxRef)
        let userlist = []
        snapshot.forEach((doc) => {
            // const decodedUser = decodeUsername(doc.id)
            userlist.push(doc.id)
        })
        setUsers(userlist);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user =>
        user.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleUserClick = (username) => {
        router.push(`/analysis/${username}`);
    };


    return (
        <div className="w-full mt-10 flex flex-col items-center space-y-6">
        <div className="relative w-full max-w-lg">
            <input
            type="text"
            placeholder="Search for a user..."
            className="w-full p-4 pl-10 text-black bg-white rounded-full shadow-lg focus:outline-none focus:ring-2 focus:ring-pink-300"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            />
            <svg
            className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-pink-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-4.35-4.35m2.6-6.65a7 7 0 11-14 0 7 7 0 0114 0z"
            ></path>
            </svg>
        </div>

        <ul className="w-full max-w-lg bg-white text-pink-500 rounded-lg shadow-lg p-6 space-y-4 mx-auto">
            {filteredUsers.length > 0 ? (
            filteredUsers.map((user, index) => (
                <li
                key={index}
                className="cursor-pointer p-4 bg-pink-100 rounded-lg hover:bg-pink-200 transition duration-200"
                onClick={() => handleUserClick(user)}
                >
                {user}
                </li>
            ))
            ) : (
            <li className="p-4 text-gray-500">No users found</li>
            )}
        </ul>
        </div>
    );
};
