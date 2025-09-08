"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import signUpUser from "../../../lib/auth/signUpUser";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const HandleSignup = async (e) => {
    e.preventDefault();
    console.log("handleSignup ejecutado");

    if (!name.trim() || !email.trim() || !password.trim()) {
      setMessage("Todos los campos son obligatorios!");
      return;
    }

    const result = await signUpUser(name, email, password);
    if (result?.error) {
      setMessage(result.error);
    } else {
      setMessage("Signup successful");
      setTimeout(() => {
        router.push("/");
      }, 3000);
    }
  };

  return (
    <div className="h-screen flex justify-center items-center w-full bg-hover">
      <div className="bg-background flex flex-col items-center px-6 lg:px-12 py-6 rounded-md max-w-[400px] w-[90%]">
        <Image
          src="/imagenes/logo1.png"
          width={500}
          height={500}
          alt="Logo"
          className="w-15 h-15"
        />
        <h2 className="text-2xl font-bold text-white my-2 mb-8 text-center">
          Signup to Spotify
        </h2>
        <form onSubmit={HandleSignup}>
          {message && (
            <p className="bg-primary font-semibold text-center mb-4 py-1">
              {message}
            </p>
          )}
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            type="text"
            placeholder="Nombre"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            type="text"
            placeholder="Email"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <input
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            type="password"
            placeholder="Password"
            className="outline-none border-1 border-neutral-600 p-2 w-full rounded-md text-primary-text placeholder-neutral-600 mb-6 focus:text-secondary-text"
          />
          <button className="bg-primary py-3 rounded-full w-full font-bold cursor-pointer">
            Continue
          </button>
          <div className="text-secondary-text text-center my-6">
            <span>Ya tienes una Cuenta?</span>
            <Link
              href="login"
              className="ml-2 text-white underline hover:text-primary"
            >
              Sign in now
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
