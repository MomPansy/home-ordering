import { useQuery } from "@tanstack/react-query";
import supabase from "@/lib/supabase";

export const useGetSoup = () => {
    return useQuery({
        queryKey: ['objects', 'soup'],
        queryFn: async () => {
            const {
                data: listData,
                error: listError,
            } = await supabase.storage.from('menu').list('soup')

            if (listError) {
                // Throwing makes React Query set `error` (so `isError` becomes `true`)
                throw listError
            }

            const fileNames = listData?.map((file) => `soup/${file.name}`) ?? []
            const { data: urls, error: urlErrors } = await supabase.storage
                .from('menu')
                .createSignedUrls(fileNames, 3600, {
                    download: true,
                })

            if (urlErrors) {
                console.error(urlErrors)
                throw urlErrors
            }

            const data = urls.map((url) => {
                return {
                    ...url,
                    name: url.path?.split('/')[1].split('.')[0],
                    id: listData?.find((file) => file.name === url.path?.split('/')[1])?.id,
                }
            })

            console.log(data)

            return data
        }
    })
}