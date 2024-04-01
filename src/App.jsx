import { useState, useEffect, useRef } from 'react';

import { 
  GoogleAuthProvider, 
  onAuthStateChanged, 
  signInWithPopup 
} from 'firebase/auth';

import { 
  getFirestore, 
  onSnapshot, 
  collection, 
  addDoc, 
  orderBy, 
  query, 
  serverTimestamp 
} from 'firebase/firestore';

import { auth, app } from '../firebase';

const db = getFirestore(app);

function App() {

  const [user, setUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef(null);

  useEffect(() => {
    const q = query(collection(db, 'messages'), orderBy('timestamp'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      })));
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
  }, []);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    await addDoc(collection(db, 'messages'), {
      uid: user.uid,
      photoURL: user.photoURL,
      displayName: user.displayName,
      text: newMessage,
      timestamp: serverTimestamp(),
    });

    setNewMessage('');
  };

  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex justify-center items-center py-10 min-h-screen bg-gradient-to-b from-pink-500 to-purple-600">
      { user ? (
        <div className="w-[500px] glass-effect bg-opacity-10 bg-white p-6 rounded-lg shadow-lg backdrop-filter backdrop-blur-lg">
          <div className="text-4xl text-white text-center my-8">
            Welcome {user.displayName}
          </div>
          <div className="flex flex-col gap-5 h-[400px] overflow-y-scroll p-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`message flex ${msg.data.uid === user.uid ? 'justify-end' : 'justify-start'}`}>
                <div className={`message text-lg flex flex-row p-3 gap-3 rounded-[20px] items-center ${msg.data.uid === user.uid ? 'text-lg text-white bg-[#465be8]' : 'bg-gray-100 text-gray-800 text-lg '}`}>
                  {msg.data.text}
                  <img className="w-10 h-10 rounded-full" src={msg.data.photoURL} alt="User" />
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
          <div className="my-8">
            <input
              className="h-12 w-[100%] rounded-lg text-lg bg-white bg-opacity-25 text-white placeholder-gray-300 px-4 focus:outline-none focus:ring-2 focus:ring-purple-400"
              placeholder="Type your message..."
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
            />
          </div>
          <div className="">
            <button 
              className="w-[100%] text-lg font-bold bg-purple-600 hover:bg-purple-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-400" 
              onClick={sendMessage}>
              Send Message
            </button>
            <button 
              className="w-[100%] mt-4 text-lg font-bold bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-400" 
              onClick={() => auth.signOut()}>
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col justify-center items-center h-[100%] backdrop-filter backdrop-blur-lg">
          <div className="glass-effect bg-opacity-10 bg-white p-4 rounded-lg shadow-lg">
            <h2 className="text-2xl font-semibold mb-6 text-white">
              Login with Google
            </h2>
            <button 
              onClick={handleGoogleLogin} 
              className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-md flex items-center justify-center space-x-2 focus:outline-none focus:ring-2 focus:ring-red-400"
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor">
                <path 
                  stroke-linecap="round" 
                  stroke-linejoin="round" 
                  stroke-width="2" 
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Sign in with Google
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
