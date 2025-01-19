import {
    Card,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
interface Props {
    id?: string;
    name: string;
    description?: string;
    url: string;
    onClick?: () => void;
    quantity?: number | null;
    withDialog?: boolean;
    className?: string
}

export function MenuItem({ name, url, onClick, quantity, withDialog, className }: Props) {
    return (
        <Card className={cn("relative flex flex-col justify-center items-center p-2", className)} onClick={onClick}>
            {/* Quantity Badge */}
            {quantity && (
                <div className="absolute top-1 right-1">
                    <Badge>{quantity}</Badge>
                </div>
            )}
            {
                withDialog ? (
                    <Dialog>
                        <DialogTrigger>
                            <img
                                src={url}
                                alt={name}
                                className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full"
                            />
                        </DialogTrigger>
                        <DialogContent className="bg-transparent border-0">
                            <img
                                src={url}
                                alt={name}
                                className='rounded-lg '
                            />
                        </DialogContent>
                    </Dialog>
                ) : (

                    <img
                        src={url}
                        alt={name}
                        className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full"
                    />
                )
            }
            <CardTitle className="pt-2">{name}</CardTitle>
        </Card>
    );
}