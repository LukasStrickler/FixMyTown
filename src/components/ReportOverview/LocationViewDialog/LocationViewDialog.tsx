import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"
import dynamic from 'next/dynamic'
import 'leaflet/dist/leaflet.css'
import type { Dictionary } from "@/dictionaries/dictionary"
import { useIsMobile } from "@/hooks/use-mobile"

interface LocationViewDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    location: {
        lat: number
        lng: number
    }
    address?: string
    dictionary: Dictionary
    trigger?: React.ReactNode
}

const MapWithNoSSR = dynamic(
    () => import('./Map'),
    {
        ssr: false,
        loading: () => (
            <div className="w-full h-[400px] rounded-lg overflow-hidden border border-border bg-muted animate-pulse" />
        )
    }
)

const Content = ({ location, address, dictionary }: Omit<LocationViewDialogProps, 'open' | 'onOpenChange' | 'trigger'>) => (
    <div className="w-full space-y-4">
        <MapWithNoSSR
            location={location}
            address={address}
            dictionary={dictionary}
        />
        {address && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" />
                <span>{address}</span>
            </div>
        )}
    </div>
)

export function LocationViewDialog({ open, onOpenChange, location, address, dictionary, trigger }: LocationViewDialogProps) {
    const isMobile = useIsMobile()

    const sharedTrigger = trigger || (
        <Button variant="outline" size="sm">
            <MapPin className="h-4 w-4 mr-2" />
            {dictionary.components.reportTable.actions.viewLocation}
        </Button>
    )

    if (isMobile) {
        return (
            <Drawer open={open} onOpenChange={onOpenChange}>
                <DrawerTrigger asChild>
                    {sharedTrigger}
                </DrawerTrigger>
                <DrawerContent className="fixed bottom-0 left-0 right-0">
                    <DrawerHeader>
                        <DrawerTitle>{dictionary.components.locationPicker.title}</DrawerTitle>
                    </DrawerHeader>
                    <div className="p-4 pb-8">
                        <Content location={location} address={address} dictionary={dictionary} />
                    </div>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogTrigger asChild>
                {sharedTrigger}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>{dictionary.components.locationPicker.title}</DialogTitle>
                </DialogHeader>
                <Content location={location} address={address} dictionary={dictionary} />
            </DialogContent>
        </Dialog>
    )
} 