import { MenuItem } from './menu-item'
import { useGetMeat } from '@/hooks/use-get-meat'
import { useGetVegetable } from '@/hooks/use-get-vegetable'
import { useGetEgg } from '@/hooks/use-get-egg'
import { useState } from 'react'
import { OrderSummary } from './order-summary'
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from './ui/sheet'
import { Button } from './ui/button'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import supabase from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export function MainMenu() {
    const { data: meatData, isLoading } = useGetMeat()
    const { data: vegetableData } = useGetVegetable()
    const { data: eggData } = useGetEgg()
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const { mutate: placeOrder, isPending } = useMutation({
        mutationFn: async (order: Record<string, { name: string; quantity: number }>) => {
            const { data: order_data, error: order_error } = await supabase.from('orders').insert({ quantity: 1 }).select().single()
            if (order_error) {
                throw order_error
            }
            const { error: order_item_error } = await supabase.from('order_items').insert(Object.entries(order).map(([id, { quantity }]) => {
                return {
                    order_id: order_data?.id,
                    item_id: id,
                    quantity,
                }
            }))
            if (order_item_error) {
                throw order_item_error
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['objects'],
            })
            toast({
                title: 'Order placed!',
            })

            setOrder({})
        },
        onError: (error) => {
            toast({
                variant: 'destructive',
                title: 'Error placing order',
                description: error.message,
            })
        }
    })

    const [order, setOrder] = useState<
        Record<
            string,
            {
                name: string
                quantity: number
            }
        >
    >({})

    const handleOrderClick = (id: string, name: string) => {
        setOrder((prevOrder) => ({
            ...prevOrder,
            [id]: {
                name,
                quantity: (prevOrder[id]?.quantity || 0) + 1,
            },
        }))
    }

    return (
        <div>
            {isLoading && <div>Loading...</div>}
            <h1 className="text-xl font-bold px-2" id='meat'>Meat</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 p-2 gap-4">
                {meatData?.map((item) => (
                    <MenuItem
                        id={item.id!}
                        key={item.id!}
                        name={item.name ?? '-'}
                        url={item.signedUrl}
                        onClick={() => handleOrderClick(item.id!, item.name ?? '-')}
                    />
                ))}
            </div>
            <h1 className="text-xl font-bold px-2" id='vegetable'>Vegetable</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 p-2 gap-4">
                {vegetableData?.map((item) => (
                    <MenuItem
                        id={item.id!}
                        key={item.id!}
                        name={item.name ?? '-'}
                        url={item.signedUrl}
                        onClick={() => handleOrderClick(item.id!, item.name ?? '-')}
                    />
                ))}
            </div>
            <h1 className="text-xl font-bold px-2" id='egg'>Egg</h1>
            <div className="grid grid-cols-2 md:grid-cols-4 p-2 gap-4">
                {eggData?.map((item) => (
                    <MenuItem
                        id={item.id!}
                        key={item.id!}
                        name={item.name ?? '-'}
                        url={item.signedUrl}
                        onClick={() => handleOrderClick(item.id!, item.name ?? '-')}

                    />
                ))}
            </div>
            <Sheet>
                <SheetTrigger asChild>
                    <Button className="fixed inset-x-16 bottom-4 p-4 rounded-tl-lg z-10 shadow-sm">
                        <span className="text-sm font-semibold">Order Summary</span>
                        <div
                            className="
                                flex
                                h-6
                                w-6
                                items-center
                                justify-center
                                rounded-sm
                                text-xs
                                font-bold
                                border-white
                                border
                                "
                        >
                            {Object.values(order).reduce((acc, { quantity }) => acc + quantity, 0)}
                        </div>

                    </Button>
                </SheetTrigger>
                <SheetContent className="flex flex-col h-full">
                    {/* Scrollable content */}
                    <SheetTitle>Order Summary</SheetTitle>
                    <div className="flex-1 overflow-y-auto">
                        <OrderSummary order={order} setOrder={setOrder} />
                    </div>
                    <div className="p-4 border-t">
                        <Button className="w-full py-2 rounded" onClick={() => {
                            placeOrder(order)
                        }} disabled={isPending}>
                            Place Order
                        </Button>
                    </div>
                </SheetContent>
            </Sheet>
        </div>
    )
}
