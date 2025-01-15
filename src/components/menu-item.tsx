import {
    Card,
    CardTitle,
} from "@/components/ui/card"

interface Props {
    id: string;
    name: string;
    description?: string;
    url: string;
    onClick: () => void;
}

export function MenuItem({ name, url, onClick }: Props) {
    return (
        <Card className='flex flex-col justify-center items-center p-2' onClick={onClick}>
            <img src={url} alt={name} className='w-[100px] h-[100px] md:w-[150px] md:h-[150px] rounded-full' />
            <CardTitle className="pt-2">{name}</CardTitle>
        </Card>
    )
}