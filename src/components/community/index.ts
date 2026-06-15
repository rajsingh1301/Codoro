import { Card, CardContent } from "@/components/ui/card";

interface CommunityCardProps {
  name: string;
  description: string;
}

export function CommunityCard({
  name,
  description,
}: CommunityCardProps) {
  return (
    <Card>
      <CardContent className="p-4">
        <h2 className="text-xl font-bold">{name}</h2>
        <p className="text-muted-foreground">
          {description}
        </p>
      </CardContent>
    </Card>
  );
}