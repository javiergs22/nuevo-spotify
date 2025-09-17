"use client";

import { createContext, useEffect, useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import Navbar from "../src/components/navbar";
import Sidebar from "../src/components/Sidebar";
import Queue from "../src/components/Queue";
import MusicPlayer from "../src/components/MusicPlayer";

// Crear el contexto con valor inicial null
export const PlayerContext = createContext(null);

// Crear una sola instancia del query client
const queryClient = new QueryClient();

export function FrontendLayout({ children }) {
  const [isQueueModalOpen, setIsQueueModalOpen] = useState(false);
  const [currentMusic, setCurrentMusic] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [queue, setQueue] = useState([]);

  // Función para avanzar en la cola
  const playNext = () => {
    if (currentIndex < queue.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  // Función para retroceder en la cola
  const playPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  // Actualizar música actual cuando cambie el índice o la cola
  useEffect(() => {
    if (queue.length > 0 && currentIndex >= 0 && currentIndex < queue.length) {
      setCurrentMusic(queue[currentIndex]);
    }
  }, [currentIndex, queue]);

  return (
    <QueryClientProvider client={queryClient}>
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
          currentIndex,
          setCurrentIndex,
        }}
      >
        <div className="min-h-screen flex flex-col">
          <Navbar />
          <div className="flex flex-1">
            <Sidebar />
            <main className="flex-1 p-4">{children}</main>
            <Queue />
          </div>
          {currentMusic && <MusicPlayer />}
        </div>
      </PlayerContext.Provider>
    </QueryClientProvider>
  );
}

export default FrontendLayout;
