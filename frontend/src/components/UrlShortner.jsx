import { useState } from "react";

function UrlShortner({ onUrlShortened }) {
  const [originalUrl, setOriginalUrl] = useState("");
  const [urlData, setUrlData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showCard, setShowCard] = useState(false);

  // Handle form submission
  async function handleSubmit() {
    if (!originalUrl.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");

    // API call to shorten URL
    try {
      const res = await fetch(`${import.meta.env.VITE_BASE_URL}/api/shorten`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ originalUrl }),
      });

      const data = await res.json();

      if (data.success) {
        setUrlData(data.data);
        setShowCard(true);
        setOriginalUrl(""); // Clear input after success
        onUrlShortened && onUrlShortened();
      } else {
        setError(data.message || "Failed to shorten URL");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to connect to server");
    } finally {
      setLoading(false);
    }
  }

  // Handler for input changes
  const handleInputChange = (e) => {
    setOriginalUrl(e.target.value);
    
    // Hide the card when user starts typing
    if (showCard) {
      setShowCard(false);
    }
    // Clear any existing errors
    if (error) {
      setError("");
    }
  };


  // Handler for input focus (when user clicks on input)
  const handleInputFocus = () => {
    if (showCard) {
      setShowCard(false);
    }
  };

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  // Copy Shortened url to clipboard
  const copyToClipboard = async (text) => {
    try {
      await navigator.clipboard.writeText(text);
      alert("URL copied to clipboard!");
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <>
      <div className="flex justify-center items-center">
        <div className="bg-[#262626] shadow-2xl border border-orange-200 md:min-w-[700px] md:min-h-[500px] flex flex-col text-center py-20 justify-around rounded-md">
          <h1 className="text-5xl font-bold text-white font-serif italic">
            URL Shortener
          </h1>

          <div className="flex flex-col gap-5 px-8">
            <label
              htmlFor="url"
              className="text-white text-2xl font-mono italic"
            >
              Enter long URL
            </label>

            <input
              className="md:w-[500px] mx-auto h-14 rounded-md px-4 outline-none text-gray-800 transition-all duration-300 hover:scale-105 hover:shadow-lg focus:scale-105 focus:shadow-xl"
              type="text"
              name="url"
              value={originalUrl}
              onChange={handleInputChange}
              onFocus={handleInputFocus}
              onKeyPress={handleKeyPress}
              placeholder="https://example.com/very/long/url"
              disabled={loading}
            />

            {error && <p className="text-red-400 text-sm">{error}</p>}

            <button
              className="bg-white hover:bg-teal-300 hover:font-thin hover:italic w-fit mx-auto text-black font-bold px-8 py-4 rounded-md text-xl transition duration-200 disabled:opacity-50"
              onClick={handleSubmit}
              disabled={loading}
            >
              {loading ? "Shortening..." : "Shorten"}
            </button>
          </div>

          {/* Display shortened URL */}
          {showCard && urlData && (
            <div className="px-8">
              <div className="bg-slate-800 rounded-lg p-6 mt-4">
                <h3 className="text-purple-400 text-xl mb-4 font-semibold">
                  🚀 URL Shortened Successfully!
                </h3>

                <div className="space-y-3 text-left">
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      Original URL:
                    </label>
                    <p className="text-white text-sm break-all bg-slate-700 p-2 rounded">
                      {urlData.longUrl}
                    </p>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm block mb-1">
                      Shortened URL:
                    </label>
                    <div className="bg-slate-700 p-2 rounded flex justify-between items-center">
                      <a
                        href={urlData.shortUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-purple-400 hover:text-purple-300 underline break-all"
                      >
                        {urlData.shortUrl}
                      </a>
                      <button
                        onClick={() => copyToClipboard(urlData.shortUrl)}
                        className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded-lg transition duration-200"
                      >
                        Copy
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default UrlShortner;
