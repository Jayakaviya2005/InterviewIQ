
const questions = [
    "Tell me about yourself.",
    "What are your strengths and weaknesses?",
    "Why should we hire you?",
    "Where do you see yourself in five years?",
    "Tell me about a project you have completed.",
    "How do you handle challenges?",
    "Why did you choose this career?"
];

let currentScore = 0;
let currentQuestion = questions[0];

function showToast(message) {
    const toast = document.getElementById("toast");
    toast.textContent = message;
    toast.style.display = "block";

    setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}

// MOBILE MENU
function toggleMenu() {
    document.getElementById("navLinks").classList.toggle("show");
}

// DARK MODE
function toggleTheme() {
    document.body.classList.toggle("dark");

    const button = document.querySelector(".theme-btn");
    button.textContent = document.body.classList.contains("dark") ? "☀️" : "🌙";
}

// PROFILE REGISTRATION
document.getElementById("studentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = document.getElementById("studentName").value.trim();
    const role = document.getElementById("targetRole").value;

    if (!name || !role) {
        showToast("Please complete all required fields.");
        return;
    }

    document.getElementById("profileMessage").textContent =
        "Welcome, " + name + "! Your profile is ready. 🎉";

    document.getElementById("dashboardRole").textContent = role;

    showToast("Profile created successfully!");
});

// UPDATE SLIDER VALUES
function updateRating(skill) {
    const value = document.getElementById(skill).value;
    const output = document.getElementById(skill + "Value");

    output.textContent = value + "/5";
}

// GET SKILL VALUES
function getRatings() {
    return [
        Number(document.getElementById("technical").value),
        Number(document.getElementById("communication").value),
        Number(document.getElementById("problem").value),
        Number(document.getElementById("teamwork").value),
        Number(document.getElementById("time").value)
    ];
}

// SKILL ASSESSMENT
function evaluateSkills() {
    const ratings = getRatings();

    const average = ratings.reduce((total, value) => total + value, 0) / ratings.length;

    currentScore = Math.round((average / 5) * 100);

    document.getElementById("scoreNumber").textContent = currentScore + "%";

    let level = "";

    if (currentScore >= 80) {
        level = "Excellent 🌟";
    } else if (currentScore >= 60) {
        level = "Good 👍";
    } else if (currentScore >= 40) {
        level = "Developing 📚";
    } else {
        level = "Beginner 🌱";
    }

    document.getElementById("skillLevel").textContent = level;
    document.getElementById("scoreStatus").textContent = "Your current readiness estimate";

    document.getElementById("assessmentMessage").textContent =
        "Your readiness estimate is " + currentScore + "%. Keep improving! 🚀";

    createRoadmap(ratings);

    showToast("Your assessment is complete!");
}

// LEARNING ROADMAP
function createRoadmap(ratings) {
    const skillNames = [
        "Technical Skills",
        "Communication Skills",
        "Problem-Solving Skills",
        "Teamwork",
        "Time Management"
    ];

    const roadmap = document.getElementById("roadmapList");
    roadmap.innerHTML = "";

    let improvementCount = 0;

    ratings.forEach((rating, index) => {
        if (rating <= 3) {
            const item = document.createElement("li");
            item.textContent = "📌 Improve " + skillNames[index] + " through regular practice.";
            roadmap.appendChild(item);
            improvementCount++;
        }
    });

    if (improvementCount === 0) {
        const item = document.createElement("li");
        item.textContent = "🌟 Great ratings! Continue practising to maintain your skills.";
        roadmap.appendChild(item);
    }

    const finalItem = document.createElement("li");
    finalItem.textContent = "🚀 Practise mock interviews and build practical projects.";
    roadmap.appendChild(finalItem);
}

// RANDOM INTERVIEW QUESTIONS
function generateQuestion() {
    let nextQuestion;

    do {
        nextQuestion = questions[Math.floor(Math.random() * questions.length)];
    } while (nextQuestion === currentQuestion && questions.length > 1);

    currentQuestion = nextQuestion;

    document.getElementById("questionBox").textContent = currentQuestion;
    document.getElementById("answerInput").value = "";
    document.getElementById("feedbackBox").style.display = "none";
}

// DEMO ANSWER FEEDBACK
function evaluateAnswer() {
    const answer = document.getElementById("answerInput").value.trim();
    const feedback = document.getElementById("feedbackBox");

    if (answer.length < 10) {
        showToast("Please enter a longer answer.");
        return;
    }

    const wordCount = answer.split(/\s+/).length;

    let message = "";

    if (wordCount < 20) {
        message = "💡 Your answer is quite short. Try adding more relevant details and examples.";
    } else if (wordCount < 50) {
        message = "👍 Good attempt! Try to explain your points clearly and include a practical example.";
    } else {
        message = "🌟 Nice effort! Your answer has useful detail. Keep practising clear and structured responses.";
    }

    feedback.innerHTML =
        "<strong>Demo Feedback</strong><br>" +
        message +
        "<br><br>📝 Word count: " + wordCount +
        "<br>💬 Tip: Use real examples and explain your contribution.";

    feedback.style.display = "block";
    showToast("Demo feedback generated!");
}

// INITIAL DISPLAY
document.addEventListener("DOMContentLoaded", function() {
    questions[0] = "Tell me about yourself.";
});
