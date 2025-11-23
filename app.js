// Certification Flash Cards - Main Application Logic

// Theme Management
const themeToggle = document.getElementById("theme-toggle");
const themeIcon = themeToggle.querySelector("i");
const html = document.documentElement;

// Check for saved theme preference
const savedTheme = localStorage.getItem("theme") || "light";
html.setAttribute("data-theme", savedTheme);
updateThemeToggle(savedTheme);

// Theme toggle functionality
themeToggle.addEventListener("click", () => {
    const currentTheme = html.getAttribute("data-theme");
    const newTheme = currentTheme === "light" ? "dark" : "light";

    html.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    updateThemeToggle(newTheme);
});

function updateThemeToggle(theme) {
    if (theme === "dark") {
        themeIcon.className = "fas fa-moon";
    } else {
        themeIcon.className = "fas fa-sun";
    }
}

// DOM Elements
const certSelectScreen =
    document.getElementById("cert-select-screen");
const cardScreen = document.getElementById("card-screen");
const finishScreen = document.getElementById("finish-screen");

const awsCertBtn = document.getElementById("aws-cert");
const kafkaCertBtn = document.getElementById("kafka-cert");
const backToCertsFromCardsBtn = document.getElementById(
    "back-to-certs-from-cards",
);
const backToCertsFromFinishBtn = document.getElementById(
    "back-to-certs-from-finish",
);

const restartBtn = document.getElementById("restart-btn");
const restartFinishBtn =
    document.getElementById("restart-finish-btn");
const prevBtn = document.getElementById("prev-btn");
const nextBtn = document.getElementById("next-btn");
const flipBtn = document.getElementById("flip-btn");
const correctBtn = document.getElementById("correct-btn");
const incorrectBtn = document.getElementById("incorrect-btn");

const questionEl = document.getElementById("question");
const answerEl = document.getElementById("answer");
const flashcard = document.getElementById("flashcard");
const progressFill = document.getElementById("progress-fill");
const correctCount = document.getElementById("correct-count");
const totalCount = document.getElementById("total-count");
const finalCorrect = document.getElementById("final-correct");
const finalTotal = document.getElementById("final-total");
const successRate = document.getElementById("success-rate");

const certTitle = document.getElementById("cert-title");
const currentCertTitle =
    document.getElementById("current-cert-title");

// Flashcard data is loaded from separate script tags above
// - aws-flashcards.js defines: awsFlashcards
// - ccco-flashcards.js defines: cccoFlashcards
// - ccdak-flashcards.js defines: ccdakFlashcards

// App State
let flashcards = [];
let currentCardIndex = 0;
let correctAnswers = 0;
let answeredCards = new Set();
let currentCertification = "";

// Note: Flashcard data is now imported from separate .js files
// To add/edit flashcards, edit the respective .js files:
// - aws-flashcards.js
// - ccco-flashcards.js
// - ccdak-flashcards.js

// Shuffle array using Fisher-Yates algorithm
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Set certification
function setCertification(certType) {
    currentCertification = certType;

    if (certType === "aws") {
        flashcards = awsFlashcards;
        currentCertTitle.textContent =
            "AWS Certified Solutions Architect Associate";
    } else if (certType === "kafka") {
        flashcards = ccdakFlashcards;
        currentCertTitle.textContent =
            "Confluent Certified Developer for Apache Kafka";
    } else if (certType === "ccco") {
        flashcards = cccoFlashcards;
        currentCertTitle.textContent =
            "Confluent Certified Cloud Operator";
    }

    // Reset search state
    originalFlashcards = [];
    isFiltering = false;
    searchInput.value = "";
    clearSearchBtn.classList.remove("visible");
    searchResults.classList.remove("visible");

    // Remove filtered mode indicator
    document
        .querySelector(".feedback-controls")
        .classList.remove("filtered-mode");

    totalCount.textContent = flashcards.length;
    startSession();
}

// Initialize the app
function initApp() {
    // Add event listeners for certification selection
    awsCertBtn.addEventListener("click", () =>
        setCertification("aws"),
    );
    kafkaCertBtn.addEventListener("click", () =>
        setCertification("kafka"),
    );
    document
        .getElementById("ccco-cert")
        .addEventListener("click", () => setCertification("ccco"));

    // Add event listeners for back buttons
    backToCertsFromCardsBtn.addEventListener(
        "click",
        backToCertSelection,
    );
    backToCertsFromFinishBtn.addEventListener(
        "click",
        backToCertSelection,
    );

    // Add event listeners for study session
    restartBtn.addEventListener("click", restartSession);
    restartFinishBtn.addEventListener("click", restartSession);
    prevBtn.addEventListener("click", showPreviousCard);
    nextBtn.addEventListener("click", showNextCard);
    flipBtn.addEventListener("click", flipCard);
    correctBtn.addEventListener("click", () => markCard(true));
    incorrectBtn.addEventListener("click", () => markCard(false));

    // Initialize search functionality
    initSearchFunctionality();
}

// Back to certification selection
function backToCertSelection() {
    // Reset state
    currentCardIndex = 0;
    correctAnswers = 0;
    answeredCards = new Set();
    correctCount.textContent = "0";

    // Reset search state
    originalFlashcards = [];
    isFiltering = false;
    searchInput.value = "";
    clearSearchBtn.classList.remove("visible");
    searchResults.classList.remove("visible");

    // Remove filtered mode indicator
    document
        .querySelector(".feedback-controls")
        .classList.remove("filtered-mode");

    showScreen(certSelectScreen);
}

// Start a new study session
function startSession() {
    flashcards = shuffleArray(flashcards);
    currentCardIndex = 0;
    correctAnswers = 0;
    answeredCards = new Set();

    correctCount.textContent = correctAnswers;

    showScreen(cardScreen);
    updateCardDisplay();
}

// Restart the session
function restartSession() {
    startSession();
}

// Show a specific screen
function showScreen(screen) {
    certSelectScreen.classList.remove("active");
    cardScreen.classList.remove("active");
    finishScreen.classList.remove("active");

    screen.classList.add("active");
}

// Update the card display
function updateCardDisplay() {
    if (flashcards.length === 0) {
        // No matching cards found
        questionEl.textContent = "No matching cards found";
        answerEl.textContent = "";

        // Disable navigation and feedback buttons
        prevBtn.disabled = true;
        nextBtn.disabled = true;
        flipBtn.disabled = true;
        correctBtn.disabled = true;
        incorrectBtn.disabled = true;

        // Update progress bar to 0
        progressFill.style.width = "0%";
        return;
    }

    // Re-enable flip button if it was disabled
    flipBtn.disabled = false;

    const currentCard = flashcards[currentCardIndex];

    // Update only the question first
    questionEl.textContent =
        currentCard.front || currentCard.question;

    // Only update the answer when the card is flipped
    if (flashcard.classList.contains("flipped")) {
        answerEl.textContent =
            currentCard.back || currentCard.answer;
    } else {
        // Clear the answer text when not flipped
        answerEl.textContent = "";
    }

    // Update progress bar
    const progress =
        ((currentCardIndex + 1) / flashcards.length) * 100;
    progressFill.style.width = `${progress}%`;

    // Update navigation buttons
    prevBtn.disabled = currentCardIndex === 0;
    nextBtn.disabled = currentCardIndex >= flashcards.length - 1;

    // Disable feedback buttons when card is not flipped
    correctBtn.disabled = true;
    incorrectBtn.disabled = true;

    // Update flip button text
    flipBtn.textContent = "Reveal Answer";
}

// Flip the card
function flipCard() {
    flashcard.classList.toggle("flipped");

    if (flashcard.classList.contains("flipped")) {
        // Only load the answer content when the card is flipped
        const currentCard = flashcards[currentCardIndex];
        answerEl.textContent =
            currentCard.back || currentCard.answer;

        flipBtn.textContent = "Hide Answer";
        // Enable feedback buttons only when card is flipped AND not filtering
        if (!isFiltering) {
            correctBtn.disabled = false;
            incorrectBtn.disabled = false;
        }
    } else {
        // Clear the answer when flipping back to front
        answerEl.textContent = "";

        flipBtn.textContent = "Reveal Answer";
        correctBtn.disabled = true;
        incorrectBtn.disabled = true;
    }
}

// Show the previous card
function showPreviousCard() {
    if (currentCardIndex > 0) {
        // Reset the card to front side
        flashcard.classList.remove("flipped");
        // Clear the answer
        answerEl.textContent = "";

        currentCardIndex--;
        updateCardDisplay();
    }
}

// Show the next card
function showNextCard() {
    if (currentCardIndex < flashcards.length - 1) {
        // Reset the card to front side
        flashcard.classList.remove("flipped");
        // Clear the answer
        answerEl.textContent = "";

        currentCardIndex++;
        updateCardDisplay();
    } else {
        finishSession();
    }
}

// Mark a card as correct or incorrect
function markCard(isCorrect) {
    // Only count each card once
    if (!answeredCards.has(currentCardIndex)) {
        if (isCorrect) {
            correctAnswers++;
            correctCount.textContent = correctAnswers;
        }
        answeredCards.add(currentCardIndex);
    }

    // Reset the card to front side
    flashcard.classList.remove("flipped");
    // Clear the answer
    answerEl.textContent = "";

    if (currentCardIndex < flashcards.length - 1) {
        currentCardIndex++;
        updateCardDisplay();
    } else {
        finishSession();
    }
}

// Finish the session
function finishSession() {
    finalCorrect.textContent = correctAnswers;
    finalTotal.textContent = flashcards.length;

    const rate =
        flashcards.length > 0
            ? Math.round((correctAnswers / flashcards.length) * 100)
            : 0;
    successRate.textContent = `${rate}%`;

    showScreen(finishScreen);
}

// Initialize the app when the DOM is loaded
document.addEventListener("DOMContentLoaded", initApp);

// Search Functionality
const searchInput = document.getElementById("search-input");
const clearSearchBtn = document.getElementById("clear-search");
const searchResults = document.getElementById("search-results");
const filteredCount = document.getElementById("filtered-count");

// Original set of flashcards before filtering
let originalFlashcards = [];
let isFiltering = false;

// Add event listeners for search functionality
function initSearchFunctionality() {
    searchInput.addEventListener("keyup", function (e) {
        const query = this.value.trim().toLowerCase();

        // Show/hide clear button
        if (query.length > 0) {
            clearSearchBtn.classList.add("visible");
        } else {
            clearSearchBtn.classList.remove("visible");
        }

        // If Enter key is pressed, perform search
        if (e.key === "Enter" && query.length > 0) {
            performSearch(query);
        }

        // If backspace to empty, restore original cards
        if (query.length === 0 && isFiltering) {
            clearSearch();
        }
    });

    clearSearchBtn.addEventListener("click", clearSearch);
}

// Perform search on flashcards
function performSearch(query) {
    if (!isFiltering) {
        // Store original flashcards if this is the first filter
        originalFlashcards = [...flashcards];
        isFiltering = true;
    }

    // Animate card fading out
    flashcard.classList.add("filtering-out");

    // Wait for animation to complete
    setTimeout(() => {
        // Filter flashcards based on query
        const filteredCards = originalFlashcards.filter((card) => {
            const question = (
                card.front ||
                card.question ||
                ""
            ).toLowerCase();
            const answer = (
                card.back ||
                card.answer ||
                ""
            ).toLowerCase();

            // Match any word in the query against any word in question or answer
            const queryWords = query
                .split(" ")
                .filter((word) => word.length > 0);

            return queryWords.some(
                (word) =>
                    question.includes(word) ||
                    answer.includes(word),
            );
        });

        // Update the flashcards array with filtered results
        flashcards = filteredCards;

        // Update filtered count
        filteredCount.textContent = flashcards.length;
        searchResults.classList.add("visible");

        // Reset to first card
        currentCardIndex = 0;
        // Reset card to front face
        flashcard.classList.remove("flipped");

        // Ensure feedback buttons are disabled while filtering
        correctBtn.disabled = true;
        incorrectBtn.disabled = true;

        // Add visual indicator that feedback is disabled during filtering
        document
            .querySelector(".feedback-controls")
            .classList.add("filtered-mode");

        // Show animation for cards coming back in
        flashcard.classList.remove("filtering-out");
        flashcard.classList.add("filtering-in");

        // Update the display
        updateCardDisplay();

        // Remove the filtering-in class after animation completes
        setTimeout(() => {
            flashcard.classList.remove("filtering-in");
        }, 300);
    }, 300); // Match this to the animation duration
}

// Clear search and restore original cards
function clearSearch() {
    if (!isFiltering) return;

    // Animate card fading out
    flashcard.classList.add("filtering-out");

    setTimeout(() => {
        // Restore original flashcards
        flashcards = [...originalFlashcards];
        isFiltering = false;

        // Clear search input and hide clear button
        searchInput.value = "";
        clearSearchBtn.classList.remove("visible");
        searchResults.classList.remove("visible");

        // Remove filtered mode indicator
        document
            .querySelector(".feedback-controls")
            .classList.remove("filtered-mode");

        // Reset to first card
        currentCardIndex = 0;
        // Reset card to front face
        flashcard.classList.remove("flipped");

        // Show animation for cards coming back in
        flashcard.classList.remove("filtering-out");
        flashcard.classList.add("filtering-in");

        // Update the display
        updateCardDisplay();

        // Remove the filtering-in class after animation completes
        setTimeout(() => {
            flashcard.classList.remove("filtering-in");
        }, 300);
    }, 300);
}
