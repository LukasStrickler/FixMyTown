"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input"; // Your custom Input component
import { Button } from "@/components/ui/button"; // Your custom Button component

export default function NamePopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [nameInput, setNameInput] = useState(""); // State for input field

  const { data: session, status } = useSession();
  const updateUserName = api.user.updateUserName.useMutation();
  const { toast } = useToast();

  const userId = session?.user?.id;

  const handleUpdateName = async () => {
    if (!userId || !nameInput.trim()) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid name.",
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUserName.mutateAsync({ userId, name: nameInput });
      toast({
        title: "Success!",
        description: `Your name has been updated to ${nameInput}.`,
        variant: "success",
      });
      setShowPopup(false);
    } catch {
      toast({
        title: "Error!",
        description: "Failed to update your name. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (status === "authenticated" && !session?.user?.name) {
      setShowPopup(true);
    }
  }, [status, session?.user?.name]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg text-center space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">Complete Your Signup</h2>
        <p className="text-foreground">Please enter your name to continue:</p>
        <Input
          placeholder="Enter your name"
          value={nameInput}
          onChange={(e) => setNameInput(e.target.value)}
          className="text-foreground"
        />
        <Button
          onClick={handleUpdateName}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 transition"
        >
          Save Name
        </Button>
      </div>
    </div>
  );
}
