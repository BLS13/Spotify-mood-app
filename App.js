import React, { useState } from "react";
import "./App.css";

function App() {
  const [song, setSong] = useState("");
  const [mood, setMood] = useState("");
  const [playlist, setPlaylist] = useState([]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!mood) {
      alert("Please enter your mood!");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/get-playlist", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ mood }),
      });

      const data = await response.json();
      setPlaylist(data);
    } catch (error) {
      console.error("Error fetching playlist:", error);
      alert("Failed to get playlist. Please check backend.");
    }
  };

  return (
    <div className="app">
      <h1>Spotify Mood App</h1>

      <form className="mood-form" onSubmit={handleSubmit}>
        <label htmlFor="song">Enter your favorite song:</label>
        <input
          type="text"
          id="song"
          name="song"
          placeholder="e.g., Shape of You"
          value={song}
          onChange={(e) => setSong(e.target.value)}
        />

        <label htmlFor="mood">Enter your mood:</label>
        <input
          type="text"
          id="mood"
          name="mood"
          placeholder="e.g., happy, sad"
          value={mood}
          onChange={(e) => setMood(e.target.value)}
        />

        <button type="submit">Get Playlist</button>
      </form>

      <div className="playlist">
        {playlist.length > 0 && <h2>Recommended Tracks 🎶</h2>}
        {playlist.map((track, index) => (
          <div key={index} className="track">
            <img src={track.image} alt={track.name} />
            <p>
              <strong>{track.name}</strong> <br />
              {track.artist} <br />
              <a href={track.url} target="_blank" rel="noopener noreferrer">
                Listen on Spotify
              </a>
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
