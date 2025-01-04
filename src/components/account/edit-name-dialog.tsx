import { useIsMobile } from "@/hooks/use-mobile";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
    Drawer,
    DrawerClose,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { Dictionary } from "@/dictionaries/dictionary";
import { useState } from "react";
import { useForm, type ControllerRenderProps } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { getNameSchema } from "@/server/api/lib/name-schema";

interface EditNameDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: (newName: string) => Promise<void>;
    dictionary: Dictionary;
    currentName: string;
}

const nameUpdateSchema = (dictionary: Dictionary) => z.object({
    name: getNameSchema(dictionary)
});

type NameUpdateInput = z.infer<ReturnType<typeof nameUpdateSchema>>;

export function EditNameDialog({
    open,
    onOpenChange,
    onConfirm,
    dictionary,
    currentName,
}: EditNameDialogProps) {
    const isMobile = useIsMobile();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const form = useForm<NameUpdateInput>({
        resolver: zodResolver(nameUpdateSchema(dictionary)),
        defaultValues: {
            name: currentName.trim()
        },
        mode: "onChange",
    });

    const isNameUnchanged = () => {
        const newName = form.getValues("name");
        const oldName = currentName;
        if (!form.formState.isValid) return false;
        return newName.trim() === oldName.trim();
    };

    const isSubmitDisabled = () => {
        const hasErrors = Object.keys(form.formState.errors).length > 0;
        return isSubmitting || isNameUnchanged() || hasErrors;
    };

    const handleSubmit = async (values: { name: string }) => {
        setIsSubmitting(true);
        try {
            await onConfirm(values.name.trim());
        } finally {
            setIsSubmitting(false);
        }
    };

    const getStatusMessage = () => {
        if (isSubmitting) {
            return <p className="text-muted-foreground font-medium">{dictionary.pages.auth.account.editNameDialog.confirm}</p>;
        }

        return null;
    };

    const FormContent = ({ field }: { field: ControllerRenderProps<NameUpdateInput, "name"> }) => (
        <FormItem className="space-y-1.5">
            <FormLabel className="text-foreground">
                {dictionary.pages.auth.account.editNameDialog.nameLabel}
            </FormLabel>
            <FormControl>
                <Input
                    {...field}
                    placeholder={dictionary.pages.auth.account.editNameDialog.namePlaceholder}
                />
            </FormControl>
            <div className="h-5">
                <FormMessage className="text-[13px] text-orange-400 font-medium" />
            </div>
        </FormItem>
    );

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="px-4">
                    <DrawerHeader className="pb-4">
                        <DrawerTitle className="text-lg font-semibold">
                            {dictionary.pages.auth.account.editNameDialog.title}
                        </DrawerTitle>
                        <DrawerDescription className="text-sm pt-1">
                            {dictionary.pages.auth.account.editNameDialog.description}
                        </DrawerDescription>
                    </DrawerHeader>
                    <Form {...form}>
                        <form data-testid="name-form" onSubmit={form.handleSubmit(handleSubmit)}>
                            <div className="px-4">
                                <FormField
                                    control={form.control}
                                    name="name"
                                    render={FormContent}
                                />
                                <div className="h-2 mt-1">
                                    {getStatusMessage()}
                                </div>
                            </div>
                            <DrawerFooter className="flex flex-row justify-between gap-3 pb-6 pt-4">
                                <DrawerClose asChild>
                                    <Button variant="outline" className="flex-1">
                                        {dictionary.pages.auth.account.editNameDialog.cancel}
                                    </Button>
                                </DrawerClose>
                                <Button
                                    type="submit"
                                    className="flex-1"
                                    disabled={isSubmitDisabled()}
                                >
                                    {dictionary.pages.auth.account.editNameDialog.confirm}
                                </Button>
                            </DrawerFooter>
                        </form>
                    </Form>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <Form {...form}>
                    <form data-testid="name-form" onSubmit={form.handleSubmit(handleSubmit)}>
                        <AlertDialogHeader className="pb-2">
                            <AlertDialogTitle className="text-lg">
                                {dictionary.pages.auth.account.editNameDialog.title}
                            </AlertDialogTitle>
                            <AlertDialogDescription className="text-sm pt-1">
                                {dictionary.pages.auth.account.editNameDialog.description}
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <div className="py-3">
                            <FormField
                                control={form.control}
                                name="name"
                                render={FormContent}
                            />
                            <div className="h-2 mt-1">
                                {getStatusMessage()}
                            </div>
                        </div>
                        <AlertDialogFooter>
                            <AlertDialogCancel>
                                {dictionary.pages.auth.account.editNameDialog.cancel}
                            </AlertDialogCancel>
                            <AlertDialogAction
                                type="submit"
                                disabled={isSubmitDisabled()}
                            >
                                {dictionary.pages.auth.account.editNameDialog.confirm}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </form>
                </Form>
            </AlertDialogContent>
        </AlertDialog>
    );
} 