import { useRef } from "react";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import axios from "axios";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const Signup = () => {
  const [error, setError] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleSignup = async () => {
    const username = userNameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      setError({});
      setGeneralError(null);

      if (!username) {
        setError({ username: ["Username is required"] });
        return;
      }

      if (!password) {
        setError({ password: ["Password is required"] });
        return;
      }

      const response = await axios.post(
        "http://localhost:5000/api/v1/officer/signup",
        {
          username,
          password,
        }
      );

      console.log(response.data);

      navigate("/login");
    } catch (err: any) {
      if (err.response?.data?.errors) {
        setError(err.response.data.errors);
      } else if (err.response?.data?.message) {
        setGeneralError(err.response.data.message);
      } else {
        setGeneralError("Signup failed");
      }
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen grid grid-cols-2">
      <div className="flex items-center justify-center h-full w-full bg-slate-900">
        <div>
          <div className="w-200 h-200">
            <DotLottieReact src="/animations/Police.lottie" loop autoplay />
          </div>
          <div>
            <p className="mt-2 text-slate-300 text-lg text-center">
              Helping Government in Traffic Management and Road Safety
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-center items-center bg-slate-900 ">
        <div className="w-120 h-100 p-5 border-slate-400 shadow-lg bg-white rounded-lg transition-transform duration-300 ease-out hover:scale-[1.03]">
          <div className="flex justify-center p-5">
            <h1 className="text-3xl">Traffic Security</h1>
          </div>

          <Input
            defaultStyle={"w-full "}
            ref={userNameRef}
            placeholder="Username"
          />
          {error.username && (
            <p className="text-red-500 text-sm p-1">{error.username[0]}</p>
          )}

          {generalError && (
            <p className="text-red-500 text-sm p-1">{generalError}</p>
          )}

          <Input
            defaultStyle={"w-full "}
            ref={passwordRef}
            placeholder="Set Password"
          />
          {error.password && (
            <p className="text-red-500 text-sm p-1">{error.password[0]}</p>
          )}

          <Button
            text={"Signup"}
            variant={"primary"}
            size={"md"}
            className="w-full mt-8 m-2 bg-green"
            onClick={handleSignup}
          />
        </div>
      </div>
    </div>
  );
};