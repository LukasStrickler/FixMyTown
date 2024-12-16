"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/provider/dictionaryProvider";

export default function NamePopup({ params }: { params: { lang: Locale } }) {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const { data: session } = useSession();
  const { toast } = useToast();
  const { dictionary } = useDictionary();
  const updateUserName = api.user.updateUserName.useMutation();
  const userId = session?.user?.id;

  const handleUpdateName = async () => {
    if (!userId || !name.trim()) {
      toast({
        title: dictionary?.popup.errorTitle,
        description: dictionary?.popup.errorMessage,
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUserName.mutateAsync({ userId, name });
      toast({
        title: dictionary?.popup.successTitle,
        description: dictionary?.popup.successMessage,
        variant: "success",
      });
      setShowPopup(false);
    } catch {
      toast({
        title: dictionary?.popup.errorTitle,
        description: dictionary?.popup.errorMessage,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (!session?.user?.name) {
      setShowPopup(true);
    }
  }, [session?.user?.name]);

  if (!showPopup || !dictionary) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg text-center">
        <h2 className="text-2xl font-semibold text-foreground">
          {dictionary.popup.title}
        </h2>
        <p className="text-foreground mt-2">{dictionary.popup.message}</p>
        <Input
          type="text"
          placeholder={dictionary.popup.inputPlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-4"
        />
        <Button onClick={handleUpdateName} className="mt-4">
          {dictionary.popup.saveButton}
        </Button>
      </div>
    </div>
  );
}
