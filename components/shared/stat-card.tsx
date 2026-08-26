export function StatCard({
  value,
  label
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-[24px] border border-white/60 bg-white/80 p-5 shadow-soft">
      <p className="font-serif text-3xl text-stone-900">{value}</p>
      <p className="mt-2 text-sm text-stone-600">{label}</p>
    </div>
  );
}
