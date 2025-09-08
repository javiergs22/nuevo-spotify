"use client";
import MusicPlayer from "../src/components/MusicPlayer";
import Navbar from "../src/components/navbar";
import Queue from "../src/components/Queue";
import Sidebar from "../src/components/Sidebar";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createContext, useEffect, useState } from "react";


export const PlayerContext = createContext(undefined);

export function FrontendLayout({ children }) {
  const queryclient = new QueryClient();
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [queue, setQueue] = useState([]);

  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prevIndex) => prevIndex + 1);
    }
  };

  const playPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
    }
  };

  useEffect(() => {
    if (queue.length > 0 && currentIndex >= 0 && currentIndex < queue.length) {
      setCurrentMusic(queue[currentIndex]);
    }
  }, [currentIndex, queue]);

  return (
    <QueryClientProvider client={queryclient}>
      <PlayerContext.Provider
        value={{
          isQueueModalOpen,
          setIsQueueModalOpen,
          currentMusic,
          setCurrentMusic,
          queue,
          setQueue,
          playNext,
          playPrev,
          setCurrentIndex,
          currentIndex,
        }}
      >
        <div className="min-h-screen">
          <Navbar />
          <main>
            <Sidebar />
            <Queue />
            {currentMusic && <MusicPlayer />}
            {children}
          </main>
        </div>
      </PlayerContext.Provider>
    </QueryClientProvider>
  );
}

export default FrontendLayout;

