import { useRef } from "react";
import { Input } from "../components/input";
import { Button } from "../components/button";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export const Signup = () => {
  const [error, setError] = useState<Record<string, string[]>>({});
  const [generalError, setGeneralError] = useState<string | null>(null);

  const userNameRef = useRef<HTMLInputElement>(null);
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const roleRef = useRef<HTMLSelectElement>(null);

  const navigate = useNavigate();

  const handleSignup = async () => {
    const username = userNameRef.current?.value;
    const name = nameRef.current?.value;
    const email = emailRef.current?.value;
    const password = passwordRef.current?.value;
    const role = roleRef.current?.value?.toLowerCase();

    try {
      setError({});
      setGeneralError(null);

      // ⭐ fake API delay
      await new Promise((res) => setTimeout(res, 500));

      // ⭐ simple validations
      if (!username) {
        setError({ username: ["Username is required"] });
        return;
      }

      if (!name) {
        setError({ name: ["Name is required"] });
        return;
      }

      if (!email) {
        setError({ email: ["Email is required"] });
        return;
      }

      if (!password) {
        setError({ password: ["Password is required"] });
        return;
      }

      if (!role) {
        setError({ role: ["Role is required"] });
        return;
      }

      // ⭐ pretend duplicate examples (optional demo)
      if (username === "admin") {
        setGeneralError("Username already exists");
        return;
      }

      if (email === "admin@gmail.com") {
        setGeneralError("Email already exists");
        return;
      }

      // ⭐ success
      console.log("Fake signup success");

      navigate("/login");
    } catch (err) {
      setGeneralError("Signup failed");
    }
  };

  return (
    <div className="fixed inset-0 w-screen h-screen grid grid-cols-2">
      {/* LEFT – Animation */}
      <div className="flex items-center justify-center h-full w-full bg-slate-900">
        <div>
          <div className="w-100 h-100">
            <DotLottieReact src="/animations/Cat.lottie" loop autoplay />
          </div>
          <div>
            <p className="mt-4 text-slate-300 text-lg text-center">
              Helping Government in Traffic Management and Road Safety
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT – Form */}
      <div className="flex justify-center items-center bg-slate-900 ">
        <div className="w-150 h-150 p-5 border-slate-400 shadow-lg bg-white rounded-lg transition-transform duration-300 ease-out hover:scale-[1.03]">
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
          {generalError === "Username already exists" && (
            <p className="text-red-500 text-sm p-1">{generalError}</p>
          )}

          <Input defaultStyle={"w-full "} ref={nameRef} placeholder="Name" />
          {error.name && (
            <p className="text-red-500 text-sm p-1">{error.name[0]}</p>
          )}

          <Input defaultStyle={"w-full "} ref={emailRef} placeholder="Email" />
          {error.email && (
            <p className="text-red-500 text-sm p-1">{error.email[0]}</p>
          )}
          {generalError === "Email already exists" && (
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

          <select ref={roleRef} className="w-full border m-2 p-2 rounded-md">
            <option value="">Select role</option>
            <option value="student">Student</option>
            <option value="faculty">Faculty</option>
            <option value="ta">TA</option>
          </select>
          {error.role && (
            <p className="text-red-500 text-sm p-1">{error.role[0]}</p>
          )}

          <Button
            text={"Signup"}
            variant={"primary"}
            size={"md"}
            className="w-full mt-6 m-2 bg-green"
            onClick={() => {
              handleSignup();
            }}
          />
        </div>
      </div>
    </div>
  );
};
