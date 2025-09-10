
"use client";
import React, { useContext, useEffect, useState } from "react";
import Image from "next/image";
import { IoMdPlay } from "react-icons/io";
import { supabase } from "../../lib/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import { PlayerContext } from "../../layouts/FrontendLayout";
import { useRouter } from "next/navigation";
import { demoSongs } from "./DemoSongs";

export default function Allsongs() {
  const context = useContext(PlayerContext);
  const router = useRouter();

  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }

  const { setQueue, setCurrentIndex } = context;

  const [user, setUser] = useState(null);
  const [isCheckingUser, setIsCheckingUser] = useState(true);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // Verifica si el usuario está logueado
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      if (data?.user) {
        setUser(data.user);
      }
      setIsCheckingUser(false);
    };
    checkUser();
  }, []);

  // Fetch de canciones (si quieres cargar desde DB en el futuro)
  const getAllSongs = async () => {
    const { data, error } = await supabase.from("songs").select("*");
    if (error) {
      console.error("Error al obtener canciones:", error.message);
    }
    return data;
  };

  const {
    data: fetchedSongs,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryFn: getAllSongs,
    queryKey: ["AllSongs"],
    enabled: true, // siempre intenta obtenerlas
  });

  const songsToDisplay = demoSongs; // usar demoSongs siempre, puedes cambiarlo si deseas usar fetchedSongs

  const startPlayingSong = (songs, index) => {
    if (!user) {
      setShowLoginModal(true); // Mostrar modal si no está logueado
      return;
    }

    setCurrentIndex(index);
    setQueue(songs);
  };

  // Cargando usuario o canciones
  if (isCheckingUser || isLoading) {
    return (
      <div className="min-h-[130vh] bg-background p-4 my-15 lg:ml-80 rounded-lg mx-4">
        <h2 className="text-2xl text-white mb-3 font-semibold">New Songs</h2>
        <div className="animate-pulse grid gap-4 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex flex-wrap">
          {[...Array(10)].map((_, index) => (
            <div key={index}>
              <div className="w-full h-50 rounded-md mb-2 bg-hover"></div>
              <div className="h-3 w-[80%] bg-hover rounded-md"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[80vh] bg-background p-4 my-15 lg:ml-80 rounded-lg mx-4">
      <h2 className="text-2xl text-white mb-3 font-semibold">New Songs</h2>

      <div className="grid gap-2 grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 flex flex-wrap">
        {songsToDisplay?.map((song, index) => (
          <div
            key={song.id}
            className="relative bg-background p-3 cursor-pointer rounded-md hover:bg-hover group"
            onClick={() => startPlayingSong(songsToDisplay, index)}
          >
            <button
              className="bg-primary w-12 h-12 rounded-full grid place-items-center absolute
                bottom-8 opacity-0 right-5 group-hover:opacity-100 group-hover:bottom-18 transition-all 
                duration-300 ease-in-out cursor-pointer"
            >
              <IoMdPlay />
            </button>
            <Image
              src={song.cover_image_url}
              width={500}
              height={500}
              alt="Song Cover"
              className="w-30 h-30 object-cover rounded-md mb-2"
            />
            <div className="mt-2">
              <p className="text-primary-text font-semibold">{song.title}</p>
              <p className="text-secondary-text text-sm">By {song.artist}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Modal para login */}
      {showLoginModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-md p-6 shadow-md max-w-sm text-center">
            <h2 className="text-lg font-semibold mb-2">Inicia sesión</h2>
            <p className="text-gray-700 mb-4">
              Debes iniciar sesión o registrarte para escuchar canciones.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setShowLoginModal(false)}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancelar
              </button>
              <button
                onClick={() => router.push("/login")}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
              >
                Iniciar sesión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
