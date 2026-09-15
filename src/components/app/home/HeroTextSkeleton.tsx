export function HeroTextSkeleton() {
    return (
        <div className="animate-pulse space-y-3">
            <div className="h-[3.4rem] w-[85%] rounded bg-white/15" />
            <div className="h-[3.4rem] w-[70%] rounded bg-white/15" />

            <div className="mt-5 space-y-2 pt-1">
                <div className="h-4 w-full max-w-md rounded bg-white/10" />
                <div className="h-4 w-[90%] max-w-md rounded bg-white/10" />
                <div className="h-4 w-[60%] max-w-md rounded bg-white/10" />
            </div>

            <div className="mt-8 h-[46px] w-44 rounded bg-white/10" />
        </div>
    );
}