import React, { useState, useEffect } from "react";
import { auth } from "../Config/firbase";
import { signInWithEmailAndPassword, type User } from "firebase/auth";
import { useNavigate, Link } from "react-router-dom";
import { useUserContextId } from "../AuthContext/UserContext";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

const SignIn: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUserId } = useUserContextId();

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser: User | null) => {
      if (currentUser) {
        setUserId(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, [setUserId]);

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      setUserId(userCredential.user.uid);
      navigate("/");
    } catch (error: any) {
      alert("Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl text-center">Login here</CardTitle>
        <CardDescription className="text-center mb-2">
          Welcome back! Please enter your details.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleLoginSubmit} className="flex flex-col gap-2">
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
          <Button type="submit" disabled={loading}>
            {loading ? "Signing in..." : "Login"}
          </Button>
        </form>

        <p className="text-sm text-center mt-2">
          Don’t have an account?{" "}
          <Link to="/signup" className="text-primary">
            Sign up
          </Link>
        </p>
      </CardContent>
    </Card>
  );
};

export default SignIn;
