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
import type { Dictionary } from "@/dictionaries/dictionary";

interface DeleteAccountDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    onConfirm: () => void;
    dictionary: Dictionary;
}

export function DeleteAccountDialog({
    open,
    onOpenChange,
    onConfirm,
    dictionary
}: DeleteAccountDialogProps) {
    const isMobile = useIsMobile();

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerContent className="px-4">
                    <DrawerHeader className="pb-6">
                        <DrawerTitle className="text-xl font-semibold">
                            {dictionary.pages.auth.account.deleteDialog.title}
                        </DrawerTitle>
                        <DrawerDescription className="text-base pt-2">
                            {dictionary.pages.auth.account.deleteDialog.description}
                        </DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="flex flex-row justify-between gap-3 pb-8">
                        <DrawerClose asChild>
                            <Button variant="outline" className="flex-1">
                                {dictionary.pages.auth.account.deleteDialog.cancel}
                            </Button>
                        </DrawerClose>
                        <Button
                            onClick={onConfirm}
                            className="bg-red-500 hover:bg-red-600 flex-1"
                        >
                            {dictionary.pages.auth.account.deleteDialog.confirm}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        );
    }

    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>
                        {dictionary.pages.auth.account.deleteDialog.title}
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                        {dictionary.pages.auth.account.deleteDialog.description}
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex flex-row justify-between sm:justify-between">
                    <AlertDialogCancel>
                        {dictionary.pages.auth.account.deleteDialog.cancel}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        onClick={onConfirm}
                        className="bg-red-500 hover:bg-red-600"
                    >
                        {dictionary.pages.auth.account.deleteDialog.confirm}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
} 