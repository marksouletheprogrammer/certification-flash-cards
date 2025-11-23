# AGENTS.md - Project Guide for AI Assistants

## Project Overview

**Certification Flash Cards** is a client-side web application for studying IT certifications. It runs entirely in the browser without requiring a server (works with `file://` protocol). The app supports multiple certifications with flashcard data stored in separate JavaScript files.

## Architecture

### Design Principles

1. **Separation of Concerns** - HTML (structure), CSS (styling), JavaScript (logic) are in separate files
2. **No Build Process** - Direct JavaScript files, no transpilation or bundling
3. **No Server Required** - Uses regular `<script>` tags (not ES6 modules) to work with `file://` protocol
4. **Client-Side Only** - All data and logic runs in the browser

### File Structure

```
certification-flash-cards/
├── index.html              # HTML structure only (185 lines)
├── styles.css              # All styling, theme variables (528 lines)
├── app.js                  # All application logic (514 lines)
├── aws-flashcards.js       # AWS certification flashcard data
├── ccco-flashcards.js      # Confluent Cloud Operator flashcard data
├── ccdak-flashcards.js     # Confluent Kafka Developer flashcard data
├── README.md               # User-facing documentation
└── AGENTS.md               # This file - AI agent documentation
```

## File Dependencies

```
index.html
├── styles.css              (styling)
├── aws-flashcards.js       (defines: awsFlashcards)
├── ccco-flashcards.js      (defines: cccoFlashcards)
├── ccdak-flashcards.js     (defines: ccdakFlashcards)
└── app.js                  (main logic, expects above variables)
```

**Load Order:** Flashcard data files must load before `app.js` because `app.js` references the global variables they define.

## Core Files

### index.html (185 lines)
- **Purpose:** HTML structure only, no inline styles or scripts
- **Structure:** 3 screens (cert selection, card display, finish screen)
- **Key IDs:** All interactive elements have IDs for JavaScript manipulation
- **Modification:** Only modify when adding new UI elements or changing page structure

### styles.css (528 lines)
- **Purpose:** All styling and theme definitions
- **Features:**
  - CSS variables for light/dark themes
  - Responsive design
  - Card flip animations
  - Search/filter animations
- **Theme System:** Uses `data-theme` attribute on `<html>` element
- **Modification:** Edit for visual changes, new components, or theme adjustments

### app.js (514 lines)
- **Purpose:** All application logic
- **Key Components:**
  - Theme management (localStorage persistence)
  - DOM element references (all `getElementById` calls)
  - App state (current card, scores, etc.)
  - Card navigation (prev/next/flip)
  - Search/filter functionality
  - Session management (start/restart/finish)
- **Global Variables Used:**
  - `awsFlashcards` (from aws-flashcards.js)
  - `cccoFlashcards` (from ccco-flashcards.js)
  - `ccdakFlashcards` (from ccdak-flashcards.js)
- **Modification:** Edit for new features, bug fixes, or behavior changes

### Flashcard Data Files (3 files)
- **Purpose:** Store flashcard content as JavaScript arrays
- **Format:**
  ```javascript
  const awsFlashcards = [
    {
      "id": 1,
      "front": "Question text",
      "back": "Answer text"
    },
    // ... more cards
  ];
  ```
- **Note:** AWS uses `front`/`back`, Confluent certs use `question`/`answer`
- **Modification:** Add/edit/remove flashcards here

## Workflow for Common Tasks

### Adding New Flashcards

1. Open the appropriate `.js` file (e.g., `aws-flashcards.js`)
2. Add a new object to the array:
   ```javascript
   {
     "id": 129,  // Use next available ID
     "front": "Your question?",
     "back": "Your answer."
   }
   ```
3. Save the file
4. Refresh browser - changes appear immediately

### Adding a New Certification

1. **Create data file:**
   - Create `newcert-flashcards.js`
   - Define: `const newcertFlashcards = [ /* cards */ ];`

2. **Update index.html:**
   - Add `<script src="newcert-flashcards.js"></script>` before `app.js`
   - Add certification card in cert-select-screen section

3. **Update app.js:**
   - Add button reference in DOM Elements section
   - Add event listener in `initApp()`
   - Add case in `setCertification()` function

### Modifying Styles

1. Open `styles.css`
2. Find relevant section (well-commented)
3. Modify CSS variables for theme changes
4. Modify component styles for layout changes
5. Save and refresh browser

### Debugging

**Check Load Order:**
- Open browser console
- Verify no "undefined" errors for flashcard arrays
- Flashcard scripts must load before `app.js`

**Common Issues:**
- ES6 modules don't work with `file://` - use regular `<script>` tags
- CORS errors mean you tried to use `import/export` - don't do this
- Theme not persisting - check localStorage in DevTools
- Cards not shuffling - verify Fisher-Yates algorithm in `shuffleArray()`

## Important Conventions

### Naming Conventions
- **Files:** kebab-case (e.g., `aws-flashcards.js`)
- **IDs:** kebab-case (e.g., `search-input`)
- **CSS Classes:** kebab-case (e.g., `.cert-card`)
- **JavaScript Variables:** camelCase (e.g., `currentCardIndex`)
- **Constants:** camelCase for arrays (e.g., `awsFlashcards`)

### Code Organization
- **app.js sections:**
  1. Theme management
  2. DOM element references
  3. App state variables
  4. Utility functions (shuffle, etc.)
  5. Core functions (navigation, display, etc.)
  6. Search functionality
  7. Event listeners (in `initApp()`)

### State Management
- No framework - pure JavaScript
- State stored in variables at top of `app.js`
- localStorage used only for theme preference
- No URL routing - screen switching via class toggles

## Technical Constraints

### MUST NOT Use
- ❌ ES6 `import/export` - breaks `file://` protocol
- ❌ Build tools (webpack, vite, etc.) - keep it simple
- ❌ Node.js or server - must work offline
- ❌ External data fetching - all data embedded

### MUST Use
- ✅ Regular `<script>` tags with `src` attribute
- ✅ Global variables for data sharing between scripts
- ✅ Plain JavaScript (ES5/ES6 features that work in browsers)
- ✅ CSS custom properties for theming

## Feature Checklist

Current features:
- ✅ Multiple certification support (3 certs)
- ✅ Card shuffling (Fisher-Yates algorithm)
- ✅ Progress tracking (correct/total)
- ✅ Search/filter cards by keyword
- ✅ Light/dark theme toggle
- ✅ Keyboard-friendly navigation
- ✅ Previous/next card navigation
- ✅ Card flip animation
- ✅ Session completion screen with stats

## Testing Procedure

**Manual Testing Checklist:**
1. ✅ Open `index.html` in browser (use `file://`)
2. ✅ Select each certification - verify cards load
3. ✅ Navigate through cards - prev/next work
4. ✅ Flip cards - front/back display correctly
5. ✅ Mark correct/incorrect - scores update
6. ✅ Search cards - filter works
7. ✅ Clear search - original cards restore
8. ✅ Complete session - stats screen shows
9. ✅ Toggle theme - preference persists
10. ✅ Restart session - cards reshuffle

## Common Pitfalls for AI Agents

1. **Don't use ES6 modules** - Users work with `file://`, not `http://`
2. **Don't inline code back** - Keep HTML, CSS, JS separate
3. **Don't add build steps** - This is intentionally simple
4. **Don't break the load order** - Data files before app.js
5. **Don't remove global variables** - They're how files communicate
6. **Don't add frameworks** - Pure JavaScript is the design choice
7. **Don't change flashcard format** - Other files depend on it

## Maintenance Guidelines

**Before Making Changes:**
- Understand the separation of concerns
- Check which file(s) need modification
- Verify no dependencies will break

**After Making Changes:**
- Test in browser with `file://` protocol
- Verify theme toggle still works
- Check all three certifications load
- Ensure search/filter works

**When Stuck:**
- Check browser console for errors
- Verify script load order in index.html
- Confirm variable naming matches between files
- Review this AGENTS.md file

## Project History

This project was built entirely with AI assistance (Cursor + Claude). The original implementation had all code inline in a single HTML file. It was refactored to follow clean code principles with proper separation of concerns while maintaining the constraint of working without a server.

## Future Considerations

If expanding the project, consider:
- Add more certifications (follow "Adding New Certification" workflow)
- Spaced repetition algorithm (modify scoring in app.js)
- Export/import custom card sets (add file handling)
- Statistics dashboard (new screen in index.html + app.js)
- Keyboard shortcuts (add event listeners in app.js)

**Do NOT consider:**
- Adding a backend (violates offline-first principle)
- Using build tools (violates simplicity principle)
- Framework migration (unnecessary complexity)
