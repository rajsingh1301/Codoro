import { CreateCommunityForm } from "@/src/components/community/create-community-form";

export default function CreateCommunityPage() {
  return (
    <div className="container mx-auto max-w-2xl p-8">
      <h1 className="text-3xl font-bold mb-6">
        Create Community
      </h1>

      <CreateCommunityForm />
    </div>
  );
}