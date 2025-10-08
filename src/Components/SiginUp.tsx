import React, { useState } from "react";
import { auth, db } from "../Config/firbase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, serverTimestamp } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
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

const SignUp: React.FC = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullname, setFullname] = useState<string>("");
  const [photoURL, setPhotoURL] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const navigate = useNavigate();
  const { setUserId } = useUserContextId();

  const handleSignUpSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;
      console.log("✅ User signed up:", user.uid);
      setUserId(user.uid);
      await setDoc(doc(db, "users", user.uid), {
        email,
        name: fullname,
        avatar:
          photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png",
        createdAt: serverTimestamp(),
      });
      navigate("/");
    } catch (error: any) {
      console.error("❌ Signup error:", error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-[90%] max-w-sm shadow-lg">
      <CardHeader>
        <CardTitle className="text-2xl text-center">Create Account</CardTitle>
        <CardDescription className="text-center mb-2">
          Sign up with your email and password
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSignUpSubmit} className="flex flex-col gap-2">
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
          <Input
            type="file"
            placeholder="Profile Picture URL (optional)"
            value={photoURL}
            onChange={(e) => setPhotoURL(e.target.value)}
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
