export default function AILoadingState({ message }: { message: string }) {
  return (
    <div className="mt-8 flex flex-col items-center gap-4 py-8">
      <div className="flex items-center gap-3">
        <div className="size-2 animate-bounce rounded-full bg-gold [animation-delay:0ms]" />
        <div className="size-2 animate-bounce rounded-full bg-gold [animation-delay:150ms]" />
        <div className="size-2 animate-bounce rounded-full bg-gold [animation-delay:300ms]" />
      </div>
      <p className="font-body text-body-sm text-slate">{message}</p>
    </div>
  );
}
