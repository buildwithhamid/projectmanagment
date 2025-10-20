import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useUserContextId } from "@/AuthContext/UserContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();

  const { signUp } = useUserContextId();

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await signUp(email, password);
      console.log("✅ User signed up successfully!");
      navigate("/");
    } catch (error: any) {
      console.error("❌ Signup error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[90%] max-w-sm shadow-lg mx-auto mt-10">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center mb-2">
          Sign up with your email and password
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-3">
          <Input
            type="text"
            placeholder="Full Name"
            value={fullname}
            onChange={(e) => setFullname(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            type="email"
            placeholder="example123@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
          />

          <Input
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
          />

          <Button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full"
          >
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default SignUp;
