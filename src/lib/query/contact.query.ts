import prisma from "@/lib/prisma";
import { ContactStatus } from "@/types/contact";

export const contactStatusValues = ["UNREAD", "READ", "AWAITING", "ARCHIVED"] as const;

export async function getContacts(): Promise<{
  contacts: {
    id: string;
    name: string;
    email: string;
    message: string;
    budget: string | null;
    reply: string | null;
    replyAt: Date | null;
    status: ContactStatus;
    createdAt: Date;
    updatedAt: Date;
  }[];
}> {
  const contacts = await prisma.contact.findMany({
    orderBy: { createdAt: "desc" },
  });

  return { contacts };
}

export async function getContactById(id: string) {
  return prisma.contact.findUnique({ where: { id } });
}

export async function updateContactStatus(
  id: string,
  status: ContactStatus
) {
  return prisma.contact.update({
    where: { id },
    data: { status },
  });
}

export async function replyToContact(
  id: string,
  reply: string
) {
  return prisma.contact.update({
    where: { id },
    data: {
      reply,
      replyAt: new Date(),
      status: "READ",
    },
  });
}