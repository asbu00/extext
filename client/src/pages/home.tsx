import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import memeImage from "@assets/meme-image.jpeg";
import meme1 from "@assets/meme1.jpeg";
import meme2 from "@assets/meme2.jpeg";
import meme3 from "@assets/meme3.jpeg";
import meme4 from "@assets/meme4.jpeg";
import meme5 from "@assets/meme5.jpeg";
import homepageImage from "@assets/homepage-image.jpeg";

interface Response {
  title: string;
  message: string;
  emoji: string;
  memeImage?: string;
}

const responses: Response[] = [
  {
    title: "Seriously? Stop.",
    message: "This is for your own good. Your ex is probably not missing you right now.",
    emoji: "🛑"
  },
  {
    title: "NOPE. Not happening.",
    message: "Remember why you broke up? Yeah, that's still valid.",
    emoji: "❌"
  },
  {
    title: "Still trying?",
    message: "Your future self will thank you for stopping now.",
    emoji: "🤦‍♀️"
  },
  {
    title: "This is getting concerning...",
    message: "Maybe call a friend instead? Or eat some ice cream?",
    emoji: "😤"
  },
  {
    title: "This is an intervention.",
    message: "We need to talk. Put the phone down and step away slowly.",
    emoji: "🚨"
  }
];

const sassyResponses: Response[] = [
  {
    title: "Drama Queenin Time! 💅🏻",
    message: "drama queenin time illa bro💅🏻",
    emoji: "🙄"
  },
  {
    title: "Ente Kutta! 😭",
    message: "ente kutta! netflix on cheyth chill cheyyu😭🙏🏻",
    emoji: "😭"
  },
  {
    title: "She Moved On! 🥲",
    message: "she moved on faster than your wifi daaa🥲",
    emoji: "🥲"
  },
  {
    title: "Google Maps Can't Help! 😂",
    message: "Even google maps can't help your way back😂",
    emoji: "😂"
  },
  {
    title: "Amazon Prime Alla! 😭",
    message: "aval/avan amazon prime allada renew cheyyan vendi😭",
    emoji: "💀"
  },
  {
    title: "Ex Vaccine Alla! 💉",
    message: "ex aahnello!! vaccine alla 💉 second dose venda😭🙅🏼‍♂️",
    emoji: "💉"
  },
  {
    title: "Msg vs Marriage! 💍",
    message: "nee poyi oru msg, aval poyi oru marriage💍",
    emoji: "💍"
  },
  {
    title: "Dark Mode Activated! 🌚",
    message: "bro she shifted to dark mode when you walked in🌚",
    emoji: "🌚"
  },
  {
    title: "Nirthi Valle! 🤌🏻",
    message: "nirthi valle panikkum podeyy🤌🏻",
    emoji: "🤌🏻"
  },
  {
    title: "Ammakum Venda! 🙂‍↕️",
    message: "ammale vendaathore ammmkum venda🙂‍↕️",
    emoji: "🙂‍↕️"
  },
  {
    title: "Maveli Poley! 😭",
    message: "avalk nee maveli poleyaanu oru thavena kandal pinne illyaa😭",
    emoji: "😭"
  }
];

const quotes = [
  "Your ex is your ex for a reason. Don't text them, text your therapist instead.",
  "Move on, you beautiful mess. The world needs your chaos elsewhere.",
  "Texting your ex is like trying to put toothpaste back in the tube. Messy and pointless.",
  "Your phone has a 'don't send' button. It's called self-respect.",
  "Plot twist: Your ex is probably doing just fine without that text.",
  "The only thing worse than missing your ex is texting them about it.",
  "Your dignity called. It wants you to put the phone down.",
  "Reminder: You're a catch, not a boomerang. Stop going back.",
  "Bestie, they ghosted you for a reason. It's giving main character delusion.",
  "Not you being pick-me energy right now. Your ex said what they said - nothing.",
  "Ma'am, this is a Wendy's. Also, your ex doesn't want that text.",
  "It's giving desperate. It's giving unhinged. It's giving... please stop.",
  "Your ex is living rent-free in your head but you got evicted from theirs months ago.",
  "Periodt. Your worth isn't determined by someone who couldn't see it. Next.",
  "Touch grass. Drink water. Call your mom. Do literally anything else."
];

export default function Home() {
  const [tapCount, setTapCount] = useState(0);
  const [showPopup, setShowPopup] = useState(false);
  const [currentResponse, setCurrentResponse] = useState<Response>(responses[0]);
  const [currentQuote, setCurrentQuote] = useState(quotes[0]);
  const [isShaking, setIsShaking] = useState(false);
  const [isFlashing, setIsFlashing] = useState(false);
  const [isIntervention, setIsIntervention] = useState(false);
  const [useSassyMode, setUseSassyMode] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showVideoIntervention, setShowVideoIntervention] = useState(false);
  
  // Array of all meme images for random selection
  const memeImages = [meme1, meme2, meme3, meme4, meme5];
  
  // State to track used sassy responses to avoid repetition
  const [usedSassyResponses, setUsedSassyResponses] = useState<number[]>([]);
  const [shuffledSassyResponses, setShuffledSassyResponses] = useState<Response[]>([]);

  // Sound effects using Web Audio API
  const playSound = (type: 'click' | 'popup' | 'sassy' | 'intervention' | 'flash' | 'hover') => {
    if (!soundEnabled) return;
    
    const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    switch (type) {
      case 'click':
        // Satisfying button click sound
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(200, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.type = 'square';
        break;
      case 'popup':
        // Pop sound for dialog
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(300, audioContext.currentTime + 0.15);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.15);
        oscillator.type = 'sine';
        break;
      case 'sassy':
        // Sassy "tsk tsk" sound
        oscillator.frequency.setValueAtTime(400, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(600, audioContext.currentTime + 0.05);
        oscillator.frequency.setValueAtTime(300, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.25, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime + 0.05);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.2);
        oscillator.type = 'triangle';
        break;
      case 'intervention':
        // Alert/warning sound
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime);
        oscillator.frequency.setValueAtTime(800, audioContext.currentTime + 0.1);
        oscillator.frequency.setValueAtTime(1000, audioContext.currentTime + 0.2);
        gainNode.gain.setValueAtTime(0.4, audioContext.currentTime);
        gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + 0.1);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.3);
        oscillator.type = 'sawtooth';
        break;
      case 'flash':
        // Quick zap sound for screen flash
        oscillator.frequency.setValueAtTime(2000, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(100, audioContext.currentTime + 0.05);
        gainNode.gain.setValueAtTime(0.15, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.05);
        oscillator.type = 'square';
        break;
      case 'hover':
        // Subtle hover sound
        oscillator.frequency.setValueAtTime(500, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1);
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        oscillator.type = 'sine';
        break;
    }

    oscillator.start(audioContext.currentTime);
    oscillator.stop(audioContext.currentTime + 0.3);
  };

  const flashScreen = () => {
    playSound('flash');
    setIsFlashing(true);
    setTimeout(() => setIsFlashing(false), 300);
  };

  const shakeButton = () => {
    setIsShaking(true);
    setTimeout(() => setIsShaking(false), 500);
  };

  const showRandomQuote = () => {
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setCurrentQuote(randomQuote);
  };

  // Initialize shuffled sassy responses on first load
  useEffect(() => {
    const shuffled = [...sassyResponses].sort(() => Math.random() - 0.5);
    setShuffledSassyResponses(shuffled);
  }, []);

  // Function to get next sassy response without repetition
  const getNextSassyResponse = () => {
    // If we've used all responses, reshuffle and reset
    if (usedSassyResponses.length >= sassyResponses.length) {
      const newShuffled = [...sassyResponses].sort(() => Math.random() - 0.5);
      setShuffledSassyResponses(newShuffled);
      setUsedSassyResponses([0]);
      return newShuffled[0];
    }
    
    // Get the next unused response
    const nextIndex = usedSassyResponses.length;
    setUsedSassyResponses([...usedSassyResponses, nextIndex]);
    return shuffledSassyResponses[nextIndex] || sassyResponses[0];
  };

  const handleButtonClick = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    // Play click sound
    playSound('click');

    // Redirect to YouTube after 15 clicks
    if (newTapCount >= 15) {
      // Play special sound for redirect
      playSound('intervention');
      
      // Show final intervention message
      setTimeout(() => {
        setCurrentResponse({
          title: "OK THAT'S IT. You're getting help.",
          message: "I'm sending you somewhere to calm down. This is for your own good.",
          emoji: "🚨"
        });
        setShowPopup(true);
        playSound('sassy');
        
        // Show video intervention instead of redirecting
        setTimeout(() => {
          setShowVideoIntervention(true);
        }, 2000);
      }, 500);
      
      return; // Exit early to prevent other logic
    }

    // Switch to sassy mode after 3 taps
    if (newTapCount >= 3) {
      setUseSassyMode(true);
    }

    // Different responses based on tap count
    if (newTapCount <= 2) {
      setTimeout(() => {
        setCurrentResponse(responses[newTapCount - 1]);
        setShowPopup(true);
        playSound('popup');
      }, 200);
    } else if (newTapCount <= 4) {
      flashScreen();
      shakeButton();
      setTimeout(() => {
        setCurrentResponse(responses[newTapCount - 1]);
        setShowPopup(true);
        playSound(newTapCount >= 3 ? 'sassy' : 'popup');
      }, 300);
    } else if (newTapCount === 10) {
      // Special meme image response for 10th tap
      flashScreen();
      shakeButton();
      setIsIntervention(true);
      playSound('intervention');
      setTimeout(() => {
        setCurrentResponse({
          title: "We need to have a serious talk...",
          message: "", // Will show image instead
          emoji: "🎭"
        });
        setShowPopup(true);
        playSound('sassy');
      }, 300);

      setTimeout(() => {
        setIsIntervention(false);
      }, 3000);
    } else if (newTapCount > 10 && newTapCount < 15) {
      // Final warning before redirect
      flashScreen();
      shakeButton();
      setIsIntervention(true);
      playSound('intervention');
      setTimeout(() => {
        setCurrentResponse({
          title: `Seriously? ${newTapCount} times?!`,
          message: `This is your ${15 - newTapCount} warning${15 - newTapCount === 1 ? '' : 's'} left before I take drastic action.`,
          emoji: "⚠️"
        });
        setShowPopup(true);
        playSound('sassy');
      }, 300);

      setTimeout(() => {
        setIsIntervention(false);
      }, 3000);
    } else {
      // Intervention mode with sassy responses
      flashScreen();
      shakeButton();
      setIsIntervention(true);
      playSound('intervention');
      setTimeout(() => {
        // Get next sassy response without repetition
        const nextSassy = getNextSassyResponse();
        
        // Always show a random meme image in sassy popups
        const responseWithMeme = {
          ...nextSassy,
          memeImage: memeImages[Math.floor(Math.random() * memeImages.length)]
        };
        
        setCurrentResponse(responseWithMeme);
        setShowPopup(true);
        playSound('sassy');
      }, 300);

      // Reset intervention mode after 3 seconds
      setTimeout(() => {
        setIsIntervention(false);
      }, 3000);
    }

    // Show new motivational quote
    setTimeout(() => {
      showRandomQuote();
    }, 1000);
  };

  const handlePopupClose = () => {
    setShowPopup(false);
    // Don't automatically show more popups - only show them when button is clicked
  };

  // Initialize with random quote
  useEffect(() => {
    showRandomQuote();
  }, []);

  return (
    <div className="bg-navy-900 text-white font-inter min-h-screen overflow-x-hidden relative">
      {/* Background Pattern */}
      <div className="fixed inset-0 opacity-5 bg-pattern" />

      {/* Flash Overlay */}
      <AnimatePresence>
        {isFlashing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.8 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.1 }}
            className="fixed inset-0 bg-red-600 z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        
        {/* Sound Toggle Button */}
        <div className="absolute top-4 right-4">
          <Button
            onClick={() => setSoundEnabled(!soundEnabled)}
            onMouseEnter={() => playSound('hover')}
            className="bg-navy-700 hover:bg-navy-600 text-white rounded-full p-3 text-sm"
          >
            {soundEnabled ? '🔊' : '🔇'}
          </Button>
        </div>

        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-poppins font-extrabold text-4xl md:text-6xl mb-6 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Text Your Ex?
          </h1>
          
          {/* Homepage image above the button */}
          <div className="mb-6">
            <img 
              src={homepageImage} 
              alt="Don't text your ex" 
              className="max-w-full h-auto rounded-lg mx-auto max-h-64 object-contain"
            />
          </div>
          
          <p className="text-slate-400 text-lg md:text-xl font-inter max-w-md mx-auto">
            The app that saves you from making terrible decisions
          </p>
        </motion.div>

        {/* Tap Counter Display */}
        <AnimatePresence>
          {tapCount > 0 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="mb-8 flex flex-col items-center gap-3"
            >
              <div className="bg-navy-800 rounded-full px-6 py-2 border border-slate-600">
                <span className="text-yellow-400 font-poppins font-semibold">
                  Bad Decision Attempts: <span className="text-white">{tapCount}</span>
                </span>
              </div>
              {useSassyMode && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-purple-600 rounded-full px-4 py-1 text-sm font-poppins font-semibold"
                >
                  💅 SASSY MODE ACTIVATED 💅
                </motion.div>
              )}
              {tapCount >= 10 && tapCount < 15 && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-600 border-2 border-red-400 rounded-full px-4 py-2 text-sm font-poppins font-bold animate-pulse"
                >
                  ⚠️ WARNING: {15 - tapCount} clicks until INTERVENTION ⚠️
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Button */}
        <div className="relative mb-12">
          <motion.div
            animate={isShaking ? { x: [-8, 8, -8, 8, -8, 8, 0] } : {}}
            transition={{ duration: 0.5, ease: "easeInOut" }}
          >
            <Button
              onClick={handleButtonClick}
              onMouseEnter={() => playSound('hover')}
              className={`
                ${isIntervention 
                  ? 'bg-yellow-600 hover:bg-yellow-500' 
                  : 'bg-red-600 hover:bg-red-500'
                } 
                text-white font-poppins font-bold text-2xl md:text-3xl 
                px-16 py-8 md:px-24 md:py-12 rounded-full shadow-2xl 
                transform hover:scale-105 transition-all duration-300 
                animate-pulse-red focus:outline-none focus:ring-4 focus:ring-red-400 focus:ring-opacity-50
                active:scale-95 relative overflow-hidden
              `}
            >
              <span className="relative z-10">
                {isIntervention ? 'INTERVENTION MODE!' : 'TEXT MY EX'}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-red-500 to-red-700 rounded-full opacity-0 hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </motion.div>
        </div>

        {/* Motivational Quote */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-center max-w-lg mx-auto"
        >
          <div className="bg-navy-800 rounded-2xl p-6 border border-slate-600 shadow-xl">
            <div className="text-2xl mb-3">✨</div>
            <motion.p 
              key={currentQuote}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="text-slate-300 font-inter text-base md:text-lg italic mb-3"
            >
              "{currentQuote}"
            </motion.p>
            <div className="text-yellow-400 font-poppins font-semibold text-sm">
              - The Universe (probably)
            </div>
          </div>
        </motion.div>

        {/* Statistics */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-2xl"
        >
          <div className="bg-navy-800 rounded-xl p-4 text-center border border-slate-600">
            <div className="text-2xl font-poppins font-bold text-green-400">99.9%</div>
            <div className="text-slate-400 text-sm">Bad Ideas Prevented</div>
          </div>
          <div className="bg-navy-800 rounded-xl p-4 text-center border border-slate-600">
            <div className="text-2xl font-poppins font-bold text-blue-400">2.3M+</div>
            <div className="text-slate-400 text-sm">Hearts Protected</div>
          </div>
          <div className="bg-navy-800 rounded-xl p-4 text-center border border-slate-600">
            <div className="text-2xl font-poppins font-bold text-purple-400">0</div>
            <div className="text-slate-400 text-sm">Regretful Texts Sent</div>
          </div>
        </motion.div>
      </div>

      {/* Popup Modal */}
      <Dialog open={showPopup} onOpenChange={handlePopupClose}>
        <DialogContent className="bg-navy-800 border-2 border-red-400 text-white max-w-md rounded-2xl">
          <VisuallyHidden>
            <DialogTitle>{currentResponse.title}</DialogTitle>
            <DialogDescription>{currentResponse.message}</DialogDescription>
          </VisuallyHidden>
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="text-center p-4"
          >
            <div className="text-6xl mb-4">{currentResponse.emoji}</div>
            <h3 className="font-poppins font-bold text-2xl mb-4 text-red-400">
              {currentResponse.title}
            </h3>
            {/* Show special 10th tap meme */}
            {tapCount === 10 && currentResponse.message === "" ? (
              <div className="mb-6">
                <img 
                  src={memeImage} 
                  alt="Intervention Meme" 
                  className="max-w-full h-auto rounded-lg mx-auto max-h-64 object-contain"
                />
              </div>
            ) : (
              <>
                {/* Show random meme image if present */}
                {currentResponse.memeImage && (
                  <div className="mb-4">
                    <img 
                      src={currentResponse.memeImage} 
                      alt="Random Meme" 
                      className="max-w-full h-auto rounded-lg mx-auto max-h-48 object-contain"
                    />
                  </div>
                )}
                {/* Show message text */}
                <p className="text-slate-300 mb-6 font-inter">
                  {currentResponse.message}
                </p>
              </>
            )}
            <Button
              onClick={handlePopupClose}
              className={`${
                useSassyMode 
                  ? 'bg-purple-600 hover:bg-purple-500' 
                  : 'bg-green-600 hover:bg-green-500'
              } text-white font-poppins font-semibold px-8 py-3 rounded-xl transition-colors duration-300`}
            >
              {useSassyMode ? "Fine, I'll Stop... Maybe" : "You're Right, Thanks"}
            </Button>
          </motion.div>
        </DialogContent>
      </Dialog>

      {/* Video Intervention Modal */}
      <Dialog open={showVideoIntervention} onOpenChange={() => {}}>
        <DialogContent className="bg-navy-900 border-2 border-red-500 text-white max-w-4xl rounded-2xl p-0 overflow-hidden">
          <VisuallyHidden>
            <DialogTitle>Video Intervention</DialogTitle>
            <DialogDescription>This is your intervention video</DialogDescription>
          </VisuallyHidden>
          <motion.div
            initial={{ scale: 0.3, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="relative"
          >
            <div className="bg-red-600 text-center py-4 px-6">
              <h2 className="font-poppins font-bold text-2xl">🚨 INTERVENTION IN PROGRESS 🚨</h2>
              <p className="text-red-100 mt-2">This is for your own good. Watch and learn.</p>
            </div>
            
            <div className="relative aspect-video">
              <iframe
                width="100%"
                height="100%"
                src="https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1&controls=0&modestbranding=1&rel=0&showinfo=0"
                title="Intervention Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              ></iframe>
            </div>
            
            <div className="bg-navy-800 p-4 text-center">
              <p className="text-slate-300 mb-4 font-inter">
                You've been rickrolled as part of your intervention. Maybe next time you'll think twice before obsessing over your ex.
              </p>
              <Button
                onClick={() => {
                  setShowVideoIntervention(false);
                  setTapCount(0);
                  setUseSassyMode(false);
                  setIsIntervention(false);
                }}
                className="bg-green-600 hover:bg-green-500 text-white font-poppins font-semibold px-8 py-3 rounded-xl"
              >
                I Promise to Move On
              </Button>
            </div>
          </motion.div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
