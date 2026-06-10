interface CommunityCardProps {
  name: string;
  description: string;
}

export function CommunityCard({
  name,
  description,
}: CommunityCardProps) {
  return (
    <div className="rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 shadow-sm">
      <h2 className="text-xl font-bold text-white">{name}</h2>
      <p className="text-zinc-400 mt-1 text-sm">
        {description}
      </p>
    </div>
  );
}
