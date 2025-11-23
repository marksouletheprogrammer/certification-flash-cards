# Certification Flash Cards

A web-based study application for IT certifications featuring interactive flashcards and multiple-choice practice quizzes. The application runs entirely in your browser with no server required.

## Features

- **Flashcards**: Study with traditional flashcards for AWS, Confluent Cloud Operator, and Kafka Developer certifications
- **Practice Quizzes**: Test your knowledge with multiple-choice questions (currently Pokemon quiz as example)
- **Review Mode**: Hide answers until the end and review all questions before final submission
- **Question Navigation**: Move freely between questions, change answers, and review your selections
- **Smart Shuffling**: Questions and answer options randomize each time
- **Progress Tracking**: See your score and success rate
- **Theme Toggle**: Switch between light and dark modes for comfortable studying
- **Offline First**: Works completely offline - no internet required

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or internet connection required (runs entirely in the browser)

### Installation

1. Clone or download this repository to your local machine
2. Open the `index.html` file directly in your web browser

That's it! No build process, server, or installation required.

## Managing Content

All study content is stored in JavaScript files (`.js` files), not JSON. The app loads these files using standard `<script>` tags, so no server is needed - it works perfectly with `file://` URLs!

### Content Types

1. **Flashcards** - Traditional front/back study cards
2. **Quizzes** - Multiple choice questions with explanations

### Flashcard Files

1. Open the relevant flashcard file:
   - `aws-flashcards.js` - AWS Certified Solutions Architect Associate
   - `ccco-flashcards.js` - Confluent Certified Cloud Operator
   - `ccdak-flashcards.js` - Confluent Certified Developer for Apache Kafka

2. Edit the flashcard array directly in the file (front/back or question/answer format):
   ```javascript
   const awsFlashcards = [
     {
       "id": 1,
       "front": "Your question here?",
       "back": "Your answer here."
     },
     // ... more flashcards
   ];
   ```

3. Save the file

4. Refresh your browser - changes will appear immediately!

### Quiz Files

1. Open the quiz file (e.g., `pokemon-quiz.js`)

2. Edit the quiz array:
   ```javascript
   const pokemonQuiz = [
     {
       "id": 1,
       "question": "Your question text?",
       "options": [
         "Option A",
         "Option B", 
         "Option C",
         "Option D"
       ],
       "correctAnswer": 0,  // Index of correct option (0 = A, 1 = B, etc.)
       "explanation": "Why this answer is correct"
     },
     // ... more questions
   ];
   ```

3. Save the file and refresh your browser

**Note:** Quizzes support 2-6+ options per question. Options and questions are shuffled automatically.

### Data Formats

**Flashcard Format:**
- `id` - Unique number
- `front`/`back` (AWS) or `question`/`answer` (Confluent certs)

**Quiz Format:**
- `id` - Unique number  
- `question` - Question text
- `options` - Array of possible answers (2-6+ options)
- `correctAnswer` - Index of correct option (0-based)
- `explanation` - Why the answer is correct

## Quiz Features

### Review Mode

Toggle the eye icon (👁️) on the quiz card to enable **Review Mode**:
- **OFF** (eye-slash): See feedback immediately after each answer
- **ON** (eye): Hide all feedback until you finish and submit

### Navigation

- **Previous/Next buttons**: Navigate freely between questions
- **Auto-submit in Review Mode**: Answers save automatically when you click an option
- **Change answers anytime**: In Review Mode, change your selection before final submission

### Review Screen

Before seeing your final score:
1. Click "Review Answers" on the last question
2. See a grid showing all questions (✓ = answered, ! = unanswered)
3. Click any question to review or change your answer
4. Click "Submit Quiz" when ready to see results

## How I made this.

This was all made with Cursor and Claude 3.5/3.7 agents. The only human written code was code to add new flash cards. Inspired by [Andrej Karpathy's How I use LLMs](https://www.youtube.com/watch?v=EWvNQjAaOHw) and [Claudio Lassala's Breaking the Code Barrier: My First True No-Code AI Experience](https://lassala.net/2025/03/06/breaking-the-code-barrier-my-first-true-no-code-ai-experience/). 

Here are the prompts I used:

### Prompt 1

Initial prompt from an empty project.

```
Create a flash card app for studying for the AWS Certified Solutions Architect Associate exam. It should be runnable in local browser and will read data from flashcards.json. The look and feel of the web page should be familiar to a power user of AWS. All work will be done in this directory.
Acceptance criteria:
- Flash cards are ready from flashcards.json. This is how flashcards will be removed, added, and editted for the app.
- The cards should be shuffled between each play through.
- The user sees the front of the card initially, then sees the back of the card when they want to reveal it.
- The user should be able to track how many they got correct.
Scenarios:
Scenario 1: User starts a study session.
When the user opens the webpage, the flashcards should be loaded from flashcards.json.
Initially, the user does not see any flashcards, but they are invited to start a study session.
Scenario 2: Start a study session.
When the user starts a study session the flashcards are shuffled and the user is shown the front of the first card.
The user can choose to reveal the back of the card, go to the next card, or go to the previous card, or restart.
Scenario 3: Recording progress.
The user can indicate if they guessed correctly or not when they see the back of the card.
They should be able to see how many they guessed right out of the total cards in the deck.
Scenario 4: Restarting session.
If the user decided to restart, then cards are shuffled and they start from the beginning of the deck.
Progress is reset.
Scenario 5: Shuffling the deck.
When the deck is shuffled, it does not edit flashcards.json. Shuffling should be done in memory only.
Scenario 6: Finishing session.
When the user has finished a session, they are shown their progress and given the option to restart.
```

Everything generally worked pretty well.

### Prompt 2

I decided to make it support more than 1 certification type.

```
Make a change to the flash card app such that it can support more than 1 certification. Users will be able to study for AWS Certified Solutions Architect Associate exam or the Confluent Certified Developer for Apache Kafka exam. AWS flashcards are in aws-flashcards.json and CCDAK flashcards are in ccdak-flashcards.json. 
Acceptance criteria:
- Users should be able to do a study session with either AWS or CCDAK, not both.
- The look and feel should not change.
- The workflow of a study session should not change.
- How the app is launched should not change.
Scenarios:
Scenario 1: User opens the page.
When the user opens the webpage, they will have the choice between AWS study session or CCDAK study session. They have to pick one.
Scenario 2: User picks a study session.
When the user selects a study session, the flash card app should work exactly as it did before this change.
Scenario 3: Switching study sessions.
There should be a button in the top left corner to go back to the study session select screen.
This wipes out all progress.
```

The result was a bit clunky but overall worked.

### Prompt 3

I was not happy with the layout and styling.

```
We are going to change the look and feel of this app. Currently it is styled in a way that is familiar to AWS. We will change this and it will affect all parts of the app so everything has the same look at feel.
Acceptance criteria:
- The application will be named Certification Flash Cards.
- Color scheme should be one that supports concentation, memory retention, and reduce eye strain.
- There shoul be a comfortable contract between text and background.
- Light mode and dark mode options available.
- It should be reminiscent of a college library.
Scenarios:
Scenario 1: Color mode
There should be a light mode and dark mode that the user can toggle between. 
Both modes adhere to acceptance criteria.
```

The result of this was very buggy. I had to go back and forth with Claude about a dozen times to fix bugs. I fixed one at a time. Not all prompts are listed here but you get the idea.