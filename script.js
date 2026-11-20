
"use strict";

/* =====================================
   INTERVIEWIQ - SMART READINESS SYSTEM
===================================== */

const questions = {
    HR: [
        "Tell me about yourself.",
        "What are your strengths and weaknesses?",
        "Why should we hire you?",
        "Where do you see yourself in five years?",
        "How do you handle challenges?",
        "Describe a time you worked in a team."
    ],

    "Data Analyst": [
        "What is the difference between SQL and Excel?",
        "What is data cleaning?",
        "Explain the difference between INNER JOIN and LEFT JOIN.",
        "What is a dashboard?",
        "How do you handle missing data?",
        "What is the difference between Power BI and Tableau?"
    ],

    "Software Developer": [
        "What is object-oriented programming?",
        "Explain the difference between a class and an object.",
        "What is the difference between an array and a linked list?",
        "What is exception handling?",
        "Explain the software development life cycle."
    ],

    "Full Stack Developer": [
        "What is the difference between frontend and backend?",
        "What is an API?",
        "Explain HTML, CSS and JavaScript.",
        "What is database connectivity?",
        "What is the difference between GET and POST?"
    ],

    "Data Scientist": [
        "What is machine learning?",
        "What is the difference between supervised and unsupervised learning?",
        "What is data preprocessing?",
        "What is overfitting?",
        "What is the purpose of Python in data science?"
    ],

    "Cloud Engineer": [
        "What is cloud computing?",
        "Explain IaaS, PaaS and SaaS.",
        "What is the difference between public and private cloud?",
        "What is cloud storage?",
        "What is scalability in cloud computing?"
    ],

    Other: [
        "Tell me about yourself.",
        "What are your career goals?",
        "How do you manage your time?",
        "How do you solve problems?",
        "Why are you interested in this role?"
    ]
};

const roleSkills = {
    "Data Analyst": [
        "SQL",
        "Excel",
        "Python",
        "Data Visualization",
        "Problem Solving"
    ],

    "Software Developer": [
        "Programming",
        "Data Structures",
        "Problem Solving",
        "Debugging",
        "Communication"
    ],

    "Full Stack Developer": [
        "HTML/CSS/JavaScript",
        "Frontend Development",
        "Backend Development",
        "Database Management",
        "Problem Solving"
    ],

    "Data Scientist": [
        "Python",
        "Statistics",
        "Machine Learning",
        "Data Analysis",
        "Problem Solving"
    ],

    "Cloud Engineer": [
        "Cloud Fundamentals",
        "Networking",
        "Linux",
        "Security",
        "Problem Solving"
    ],

    Other: [
        "Technical Knowledge",
        "Communication",
        "Problem Solving",
        "Teamwork",
        "Time Management"
    ]
};

const roleWeights = {
    "Data Analyst": [0.30, 0.20, 0.20, 0.15, 0.15],
    "Software Developer": [0.25, 0.25, 0.20, 0.15, 0.15],
    "Full Stack Developer": [0.25, 0.20, 0.20, 0.20, 0.15],
    "Data Scientist": [0.25, 0.20, 0.20, 0.20, 0.15],
    "Cloud Engineer": [0.25, 0.20, 0.20, 0.20, 0.15],
    Other: [0.20, 0.20, 0.20, 0.20, 0.20]
};

const skillIds = [
    "technical",
    "communication",
    "problem",
    "teamwork",
    "time"
];

let currentScore = 0;
let currentQuestion = questions.HR[0];
let currentCategory = "HR";

let studentProfile = null;
let assessmentCompleted = false;


/* =====================================
   DOM HELPERS
===================================== */

const getElement = (id) => document.getElementById(id);

function showToast(message) {
    const toast = getElement("toast");

    toast.textContent = message;
    toast.style.display = "block";

    clearTimeout(showToast.timer);

    showToast.timer = setTimeout(() => {
        toast.style.display = "none";
    }, 2500);
}


/* =====================================
   NAVIGATION
===================================== */

function toggleMenu() {
    getElement("navLinks").classList.toggle("show");
}

function toggleTheme() {
    const isDark = document.body.classList.toggle("dark");

    const button = document.querySelector(".theme-btn");

    button.textContent = isDark ? "☀️" : "🌙";
    button.setAttribute(
        "aria-label",
        isDark ? "Switch to light mode" : "Switch to dark mode"
    );

    localStorage.setItem("interviewTheme", isDark ? "dark" : "light");
}

function loadTheme() {
    const savedTheme = localStorage.getItem("interviewTheme");

    if (savedTheme === "dark") {
        document.body.classList.add("dark");
        document.querySelector(".theme-btn").textContent = "☀️";
    }
}


/* =====================================
   STUDENT PROFILE
===================================== */

getElement("studentForm").addEventListener("submit", function(event) {
    event.preventDefault();

    const name = getElement("studentName").value.trim();
    const email = getElement("studentEmail").value.trim();
    const course = getElement("studentCourse").value.trim();
    const role = getElement("targetRole").value;

    if (!name || !email || !course || !role) {
        showToast("Please complete all fields.");
        return;
    }

    if (!getElement("studentEmail").checkValidity()) {
        showToast("Please enter a valid email address.");
        return;
    }

    studentProfile = {
        name,
        email,
        course,
        role
    };

    localStorage.setItem(
        "interviewProfile",
        JSON.stringify(studentProfile)
    );

    getElement("profileMessage").textContent =
        `Welcome, ${name}! Your profile is ready. 🎉`;

    getElement("dashboardRole").textContent = role;

    showToast("Profile created successfully!");
});

function loadProfile() {
    try {
        const saved = localStorage.getItem("interviewProfile");

        if (!saved) return;

        const profile = JSON.parse(saved);

        if (
            !profile ||
            typeof profile.name !== "string" ||
            typeof profile.role !== "string"
        ) return;

        studentProfile = profile;

        getElement("studentName").value = profile.name;
        getElement("studentEmail").value = profile.email || "";
        getElement("studentCourse").value = profile.course || "";
        getElement("targetRole").value = profile.role;

        getElement("dashboardRole").textContent = profile.role;

        getElement("profileMessage").textContent =
            `Welcome back, ${profile.name}!`;
    } catch (error) {
        console.error("Unable to load profile:", error);
    }
}


/* =====================================
   SKILL RATING
===================================== */

function updateRating(skill) {
    const value = getElement(skill).value;
    const output = getElement(skill + "Value");

    output.textContent = value + "/5";

    getElement(skill).setAttribute(
        "aria-valuetext",
        value + " out of 5"
    );
}

function getRatings() {
    return skillIds.map(id => Number(getElement(id).value));
}


/* =====================================
   SMART READINESS CALCULATION
===================================== */

function evaluateSkills() {

    const ratings = getRatings();

    const role = getElement("targetRole").value ||
        studentProfile?.role ||
        "Other";

    const weights = roleWeights[role] || roleWeights.Other;

    if (ratings.some(value => value < 1 || value > 5)) {
        showToast("Please provide valid skill ratings.");
        return;
    }

    const weightedAverage = ratings.reduce(
        (total, rating, index) =>
            total + rating * weights[index],
        0
    );

    currentScore = Math.round((weightedAverage / 5) * 100);

    assessmentCompleted = true;

    const level =
        currentScore >= 80 ? "Excellent 🌟" :
        currentScore >= 60 ? "Good 👍" :
        currentScore >= 40 ? "Developing 📚" :
        "Beginner 🌱";

    getElement("scoreNumber").textContent = currentScore + "%";
    getElement("skillLevel").textContent = level;

    getElement("scoreStatus").textContent =
        "Your role-based readiness estimate";

    getElement("assessmentMessage").textContent =
        `Your readiness estimate is ${currentScore}%. Keep improving! 🚀`;

    createRoadmap(ratings, role);

    showToast("Assessment completed successfully!");

    getElement("dashboard").scrollIntoView({
        behavior: "smooth"
    });
}


/* =====================================
   PERSONALIZED LEARNING ROADMAP
===================================== */

function createRoadmap(ratings, role) {

    const skillNames = roleSkills[role] || roleSkills.Other;

    const roadmap = getElement("roadmapList");

    roadmap.replaceChildren();

    const improvementSkills = ratings
        .map((rating, index) => ({
            rating,
            skill: skillNames[index]
        }))
        .filter(item => item.rating <= 3)
        .sort((a, b) => a.rating - b.rating);

    if (improvementSkills.length === 0) {

        const item = document.createElement("li");

        item.textContent =
            "🌟 Excellent! Continue practising and building projects.";

        roadmap.appendChild(item);

    } else {

        improvementSkills.forEach(item => {

            const li = document.createElement("li");

            li.textContent =
                `📌 Improve ${item.skill} through regular practice.`;

            roadmap.appendChild(li);
        });
    }

    const project = document.createElement("li");

    project.textContent =
        `🚀 Build a practical project related to ${role}.`;

    roadmap.appendChild(project);

    const practice = document.createElement("li");

    practice.textContent =
        "🎤 Practise technical and HR mock interviews regularly.";

    roadmap.appendChild(practice);
}


/* =====================================
   MOCK INTERVIEW
===================================== */

function getQuestionPool() {

    const role = studentProfile?.role ||
        getElement("targetRole").value ||
        "Other";

    const hrQuestions = questions.HR;
    const technicalQuestions = questions[role] || questions.Other;

    return [
        ...hrQuestions,
        ...technicalQuestions
    ];
}

function generateQuestion() {

    const pool = getQuestionPool();

    const available = pool.filter(
        question => question !== currentQuestion
    );

    const nextQuestion = available[
        Math.floor(Math.random() * available.length)
    ];

    currentQuestion = nextQuestion;

    getElement("questionBox").textContent = currentQuestion;

    getElement("answerInput").value = "";

    getElement("feedbackBox").style.display = "none";
}


/* =====================================
   ANSWER EVALUATION
===================================== */

function evaluateAnswer() {

    const answer = getElement("answerInput").value.trim();

    const feedback = getElement("feedbackBox");

    if (answer.length < 10) {
        showToast("Please enter a meaningful answer.");
        return;
    }

    const words = answer.split(/\s+/).filter(Boolean);

    const wordCount = words.length;

    const sentences = answer
        .split(/[.!?]+/)
        .filter(sentence => sentence.trim().length > 0);

    const hasExample =
        /\b(example|project|experience|developed|created|worked)\b/i.test(answer);

    const hasStructure =
        /\b(because|therefore|first|finally|result|learned)\b/i.test(answer);

    let feedbackMessages = [];

    if (wordCount < 20) {
        feedbackMessages.push(
            "Your answer is short. Add more relevant details."
        );
    } else if (wordCount <= 60) {
        feedbackMessages.push(
            "Good answer length. Try adding more specific details."
        );
    } else {
        feedbackMessages.push(
            "Detailed answer. Keep your explanation focused."
        );
    }

    if (sentences.length < 2) {
        feedbackMessages.push(
            "Try organizing your answer into clear sentences."
        );
    } else {
        feedbackMessages.push(
            "Good effort in explaining your thoughts."
        );
    }

    if (hasExample) {
        feedbackMessages.push(
            "Good! You included an example or experience."
        );
    } else {
        feedbackMessages.push(
            "Try including a real project or practical example."
        );
    }

    if (!hasStructure) {
        feedbackMessages.push(
            "Use a structured explanation to make your answer clearer."
        );
    }

    feedback.replaceChildren();

    const heading = document.createElement("strong");
    heading.textContent = "🧠 Practice Feedback";

    const list = document.createElement("ul");

    feedbackMessages.forEach(message => {
        const item = document.createElement("li");
        item.textContent = message;
        list.appendChild(item);
    });

    const count = document.createElement("p");
    count.textContent = `📝 Word count: ${wordCount}`;

    const note = document.createElement("p");
    note.textContent =
        "Note: This is automated demo feedback, not an AI assessment.";

    feedback.append(heading, list, count, note);

    feedback.style.display = "block";

    showToast("Practice feedback generated!");
}


/* =====================================
   BASIC TESTING
===================================== */

function runBasicTests() {

    console.assert(
        getRatings().length === 5,
        "Test failed: Five skill ratings should exist."
    );

    console.assert(
        currentScore >= 0 && currentScore <= 100,
        "Test failed: Score must be between 0 and 100."
    );

    console.assert(
        typeof toggleTheme === "function",
        "Test failed: Theme function missing."
    );

    console.log("InterviewIQ basic tests executed.");
}


/* =====================================
   INITIALIZATION
===================================== */

document.addEventListener("DOMContentLoaded", () => {

    loadTheme();

    loadProfile();

    skillIds.forEach(id => updateRating(id));

    runBasicTests();

});
