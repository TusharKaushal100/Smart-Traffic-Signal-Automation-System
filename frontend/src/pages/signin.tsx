import { useRef } from "react";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const Login = () => {
  const [error, setError] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const userNameRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);

  const navigate = useNavigate();

  const handleLogin = async () => {
    const username = userNameRef.current?.value;
    const password = passwordRef.current?.value;

    try {
      setError({});
      setGeneralError(null);

      // ⭐ fake API delay
      await new Promise((res) => setTimeout(res, 500));

      // ⭐ simple validation
      if (!username) {
        setError({ username: ["Username is required"] });
        return;
      }

      if (!password) {
        setError({ password: ["Password is required"] });
        return;
      }

      // ⭐ pretend backend success
      const fakeToken = "demo-token-123";

      console.log(`token from login=${fakeToken}`);

      localStorage.setItem("token", fakeToken);

      navigate("/myQuestions");
    } catch (err) {
      setGeneralError("Login failed");
    }
  };

  return (
    <div>
      <div className="h-screen grid grid-cols-2">
        <div className="flex items-center justify-center h-full w-full cols-span-1 bg-slate-900">
          <div className="w-150 h-150">
            <DotLottieReact src="/animations/Bunny.lottie" loop autoplay />
          </div>
        </div>

        <div className="flex justify-center items-center cols-span-1 bg-slate-900 ">
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
              text={"Login"}
              variant={"primary"}
              size={"md"}
              className="w-full mt-8 m-2 bg-green"
              onClick={() => {
                handleLogin();
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
