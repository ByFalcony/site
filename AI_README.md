# Emir Kılıç Portfolio - AI Instruction Guide

This file is prepared for AI assistants that will make changes to this project.

## 🤖 AI Instructions

### 1. Adding Content (Blog/Learning Log)
To add a new blog post, **you DO NOT need to change any HTML or JS files.**
Just open `src/data/blog.json` and add a new object to the beginning of the list:
```json
{
  "id": "unique-id",
  "title": "Post Title",
  "date": "YYYY-MM-DD",
  "excerpt": "Short summary",
  "tags": ["Tag1", "Tag2"],
  "content": "All content goes here."
}
```

### 2. Updating Site Information
To change the home page title, about text, or contact links, edit the `src/data/config.json` file.

### 3. Changing Design and Colors
To change the site's color palette or fonts, update the CSS variables under `:root` in the `src/styles/main.css` file. Specifically, the `--accent` variable controls the base accent color of the entire site.

## 🏗️ Architectural Structure
- **Entry:** `index.html` (Semantic structure)
- **Logic:** `main.js` (Fetches JSON data and injects it into HTML)
- **Style:** `src/styles/main.css` (Modern Dark Theme)
- **Data:** `src/data/*.json` (The heart of the content)

This structure separates the content from the code, allowing it to be managed flawlessly by AI.
