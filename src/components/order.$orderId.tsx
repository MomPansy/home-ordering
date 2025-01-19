import { useParams } from "react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import supabase from "../lib/supabase";
import { SkeletonCard } from "./ui/skeleton";
import { MenuItem } from "./menu-item";
import { Button } from "./ui/button";
import { useToast } from "@/hooks/use-toast";

export function Order() {
    const { orderId } = useParams();
    const queryClient = useQueryClient()
    const { toast } = useToast()

    if (!orderId) {
        throw new Error('Missing orderId');
    }
    const { mutateAsync: confirmOrder } = useMutation({
        mutationFn: async () => {
            const { error } = await supabase.from('orders').update({
                status: 'Confirmed'
            }).eq('id', parseInt(orderId));

            if (error) {
                console.error(error.message);
                throw error;
            }
        },
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['order', orderId],
            })
            queryClient.invalidateQueries({
                queryKey: ['orderConfirmed', orderId],
            })
            toast({
                title: `Order ${orderId} confirmed!`,
            })
        }
    })

    const { data: orderConfirmed, isLoading: isOrderConfirmedLoading } = useQuery({
        queryKey: ['orderConfirmed', orderId],
        queryFn: async () => {
            const { data, error } = await supabase
                .from('orders')
                .select('status')
                .eq('id', parseInt(orderId))
                .single();

            if (error) {
                console.error(error.message);
                throw error;
            }

            return data;
        },
    });

    const { data, isLoading } = useQuery({
        queryKey: ['order', orderId],
        queryFn: async () => {
            const parsedOrderId = parseInt(orderId);

            // Fetch order items
            const { data: orderItems, error: orderItemError } = await supabase
                .from('order_items')
                .select('*')
                .eq('order_id', parsedOrderId);

            if (orderItemError) {
                console.error(orderItemError.message);
                throw orderItemError;
            }

            // Fetch item names from storage objects
            const itemIds = orderItems?.map(item => item.item_id!).filter(Boolean);
            const { data: items, error: itemError } = await supabase
                .schema('storage')
                .from('objects')
                .select('*')
                .in('id', itemIds);

            if (itemError) {
                console.error(itemError.message);
                throw itemError;
            }

            // Filter item names
            const itemNames = items?.map(item => item.name).filter(Boolean) as string[];

            // Generate signed URLs
            const { data: urls, error: urlError } = await supabase
                .storage
                .from('menu')
                .createSignedUrls(itemNames, 3600);

            if (urlError) {
                console.error(urlError.message);
                throw urlError;
            }

            // Format data with item names
            return urls?.map((url) => {
                const orderItem = orderItems.find((oi) => oi.item_id === items.find(item => item.name === url.path)?.id);
                return {
                    ...url,
                    name: url.path?.split('/')[1]?.split('.')[0],
                    quantity: orderItem?.quantity,
                    created_at: orderItem?.created_at,
                }
            });
        },
    });

    return (
        <div className="flex flex-col h-screen">
            <div className="flex flex-col flex-1 overflow-y-auto">
                <div className="p-4 border-b">
                    <h1 className="text-2xl font-bold text-gray-800">
                        Order #{orderId} Confirmation
                    </h1>
                    {data?.[0]?.created_at && (
                        <p className="text-sm text-gray-500 mt-1">
                            Placed on{" "}
                            {new Date(data[0].created_at).toLocaleDateString("en-GB", {
                                timeZone: "Asia/Singapore",
                                day: "numeric",
                                month: "long",
                                year: "numeric",
                            })}
                        </p>
                    )}
                </div>
                {isLoading || isOrderConfirmedLoading ? (
                    <div className="grid grid-cols-2 md:grid-cols-4 p-2 gap-4">
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                        <SkeletonCard />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-4 p-2 gap-4">
                        {data && data.map((item) => (
                            <MenuItem key={item.name} name={item.name ?? '-'} url={item.signedUrl} quantity={item.quantity} withDialog/>
                        ))}
                    </div>
                )
                }
            </div>
            {
                orderConfirmed?.status === 'Pending' ? (
                    <div className="p-4 border-t">
                        <Button className="w-full py-2 rounded" onClick={() => confirmOrder()} disabled={isLoading || isOrderConfirmedLoading}>Confirm Order</Button>
                    </div>
                ) : (
                    <div className="p-4 border-t">
                        <Button className="w-full py-2 rounded bg-green-500" disabled>Order Confirmed</Button>
                    </div>
                )
            }
        </div>
    );
}