import { cn } from "@/lib/utils"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-primary/10", className)}
      {...props}
    />
  )
}

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[175px] w-[175px] md:h-[250px] md:w-[300px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[175px] md:w-[300px]" />
        <Skeleton className="h-4 w-[150px] md:w-[250px]" />
      </div>
    </div>
  )
}


export { Skeleton, SkeletonCard }
