
interface CommunityCardProps {
  name: string;
  description: string;
}

export function CommunityCard({
  name,
  description,
}: CommunityCardProps) {
  return (
    <div className="group rounded-[14px] border border-border-main bg-card-bg hover:bg-card-elevated p-6 shadow-sm hover:border-brand/35 transition duration-200">
      <h2 className="text-lg font-bold text-txt-primary group-hover:text-brand transition duration-200">{name}</h2>
      <p className="text-txt-secondary mt-2 text-xs sm:text-sm leading-relaxed">
        {description}
      </p>
    </div>
  );
}
