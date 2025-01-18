/* eslint-disable @typescript-eslint/no-unused-vars */
import { MenuItem } from './menu-item'
import { SkeletonCard } from './ui/skeleton'
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
import { api } from '@/lib/api'

export function MainMenu() {
    const { data: meatData, isLoading } = useGetMeat()
    const { data: vegetableData } = useGetVegetable()
    const { data: eggData } = useGetEgg()
    const queryClient = useQueryClient()
    const { toast } = useToast()

    const [order, setOrder] = useState<
        Record<string, { name: string; quantity: number }>
    >({})

    const { mutate: placeOrder, isPending } = useMutation({
        mutationFn: async (order: Record<string, { name: string; quantity: number }>) => {
            const { data: order_data, error: order_error } = await supabase
                .from('orders')
                .insert({ quantity: 1 })
                .select()
                .single()

            if (order_error) {
                throw order_error
            }

            const { error: order_item_error } = await supabase
                .from('order_items')
                .insert(
                    Object.entries(order).map(([id, { quantity }]) => {
                        return {
                            order_id: order_data?.id,
                            item_id: id,
                            quantity,
                        }
                    })
                )

            if (order_item_error) {
                throw order_item_error
            }

            const order_text = Object.entries(order)
                .map(([_, { quantity, name }]) => `• ${quantity} x ${name}`)
                .join('  ');  // Double spaces as a soft separator

            const res = await api.whatsapp.sendMessage.$post({
                'json': {
                    order: order_text,
                    url_endpoint: 'order/' + order_data?.id
                }
            })

            if (!res.ok) {
                throw new Error('Failed to send message');
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
                description: (error as Error).message,
            })
        },
    })

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
        <div className="bg-gray-50 min-h-screen">
            <div className="max-w-6xl mx-auto px-4 py-8">

                {/* Meat Section */}
                <section className="bg-white mb-8 p-4 rounded-md shadow-sm">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-1">Meat</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Select from our wide variety of fresh, locally sourced cuts.
                    </p>
                    {isLoading && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {meatData?.map((item) => (
                            <MenuItem
                                key={item.id!}
                                id={item.id!}
                                name={item.name ?? '-'}
                                url={item.signedUrl}
                                onClick={() => handleOrderClick(item.id!, item.name ?? '-')}
                                className="
                  bg-gray-50
                  rounded-md
                  p-2
                  shadow-sm
                  border border-gray-200
                  hover:shadow-md
                  transition-shadow
                "
                            />
                        ))}
                    </div>
                </section>

                {/* Vegetable Section */}
                <section className="bg-gray-100 mb-8 p-4 rounded-md shadow-sm">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-1">Vegetable</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Fresh produce picked at peak ripeness for maximum flavor.
                    </p>
                    {isLoading && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {vegetableData?.map((item) => (
                            <MenuItem
                                key={item.id!}
                                id={item.id!}
                                name={item.name ?? '-'}
                                url={item.signedUrl}
                                onClick={() => handleOrderClick(item.id!, item.name ?? '-')}
                                className="
                  bg-white
                  rounded-md
                  p-2
                  shadow-sm
                  border border-gray-200
                  hover:shadow-md
                  transition-shadow
                "
                            />
                        ))}
                    </div>
                </section>

                {/* Egg Section */}
                <section className="bg-white mb-8 p-4 rounded-md shadow-sm">
                    <h2 className="text-2xl font-semibold text-indigo-700 mb-1">Egg</h2>
                    <p className="text-sm text-gray-500 mb-4">
                        Free-range eggs sourced from local farms.
                    </p>
                    {isLoading && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </div>
                    )}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {eggData?.map((item) => (
                            <MenuItem
                                key={item.id!}
                                id={item.id!}
                                name={item.name ?? '-'}
                                url={item.signedUrl}
                                onClick={() => handleOrderClick(item.id!, item.name ?? '-')}
                                className="
                  bg-gray-50
                  rounded-md
                  p-2
                  shadow-sm
                  border border-gray-200
                  hover:shadow-md
                  transition-shadow
                "
                            />
                        ))}
                    </div>
                </section>

                {/* Sheet remains the same */}
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
                  border
                  border-white
                "
                            >
                                {Object.values(order).reduce(
                                    (acc, { quantity }) => acc + quantity,
                                    0
                                )}
                            </div>
                        </Button>
                    </SheetTrigger>
                    <SheetContent className="flex flex-col h-full">
                        <SheetTitle>Order Summary</SheetTitle>
                        <div className="flex-1 overflow-y-auto">
                            <OrderSummary order={order} setOrder={setOrder} />
                        </div>
                        <div className="p-4 border-t">
                            <Button
                                className="w-full py-2 rounded"
                                onClick={() => {
                                    placeOrder(order)
                                }}
                                disabled={isPending}
                            >
                                Place Order
                            </Button>
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    )
}
