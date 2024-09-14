document.addEventListener('DOMContentLoaded', () => {
  const exerciseOptions = document.getElementById('exercise-options');
  const exerciseContainer = document.getElementById('exercise-container');
  const breathingCircle = document.querySelector('.breathing-circle');
  const timer = document.getElementById('timer');
  const exerciseDescription = document.getElementById('exercise-description');
  const stopButton = document.getElementById('stop-session');

  let exerciseType = '';
  let duration = 0;
  let remainingTime = 0;
  let intervalId;

  document.querySelectorAll('.exercise-type').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.exercise-type').forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      exerciseType = button.dataset.type;
      updateExerciseDescription();
      document.querySelectorAll('.duration').forEach(btn => btn.classList.remove('hidden'));
    });
  });

  document.querySelectorAll('.duration').forEach(button => {
    button.addEventListener('click', () => {
      document.querySelectorAll('.duration').forEach(btn => btn.classList.remove('selected'));
      button.classList.add('selected');
      duration = parseInt(button.dataset.duration);
      startExercise();
    });
  });

  stopButton.addEventListener('click', () => {
    stopExercise();
  });

  function updateExerciseDescription() {
    const descriptions = {
      calm: "This exercise uses a 4-7-8 pattern to help you calm down. Inhale for 4 seconds, hold for 7 seconds, and exhale for 8 seconds.",
      reset: "This exercise uses a 4-4-4-4 pattern to help you reset. Inhale for 4 seconds, hold for 4 seconds, exhale for 4 seconds, and hold for 4 seconds.",
      focus: "This exercise uses a 4-2-4 pattern to help you focus. Inhale for 4 seconds, hold for 2 seconds, and exhale for 4 seconds."
    };
    exerciseDescription.textContent = descriptions[exerciseType];
    exerciseDescription.classList.remove('hidden');
  }

  function startExercise() {
    exerciseOptions.classList.add('hidden');
    exerciseContainer.classList.remove('hidden');
    remainingTime = duration * 60;

    let countdown = 3;
    const countdownInterval = setInterval(() => {
      timer.textContent = `Starting in ${countdown}`;
      countdown--;
      if (countdown < 0) {
        clearInterval(countdownInterval);
        timer.textContent = '';
        startBreathing();
      }
    }, 1000);
  }

  function updateTimer() {
    const minutes = Math.floor(remainingTime / 60);
    const seconds = remainingTime % 60;
    timer.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }

  function startBreathing() {
    let phase = 'inhale';
    let count = 0;
    const patterns = {
      calm: [4, 7, 8],
      reset: [4, 4, 4, 4],
      focus: [4, 2, 4]
    };
    const pattern = patterns[exerciseType];
    let patternIndex = 0;

    // Initialize the breathing instructions
    updateBreathingPhase(patternIndex, pattern);

    intervalId = setInterval(() => {
      remainingTime--;
      updateTimer();

      if (remainingTime <= 0) {
        clearInterval(intervalId);
        endExercise();
        return;
      }

      count++;
      if (count >= pattern[patternIndex]) {
        count = 0;
        patternIndex = (patternIndex + 1) % pattern.length;
        updateBreathingPhase(patternIndex, pattern);
      }
    }, 1000);
  }

  function updateBreathingPhase(patternIndex, pattern) {
    const phases = {
      calm: ['inhale', 'hold', 'exhale'],
      reset: ['inhale', 'hold', 'exhale', 'hold'],
      focus: ['inhale', 'hold', 'exhale']
    };
    const phase = phases[exerciseType][patternIndex];
    const duration = pattern[patternIndex];

    const circleInstructions = document.getElementById('circle-instructions');
    circleInstructions.textContent = phase.charAt(0).toUpperCase() + phase.slice(1) + '...';
    breathingCircle.className = `breathing-circle mx-auto w-48 h-48 relative ${phase}`;
    breathingCircle.style.setProperty('--duration', `${duration}s`);
  }

  function stopExercise() {
    clearInterval(intervalId);
    exerciseContainer.classList.add('hidden');
    showStoppedMessage();
  }

  function showStoppedMessage() {
    const stoppedMessage = document.createElement('div');
    stoppedMessage.innerHTML = `
      <h2 class="text-2xl font-bold mb-4 text-white">Session Stopped</h2>
      <p class="mb-4 text-white">You've stopped the exercise. Feel free to start a new session when you're ready.</p>
      <button id="new-session" class="bg-white text-purple-600 hover:bg-purple-100 transform hover:scale-105 transition-all duration-200 font-bold py-2 px-4 rounded-full">
        Start New Session
      </button>
    `;
    exerciseContainer.parentNode.insertBefore(stoppedMessage, exerciseContainer);

    document.getElementById('new-session').addEventListener('click', () => {
      stoppedMessage.remove();
      resetExercise();
    });
  }

  function endExercise() {
    exerciseContainer.classList.add('hidden');
    const completionMessage = document.createElement('div');
    completionMessage.innerHTML = `
      <h2 class="text-2xl font-bold mb-4 text-white">Exercise Completed!</h2>
      <p class="mb-4 text-white">Great job! You've completed a ${duration}-minute ${exerciseType} exercise.</p>
      <button id="do-another" class="bg-white text-purple-600 hover:bg-purple-100 transform hover:scale-105 transition-all duration-200 font-bold py-2 px-4 rounded-full">
        Do Another Exercise
      </button>
    `;
    exerciseContainer.parentNode.insertBefore(completionMessage, exerciseContainer);

    document.getElementById('do-another').addEventListener('click', () => {
      completionMessage.remove();
      resetExercise();
    });
  }

  function resetExercise() {
    exerciseType = '';
    duration = 0;
    remainingTime = 0;
    exerciseDescription.textContent = '';
    exerciseDescription.classList.add('hidden');
    exerciseOptions.classList.remove('hidden');
    document.querySelectorAll('.exercise-type').forEach(button => {
      button.classList.remove('hidden', 'selected');
    });
    document.querySelectorAll('.duration').forEach(button => {
      button.classList.remove('selected');
    });
  }
});
