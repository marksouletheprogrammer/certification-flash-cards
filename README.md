# Certification Flash Cards

A web-based flash card application for studying for various IT certifications. The application allows you to test your knowledge of certification concepts through interactive flash cards.

## Features

- Support for multiple certifications:
  - AWS Certified Solutions Architect Associate
  - Confluent Certified Developer for Apache Kafka (CCDAK)
- Embedded flash cards for offline use
- Shuffle cards between each play through
- View front (question) and back (answer) of each card
- Track correct answers and progress
- Restart study sessions with reshuffled cards
- Certification-specific styling and branding

## Getting Started

### Prerequisites

- A modern web browser (Chrome, Firefox, Safari, Edge)
- No server or internet connection required (runs entirely in the browser)

### Installation

1. Clone or download this repository to your local machine
2. Open the `index.html` file directly in your web browser

That's it! No build process, server, or installation required.

## How It Works

This application has the flashcards for multiple certifications embedded directly in the HTML file, which means:

- No server is required
- No internet connection is needed
- You can run it by simply opening the HTML file in your browser
- It works offline

## Using the Application

1. Open the `index.html` file in your web browser
2. Select which certification you want to study for:
   - AWS Certified Solutions Architect Associate
   - Confluent Certified Developer for Apache Kafka
3. Click "Start Study Session" to begin
4. Read the question on the front of the card
5. Click "Reveal Answer" to see the answer
6. Mark whether you got it correct or incorrect
7. Navigate through cards using the Previous and Next buttons
8. View your progress at the top of the screen
9. When finished, see your final score and success rate
10. Click "Start New Session" to restart with reshuffled cards
11. Use the "Back to Certifications" button to switch to a different certification

## Adding Your Own Flash Cards

To add your own flashcards or modify existing ones, edit the appropriate array in the `index.html` file:

- For AWS: Edit the `awsFlashcards` array
- For Kafka: Edit the `ccdakFlashcards` array

Each flashcard should follow this format:

```javascript
{
    "id": 1,
    "front": "Question text goes here",
    "back": "Answer text goes here"
}
```

## Adding New Certifications

To add a new certification:

1. Create a new flashcard array in the JavaScript section
2. Add a new certification card in the selection screen
3. Update the `setCertification` function to handle the new certification type

## License

This project is open source and available under the MIT License.

## Acknowledgments

- AWS for providing the inspiration for the design
- All contributors to the flash card content 