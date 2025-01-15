import { Minus, Plus, Trash } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "./ui/table";

interface Props {
    order: Record<string, {
        name: string;
        quantity: number;
    }>;
    setOrder: React.Dispatch<React.SetStateAction<Record<string, {
        name: string;
        quantity: number;
    }>>>
}

export function OrderSummary({ order, setOrder }: Props) {
    const handleMinus = (id: string) => {
        setOrder((prevOrder) => {
            const quantity = prevOrder[id]?.quantity || 0
            if (quantity > 1) {
                return {
                    ...prevOrder,
                    [id]: {
                        name: prevOrder[id]?.name || '',
                        quantity: quantity - 1,
                    },
                }
            }
            return prevOrder
        })
    }

    const handlePlus = (id: string) => {
        setOrder((prevOrder) => ({
            ...prevOrder,
            [id]: {
                name: prevOrder[id]?.name || '',
                quantity: (prevOrder[id]?.quantity || 0) + 1,
            },
        }))
    }

    const handleDelete = (id: string) => {
        setOrder((prevOrder) => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [id]: _, ...rest } = prevOrder
            return rest
        })
    }

    return (
        <div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Item Name</TableHead>
                        <TableHead>Quantity</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {Object.entries(order).map(([id, { name, quantity }]) => (
                        <TableRow key={id}>
                            <TableCell>{name}</TableCell>
                            <TableCell className='flex items-center gap-2'>
                                <div className='border rounded-sm'>
                                    <Minus size={16} onClick={() => {
                                        handleMinus(id)
                                    }} />
                                </div>
                                {quantity}
                                <div className='border rounded-sm'>
                                    <Plus size={16} onClick={() => {
                                        handlePlus(id)
                                    }} />
                                </div>
                            </TableCell>
                            <TableCell className="text-right">
                                <div className="flex justify-center">
                                    <Trash
                                        size={16}
                                        className="cursor-pointer"
                                        onClick={() => handleDelete(id)}
                                    />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </div>

    )
}