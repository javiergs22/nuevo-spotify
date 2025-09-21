"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../../lib/SupabaseClient";
import useUserSession from "../../../custom-hooks/useUserSession";

export default function UploadAlbumPage() {
  const router = useRouter();
  const { session } = useUserSession();

  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [category, setCategory] = useState(""); // ✅ Estado para la categoría
  const [audioFile, setAudioFile] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);

  useEffect(() => {
    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.push("/");
      } else {
        setPageLoading(false);
      }
    };

    checkSession();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setMessage("");
    setLoading(true);

    if (!title || !artist || !category || !audioFile || !imageFile) {
      setMessage("Todos los campos son obligatorios.");
      setLoading(false);
      return;
    }

    try {
      const timestamp = Date.now();

      // Subir imagen
      const imagePath = `/${timestamp}_${imageFile.name}`;
      const { error: imageError } = await supabase.storage
        .from(`albuns/cover-images/${category}`) // ✅ Usar la categoría en la ruta
        .upload(imagePath, imageFile);

      if (imageError) throw imageError;

      const { data: imageURLData } = supabase.storage
        .from(`albuns/cover-images/${category}`) // ✅ Usar la categoría en la ruta
        .getPublicUrl(imagePath);
      const imageURL = imageURLData?.publicUrl;

      // Subir audio
      const audioPath = `/${timestamp}_${audioFile.name}`;
      const { error: audioError } = await supabase.storage
        .from(`albuns/songs/${category}`) // ✅ Usar la categoría en la ruta
        .upload(audioPath, audioFile);

      if (audioError) throw audioError;

      const { data: audioURLData } = supabase.storage
        .from(`albuns/songs/${category}`) // ✅ Usar la categoría en la ruta
        .getPublicUrl(audioPath);
      const audioURL = audioURLData?.publicUrl;

      // Insertar en Supabase
      const { error: insertError } = await supabase.from("albuns").insert([
        {
          title,
          artist,
          category, // ✅ Insertar categoría
          cover_image_url: imageURL,
          audio_url: audioURL,
          user_id: session?.user.id,
        },
      ]);

      if (insertError) throw insertError;

      setMessage("Canción subida con éxito.");
      setTitle("");
      setArtist("");
      setCategory("");
      setAudioFile(null);
      setImageFile(null);

      setTimeout(() => router.push("/"), 3000);
    } catch (err) {
      console.error("Error al subir canción:", err.message);
      setMessage("Ocurrió un error al subir la canción.");
    } finally {
      setLoading(false);
    }
  };

  if (pageLoading) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="bg-background p-6 rounded-lg shadow-lg w-full max-w-md">
        <div className="flex justify-center mb-4">
          <Image
            src="/imagenes/logo1.png"
            width={44}
            height={44}
            alt="Logo"
            className="w-11 h-11"
          />
        </div>
        <h2 className="text-white text-center text-2xl font-semibold mb-6">
          Subir canción a Supabase
        </h2>

        {message && (
          <p className="text-center mb-4 text-sm text-white bg-blue-500 py-2 rounded">
            {message}
          </p>
        )}

        <form onSubmit={handleUpload} className="space-y-4">
          <input
            type="text"
            placeholder="Título"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-4 focus:text-secondary-text"
          />

          <input
            type="text"
            placeholder="Artista"
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-4 focus:text-secondary-text"
          />

          {/* ✅ Campo de categoría */}
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text mb-4 bg-black text-white"
          >
            <option value="">Selecciona una categoría</option>
            <option value="Vallenatos">Vallenatos</option>
            <option value="Top Lainos">Top Latinos</option>
            <option value="Reggaeton">Reggaetón</option>
            <option value="Baladas Americanas">Baladas Americanas</option>
            <option value="Electrónica">Electrónica</option>
            <option value="Jazz">Jazz</option>
            <option value="Otra">Otra</option>
          </select>

          <div>
            <label className="text-white text-sm block mb-1">Audio</label>
            <input
              type="file"
              accept="audio/*"
              onChange={(e) => setAudioFile(e.target.files?.[0])}
              className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-4 focus:text-secondary-text"
            />
          </div>

          <div>
            <label className="text-white text-sm block mb-1">Cover Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0])}
              className="outline-none border border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-4 focus:text-secondary-text"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary hover:bg-blue-700 text-white font-semibold py-2 rounded transition duration-200"
          >
            {loading ? "Subiendo..." : "Subir Canción"}
          </button>
        </form>
      </div>
    </div>
  );
}
