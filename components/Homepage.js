import React, { useCallback, useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import JSZip from 'jszip';
import { auth, googleProvider, firestore, storage } from "../firebase/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { signInWithPopup, signOut } from "firebase/auth";
import { useRouter } from "next/navigation";
import { collection, query, getDocs, getDoc, setDoc, doc, deleteDoc } from "firebase/firestore";
import { ref, uploadString, getDownloadURL, getBytes } from "firebase/storage";
import UserList from './UserList';
import Spinner from './Spinner';

export default function Hompeage() { 

    const [users, setUsers] = useState([]);
    const [showUserList, setShowUserList] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const router = useRouter()

    const handleSignOut = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.log(error);
        }
        router.push("/");
    };

    const [user] = useAuthState(auth);

    function decodeUsername(encodedStr) {
        try {
            const decoder = new TextDecoder('utf-8');
            const bytes = new Uint8Array(encodedStr.split('').map(char => char.charCodeAt(0)));
            return decoder.decode(bytes);
        } catch (e) {
            console.error('Failed to decode string:', e);
            return encodedStr;
        }
    }

    const onDrop = async (acceptedFiles) => {
        setIsLoading(true)
        const zip = new JSZip();
        const file = acceptedFiles[0];
    
        try {
            const zipContent = await zip.loadAsync(file);
            const usernames = [];
            const messagesMap = new Map();
    
            for (const relativePath in zipContent.files) {
                if (relativePath.endsWith('.json') && relativePath.includes('/messages/inbox/')) {
                    const fileData = await zipContent.files[relativePath].async('string');
                    const json = JSON.parse(fileData);
                    console.log('json', json);
    
                    const title = decodeUsername(json.title);
                    const messages = json.messages || [];
    
                    if (!messagesMap.has(title)) {
                        // If no existing data, add the new messages
                        messagesMap.set(title, { messages });
                    } else {
                        // If data exists, append the new messages to the existing ones
                        const existingData = messagesMap.get(title);
                        existingData.messages.push(...messages);
                        messagesMap.set(title, existingData);
                    }
                }
            }
    
            for (const [title, data] of messagesMap.entries()) {
                const jsonString = JSON.stringify({ title, messages: data.messages });
    
                // Create a reference to the file in Firebase Storage
                const storageRef = ref(storage, `users/${user.uid}/inbox/${title}.json`);
    
                // Upload the JSON string to Firebase Storage
                await uploadString(storageRef, jsonString);
    
                // Store metadata or reference to the JSON file in Firestore
                const docRef = doc(firestore, `users/${user.uid}/inbox_metadata/${title}`);
                await setDoc(docRef, {
                    storagePath: `users/${user.uid}/inbox/${title}.json`,
                    size: jsonString.length,
                    uploadedAt: new Date(),
                });
    
                if (!usernames.includes(title)) {
                    usernames.push(title);
                }
            }
    
            console.log('usernames: ' + usernames);
            setUsers(usernames);
            setShowUserList(true);
        } catch (error) {
            console.error('Failed to process zip file:', error);
        } finally {
            setIsLoading(false)
        }
    };


    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: '.zip',
    });

    return (
        <div className="min-h-screen bg-gradient-to-r from-pink-500 via-pink-400 to-purple-400 text-white flex flex-col items-center">
        <nav className="w-full py-6 px-10 flex justify-between items-center">
            <div className="flex items-center space-x-2">
            <img src="kupl-plain.png" alt="Kupl Logo" className="h-10" />
            <span className="text-2xl font-bold">kupl</span>
            </div>
            <ul className="flex space-x-8">
            <li className="hover:text-gray-300 cursor-pointer\" onClick={handleSignOut}>sign out</li>
            </ul>
        </nav>

        <main className="flex-grow flex flex-col justify-center items-center text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">welcome, {user.displayName.toLowerCase()}</h1>
            <p className="text-lg md:text-2xl mb-10 max-w-xl">
            drop your zip file below to upload your dms.
            </p>

            {isLoading ? (
                <Spinner />
            ) : (
                <>
                <div {...getRootProps()} className={`w-full max-w-lg p-8 rounded-lg shadow-lg ${isDragActive ? 'bg-pink-600' : 'bg-white'} text-pink-500 border-4 border-dashed border-gray-200 hover:border-gray-400 transition duration-300`}>
                <input {...getInputProps()} />
                {
                    isDragActive ?
                    <p className="text-center">drop the zip file here...</p> :
                    <p className="text-center">drag and drop your <strong>your_instagram_activity.zip</strong> file here, or click to select</p>
                }
                </div>
                <p className='text-md mt-4 w-1/4'>Instructions: On Instagram, go to Settings {'>'} Account Center {'>'} Your information and permissions {'>'} Download your information {'>'} Download or transfer information {'>'} Some of your information. Select "Messages" and click Next. Select Download to device and click Next. Set "Format" to JSON. Click "Create Files". You will recieve an email once it is downloaded, and you can upload the zip file here.  </p>

                <UserList users={users} />
                </>
            )}


            
        </main>

        

        <footer className="py-6">
            <p className="text-gray-300">&copy; 2024 kupl. all rights reserved.</p>
        </footer>
        </div>
    );
};
