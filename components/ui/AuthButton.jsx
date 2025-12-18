"use client";
import React, { useState } from "react";
import { Button } from "./button";
import { LogIn, LogOut } from "lucide-react";
import { AuthModel } from "./AuthModel";
import { signOut } from "@/app/actions";

const AuthButton = ({ user }) => {
  const [showAuthModel, setshowAuthModel] = useState(false);


  if (user) {
    return (
      <form action={signOut}>
        <Button className="gap-2 bg-gray-200 text-[12px]" variant="ghost" type="submit" size="sm">
          <LogOut className="w-4 h-4" />
          Sign Out
        </Button>
      </form>
    );
  }
  return (
    <>
      <Button
        onClick={() => setshowAuthModel(true)}
        className="bg-orange-500 hover:bg-orange-600 gap-4"
        variant="default"
        size="sm"
      >
        <LogIn className="w-4 h-4" />
        Sign In
      </Button>
      <AuthModel
        isopen={showAuthModel}
        onclose={() => setshowAuthModel(false)}
      />
    </>
  );
};

export default AuthButton;
