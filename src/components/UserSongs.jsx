import Image from "next/image";
import React, { useContext } from "react";
import { supabase } from "../../lib/SupabaseClient";
import { useQuery } from "@tanstack/react-query";
import DeleteButton from "./DeleteButton";
import { PlayerContext } from "../../layouts/FrontendLayout";

export default function UserSongs({ userId }) {
  const context = useContext(PlayerContext);

  if (!context) {
    throw new Error("PlayerContext must be used within a PlayerProvider");
  }
  const { setQueue, setCurrentIndex } = context;

  const getUserSongs = async () => {
    const { error, data } = await supabase
      .from("songs")
      .select("*")
      .eq("user_id", userId);
    if (error) {
      console.log("fetchUserSongsError:", error.message);
    }
    return data;
  };

  const {
    data: songs,
    isLoading,
    error,
    isError,
  } = useQuery({
    queryFn: getUserSongs,
    queryKey: ["userSongs", userId],
  });

  const startPlayingSong = (songs, index) => {
    setCurrentIndex(index);
    setQueue(songs);
  };

  if (isLoading)
    return (
      <div>
        {[...Array(10)].map((_, index) => (
          <div key={index} className="flex gap-2 animate-pulse mb-4">
            <div className="w-10 h-10 rounded-md bg-hover"></div>
            <div className="h-5 w-[80%] rounded-md bg-hover"></div>
          </div>
        ))}
      </div>
    );

  if (isError)
    return <h2 className="text-center text-white text-2xl">{error.message}</h2>;

  if (!songs || songs.length === 0) {
    return (
      <h1 className="text-center text-white text-sm">
        No tienes musica en tu libreria
      </h1>
    );
  }

  return (
    <div>
      {songs.map((song, index) => (
        <div
          className="relative flex gap-2 items-center cursor-pointer mb-4 p-2 rounded-lg hover:bg-hover group"
          key={song.id}
          onClick={() => startPlayingSong(songs, index)}
        >
          <DeleteButton
            songId={song.id}
            imagePath={song.cover_image_url}
            audioPath={song.audio_url}
          />
          <Image
            src={song.cover_image_url}
            alt={song.title}
            width={300}
            height={300}
            className="w-10 h-10 object-cover rounded-md"
          />
          <div>
            <p className="text-primary-text font-semibold">{song.title}</p>
            <p className="text-secondary-text text-sm">By {song.artist}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
