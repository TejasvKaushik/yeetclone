import { authModalState } from "@/atoms/authModalAtom";
import { auth } from "@/firebase/firebase";
import { useRouter } from "next/router";
import React, { use, useEffect, useState } from "react";
import {
  useSignInWithEmailAndPassword,
  useSignInWithGoogle,
} from "react-firebase-hooks/auth";
import { toast } from "react-toastify";
import { useSetRecoilState } from "recoil";

type LoginProps = {};

const Login: React.FC<LoginProps> = () => {
  const setAuthModalState = useSetRecoilState(authModalState);
  const handleClick = (type: "login" | "register" | "forgotPassword") => {
    setAuthModalState((prev) => ({ ...prev, type }));
  };
  const router = useRouter();

  const [inputs, setInputs] = useState({ email: "", password: "" });

  const [signInWithEmailAndPassword, user, loading, error] =
    useSignInWithEmailAndPassword(auth);

  const [signInWithGoogle, googleUser, googleLoading, googleError] =
    useSignInWithGoogle(auth);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!inputs.email || !inputs.password)
      return alert("Please fill all fields");
    try {
      const newUser = await signInWithEmailAndPassword(
        inputs.email,
        inputs.password
      );
      if (!newUser) return;
      router.push("/");
    } catch (error: any) {
      toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signInWithGoogle();
      if (!result) return;
      router.push("/");
    } catch (error: any) {
      toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" });
    }
  };

  useEffect(() => {
    if (error) toast.error(error.message, { position: "top-center", autoClose: 3000, theme: "dark" });
  }, [error]);

  return (
    <form className="space-y-6 px-6 pb-4" onSubmit={handleLogin}>
      <h3 className="text-xl font-medium text-white">Sign In</h3>
      <div>
        <label
          htmlFor="email"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Your Email
        </label>
        <input
          onChange={handleInputChange}
          type="email"
          id="email"
          name="email"
          placeholder="Your Email"
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white"
        />
      </div>
      <div>
        <label
          htmlFor="password"
          className="text-sm font-medium block mb-2 text-gray-300"
        >
          Your Password
        </label>
        <input
          onChange={handleInputChange}
          type="password"
          id="password"
          name="password"
          placeholder="Your Password"
          className="w-full px-4 py-2 rounded-md bg-gray-800 text-white"
        />
      </div>

      <button
        type="submit"
        className="w-full text-white focus:ring-blue-300 font-medium rounded-lg
                text-sm px-5 py-2.5 text-center bg-brand-orange hover:bg-brand-orange-s
            "
      >
        {" "}
        {loading ? "Loading..." : "Sign In"}
      </button>
      <button
        type="button"
        onClick={handleGoogleSignIn}
        className="w-full flex items-center justify-center gap-2 text-white focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-red-600 hover:bg-red-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 24 24"
          fill="white"
        >
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10c5.16 0 9.44-3.92 9.95-9H12v3h5.5c-.7 2-2.61 3.5-5.5 3.5-3.58 0-6.5-2.92-6.5-6.5s2.92-6.5 6.5-6.5c1.63 0 3.13.58 4.28 1.54l2.64-2.64C17.9 3.14 15.1 2 12 2z" />
        </svg>
        Sign in with Google
      </button>

      <button
        className="flex w-full justify-end"
        onClick={() => handleClick("forgotPassword")}
      >
        <a
          href="#"
          className="text-sm block text-brand-orange hover:underline w-full text-right"
        >
          Forgot Password?
        </a>
      </button>
      <div className="text-sm font-medium text-gray-300">
        Not Registered?{" "}
        <a
          href="#"
          className="text-blue-700 hover:underline"
          onClick={() => handleClick("register")}
        >
          Create account
        </a>
      </div>
    </form>
  );
};
export default Login;
