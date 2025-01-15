import {
    Card,
    CardTitle,
} from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
interface Props {
    id?: string;
    name: string;
    description?: string;
    url: string;
    onClick?: () => void;
    quantity?: number | null;
}

export function MenuItem({ name, url, onClick, quantity }: Props) {
    return (
        <Card className="relative flex flex-col justify-center items-center p-2" onClick={onClick}>
            {/* Quantity Badge */}
            {quantity && (
                <div className="absolute top-1 right-1">
                    <Badge>{quantity}</Badge>
                </div>
            )}
            <img
                src={url}
                alt={name}
                className="w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full"
            />
            <CardTitle className="pt-2">{name}</CardTitle>
        </Card>
    );
}