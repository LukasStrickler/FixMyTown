"use client";

import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { api } from "@/trpc/react";
import { useSession } from "next-auth/react";
import { useDictionary } from "@/components/provider/dictionaryProvider";
import { usePathname } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
} from "@/components/ui/form";

export default function NamePopup() {
  const [showPopup, setShowPopup] = useState(false);

  const pathname = usePathname();
  const { data: session, status } = useSession();
  const { toast } = useToast();
  const { dictionary } = useDictionary();
  const updateUserName = api.user.updateUserName.useMutation();

  // Separate schema for name
  const nameSchema = z.object({
    name: z
      .string()
      .min(1, { message: dictionary?.pages.auth.account.editNameDialog.nameEmpty })
      .transform((val) => val.trim())
      .refine((val) => val.length >= 3, { message: dictionary?.pages.auth.account.editNameDialog.nameTooShort })
      .refine((val) => val.length <= 50, { message: dictionary?.pages.auth.account.editNameDialog.nameTooLong })
      .refine((val) => /^[\p{L}\s]*$/u.test(val), { message: dictionary?.pages.auth.account.editNameDialog.nameNumbers }),
    });

  const termsSchema = z.object({
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: dictionary?.components.signUpPopup.errorMessageC,
    }),
  });

  type NameUpdateInput = z.infer<typeof nameSchema>;
  type TermsUpdateInput = z.infer<typeof termsSchema>;

  const form = useForm<NameUpdateInput & TermsUpdateInput>({
    resolver: zodResolver(nameSchema.merge(termsSchema)),
    defaultValues: { name: "", termsAccepted: false },
    mode: "onChange",
  });

  const handleUpdateName = async (values: NameUpdateInput) => {
    try {
      await updateUserName.mutateAsync({ name: values.name.trim() });
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
  }, [status, session?.user?.name, pathname]);

  if (!showPopup || !dictionary) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-background p-6 rounded-lg shadow-lg text-center space-y-4">
        <h2 className="text-2xl font-semibold text-foreground">
          {dictionary.components.signUpPopup.title}
        </h2>
        <p className="text-foreground">{dictionary.components.signUpPopup.message}</p>
        <Form {...form}>
          <form data-testid="name-popup-form" onSubmit={form.handleSubmit(handleUpdateName)}>
            {/* Name Field */}
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      {...field}
                      placeholder={dictionary.components.signUpPopup.inputPlaceholder}
                      className="text-foreground"
                    />
                  </FormControl>
                  <FormMessage className="text-[13px] text-orange-400 font-medium" />
                </FormItem>
              )}
            />

            {/* Terms Accepted Checkbox */}
            <FormField
              control={form.control}
              name="termsAccepted"
              render={({ field, fieldState }) => (
                <FormItem className="mt-2">
                  <div className="flex items-center space-x-2">
                    <FormControl>
                      <input
                        type="checkbox"
                        id="terms"
                        className="text-foreground"
                        checked={field.value}
                        onChange={(e) => field.onChange(e.target.checked)} 
                        onBlur={field.onBlur} 
                      />
                    </FormControl>
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

                  {fieldState?.error && (
                    <FormMessage className="text-[13px] text-orange-400 font-medium mt-2 block">
                      {fieldState?.error.message}
                    </FormMessage>
                  )}
                </FormItem>
              )}
            />
            
            <Button type="submit" className="mt-4">
              {dictionary.components.signUpPopup.saveButton}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
