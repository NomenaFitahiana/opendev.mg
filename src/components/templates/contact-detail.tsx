"use client";

import { useState } from "react";
import { ContactMock, ContactStatus } from "@/mocks/contacts";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

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

function formatDate(date: Date): string {
  return date.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

interface ContactDetailProps {
  contact: ContactMock;
  onStatusChange: (contactId: string, newStatus: ContactStatus) => void;
  onBack: () => void;
}

export function ContactDetail({ contact, onStatusChange, onBack }: ContactDetailProps) {
  const [replyText, setReplyText] = useState("");
  const [isReplying, setIsReplying] = useState(false);

  const handleSendReply = () => {
    console.log("Sending reply to:", contact.email, "Message:", replyText);
    setReplyText("");
    setIsReplying(false);
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 p-4 border-b">
        <Button
          variant="ghost"
          size="icon"
          title="Retour"
          onClick={onBack}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-arrow-left"
          >
            <path d="m12 19-7-7 7-7" />
            <path d="M19 12H5" />
          </svg>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          title="Marquer comme non lu"
          onClick={() => onStatusChange(contact.id, "UNREAD")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-mail"
          >
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
          </svg>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          title="Archiver"
          onClick={() => onStatusChange(contact.id, "ARCHIVED")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-archive"
          >
            <rect width="20" height="5" x="2" y="3" rx="1" />
            <path d="M4 8v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8" />
            <path d="M10 12h4" />
            <path d="M2 6h20" />
          </svg>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          title="Supprimer"
          onClick={() => onStatusChange(contact.id, "ARCHIVED")}
          className="text-destructive hover:text-destructive"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-trash-2"
          >
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" x2="10" y1="11" y2="17" />
            <line x1="14" x2="14" y1="11" y2="17" />
          </svg>
        </Button>

        <Button
          variant="ghost"
          size="icon"
          title="En attente"
          onClick={() => onStatusChange(contact.id, "READ")}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-clock"
          >
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
        </Button>
      </div>

      <div className="flex-1 overflow-auto p-4">
        <div className="flex items-center gap-3 mb-4">
          <Avatar size="lg" className="shrink-0">
            <AvatarFallback className={cn(getAvatarColor(contact.name), "text-white font-medium text-lg")}>
              {getInitials(contact.name)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h3 className="font-semibold text-lg">{contact.name}</h3>
            <p className="text-sm text-muted-foreground">{contact.email}</p>
            {contact.budget && (
              <p className="text-xs text-muted-foreground mt-1">
                Budget: {contact.budget}
              </p>
            )}
          </div>
        </div>

        <div className="text-sm text-muted-foreground mb-2">
          Reçu le {formatDate(contact.createdAt)}
        </div>

        <div className="p-4 bg-muted/30 rounded-lg whitespace-pre-wrap">
          {contact.message}
        </div>
      </div>

      <div className="border-t p-4">
        {!isReplying ? (
          <Button onClick={() => setIsReplying(true)} className="w-full">
            Répondre
          </Button>
        ) : (
          <div className="flex flex-col gap-2">
            <Textarea
              placeholder="Tapez votre réponse..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              rows={4}
            />
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => {
                  setIsReplying(false);
                  setReplyText("");
                }}
              >
                Annuler
              </Button>
              <Button onClick={handleSendReply} disabled={!replyText.trim()}>
                Envoyer
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
