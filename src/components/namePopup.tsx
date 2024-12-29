"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useDictionary } from "@/components/provider/dictionaryProvider";
import { usePathname } from "next/navigation";

export default function NamePopup() {
  const [showPopup, setShowPopup] = useState(false);
  const [name, setName] = useState("");
  const [termsAccepted, setTermsAccepted] = useState(false);

  const pathname = usePathname()

  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { dictionary } = useDictionary();
  const updateUserName = api.user.updateUserName.useMutation();

  const handleUpdateName = async () => {
    const nameRegex = /^[a-zA-Z0-9 ]{1,50}$/;

    if (!name.trim()) {
      toast({
        title: dictionary?.components.signUpPopup.errorTitle,
        description: dictionary?.components.signUpPopup.errorMessageA,
        variant: "destructive",
      });
      return;
    }

    if (!nameRegex.test(name)) {
      toast({
        title: dictionary?.components.signUpPopup.errorTitle,
        description: dictionary?.components.signUpPopup.errorMessageA,
        variant: "destructive",
      });
      return;
    }

    if (!termsAccepted) {
      toast({
        title: dictionary?.components.signUpPopup.errorTitle,
        description: dictionary?.components.signUpPopup.errorMessageC,
        variant: "destructive",
      });
      return;
    }

    try {
      await updateUserName.mutateAsync({ name });
      toast({
        title: dictionary?.components.signUpPopup.successTitle,
        description: dictionary?.components.signUpPopup.successMessage,
        variant: "success",
      });
      setShowPopup(false);
    } catch {
      toast({
        title: dictionary?.components.signUpPopup.errorTitle,
        description: dictionary?.components.signUpPopup.errorMessageB,
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
 
    if (
      status === "authenticated" && 
      !session?.user?.name && 
      !pathname.endsWith("datenschutz") && 
      !pathname.endsWith("agb")
    ) {
      setShowPopup(true);
    }
  }, [status, session?.user?.name]);
  
  if (!showPopup || !dictionary) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg text-center space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">
          {dictionary.components.signUpPopup.title}
        </h2>
        <p className="text-foreground">{dictionary.components.signUpPopup.message}</p>
        <Input
          type="text"
          placeholder={dictionary.components.signUpPopup.inputPlaceholder}
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="text-foreground"
        />
        <div className="flex items-center space-x-2 mt-2">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="h-4 w-4"
          />

          <label htmlFor="terms" className="text-foreground">
            {dictionary.components.signUpPopup.termsAndConditionsPartA}
            <a href="/agb" className="underline text-link">
              {dictionary.layout.footer.terms}
            </a>
            {dictionary.components.signUpPopup.termsAndConditionsPartB}
            <a href="/datenschutz" className="underline text-link">
              {dictionary.layout.footer.privacy}
            </a>
            {dictionary.components.signUpPopup.termsAndConditionsPartC}
          </label>

        </div>
        <Button onClick={handleUpdateName} className="mt-4">
          {dictionary.components.signUpPopup.saveButton}
        </Button>
      </div>
    </div>
  );
}
