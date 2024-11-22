import React, { useState } from "react";
import pptxgen from "pptxgenjs";

function App() {
  const [htmlContent, setHtmlContent] = useState("");
  const [disabled, setDisabled] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleConvertToPptx = async () => {
    try {
      setLoading(true)
      const pptx = new pptxgen();

      const tempDiv = document.createElement("div");
      tempDiv.innerHTML = htmlContent;
      const content = tempDiv.innerHTML;

      if (!content) {
        console.error("Body content is empty or null.");
        throw new Error("HTML content is empty or invalid.");
      }

      const slidesContent = content.split("<hr>");

      for (let index = 0; index < slidesContent.length; index++) {
        const slideContent = slidesContent[index];
        const slide = pptx.addSlide();
        const tempDivContent = document.createElement("div");
        tempDivContent.innerHTML = slideContent;

        let slideYPosition = 0.5;

        const h1 = tempDivContent.querySelector("h1");
        const p = tempDivContent.querySelector("p");
        const img = tempDivContent.querySelector("img");
        const table = tempDivContent.querySelector("table");

        if (h1) {
          slide.addText(h1.textContent, {
            x: 0.5,
            y: slideYPosition,
            fontSize: 28,
            color: "#1e90ff",
            bold: true,
          });
          slideYPosition += 1.5;
        }

        if (p) {
          slide.addText(p.textContent, {
            x: 0.5,
            y: slideYPosition,
            fontSize: 18,
          });
          slideYPosition += 1.5;
        }

        if (img && img.src) {
          try {
            const base64Path = await convertImageToBase64(img.src);
            console.log("await convertImageToBase64 ", base64Path)
            slide.addImage({
              data: base64Path,
              x: 1,
              y: slideYPosition,
              w: 6,
              h: 3.5,
            });
            slideYPosition += 4;
          } catch (imageError) {
            console.error(`Image loading failed for URL: ${img.src}`, imageError);
            throw new Error("Failed to load and convert an image.");
          }
        }

        if (table) {
          try {
            const rows = Array.from(table.rows).map((row) =>
              Array.from(row.cells).map((cell) => cell.textContent.trim())
            );
            slide.addTable(rows, {
              x: 0.5,
              y: slideYPosition,
              w: 9,
              colW: Array.from(table.rows[0].cells).map(() => 2),
              border: { pt: 1, color: "000000" },
            });
            slideYPosition += 4;
          } catch (tableError) {
            console.error("Table conversion failed.", tableError);
            throw new Error("Failed to process table content.");
          }
        }

        tempDivContent.remove();
      }

      await pptx.writeFile({ fileName: "converted-item.pptx" });
    } catch (error) {
      console.error("An error occurred:", error.message || error);
      alert(`${error.message || "Something went wrong while converting."}`);
    } finally {
      setLoading(false)
    }
  };

  async function convertImageToBase64(imageUrl) {
    try {
      const proxyUrl = "https://api.allorigins.win/get?url=";
      const encodedImageUrl = encodeURIComponent(imageUrl);
      const imgUrlWithProxy = proxyUrl + encodedImageUrl;

      const response = await fetch(imgUrlWithProxy, {
        method: 'GET',
        headers: {
          'X-Requested-With': 'XMLHttpRequest', // Ensures CORS is handled properly
          'Accept': 'application/json', // Ensures we get JSON response
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch image from proxy, status code: ${response.status}`);
      }

      const data = await response.json();

      if (!data.contents) {
        throw new Error("Image data is not available in the proxy response.");
      }

      return data.contents; // This is the base64 encoded image

    } catch (error) {
      console.error("Error occurred while converting the image:", error);
      throw new Error(`Error loading the image: ${error.message || "Unknown error"}`);
    }
  }



  const handlePaste = async () => {
    const clipboardText = await navigator.clipboard.readText();
    setHtmlContent(clipboardText);
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = clipboardText;
    const isValidHtml = tempDiv.children.length > 0;

    const content = tempDiv.innerHTML.trim();

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
    setDisabled(!content || !isValidHtml);
  };


  return (
    <div className="container">
      <div className="content">
        <h1 className="title">HTML to PPTX Converter</h1>
        <p className="subtitle">
          Paste your HTML content below or type manually. <br /> Click "Convert
          to PPTX" to download as PowerPoint presentation.
        </p>
        <div className="textarea-container">
          <div className="textarea-header">
            <p className="textarea-label">HTML</p>
            <button className="paste-button" onClick={handlePaste}>
              Paste
            </button>
          </div>
          <textarea
            rows={Math.min(Math.max(htmlContent.split('\n').length, 1), 10)}
            cols="70"
            placeholder="Enter your HTML content here..."
            value={htmlContent}
            onChange={handleChange}
            className="textarea"
          ></textarea>
        </div>
        <p className="note">Note: Only the content inside the body tag will be converted.</p>

    <div style={{display: "flex", justifyContent: "center"}}>
        <button
          onClick={handleConvertToPptx}
          disabled={disabled}
            className={`convert-button ${(disabled || loading) ? 'disabled' : ''}`}
        >
          {loading ? <img src="https://i.gifer.com/ZKZg.gif" alt="loading" width={20} /> : 
          "Convert to PPTX"
          }
         
        </button>
        </div>

      </div>
    </div>
  );
}

export default App;
