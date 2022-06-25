import React, { useState, useEffect } from "react";
import { createFFmpeg, fetchFile } from "@ffmpeg/ffmpeg";
import { saveAs } from "file-saver";
import Loading from "./Loading";

const ffmpeg = createFFmpeg({
  corePath: "https://unpkg.com/@ffmpeg/core@0.10.0/dist/ffmpeg-core.js",
  log: true,
});

const VideoToGif = () => {
  const [video, setVideo] = useState();
  const [gif, setGif] = useState();
  const [ready, setReady] = useState(false);
  // Async file loading
  const load = async () => {
    try {
      await ffmpeg.load();
      setReady(true);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => load(), []);

  const convertToGif = async () => {
    // Write the file to memory
    ffmpeg.FS("writeFile", "test.mp4", await fetchFile(video));

    // Run the FFMpeg command
    await ffmpeg.run(
      "-i",
      "test.mp4",
      "-t",
      "2.5",
      "-ss",
      "2.0",
      "-f",
      "gif",
      "out.gif"
    );

    // Read the result
    const data = ffmpeg.FS("readFile", "out.gif");

    // Create a URL
    const url = URL.createObjectURL(
      new Blob([data.buffer], { type: "image/gif" })
    );
    setGif(url);
  };

  const downloadImage = () => {
    saveAs(gif.toDataURL(), gif); // Put your image url here.
  };

  return ready ? (
    <section className="c-converter">
      <div className="c-converter__video-to-gif">
        Upload video
        <input
          type="file"
          name="file"
          id="file"
          onChange={(e) => setVideo(e.target.files?.item(0))}
          className="c-converter__video-to-gif__input"
        />
        <div className="c-converter__buttons">
          <label htmlFor="file" className="c-converter__buttons__upload">
            Convert video
          </label>
          <button
            onClick={convertToGif}
            className="c-converter__buttons__convert"
          >
            Convert
          </button>
        </div>
        <div className="c-converter__video-to-gif__video-container">
          {video && (
            <video
              className="c-converter__video-to-gif__video-container__video"
              controls
              src={URL.createObjectURL(video)}
            ></video>
          )}
        </div>
        <div className="c-converter__video-to-gif__divider"></div>
        <div className="c-converter__video-to-gif__gif-container">
          {gif && (
            <img
              src={gif}
              className="c-converter__video-to-gif__gif-container__gif"
            />
          )}
        </div>
      </div>
    </section>
  ) : (
    <Loading />
  );
};

export default VideoToGif;
