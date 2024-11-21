import React, { useState } from "react";
import pptxgen from "pptxgenjs";

function App() {
  const [htmlContent, setHtmlContent] = useState("");
  const [disabled, setDisabled] = useState(true);


  const handleConvertToPptx = () => {
    const pptx = new pptxgen();

    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlContent;
    console.log("this is tempDiv : ", tempDiv.innerHTML)
    // Extract content from the body of the HTML
    const content = tempDiv.innerHTML
    // const bodyContent = tempDiv.querySelector("body");

    if (!content) {
      console.error("Body content is empty or null.");
      return;
    }

    // Split the body content based on <hr> to create separate slides
    const slidesContent = content.split("<hr>");

    slidesContent.forEach((content, index) => {
      const slide = pptx.addSlide();
      const tempDivContent = document.createElement("div");
      tempDivContent.innerHTML = content;

      let slideYPosition = 0.5; // Starting vertical position

      // Extract all the elements inside the body (like h1, p, img, etc.)
      const h1 = tempDivContent.querySelector("h1");
      const p = tempDivContent.querySelector("p");
      const img = tempDivContent.querySelector("img");
      const table = tempDivContent.querySelector("table");

      // Add h1 content if exists
      if (h1) {
        slide.addText(h1.textContent, {
          x: 0.5,
          y: slideYPosition,
          fontSize: 28,
          color: "#1e90ff", // blue color for the header
          bold: true
        });
        slideYPosition += 1.5; // Adjust the Y position for the next content
      }

      // Add p content if exists
      if (p) {
        slide.addText(p.textContent, {
          x: 0.5,
          y: slideYPosition,
          fontSize: 18
        });
        slideYPosition += 1.5; // Adjust the Y position for the next content
      }

      // Add image if exists
      if (img) {
        slide.addImage({
          path: img.src,
          x: 1,
          y: slideYPosition,
          w: 6,
          h: 3.5,
        });
        slideYPosition += 4; // Adjust the Y position for the next content
      }

      // Add table if exists
      if (table) {
        const rows = Array.from(table.rows).map(row =>
          Array.from(row.cells).map(cell => cell.textContent.trim())
        );

        slide.addTable(rows, {
          x: 0.5,
          y: slideYPosition,
          w: 9,
          colW: Array.from(table.rows[0].cells).map(() => 2),
          border: { pt: 1, color: "000000" },
        });
        slideYPosition += 4; // Adjust the Y position for the next content
      }

      tempDivContent.remove(); // Clean up the temporary div
    });

    pptx.writeFile({ fileName: "Converted-item.pptx" });

  };

  const handlePaste = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setHtmlContent(clipboardText);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = clipboardText;
    const isValidHtml = tempDiv.children.length > 0;

    const content = tempDiv.innerHTML.trim();
    console.log("this is content : ", tempDiv.children[0]);

    setDisabled(!content || !isValidHtml);
  };
  
  const handleChange = (event) => {
    const newHtmlContent = event.target.value;
    setHtmlContent(newHtmlContent);

    // Check if the input is valid HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = newHtmlContent;
    const isValidHtml = tempDiv.children.length > 0;

    const content = tempDiv.innerHTML.trim();
    console.log("this is content : ", tempDiv.children[0]);

    setDisabled(!content || !isValidHtml);
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", backgroundColor: "#edece8" }}>
      <div style={{ textAlign: "center" }}>
        <h1 style={{ textAlign: "center", marginBottom: "10px" }}>HTML to PPTX Converter</h1>
        <p style={{ textAlign: "center", fontSize: "12px", color: "#555", marginBottom: "20px" }}>
          Paste your HTML content below or type manually. <br /> Click "Convert to PPTX" to download as PowerPoint presentation.
        </p>
        <div style={{ display: "flex", justifyContent: "end", width: "100%" }}>
          <button
            onClick={handlePaste}
            style={{
              backgroundColor: "#6d6e6d",
              color: "#fff",
              border: "none",
              padding: "5px 10px",
              fontSize: "12px",
              cursor: "pointer",
            }}
          >
            Paste
          </button>
        </div>
        <textarea
          rows={Math.min(Math.max(htmlContent.split("\n").length, 1), 10)}
          cols="60"
          placeholder="Enter your HTML content here..."
          value={htmlContent}
          onChange={handleChange}
          style={{ width: "97%", padding: "10px", marginBottom: "10px", fontSize: "12px" }}
        ></textarea>
        <button
          onClick={handleConvertToPptx}
          disabled={disabled}
          style={{
            color: "#fff",
            border: "none",
            padding: "10px 20px",
            fontSize: "16px",
            borderRadius: "5px",
            backgroundColor: disabled ? "#449dfc" : "#007bff",
            cursor: disabled ? "not-allowed" : "pointer",
          }}
        >
          Convert to PPTX
        </button>
      </div>
    </div>
  );
}

export default App;
