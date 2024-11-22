# HTML to PPTX Converter

A simple React app that converts HTML content into PowerPoint presentations (`.pptx`) using the `PptxGenJS` library. This app allows you to input HTML content, which is then parsed and converted into a PowerPoint presentation with separate slides for each section.

## Features

- Convert HTML content with headings, paragraphs, images, and tables to PowerPoint slides.
- Automatically handles HTML content and generates corresponding slides.
- Includes an interactive interface for pasting HTML or typing content.
- Button becomes disabled if the HTML content is invalid or empty.

## Technologies

- React.js
- PptxGenJS library (for PowerPoint generation)
- HTML and CSS

## Installation

To set up the project locally, follow these steps:

1. **Clone the repository**:
    ```bash
    git clone https://github.com/SoorajVp/html-to-pptx.git
    
    cd html-to-pptx
    ```

2. **Install the dependencies**:
    ```bash
    npm install
    ```

3. **Start the development server**:
    ```bash
    npm start
    ```

    The app will be available at `http://localhost:3000`.

## Usage

1. **Enter your HTML content**:
    - You can directly type or paste your HTML content into the textarea.
    - The content must be valid HTML (including `<h1>`, `<p>`, `<table>`, and other tags).
  
2. **Convert to PowerPoint**:
    - Click the **Convert to PPTX** button to generate the `.pptx` file from the HTML content.
    - The application will automatically create a slide for each section of content (e.g., a new slide for each `<hr>` tag).

3. **Paste content**:
    - If you have HTML content in your clipboard, use the **Paste** button to automatically insert it into the textarea.

4. **Button states**:
    - The **Convert to PPTX** button will be disabled if the content is empty or invalid HTML.

## How it Works

The app uses the [PptxGenJS](https://gitbrent.github.io/PptxGenJS/docs/html-to-powerpoint/) library to generate PowerPoint presentations from HTML content. It parses the HTML and adds content (like headings, paragraphs, tables, and images) to the slides. Each section of content separated by an `<hr>` tag is added to a new slide.

### Supported HTML Tags

- **`<h1>`, `<h2>`, `<h3>`, ...**: These are converted to slide titles.
- **`<p>`**: Paragraphs are converted to text boxes on slides.
- **`<table>`**: Tables are converted to tables in the PowerPoint slides.
- **`<img>`**: Images are inserted into the slides.

### Known Limitations

- The app only supports basic HTML elements like text, headings, images, and tables.
- Complex HTML features like forms, scripts, or advanced CSS are not supported.
- Styles are not fully replicated from HTML to the PowerPoint slides (only basic ones like color, font size).

## Dependencies

- [React](https://reactjs.org/)
- [PptxGenJS](https://gitbrent.github.io/PptxGenJS/docs/html-to-powerpoint/)

### Installation of PptxGenJS

To include the PptxGenJS library in your project, run the following command:

```bash
npm install pptxgenjs
