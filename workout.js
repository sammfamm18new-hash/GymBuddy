// workout.js
// This script will read quiz results from localStorage and render a dynamic, interactive workout

const workouts = {
    Leg: {
        warmup: ["Jump Rope", "High Knees", "Bodyweight Squats", "Leg Swings"],
        bodyweight: [
            "Squats", "Lunges", "Wall Sit", "Step-Ups", "Glute Bridge", "Bulgarian Split Squat", "Calf Raises", "Jump Squats", "Single Leg Deadlift", "Side Lunges", "Reverse Lunge", "Curtsy Lunge", "Frog Jumps"
        ],
        dumbbells: [
            "Dumbbell Squats", "Dumbbell Lunges", "Dumbbell Step-Ups", "Dumbbell Deadlifts", "Goblet Squat", "Dumbbell Calf Raises", "Dumbbell Bulgarian Split Squat", "Dumbbell Sumo Squat", "Dumbbell Side Lunge"
        ],
        resistance_band: [
            "Band Squats", "Band Leg Press", "Band Glute Bridge", "Band Side Steps", "Band Hamstring Curl", "Band Kickbacks"
        ],
        finisher: ["Wall Sit Hold", "Jump Squats", "Sprint Intervals"]
    },
    Push: {
        warmup: ["Arm Circles", "Push-Up Plank Hold", "Shoulder Taps"],
        bodyweight: [
            "Push-Ups", "Incline Push-Ups", "Decline Push-Ups", "Diamond Push-Ups", "Shoulder Tap Push-Ups", "Triceps Dips", "Pike Push-Ups", "Archer Push-Ups", "Wide Push-Ups"
        ],
        dumbbells: [
            "Dumbbell Bench Press", "Dumbbell Shoulder Press", "Dumbbell Triceps Extension", "Dumbbell Chest Fly", "Dumbbell Front Raise", "Dumbbell Overhead Press", "Dumbbell Floor Press"
        ],
        resistance_band: [
            "Band Chest Press", "Band Shoulder Press", "Band Triceps Extension", "Band Chest Fly", "Band Overhead Press"
        ],
        finisher: ["Push-Up Burnout", "Plank to Push-Up", "Shoulder Tap Push-Ups"]
    },
    Pull: {
        warmup: ["Jumping Jacks", "Arm Swings", "Scapular Pulls"],
        bodyweight: [
            "Pull-Ups", "Chin-Ups", "Inverted Rows", "Superman", "Reverse Snow Angels", "Doorway Rows", "Towel Rows", "Table Rows"
        ],
        dumbbells: [
            "Dumbbell Rows", "Dumbbell Bicep Curl", "Dumbbell Hammer Curl", "Dumbbell Reverse Fly", "Dumbbell Deadlift", "Dumbbell Shrugs", "Dumbbell Renegade Row"
        ],
        resistance_band: [
            "Band Rows", "Band Bicep Curl", "Band Face Pull", "Band Lat Pull Down", "Band Pull Apart"
        ],
        finisher: ["Superman Hold", "Max Rep Pull-Ups", "Bicep Curl Burnout"]
    },
    Abs: {
        warmup: ["Jumping Jacks", "Torso Twists", "Plank Hold"],
        bodyweight: [
            "Crunches", "Plank", "Russian Twist", "Leg Raises", "Bicycle Crunches", "Mountain Climbers", "Flutter Kicks", "V-Ups", "Toe Touches", "Plank Hip Dips", "Side Plank"
        ],
        dumbbells: [
            "Weighted Russian Twist", "Dumbbell Side Bend", "Dumbbell Sit-Up", "Dumbbell Toe Touch", "Dumbbell Crunch"
        ],
        resistance_band: [
            "Band Woodchopper", "Band Crunch", "Band Pallof Press", "Band Plank Row"
        ],
        finisher: ["Plank Hold", "Mountain Climbers", "Crunch Burnout"]
    }
};
const motivationalTips = [
    "Every rep gets you closer to your goal!",
    "Consistency beats intensity!",
    "You’re stronger than you think!",
    "Sweat is just your fat crying!",
    "Push through, you got this!",
    "No one ever regretted a workout!",
    "Progress, not perfection!",
    "Champions train, losers complain!",
    "The only bad workout is the one you didn’t do!",
    "You’re building a better you!"
];

function getWorkoutPlan(dayType, tools) {
    let pool = [];
    // Always start with a warmup
    if (workouts[dayType] && workouts[dayType].warmup) {
        pool = pool.concat(workouts[dayType].warmup);
    }
    // Add main exercises from selected tools
    tools.forEach(tool => {
        let toolKey = tool.toLowerCase().replace(/ /g, '_');
        if (workouts[dayType] && workouts[dayType][toolKey]) {
            pool = pool.concat(workouts[dayType][toolKey]);
        }
    });
    // Remove duplicates
    pool = Array.from(new Set(pool));
    // Determine number of main exercises by duration
    let numMain = 5;
    let intensity = 'medium';
    if (window.localStorage.getItem('quizAnswers')) {
        const answers = JSON.parse(window.localStorage.getItem('quizAnswers'));
        intensity = answers.difficulty || 'medium';
        switch (answers.duration) {
            case '15': numMain = 5; break;
            case '30': numMain = 8; break;
            case '45': numMain = 12; break;
            case '60': numMain = 16; break;
            default: numMain = 6;
        }
        // Adjust for difficulty
        if (intensity === 'easy') numMain = Math.max(5, Math.floor(numMain * 0.7));
        if (intensity === 'hard') numMain = Math.max(numMain, Math.ceil(numMain * 1.3));
    }
    // Pick main exercises (skip warmup)
    let warmup = workouts[dayType].warmup ? [workouts[dayType].warmup[Math.floor(Math.random()*workouts[dayType].warmup.length)]] : [];
    let mainPool = [];
    tools.forEach(tool => {
        let toolKey = tool.toLowerCase().replace(/ /g, '_');
        if (workouts[dayType] && workouts[dayType][toolKey]) {
            mainPool = mainPool.concat(workouts[dayType][toolKey]);
        }
    });
    mainPool = Array.from(new Set(mainPool));
    mainPool = mainPool.sort(() => Math.random() - 0.5);
    let mainExercises = mainPool.slice(0, numMain);
    // Add a finisher
    let finisher = workouts[dayType].finisher ? [workouts[dayType].finisher[Math.floor(Math.random()*workouts[dayType].finisher.length)]] : [];
    // Final plan: warmup + main + finisher
    return warmup.concat(mainExercises, finisher);
}

function renderWorkout() {
    const answers = JSON.parse(localStorage.getItem('quizAnswers'));
    if (!answers) {
        document.getElementById('workout-section').innerHTML = '<p>No workout found. Please take the quiz first.</p>';
        return;
    }
    const { dayType, tools, duration, difficulty } = answers;
    const exercises = getWorkoutPlan(dayType, tools);
    // Estimate time: warmup (5 min), each main (6 min), finisher (4 min)
    let estTime = 0;
    if (exercises.length > 2) {
        estTime = 5 + (exercises.length - 2) * 6 + 4;
    } else {
        estTime = 5 + 4;
    }
    let html = `<h2>${dayType} Day Workout</h2>`;
    html += `<div class="workout-difficulty">Difficulty: <strong style="color:${difficulty==='hard'?'#fc4a1a':difficulty==='medium'?'#4f46e5':'#b6f7c1'}">${difficulty.charAt(0).toUpperCase()+difficulty.slice(1)}</strong></div>`;
    html += `<div class="workout-duration">Estimated Total Time: ${estTime} minutes</div>`;
    // Add tip for pull day with bodyweight only
    if (dayType === "Pull" && (tools.length === 0 || (tools.length === 1 && tools[0] === "none") || (tools.includes("bodyweight") && tools.length === 1))) {
        html += `<div class="workout-tip" style="color:#fc4a1a;font-weight:bold;">Tip: Pull exercises are much easier and more effective with weights or bands! Consider adding equipment for best results.</div>`;
    } else {
        html += `<div class="workout-tip">${motivationalTips[Math.floor(Math.random()*motivationalTips.length)]}</div>`;
    }
    html += '<ul class="workout-list">';
    // List of time-based exercises
    const timeExercises = [
        "Plank", "Wall Sit", "Superman", "Plank Hold", "Side Plank", "Plank Hip Dips", "Superman Hold"
    ];
    exercises.forEach((ex, idx) => {
        let type = "Main";
        if (idx === 0) type = "Warmup";
        if (idx === exercises.length-1) type = "Finisher";
        let timerId = `timer-${idx}`;
        let timerDuration = type === "Warmup" ? 1 : (type === "Finisher" ? 1 : 1); // default 1 min for holds
        let isTimeExercise = timeExercises.some(t => ex.toLowerCase().includes(t.toLowerCase()));
        html += `<li class="workout-exercise">
            <span class="exercise-name">${ex}</span>
            <div class="sets-reps">${isTimeExercise ? "Hold for time!" : (type === "Warmup" ? "1 set x 15 reps (5 min)" : (type === "Finisher" ? "1 set x Max reps (4 min)" : "3 sets x 15 reps (6 min)") )}</div>
            <div class="set-checkboxes">
                ${isTimeExercise ? '' : '<label><input type="checkbox"> Set 1</label>'}
                ${type === "Main" && !isTimeExercise ? '<label><input type="checkbox"> Set 2</label><label><input type="checkbox"> Set 3</label>' : ''}
            </div>
            <div class="exercise-type">${type}</div>
            <div class="exercise-timer">
                <button class="start-timer" data-timer="${timerId}" data-duration="${isTimeExercise ? timerDuration : (type === "Warmup" ? 5 : (type === "Finisher" ? 4 : 6))}">${isTimeExercise ? `Start 1 min Timer` : `Start ${(type === "Warmup" ? 5 : (type === "Finisher" ? 4 : 6))} min Timer`}</button>
                <span id="${timerId}" class="timer-display"></span>
            </div>
        </li>`;
    });
    html += '</ul>';
    html += '<div class="motivation">Keep pushing! You got this! 💪</div>';
    document.getElementById('workout-section').innerHTML = html;
    // Add timer logic
    document.querySelectorAll('.start-timer').forEach(btn => {
        btn.addEventListener('click', function() {
            const timerId = btn.getAttribute('data-timer');
            const duration = parseInt(btn.getAttribute('data-duration')) * 60;
            let timeLeft = duration;
            const display = document.getElementById(timerId);
            btn.disabled = true;
            display.textContent = `Time left: ${Math.floor(timeLeft/60)}:${('0'+(timeLeft%60)).slice(-2)}`;
            let interval = setInterval(() => {
                timeLeft--;
                display.textContent = `Time left: ${Math.floor(timeLeft/60)}:${('0'+(timeLeft%60)).slice(-2)}`;
                if (timeLeft <= 0) {
                    clearInterval(interval);
                    display.textContent = 'Done! Great job!';
                    btn.disabled = false;
                }
            }, 1000);
        });
    });
}

document.addEventListener('DOMContentLoaded', renderWorkout);
