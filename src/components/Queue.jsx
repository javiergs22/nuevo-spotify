/*"use client";
import React, { useContext } from "react";
import Image from "next/image";
import { PlayerContext } from "../../layouts/FrontendLayout";

export default function Queue() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("Queue must be used within a PlayerContext.Provider");
  }

  const {
    isQueueModalOpen,
    currentMusic,
    currentindex,
    queue,
    setCurrentIndex,
    setQueue,
  } = context;

  const startPlayingSong = (songs, index) => {
    setCurrentIndex(index);
    setQueue(songs);
  };

  if (!isQueueModalOpen) return null;

  return (
    <div
      className="fixed top-18 right-15 z-50 max-w-[300px] w-full h-[75vh] bg-black border-1
    p-4 overflow-y-auto rounded-md"
    >
      <h2>Queue</h2>
      <div className="mt-8">
        <h2 className="text-white font-bold mb-3">Now Playing</h2>
        <div className="flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg hover:bg-hover">
          {currentMusic && (
            <Image
              src={currentMusic.cover_image_url}
              width={300}
              height={300}
              alt="queue-image"
              className="w-10 h-10 object-cover rounded-md"
            />
          )}
          <div>
            <p className="text-primary font-semibold">{currentMusic?.title}</p>
            <p className="text-sm text-secondary-text">{currentMusic?.artist}</p>
          </div>
        </div>
      </div>
      <div className="mt-8">
        <h2 className="text-white font-bold mb-3">Queue List</h2>
        {queue.map((song, index) => (
          <div
            className="flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg hover:bg-hover"
            key={song.id}
            onClick={() => startPlayingSong(queue, index)}
          >
            <Image
              src={song.cover_image_url}
              width={300}
              height={300}
              alt="queue-image"
              className="w-10 h-10 object-cover rounded-md"
            />
            <div>
              <p
                className={`font-semibold ${
                  currentindex === index ? "text-primary" : "text-primary-text"
                }`}
              >
                {song.title}
              </p>
              <p className="text-sm text-secondary-text">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}*/

"use client";

import React, { useContext } from "react";
import Image from "next/image";
import { PlayerContext } from "../../layouts/FrontendLayout";

export default function Queue() {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("Queue must be used within a PlayerContext.Provider");
  }

  const {
    isQueueModalOpen,
    currentMusic,
    currentindex,
    queue,
    setCurrentIndex,
    setQueue,
  } = context;

  const startPlayingSong = (songs, index) => {
    setCurrentIndex(index);
    setQueue(songs);
  };

  if (!isQueueModalOpen) return null;

  return (
    <div className="fixed top-18 right-15 z-50 max-w-[300px] w-full h-[75vh] bg-black border p-4 overflow-y-auto rounded-md">
      <h2 className="text-white font-bold text-lg">Queue</h2>

      {/* Now Playing */}
      <div className="mt-8">
        <h3 className="text-white font-bold mb-3">Now Playing</h3>
        {currentMusic && (
          <div className="flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg hover:bg-hover">
            <Image
              src={currentMusic.cover_image_url}
              width={40}
              height={40}
              alt="Current song"
              className="w-10 h-10 object-cover rounded-md"
            />
            <div>
              <p className="text-primary font-semibold">{currentMusic.title}</p>
              <p className="text-sm text-secondary-text">
                {currentMusic.artist}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Queue List */}
      <div className="mt-8">
        <h3 className="text-white font-bold mb-3">Queue List</h3>
        {queue.map((song, index) => (
          <div
            key={song.id}
            className="flex items-center gap-2 cursor-pointer mb-2 p-2 rounded-lg hover:bg-hover"
            onClick={() => startPlayingSong(queue, index)}
          >
            <Image
              src={song.cover_image_url}
              width={40}
              height={40}
              alt={song.title}
              className="w-10 h-10 object-cover rounded-md"
            />
            <div>
              <p
                className={`font-semibold ${
                  currentindex === index ? "text-primary" : "text-primary-text"
                }`}
              >
                {song.title}
              </p>
              <p className="text-sm text-secondary-text">{song.artist}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
