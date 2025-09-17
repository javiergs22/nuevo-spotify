import React, { useState } from "react";
import { FaTrash } from "react-icons/fa";
import { supabase } from "../../lib/SupabaseClient";
import { useQueryClient } from "@tanstack/react-query";

export default function DeleteButton({ songId, imagePath, audioPath }) {
  const queryClient = useQueryClient();
  const [isDeleting, setIsDeleting] = useState(false);

  const deleteSong = async () => {
    const confirmed = window.confirm(
      "¿Estás seguro de que deseas eliminar esta canción?"
    );
    if (!confirmed) return;

    setIsDeleting(true);

    // Eliminar imagen
    const { error: imgError } = await supabase.storage
      .from("cover-images")
      .remove([imagePath]);

    if (imgError) {
      alert("Error al eliminar la imagen: " + imgError.message);
      setIsDeleting(false);
      return;
    }

    // Eliminar audio
    const { error: audioError } = await supabase.storage
      .from("songs")
      .remove([audioPath]);

    if (audioError) {
      alert("Error al eliminar el audio: " + audioError.message);
      setIsDeleting(false);
      return;
    }

    // Eliminar registro en la base de datos
    const { error: deleteError } = await supabase
      .from("songs")
      .delete()
      .eq("id", songId);

    if (deleteError) {
      alert("Error al eliminar el registro: " + deleteError.message);
      setIsDeleting(false);
      return;
    }

    // Refrescar queries
    queryClient.invalidateQueries({ queryKey: ["allSongs"] });
    queryClient.invalidateQueries({ queryKey: ["userSongs"] });

    setIsDeleting(false);
  };

  return (
    <button
      onClick={deleteSong}
      className="text-secondary-text absolute right-2 top-6 cursor-pointer hidden group-hover:block"
      disabled={isDeleting}
    >
      {isDeleting ? "Eliminando..." : <FaTrash />}
    </button>
  );
}
