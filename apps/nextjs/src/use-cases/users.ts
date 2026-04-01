import { prisma } from "@/lib/prisma";

export async function deleteUserUseCase(
  authenticatedUserId: string,
  userToDeleteId: string
) {
  if (authenticatedUserId !== userToDeleteId) {
    throw new Error("You can only delete your own account");
  }

  await prisma.user.delete({
    where: { id: userToDeleteId },
  });
}
