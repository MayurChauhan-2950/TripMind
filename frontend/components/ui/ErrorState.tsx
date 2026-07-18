export default function ErrorState({ message }: { message: string }) {
  return (
    <div className="mt-6 rounded-card border border-rust/40 bg-rust/5 p-4">
      <p className="font-body text-label uppercase tracking-[0.04em] text-rust">Error</p>
      <p className="mt-1 font-body text-body-md text-navy">{message}</p>
    </div>
  );
}
