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
import { Link } from "react-router-dom";

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
      navigate("/v1");
    } catch (error: any) {
      console.error("❌ Signup error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[90%] max-w-md mx-auto md:mt-10 border  shadow-xl backdrop-blur-sm bg-gradient-to-b ">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-3xl font-semibold text-white">
          Create Account
        </CardTitle>
        <CardDescription className="text-sm">
          Join ProjectFlow to organize and manage your Project easily.
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Full Name"
              value={fullname}
              onChange={(e) => setFullname(e.target.value)}
              required
              disabled={loading}
              className="bg-gray-900/40 border-gray-700 text-white placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="email"
              placeholder="example123@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={loading}
              className="bg-gray-900/40 border-gray-700 text-white placeholder-gray-500"
            />
          </div>

          <div className="space-y-2">
            <Input
              type="password"
              placeholder="********"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={loading}
              className="bg-gray-900/40 border-gray-700 text-white placeholder-gray-500"
            />
          </div>

          <Button
            type="submit"
            disabled={loading || !email.trim() || !password.trim()}
            className="w-full rounded-full bg-white text-black hover:bg-gray-200 transition-all"
          >
            {loading ? "Creating..." : "Create Account"}
          </Button>
        </form>

        <p className="flex gap-2 justify-center items-center text-sm text-center text-gray-400 mt-6">
          Already have an account?
          <Link
            to="/login"
            className="text-primary font-medium hover:underline"
          >
            Sign in
          </Link>
        </p>
        <p className="text-sm text-center mt-2">
          <Link to="/" className="text-chart-1  hover:underline">
            Back to Home
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignUp;
