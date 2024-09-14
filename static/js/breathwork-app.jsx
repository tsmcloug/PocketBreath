import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

console.log('breathwork-app.jsx is being executed');

const exerciseTypes = ['Calm Down', 'Reset', 'Focus']
const durations = ['2 min', '5 min', '10 min']
const exerciseDescriptions = {
  'Calm Down': "This exercise uses a 4-7-8 pattern to help you calm down. Inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds.",
  'Reset': "This exercise uses a 4-4-4-4 pattern to help you reset. Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold for 4 seconds.",
  'Focus': "This exercise uses a 4-2-4 pattern to help you focus. Inhale for 4 seconds, hold for 2 seconds, and exhale for 4 seconds."
};

const breathingPatterns = {
  'Calm Down': [4, 7, 8],
  'Reset': [4, 4, 4, 4],
  'Focus': [4, 2, 4]
};

function BreathworkApp() {
  console.log('BreathworkApp component is rendering');
  const [intention, setIntention] = useState('')
  const [duration, setDuration] = useState('')
  const [isBreathing, setIsBreathing] = useState(false)
  const [breathingState, setBreathingState] = useState('inhale')
  const [instructions, setInstructions] = useState('Inhale')
  const [remainingTime, setRemainingTime] = useState(0)
  const [countdown, setCountdown] = useState(3)
  const [exerciseDescription, setExerciseDescription] = useState('')
  const [currentPattern, setCurrentPattern] = useState([])
  const [currentPhaseTime, setCurrentPhaseTime] = useState(0)

  const handleIntentionSelect = (type) => {
    setIntention(type);
    setExerciseDescription(exerciseDescriptions[type]);
    setCurrentPattern(breathingPatterns[type]);
  };

  useEffect(() => {
    if (isBreathing && countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000)
      return () => clearTimeout(timer)
    } else if (isBreathing && countdown === 0) {
      startBreathingExercise()
    }
  }, [isBreathing, countdown])

  useEffect(() => {
    if (isBreathing && countdown === 0) {
      const timer = setInterval(() => {
        setRemainingTime(prevTime => {
          if (prevTime <= 1) {
            clearInterval(timer)
            endExercise()
            return 0
          }
          return prevTime - 1
        })
      }, 1000)
      return () => clearInterval(timer)
    }
  }, [isBreathing, countdown])

  const startBreathingExercise = () => {
    setBreathingState('inhale');
    setInstructions('Inhale');
    setCurrentPhaseTime(currentPattern[0]);
    let phaseIndex = 0;
    const breathingInterval = setInterval(() => {
      setCurrentPhaseTime(prevTime => {
        if (prevTime <= 1) {
          phaseIndex = (phaseIndex + 1) % currentPattern.length;
          const nextPhase = ['inhale', 'hold', 'exhale', 'hold'][phaseIndex];
          setBreathingState(nextPhase);
          setInstructions(nextPhase.charAt(0).toUpperCase() + nextPhase.slice(1));
          return currentPattern[phaseIndex];
        }
        return prevTime - 1;
      });
    }, 1000);

    return () => clearInterval(breathingInterval);
  }

  const startBreathing = () => {
    setIsBreathing(true)
    setRemainingTime(parseInt(duration) * 60)
    setCountdown(3)
  }

  const stopBreathing = () => {
    setIsBreathing(false)
    setBreathingState('inhale')
    setInstructions('Inhale')
    setCountdown(3)
    setCurrentPhaseTime(0)
  }

  const endExercise = () => {
    setIsBreathing(false)
    setBreathingState('inhale')
    setInstructions('Inhale')
    setCountdown(3)
    setCurrentPhaseTime(0)
  }

  const circleVariants = {
    inhale: {
      scale: [1, 1.5],
      transition: { duration: currentPattern[0], ease: "easeInOut" }
    },
    hold: {
      scale: 1.5,
      transition: { duration: currentPattern[1], ease: "linear" }
    },
    exhale: {
      scale: [1.5, 1],
      transition: { duration: currentPattern[2], ease: "easeInOut" }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col items-center justify-center p-4 text-white">
      {!isBreathing && (
        <motion.h1
          className="text-4xl font-bold mb-8"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Let's breathe
        </motion.h1>
      )}

      <AnimatePresence mode="wait">
        {!isBreathing ? (
          <motion.div
            key="setup"
            className="w-full max-w-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.h2
              className="text-2xl mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              What's your intention?
            </motion.h2>

            <motion.div
              className="flex justify-between mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              {exerciseTypes.map((type) => (
                <motion.button
                  key={type}
                  onClick={() => handleIntentionSelect(type)}
                  className={`px-6 py-2 rounded-full border border-white text-white text-lg transition-all duration-200 ${intention === type ? 'bg-white text-purple-600' : 'bg-transparent'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {type}
                </motion.button>
              ))}
            </motion.div>

            {intention && (
              <motion.div
                className="mt-4 mb-8 text-center text-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                {exerciseDescription}
              </motion.div>
            )}

            <motion.h3
              className="text-2xl mb-6 text-center"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Choose duration:
            </motion.h3>

            <motion.div
              className="flex justify-between"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.8 }}
            >
              {durations.map((time) => (
                <motion.button
                  key={time}
                  onClick={() => setDuration(time.split(' ')[0])}
                  className={`px-6 py-2 rounded-full border border-white text-white text-lg transition-all duration-200 ${duration === time.split(' ')[0] ? 'bg-white text-purple-600' : 'bg-transparent'
                    }`}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {time}
                </motion.button>
              ))}
            </motion.div>

            {intention && duration && (
              <motion.button
                className="w-full py-3 bg-white text-purple-600 rounded-full text-xl font-bold mt-8 hover:bg-opacity-90 transition-all duration-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                onClick={startBreathing}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Start Breathing
              </motion.button>
            )}
          </motion.div>
        ) : (
          <motion.div
            key="breathing"
            className="w-full max-w-md flex flex-col items-center"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5 }}
          >
            {countdown > 0 ? (
              <div className="text-8xl font-bold mb-8">{countdown}</div>
            ) : (
              <>
                <motion.div
                  className="w-64 h-64 rounded-full bg-white bg-opacity-30 flex items-center justify-center mb-8"
                  variants={circleVariants}
                  animate={breathingState}
                >
                  <div className="text-6xl font-bold">{instructions}</div>
                </motion.div>
                <div className="text-3xl font-bold mt-8">
                  {Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')}
                </div>
              </>
            )}
            <motion.button
              className="px-8 py-3 bg-white text-purple-600 rounded-full text-xl font-bold mt-8 hover:bg-opacity-90 transition-all duration-200"
              onClick={stopBreathing}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Stop Session
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

console.log('About to render BreathworkApp');
ReactDOM.render(
  <React.StrictMode>
    <BreathworkApp />
  </React.StrictMode>,
  document.getElementById('react-app')
);
console.log('Render attempt completed');

export default BreathworkApp;