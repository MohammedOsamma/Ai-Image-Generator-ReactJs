import React, { useRef, useState } from "react";
import "./ImageGenerator.css";
import defaultImage from "../Assests/default_image.svg";

const ImageGenerator = () => {
  const [imageUrl, setImageUrl] = useState("/");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const inputRef = useRef(null);

  const imageGenerator = async () => {
    const promptText = inputRef.current.value.trim();
    if (!promptText) {
      setError("Please enter a description.");
      return;
    }

    setError("");
    setLoading(true);

    try {
      const response = await fetch(
        "https://api.openai.com/v1/images/generations",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer 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 `,
          },
          body: JSON.stringify({
            prompt: promptText,
            n: 1,
            size: "512x512",
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error?.message || "Failed to generate image");
      }

      if (data.data && data.data.length > 0) {
        setImageUrl(data.data[0].url);
      } else {
        throw new Error("No image generated. Try a different prompt.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ai-image-generator">
      <div className="header">
        AI Image <span>Generator</span>
      </div>

      <div className="img-loading">
        <div className="image">
          {loading ? (
            <p>Loading...</p>
          ) : (
            <img
              src={imageUrl === "/" ? defaultImage : imageUrl}
              alt="Generated"
            />
          )}
        </div>
      </div>

      {error && <p className="error-message">{error}</p>}

      <div className="search-box">
        <input
          ref={inputRef}
          type="text"
          className="search-input"
          placeholder="Describe what you want to see"
        />
        <button
          className="generate-btn"
          onClick={imageGenerator}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate"}
        </button>
      </div>
    </div>
  );
};

export default ImageGenerator;
