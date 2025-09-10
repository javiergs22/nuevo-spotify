import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image"; // Si no usas Next.js, cambia esto por un <img> normal o tu componente de imagen preferido
import {
  IoMdPause,
  IoMdPlay,
  IoMdSkipBackward,
  IoMdSkipForward,
  IoMdVolumeHigh,
  IoMdVolumeOff,
} from "react-icons/io";
import { LuRepeat, LuRepeat1 } from "react-icons/lu";
import { MdOutlineQueueMusic } from "react-icons/md";
import { PlayerContext } from "../../layouts/FrontendLayout";

export default function MusicPlayer() {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(50);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [previousVolume, setPreviousVolume] = useState(50);
  const [repeatSong, setRepeatSong] = useState(false);

  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const {
    isQueueModalOpen,
    setIsQueueModalOpen,
    currentMusic,
    playNext,
    playPrev,
  } = context;

  const togglePlayButton = () => {
    if (!audioRef.current) return;
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
  };

  const handleSeek = (event) => {
    const newTime = parseFloat(event.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const handleVolumeChange = (event) => {
    const vol = parseInt(event.target.value, 10);
    setVolume(vol);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  const toggleMute = () => {
    if (volume === 0) {
      setVolume(previousVolume);
      if (audioRef.current) {
        audioRef.current.volume = previousVolume / 100;
      }
    } else {
      setPreviousVolume(volume);
      setVolume(0);
      if (audioRef.current) {
        audioRef.current.volume = 0;
      }
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateTime = () => {
      setCurrentTime(audio.currentTime);
      setDuration(audio.duration || 0);
    };

    audio.addEventListener("timeupdate", updateTime);
    audio.addEventListener("loadedmetadata", updateTime);

    return () => {
      audio.removeEventListener("timeupdate", updateTime);
      audio.removeEventListener("loadedmetadata", updateTime);
    };
  }, []);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume / 100;
    }
  }, [volume]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !currentMusic) return;

    const playAudio = async () => {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.log("Audioplay Error:", error);
        setIsPlaying(false);
      }
    };

    playAudio();
  }, [currentMusic]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (repeatSong) {
        audio.currentTime = 0;
        audio.play();
      } else {
        playNext();
      }
    };

    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("ended", handleEnded);
    };
  }, [repeatSong, playNext]);

  if (!currentMusic) return null;

  return (
    <div className="fixed bottom-0 left-0 w-full bg-black text-white px-4 py-4 shadow-md z-50">
      <audio src={currentMusic.audio_url} ref={audioRef}></audio>
      <div className="max-w-8xl w-[95%] mx-auto flex items-center justify-between">
        <div className="flex gap-4 items-center">
          <Image
            src={currentMusic.cover_image_url}
            width={500}
            height={500}
            alt="Song Cover"
            className="w-13 h-13 object-cover rounded-md"
          />
          <div className="text-sm">
            <p className="text-white">{currentMusic.title}</p>
          </div>
        </div>

        {/* Controles de sonido */}
        <div className="max-w-[400px] w-full flex items-center flex-col gap-3">
          <div className="flex gap-4">
            <button className="text-xl text-secondary-text" onClick={playPrev}>
              <IoMdSkipBackward />
            </button>

            <button
              onClick={togglePlayButton}
              className="bg-white text-xl text-black w-10 h-10 rounded-full grid place-items-center"
            >
              {isPlaying ? <IoMdPause /> : <IoMdPlay />}
            </button>

            <button className="text-xl text-secondary-text" onClick={playNext}>
              <IoMdSkipForward />
            </button>
          </div>
          <div className="w-full flex justify-center items-center gap-2">
            <span>{formatTime(currentTime)}</span>
            <div>
              <input
                onChange={handleSeek}
                type="range"
                min="0"
                max={duration}
                value={currentTime}
                className="w-full outline-none h-1 bg-zinc-700 rounded-md appearance-none accent-white"
              />
            </div>
            <span className="text-secondary-text font-normal text-sm">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Control de volumen */}
        <div className="flex items-center gap-2">
          {repeatSong ? (
            <button
              onClick={() => setRepeatSong(false)}
              className="text-primary"
            >
              <LuRepeat1 />
            </button>
          ) : (
            <button onClick={() => setRepeatSong(true)}>
              <LuRepeat />
            </button>
          )}

          <button
            onClick={() => setIsQueueModalOpen(!isQueueModalOpen)}
            className="text-secondary-text text-xl cursor-pointer"
          >
            <MdOutlineQueueMusic />
          </button>

          {volume === 0 ? (
            <button
              onClick={toggleMute}
              className="text-secondary-text text-xl cursor-pointer"
            >
              <IoMdVolumeOff />
            </button>
          ) : (
            <button
              onClick={toggleMute}
              className="text-secondary-text text-xl cursor-pointer"
            >
              <IoMdVolumeHigh />
            </button>
          )}
          <p className="text-white">Volumen: {volume}</p>
          <input
            onChange={handleVolumeChange}
            value={volume}
            type="range"
            min="0"
            max="100"
            className="w-[100px] outline-none h-1 bg-zinc-700 appearance-none accent-white"
          />
        </div>
      </div>
    </div>
  );
}
