import React, { useState, useEffect } from 'react';
import { OpenAI } from 'openai';
import Spinner from './Spinner';
import ReactMarkdown from 'react-markdown'; 

require('dotenv').config()
const openai = new OpenAI({apiKey: process.env.NEXT_PUBLIC_OPENAI_KEY, dangerouslyAllowBrowser: true});

const Analysis = ({user1, user2}) => {
    const [isLoading, setIsLoading] = useState(false);
    const [topWords, setTopWords] = useState({});

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


    async function fetchMessagesJson(userId, chatId) {
        try {
          const response = await fetch(`/api/fetchMessages?userId=${userId}&chatId=${chatId}`);
          const data = await response.json();
      
          if (response.ok) {
            return data.messages;
          } else {
            console.error('Error fetching messages:', data.error);
            return [];
          }
        } catch (error) {
          console.error('Fetch failed:', error);
          return [];
        }
      }

    const [user_handle, setuser_handle] = useState('')

    function getWordFrequency(messages) {
        const wordCount = {};

        const ignorePhrases = [
            "sent an attachment",
            "liked a message",
            "reacted",
        ];
    
        messages.forEach(message => {
            let { sender_name, content } = message;
            sender_name = decodeUsername(sender_name)

            // Check if the content contains any of the ignore phrases
            if (content && ignorePhrases.some(phrase => content.toLowerCase().includes(phrase))) {
                return; // Skip this iteration if content contains an ignore phrase
            }
            
            if (!user_handle && sender_name != user2) {
                setuser_handle(sender_name)
            }
            if (content) {
                const words = content.split(/\s+/); // Split content into words
                words.forEach(word => {
                    const cleanedWord = word.toLowerCase().replace(/[^\w]/g, ''); // Clean word
                    if (!wordCount[sender_name]) {
                        wordCount[sender_name] = {};
                    }
                    if (cleanedWord) {
                        wordCount[sender_name][cleanedWord] = (wordCount[sender_name][cleanedWord] || 0) + 1;
                    }
                });
            }
        });
        return wordCount;
    }

    function getTopWords(wordCount, topN = 5) {
        const topWords = {};
    
        for (const sender in wordCount) {
            const sortedWords = Object.entries(wordCount[sender])
                .sort(([, a], [, b]) => b - a) // Sort words by frequency
                .slice(0, topN); // Get top N words
            topWords[sender] = sortedWords;
        }
        console.log(topWords)
        return topWords;
    }

    async function analyzeFreq() {
        
        try {
            const messages = await fetchMessagesJson(user1.uid, user2)
            const wordCount = getWordFrequency(messages)
            const topWordsData = getTopWords(wordCount)
            setTopWords({ ...topWordsData })
            console.log('topWordsdharshan', topWords['dharshan'])
        } catch(err) {
            console.log(err)
        } 
    }

    async function analyze() {
        setIsLoading(true)
        analyzeFreq()
        await generateSummary()
        setIsLoading(false)
    }

    async function retrieveSavedAnalysis() {
        //
    }
    
    useEffect(() => {
        analyze()
    }, [])
    
    const [summary, setSummary] = useState({})

    async function generateSummary() {
        const messagesjson = await fetchMessagesJson(user1.uid, user2)
        const messages = JSON.stringify(messagesjson) 
        const prompt = `Analyze the following Instagram direct messages between ${user_handle} and ${user2}: ${messages.slice(-200000)}. Based on this conversation, first determine the title you would put on their relationship (platonic, romantic, or just acquantiances, etc), then provide a comprehensive summary of their relationship dynamics. Highlight both the positive and challenging aspects of their interactions, paying attention to patterns in communication, emotional tone, and the balance of conversation. Offer insights into the strengths and potential areas of tension in their relationship. Make sure not to be overly positive, make sure you give a truthful analysis, even if you need to go into uncomfortable topics. Make it concise and easy to understand. Also provide a relationship score from 1 - 100 based on how close they seem to be in their relationship. Return the information in the following JSON format: {"title": "title", "summary": "summary", "score": score (int)}. Make sure not to add any extra information/formatting to the JSON - it should be a raw JSON object that can be parsed and used in the frontend. It is VERY IMPORTANT you do not add any extra formatting, such as triple backticks, new lines, etc.`;
        setSummary('Generating...')
        try {
          const response = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: [{ role: "user", content: prompt }],
          });
      
          const genSummary = response.choices[0].message.content;
          console.log("Summary:", genSummary);
          setSummary(JSON.parse(genSummary));
        } catch (error) {
          console.error("Error generating recipe:", error);
          return null;
        }
    }

    return (
        <div className="bg-transparent p-8 mt-8 max-w-5xl mx-auto flex flex-col justify-center items-center">
        
        {isLoading || !topWords[user_handle] ? (
            <Spinner />
        ) : (
            <>
            <div className="flex flex-col md:flex-row gap-4 justify-between mb-12 w-full">
                <div className="w-1/2 pr-4 w-full md:w-1/2">
                <h2 className="text-4xl font-semibold text-pink-100 mb-1">top words</h2>
                <h3 className="text-2xl font-semibold text-pink-200 mb-6">you</h3>
                {topWords[user_handle].map((data, index) => (
                    <div key={index} className="mb-4">
                        <div className="flex justify-between">
                            <span className="text-2xl font-semibold text-pink-200">{data[0].toLowerCase()}</span>
                            <span className="text-2xl font-semibold text-white">{data[1]}</span>
                        </div>
                        <div className="w-full bg-pink-300 rounded-full h-6 mt-1">
                            <div 
                            className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 h-6 rounded-full shadow-lg" 
                            style={{ width: `${(data[1] / topWords[user_handle][0][1]) * 100}%` }}
                            />
                        </div>
                    </div>
                ))}
                </div>


                <div className="w-1/2 pl-4 w-full md:w-1/2">
                <h2 className="text-4xl font-semibold text-purple-100 mb-1">top words</h2>
                <h3 className="text-2xl font-semibold text-purple-200 mb-6">{user2}</h3>
                {topWords[user2].map((data, index) => (
                    <div key={index} className="mb-4">
                    <div className="flex justify-between">
                        <span className="text-2xl font-semibold text-purple-200">{data[0].toLowerCase()}</span>
                        <span className="text-2xl font-semibold text-white">{data[1]}</span>
                    </div>
                    <div className="w-full bg-purple-300 rounded-full h-6 mt-1">
                        <div 
                        className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-400 h-6 rounded-full shadow-lg" 
                        style={{ width: `${(data[1] / topWords[user2][0][1]) * 100}%` }}
                        />
                    </div>
                    </div>
                ))}
                </div>
            </div>

            <div className="mb-12 flex flex-col items-center">
                <h2 className="text-3xl font-semibold text-white mb-6">Relationship Summary</h2>
                <h1 className='text-2xl font-semibold text-white'>{summary['title']}</h1>
                <div className="mb-4 w-4/5 flex flex-col items-center my-4">
                    <div>
                        <span className="text-2xl font-semibold text-pink-200">kupl score: {summary['score']}%</span>
                    </div>
                    <div className="w-full bg-pink-300 rounded-full h-6 mt-2">
                        <div 
                        className="bg-gradient-to-r from-indigo-400 via-purple-500 to-pink-500 h-6 rounded-full shadow-lg" 
                        style={{ width: `${summary['score']}%` }}
                        />
                    </div>
                </div>
                <p className="text-lg text-white leading-relaxed mt-4">
                    <ReactMarkdown>{summary['summary']}</ReactMarkdown>
                </p>
                
            </div>

            <div className="bg-transparent border border-white rounded-3xl p-6 shadow-inner">
                <h2 className="text-3xl font-semibold text-white mb-6">Relationship Therapist (COMING SOON)</h2>
                <div className="h-48 overflow-y-auto bg-white/70 p-4 mb-4 rounded-xl border border-gray-200 shadow-lg">
                <p className="text-lg text-gray-800"><strong className="text-pink-500">Therapist:</strong> Hi! How can I assist you with your relationship today?</p>
                <p className="text-lg text-gray-800 mt-2"><strong className="text-gray-800">User:</strong> I'm feeling a bit uncertain about some things...</p>
                </div>
                <div className="flex">
                <input 
                    type="text" 
                    className="flex-grow p-3 rounded-l-full border border-white focus:outline-none text-lg text-gray-800 bg-white/70" 
                    placeholder="Type your message..." 
                />
                <button className="bg-pink-500 text-white px-6 py-3 rounded-r-full hover:bg-pink-600 transition duration-300">
                    Send
                </button>
                </div>
            </div>
            </>
        )}

        </div>
    );
};

export default Analysis;
