import { NextResponse } from 'next/server';
import { ref, getDownloadURL } from 'firebase/storage';
import { storage } from '@/firebase/firebase';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const userId = searchParams.get('userId');
  const chatId = searchParams.get('chatId');

  if (!userId || !chatId) {
    return NextResponse.json({ error: 'Missing userId or chatId' }, { status: 400 });
  }

  const fileRef = ref(storage, `users/${userId}/inbox/${chatId}.json`);

  try {
    const url = await getDownloadURL(fileRef);
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json({ messages: data.messages });
  } catch (error) {
    console.error("Failed to fetch messages:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}