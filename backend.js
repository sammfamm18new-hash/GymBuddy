// Interactive tool adding logic
document.addEventListener('DOMContentLoaded', function() {
	const addToolBtn = document.getElementById('add-tool');
	const customToolInput = document.getElementById('custom-tool');
	const toolsDropdown = document.getElementById('tools-dropdown');
	if (addToolBtn && customToolInput && toolsDropdown) {
		addToolBtn.addEventListener('click', function() {
			const newTool = customToolInput.value.trim();
			if (newTool.length > 0) {
				// Prevent duplicates
				let exists = false;
				for (let i = 0; i < toolsDropdown.options.length; i++) {
					if (toolsDropdown.options[i].value.toLowerCase() === newTool.toLowerCase()) {
						exists = true;
						break;
					}
				}
				if (!exists) {
					const option = document.createElement('option');
					option.value = newTool;
					option.textContent = newTool;
					toolsDropdown.appendChild(option);
					toolsDropdown.value = newTool;
					customToolInput.value = '';
				} else {
					customToolInput.value = '';
					customToolInput.placeholder = 'Tool already added!';
					setTimeout(() => { customToolInput.placeholder = 'Add your own tool...'; }, 1200);
				}
			}
		});
		customToolInput.addEventListener('keydown', function(e) {
			if (e.key === 'Enter') {
				addToolBtn.click();
				e.preventDefault();
			}
		});
	}
});
// Quiz modal logic
document.addEventListener('DOMContentLoaded', function() {
	const quizModal = document.getElementById('quiz-modal');
	const closeQuizBtn = document.getElementById('close-quiz');
	const quizForm = document.getElementById('quiz-form');
	const workoutTypeSelect = document.getElementById('workout-type');
		const toolsSection = document.getElementById('tools-section');
		const workoutResult = document.getElementById('workout-result');
		const bweLink = document.getElementById('bwe-link');
		const wteLink = document.getElementById('wte-link');
		const toolsCheckboxes = document.getElementById('tools-checkboxes');

	function startQuiz(type) {
		quizModal.style.display = 'flex';
		workoutResult.innerHTML = '';
		quizForm.reset();
		// Set workout type and show/hide tools
		workoutTypeSelect.value = type;
		workoutTypeSelect.disabled = true;
		if (type === 'wte') {
			toolsSection.style.display = 'block';
		} else {
			toolsSection.style.display = 'none';
		}
		// Start quiz timer
		const quizTimer = document.getElementById('quiz-timer');
		let timeLeft = 30;
		quizTimer.style.display = 'block';
		quizTimer.textContent = `Time left: ${timeLeft}s`;
		quizTimer.classList.remove('timer-finished');
		let timerInterval = setInterval(() => {
			timeLeft--;
			quizTimer.textContent = `Time left: ${timeLeft}s`;
			if (timeLeft <= 0) {
				clearInterval(timerInterval);
				quizTimer.textContent = 'Time is up!';
				quizTimer.classList.add('timer-finished');
				quizForm.querySelectorAll('select, input, button').forEach(el => el.disabled = true);
			}
		}, 1000);
		closeQuizBtn.onclick = function() {
			clearInterval(timerInterval);
			quizTimer.style.display = 'none';
			quizForm.querySelectorAll('select, input, button').forEach(el => el.disabled = false);
		};
		quizForm.onsubmit = function() {
			clearInterval(timerInterval);
			quizTimer.style.display = 'none';
		};
	}

	bweLink.addEventListener('click', function(e) {
		e.preventDefault();
		startQuiz('bwe');
	});
	wteLink.addEventListener('click', function(e) {
		e.preventDefault();
		startQuiz('wte');
	});
	closeQuizBtn.addEventListener('click', function() {
		quizModal.style.display = 'none';
		workoutTypeSelect.disabled = false;
		workoutTypeSelect.value = '';
	});
	quizForm.addEventListener('submit', function(e) {
		e.preventDefault();
		const lazy = quizForm.lazy.value;
		const duration = quizForm.duration.value;
		const type = workoutTypeSelect.value;
		const dayType = quizForm.dayType.value;
		const difficulty = quizForm.difficulty.value;
		let selectedTools = [];
		if (toolsCheckboxes && type === 'wte') {
			selectedTools = Array.from(toolsCheckboxes.querySelectorAll('input[type=checkbox]:checked')).map(cb => cb.value);
		}
		// Save answers to localStorage
		localStorage.setItem('quizAnswers', JSON.stringify({ lazy, duration, type, dayType, difficulty, tools: selectedTools }));
		// Redirect to workout page
		window.location.href = 'workout.html';
	});
});
// Loading screen with random motivational tip
document.addEventListener('DOMContentLoaded', function() {
	// Always show loading screen on homepage
	const tips = [
		'💪 "Push yourself, because no one else is going to do it for you."',
		'🔥 "The only bad workout is the one you didn’t do."',
		'🏆 "Small progress is still progress."',
		'🥤 "Stay hydrated and keep moving!"',
		'🧠 "Mindset is everything."',
		'🚀 "Success starts with self-discipline."',
		'🌟 "Dream big, work hard, stay focused."',
		'⏳ "Consistency is the key to progress."',
		'🦾 "Strength grows in the moments you think you can’t go on but you keep going anyway."',
		'🫀 "Your body can stand almost anything. It’s your mind you have to convince."'
	];
	const randomTip = tips[Math.floor(Math.random() * tips.length)];
	const loader = document.createElement('div');
	loader.id = 'loading-screen';
	loader.innerHTML = `
		<div class="loader-content">
			<img src="https://th.bing.com/th/id/OIP.Zwue73m8qEuAPL8RSWPjxwHaHa?w=178&h=180&c=7&r=0&o=5&dpr=2&pid=1.7" alt="Gym Buddy Logo" class="logo-img" />
			<h2>Welcome to Gym Buddy!</h2>
			<ul>
				<li>${randomTip}</li>
			</ul>
			<div class="loader-spinner"></div>
		</div>
	`;
	document.body.appendChild(loader);
	setTimeout(function() {
		loader.style.opacity = '0';
		loader.style.pointerEvents = 'none';
		setTimeout(function() {
			loader.remove();
		}, 600);
	}, 5000);
});
