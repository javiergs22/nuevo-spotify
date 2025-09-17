"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MdHomeFilled } from "react-icons/md";
import { GoSearch } from "react-icons/go";
import { useState } from "react";
import useUserSession from "../../custom-hooks/useUserSession";
import LogoutUser from "../../lib/auth/logoutUser";

// Importa las canciones
import { demoSongs } from "./DemoSongs";

export default function Navbar() {
  const router = useRouter();
  const { session, loading } = useUserSession();
  const [searchTerm, setSearchTerm] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [filteredSongs, setFilteredSongs] = useState([]);

  const handleLogout = async () => {
    const result = await LogoutUser();
    if (!result?.error) {
      router.push("/");
    }
  };

  const handleSearch = (e) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const filtered = demoSongs.filter(
        (song) =>
          song.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          song.artist.toLowerCase().includes(searchTerm.toLowerCase())
      );

      setFilteredSongs(filtered);
      setShowModal(true);
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setSearchTerm("");
  };

  return (
    <>
      <nav className="fixed top-0 left-0 w-full h-16 bg-black z-50 px-6 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <Link href="/">
            <Image
              src="/imagenes/logo1.png"
              alt="Logo"
              width={40}
              height={40}
              className="object-contain"
            />
          </Link>

          <Link
            href="/"
            className="w-11 h-11 bg-background grid place-items-center text-white text-2xl rounded-full hover:bg-gray-700"
          >
            <MdHomeFilled />
          </Link>

          {/* Search Bar */}
          <div className="hidden lg:flex items-center w-72 h-11 bg-gray-800 rounded-full px-3 text-white">
            <GoSearch size={20} className="text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por canción o artista..."
              className="ml-2 w-full bg-transparent outline-none placeholder:text-gray-400 text-sm"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          <div className="hidden lg:flex items-center gap-4 border-l border-gray-600 pl-6 text-sm text-gray-400 font-semibold">
            <Link href="#" className="hover:text-white">
              Premium
            </Link>
            <Link href="#" className="hover:text-white">
              Support
            </Link>
            <Link href="#" className="hover:text-white">
              Download
            </Link>
          </div>
        </div>

        <div>
          {!loading &&
            (session ? (
              <button
                onClick={handleLogout}
                className="h-10 px-6 bg-white text-black rounded-full font-bold hover:bg-gray-200"
              >
                Logout
              </button>
            ) : (
              <Link
                href="/login"
                className="h-10 px-6 bg-white text-black rounded-full font-bold grid place-items-center hover:bg-gray-200"
              >
                Login
              </Link>
            ))}
        </div>
      </nav>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-60 z-50 flex items-center justify-center px-4">
          <div className="bg-white rounded-lg shadow-lg max-w-md w-full p-6 overflow-y-auto max-h-[80vh]">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
              Resultados
            </h2>
            {filteredSongs.length > 0 ? (
              <ul className="space-y-6">
                {filteredSongs.map((song) => (
                  <li key={song.id} className="text-gray-700 border-b pb-4">
                    <p className="text-lg font-bold">{song.title}</p>
                    <p className="italic mb-2 text-gray-600">{song.artist}</p>

                    {/* Imagen del artista */}
                    {song.cover_image_url && (
                      <Image
                        src={song.cover_image_url}
                        alt={`Imagen de ${song.artist}`}
                        width={64}
                        height={64}
                        className="rounded mb-3"
                      />
                    )}

                    {/* Reproductor de audio */}
                    {song.audio_url && (
                      <audio controls className="w-full mt-2">
                        <source src={song.audio_url} type="audio/mp3" />
                        Tu navegador no soporta el elemento de audio.
                      </audio>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-gray-600">No se encontraron resultados.</p>
            )}
            <button
              onClick={closeModal}
              className="mt-6 bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </>
  );
}
