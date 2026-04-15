"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import { ContactMock, ContactStatus } from "@/mocks/contacts";

const ALPHABET_COLORS: Record<string, string> = {
  A: "bg-blue-500",
  B: "bg-teal-500",
  C: "bg-amber-500",
  D: "bg-orange-500",
  E: "bg-pink-500",
  F: "bg-rose-500",
  G: "bg-red-500",
  H: "bg-red-600",
  I: "bg-yellow-500",
  J: "bg-lime-500",
  K: "bg-green-500",
  L: "bg-emerald-500",
  M: "bg-green-600",
  N: "bg-cyan-500",
  O: "bg-sky-500",
  P: "bg-blue-600",
  Q: "bg-indigo-500",
  R: "bg-violet-500",
  S: "bg-purple-500",
  T: "bg-fuchsia-500",
  U: "bg-pink-400",
  V: "bg-rose-400",
  W: "bg-red-400",
  X: "bg-orange-400",
  Y: "bg-amber-400",
  Z: "bg-yellow-400",
};

function getInitials(name: string): string {
  const parts = name.split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

function getAvatarColor(name: string): string {
  const firstLetter = name[0].toUpperCase();
  return ALPHABET_COLORS[firstLetter] || "bg-gray-500";
}

function truncateMessage(message: string, maxLength: number = 60): string {
  if (message.length <= maxLength) return message;
  return message.slice(0, maxLength) + "...";
}

function formatDate(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) {
    return "Aujourd'hui";
  } else if (diffDays === 1) {
    return "Hier";
  } else if (diffDays < 7) {
    return `Il y a ${diffDays} jours`;
  } else {
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  }
}

interface ContactListItemProps {
  contact: ContactMock;
  onClick?: () => void;
  isSelected?: boolean;
}

export function ContactListItem({ contact, onClick, isSelected }: ContactListItemProps) {
  const isUnread = contact.status === "UNREAD";

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors hover:bg-muted/50",
        isUnread && "bg-muted/30",
        isSelected && "bg-muted"
      )}
    >
      {isUnread && (
        <div className="w-2 h-2 rounded-full bg-blue-500 shrink-0" />
      )}

      <Avatar size="default" className="shrink-0">
        <AvatarFallback className={cn(getAvatarColor(contact.name), "text-white font-medium")}>
          {getInitials(contact.name)}
        </AvatarFallback>
      </Avatar>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <p className={cn("font-medium truncate", isUnread && "font-semibold")}>
            {contact.name}
          </p>
          <span className="text-xs text-muted-foreground shrink-0">
            {formatDate(contact.createdAt)}
          </span>
        </div>
        <p className={cn("text-sm text-muted-foreground truncate", isUnread && "text-foreground")}>
          {truncateMessage(contact.message)}
        </p>
      </div>
    </div>
  );
}
