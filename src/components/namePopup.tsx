"use client";

import { useEffect, useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";

export default function NamePopup({ userName }: { userName: string | null }) {
  const [showPopup, setShowPopup] = useState(false);

  const { data: session } = useSession();
  const updateUserName = api.user.updateUserName.useMutation();
  const { toast } = useToast();

  const userId = session?.user?.id;

  const handleUpdateName = async () => {
    if (!userId) {
      console.error("User ID is missing");
      return;
    }

    try {
      await updateUserName.mutateAsync({ userId, name: "Maximilian" });
      toast({
        title: "Success!",
        description: "Your name has been updated to Maximilian.",
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
    if (!userName) {
      setShowPopup(true);
    }
  }, [userName]);

  if (!showPopup) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-foreground">Welcome!</h2>
        <p className="text-foreground mt-2">
          Your name is not set. Would you like to set it to "Maximilian"?
        </p>
        <button
          onClick={handleUpdateName}
          className="mt-4 bg-primary text-white px-4 py-2 rounded hover:bg-primary/50 transition"
        >
          Set Name to Maximilian
        </button>
      </div>
    </div>
  );
}
