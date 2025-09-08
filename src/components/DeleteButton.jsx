import React from "react";
import { FaTrash } from "react-icons/fa";
import { supabase } from "../../lib/SupabaseClient";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteButton({ songId, imagePath, audioPath }) {
  const queryClient = useQueryClient();

  const deleteSong = async () => {
    // Borrar la imagen
    const { error: imgError } = await supabase.storage
      .from("cover-images")
      .remove([imagePath]);

    if (imgError) {
      console.log("ImageDeleteError:", imgError.message);
      return;
    }

    // Borrar el audio
    const { error: audioError } = await supabase.storage
      .from("songs")
      .remove([audioPath]);

    if (audioError) {
      console.log("AudioDeleteError:", audioError.message);
      return;
    }

    // Borrar el registro en la tabla de canciones
    const { error: deleteError } = await supabase
      .from("songs")
      .delete()
      .eq("id", songId);

    if (deleteError) {
      console.log("TableDeleteError:", deleteError.message);
      return;
    }

    // Invalidar queries para refrescar la data
    queryClient.invalidateQueries({ queryKey: ["allSongs"] });
    queryClient.invalidateQueries({ queryKey: ["userSongs"] });
  };

  return (
    <button
      onClick={deleteSong}
      className="text-secondary-text absolute right-2 top-6
                 cursor-pointer hidden group-hover:block"
    >
      <FaTrash />
    </button>
  );
}
