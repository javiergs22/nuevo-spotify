import React, { useContext, useEffect, useRef, useState } from "react";
import Image from "next/image";
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
  const [repeatSong, setRepeatSong] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

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

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    const newMuteState = !isMuted;
    setIsMuted(newMuteState);
    audio.volume = newMuteState ? 0 : volume / 100;
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    if (audioRef.current) {
      audioRef.current.currentTime = newTime;
    }
    setCurrentTime(newTime);
  };

  const handleVolumeChange = (e) => {
    const vol = parseInt(e.target.value, 10);
    setVolume(vol);
    setIsMuted(vol === 0);
    if (audioRef.current) {
      audioRef.current.volume = vol / 100;
    }
  };

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${minutes}:${seconds}`;
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
    const audio = audioRef.current;
    if (!audio || !currentMusic) return;

    audio.src = currentMusic.audio_url;
    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch(() => setIsPlaying(false));
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
      <audio ref={audioRef} />
      <div className="max-w-8xl w-[95%] mx-auto flex items-center justify-between">
        {/* Song Info */}
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

        {/* Player Controls */}
        <div className="max-w-[400px] w-full flex items-center flex-col gap-3">
          <div className="flex gap-4">
            <button onClick={playPrev} className="text-xl text-secondary-text">
              <IoMdSkipBackward />
            </button>

            <button
              onClick={togglePlay}
              className="bg-white text-xl text-black w-10 h-10 rounded-full grid place-items-center"
            >
              {isPlaying ? <IoMdPause /> : <IoMdPlay />}
            </button>

            <button onClick={playNext} className="text-xl text-secondary-text">
              <IoMdSkipForward />
            </button>
          </div>

          {/* Seek Bar */}
          <div className="w-full flex justify-center items-center gap-2">
            <span>{formatTime(currentTime)}</span>
            <input
              onChange={handleSeek}
              type="range"
              min="0"
              max={duration}
              value={currentTime}
              className="w-full h-1 bg-zinc-700 rounded-md appearance-none accent-white"
            />
            <span className="text-secondary-text font-normal text-sm">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        {/* Volume and Extras */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRepeatSong(!repeatSong)}
            className={repeatSong ? "text-primary" : ""}
          >
            {repeatSong ? <LuRepeat1 /> : <LuRepeat />}
          </button>

          <button
            onClick={() => setIsQueueModalOpen(!isQueueModalOpen)}
            className="text-secondary-text text-xl"
          >
            <MdOutlineQueueMusic />
          </button>

          <button onClick={toggleMute} className="text-secondary-text text-xl">
            {isMuted || volume === 0 ? <IoMdVolumeOff /> : <IoMdVolumeHigh />}
          </button>

          <input
            onChange={handleVolumeChange}
            value={volume}
            type="range"
            min="0"
            max="100"
            className="w-[100px] h-1 bg-zinc-700 appearance-none accent-white"
          />
        </div>
      </div>
    </div>
  );
}
