import { currentUser } from "@clerk/nextjs/server";

export interface AuthenticatedUser {
  id: string;
  username: string;
  imageUrl: string;
  email: string;
}

export async function getCurrentUser(): Promise<AuthenticatedUser | null> {
  try {
    const clerkUser = await currentUser();
    if (!clerkUser) return null;

    // Fallbacks for username/display name
    let username = clerkUser.username;
    if (!username) {
      if (clerkUser.firstName) {
        username = clerkUser.firstName + (clerkUser.lastName ? ` ${clerkUser.lastName}` : "");
      } else {
        username = clerkUser.emailAddresses[0]?.emailAddress.split("@")[0] || "User";
      }
    }

    return {
      id: clerkUser.id,
      username: username,
      imageUrl: clerkUser.imageUrl,
      email: clerkUser.emailAddresses[0]?.emailAddress || "",
    };
  } catch (error) {
    console.error("Error fetching current user in current-user abstraction:", error);
    return null;
  }
}
