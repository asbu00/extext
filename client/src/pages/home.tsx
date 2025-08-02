import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";

interface Response {
  title: string;
  message: string;
  emoji: string;
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
    title: "Are you fr right now? 💀",
    message: "Bestie, they left you on read for a reason. It's giving desperate energy.",
    emoji: "💀"
  },
  {
    title: "Not you being delulu again...",
    message: "Babe, it's giving main character syndrome but you're not even in their story anymore.",
    emoji: "🤡"
  },
  {
    title: "Ma'am this is embarrassing",
    message: "Imagine explaining to your therapist that you texted your ex... again. That's a no from me chief.",
    emoji: "😬"
  },
  {
    title: "Oop- we're still doing this?",
    message: "Honey, your ex is probably living their best life and you're over here... like this. Red flag behavior fr.",
    emoji: "🚩"
  },
  {
    title: "Touch some grass bestie",
    message: "I'm literally begging you to go outside and remember that grass exists. Your ex ain't it.",
    emoji: "🌱"
  },
  {
    title: "Slay queen... but backwards",
    message: "You're literally un-slaying right now. This ain't giving what you think it's giving.",
    emoji: "💅"
  },
  {
    title: "It's giving... unhinged",
    message: "Babes, this energy could power a small village. Channel it into literally anything else.",
    emoji: "⚡"
  },
  {
    title: "Periodt... STOP.",
    message: "And that's on periodt. Your ex is not the main character of your story anymore. You are.",
    emoji: "✨"
  },
  {
    title: "No cap, this is cringe",
    message: "I'm not even being dramatic - this is actually embarrassing. Your future self is cringing rn.",
    emoji: "🧢"
  },
  {
    title: "That's sus behavior",
    message: "Very sus. Very pick-me. Very 'I have no other hobbies' energy. We don't do that here.",
    emoji: "😒"
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

  const flashScreen = () => {
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

  const handleButtonClick = () => {
    const newTapCount = tapCount + 1;
    setTapCount(newTapCount);

    // Switch to sassy mode after 3 taps
    if (newTapCount >= 3) {
      setUseSassyMode(true);
    }

    // Different responses based on tap count
    if (newTapCount <= 2) {
      setCurrentResponse(responses[newTapCount - 1]);
      setShowPopup(true);
    } else if (newTapCount <= 4) {
      flashScreen();
      shakeButton();
      setTimeout(() => {
        setCurrentResponse(responses[newTapCount - 1]);
        setShowPopup(true);
      }, 300);
    } else {
      // Intervention mode with sassy responses
      flashScreen();
      shakeButton();
      setIsIntervention(true);
      setTimeout(() => {
        // Pick random sassy response
        const randomSassy = sassyResponses[Math.floor(Math.random() * sassyResponses.length)];
        setCurrentResponse(randomSassy);
        setShowPopup(true);
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
    
    // Always show another popup when they click the button in sassy mode
    if (tapCount >= 3 && useSassyMode) {
      // Show a random sassy response after a small delay
      setTimeout(() => {
        const randomSassy = sassyResponses[Math.floor(Math.random() * sassyResponses.length)];
        setCurrentResponse(randomSassy);
        setShowPopup(true);
      }, 800); // Slightly longer delay for dramatic effect
    }
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
        
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h1 className="font-poppins font-extrabold text-4xl md:text-6xl mb-4 bg-gradient-to-r from-red-400 to-pink-400 bg-clip-text text-transparent">
            Text Your Ex?
          </h1>
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
            <p className="text-slate-300 mb-6 font-inter">
              {currentResponse.message}
            </p>
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
    </div>
  );
}
