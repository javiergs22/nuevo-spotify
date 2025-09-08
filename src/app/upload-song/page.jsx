"use client";
import Image from "next/image";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/SupabaseClient";
import { useRouter } from "next/navigation";
import useUserSession from "../../../custom-hooks/useUserSession";

export default function Page() {
  const router = useRouter();
  const [title, setTitle] = useState("");
  const [artist, setArtist] = useState("");
  const [audioFile, setAudioFile] = useState(null);
  const [imagefile, setImageFile] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [pageLoading, setPageLoading] = useState(true);
  const { session } = useUserSession();

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      if (!data.session) {
        router.push("/");
      } else {
        setPageLoading(false);
      }
    });
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    setLoading(true);

    if (!title.trim() || !artist.trim() || !audioFile || !imagefile) {
      setMessage("Todos los campos son requeridos");
      setLoading(false);
      return;
    }

    try {
      const timestamp = Date.now();

      // Subir imagen
      const imagePath = `/${timestamp}_${imagefile.name}`;
      const { error: imgError } = await supabase.storage
        .from("cover-images")
        .upload(imagePath, imagefile);

      if (imgError) {
        setMessage(imgError.message);
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl: imageURL },
      } = supabase.storage.from("cover-images").getPublicUrl(imagePath);

      // Subir audio
      const audioPath = `/${timestamp}_${audioFile.name}`;
      const { error: audioError } = await supabase.storage
        .from("songs")
        .upload(audioPath, audioFile);

      if (audioError) {
        setMessage(audioError.message);
        setLoading(false);
        return;
      }

      const {
        data: { publicUrl: audioURL },
      } = supabase.storage.from("songs").getPublicUrl(audioPath);

      // Guardar en la base de datos
      const { error: insertError } = await supabase.from("songs").insert([
        {
          title,
          artist,
          cover_image_url: imageURL,
          audio_url: audioURL,
          user_id: session?.user.id,
        },
      ]);

      if (insertError) {
        setMessage(insertError.message);
        setLoading(false);
        return;
      }

      setTitle("");
      setArtist("");
      setImageFile(null);
      setAudioFile(null);
      setMessage("Canción subida con éxito");

      setTimeout(() => {
        router.push("/");
      }, 3000);
    } catch (err) {
      console.log("Error capturado", err);
      setMessage("Ocurrió un error");
      setLoading(false);
    }
  };

  if (pageLoading) return null;

  return (
    <div className="h-screen flex justify-center items-center w-full bg:hover">
      <div className="bg-background flex flex-col items-center px-6 lg:px-12 py-6 rounded-md max-w-[400px] w-[90%]">
        <Image
          src="/imagenes/logo1.png"
          width={500}
          height={500}
          alt="Logo"
          className="w-11 h-11"
        />
        <h2 className="text-2xl font-bold text-white my-2 mb-8 text-center">
          Upload to Spotify
        </h2>
        <form onSubmit={handleUpload}>
          {message && (
            <p className="bg-primary font-semibold text-center mb-4 py-1">
              {message}
            </p>
          )}
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            type="text"
            placeholder="Title"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <input
            value={artist}
            onChange={(e) => setArtist(e.target.value)}
            type="text"
            placeholder="Artist"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <label htmlFor="audio" className="block py-2 text-secondary-text">
            Audio
          </label>
          <input
            accept="audio/*"
            id="audio"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setAudioFile(file);
              console.log(file);
            }}
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <label htmlFor="cover" className="block py-2 text-secondary-text">
            Cover Image
          </label>
          <input
            accept="image/*"
            id="cover"
            type="file"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (!file) return;
              setImageFile(file);
            }}
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <button
            className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer"
            disabled={loading}
          >
            {loading ? "Uploading..." : "Add Song"}
          </button>
        </form>
      </div>
    </div>
  );
}
