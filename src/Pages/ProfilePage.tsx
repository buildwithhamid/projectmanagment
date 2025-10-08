"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useUserContextId } from "@/AuthContext/UserContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemeToggle } from "@/components/ThemeToggle";
import { useTaskContext } from "@/TaskContext/TaskContext";
const ProfilePage = () => {
  const { userContextId } = useUserContextId();
  const { userData } = useTaskContext();
  const [name, setName] = useState(userData.name || "");
  const [email, setEmail] = useState(userData.email || "");
  const [profilePic, setprofilePic] = useState("");
  const [bio, setBio] = useState(
    "Frontend Developer | React & Next.js Enthusiast"
  );

  const handleSave = () => {
    console.log(name, email, bio);
  };

  return (
    <div className="w-full mx-auto max-w-5xl p-6 space-y-6">
      <Card className="shadow-md rounded-2xl">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={profilePic} alt="Profile" />
            <AvatarFallback>U</AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-2xl font-semibold">{name}</CardTitle>
            <CardDescription>{userContextId}</CardDescription>
          </div>
          <div className="ml-auto">
            <Input
              type="file"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setprofilePic(URL.createObjectURL(file));
                }
              }}
            />
          </div>
        </CardHeader>
      </Card>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-[40%] grid-cols-3">
          <TabsTrigger value="profile">Edit Profile</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        <TabsContent value="profile">
          <Card className="shadow-md rounded-2xl mt-4">
            <CardHeader>
              <CardTitle>Edit Profile</CardTitle>
              <CardDescription>
                Update your personal information
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Write a short bio about yourself"
                />
              </div>
              <Separator />
              <Button onClick={handleSave} className="w-full">
                Save Changes
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card className="shadow-md rounded-2xl mt-4">
            <CardHeader>
              <CardTitle>Security</CardTitle>
              <CardDescription>
                Change your password or manage sessions
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="password">New Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Enter new password"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm-password">Confirm Password</Label>
                <Input
                  id="confirm-password"
                  type="password"
                  placeholder="Confirm new password"
                />
              </div>
              <Separator />
              <Button className="w-full">Update Password</Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="settings">
          <Card className="shadow-md rounded-2xl mt-4">
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage preferences and theme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <Label htmlFor="darkMode">Dark Mode</Label>
                <div className="flex items-center gap-2">
                  <ThemeToggle />
                </div>
              </div>
              <Separator />

              <Button
                variant="destructive"
                className="w-full"
                onClick={() => alert("Account deleted")}
              >
                Delete Account
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProfilePage;
