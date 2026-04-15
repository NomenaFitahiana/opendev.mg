"use client";

import { useState } from "react";
import { mockContacts, ContactStatus, ContactMock } from "@/mocks/contacts";
import { ContactListItem } from "./contact-list-item";
import { ContactDetail } from "@/components/templates/contact-detail";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createMetadata } from "@/lib/metadata";
import { Inbox, Archive, Trash2, Clock } from "lucide-react";

export const metadata = createMetadata({ title: "Demandes de contact" });

type TabType = "inbox" | "awaiting" | "archived";

const tabs: { id: TabType; label: string; status: ContactStatus[] }[] = [
  { id: "inbox", label: "Inbox", status: ["UNREAD"] },
  { id: "awaiting", label: "Awaiting approval", status: ["READ"] },
  { id: "archived", label: "Archived", status: ["ARCHIVED"] },
];

function getContactsByStatus(status: ContactStatus[]): ContactMock[] {
  return mockContacts.filter((contact) => status.includes(contact.status));
}

function getUnreadCount(): number {
  return mockContacts.filter((c) => c.status === "UNREAD").length;
}

function getAwaitingCount(): number {
  return mockContacts.filter((c) => c.status === "READ").length;
}

function getArchivedCount(): number {
  return mockContacts.filter((c) => c.status === "ARCHIVED").length;
}

export default function ContactsPage() {
  const [activeTab, setActiveTab] = useState<TabType>("inbox");
  const [selectedContact, setSelectedContact] = useState<ContactMock | null>(null);
  const [contacts, setContacts] = useState(mockContacts);

  const currentTab = tabs.find((t) => t.id === activeTab)!;
  const filteredContacts = getContactsByStatus(currentTab.status);

  const handleStatusChange = (contactId: string, newStatus: ContactStatus) => {
    setContacts((prev) =>
      prev.map((c) => (c.id === contactId ? { ...c, status: newStatus } : c))
    );
    setSelectedContact(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Demandes de contact</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Gérez vos demandes de contact et devis.
        </p>
      </div>

      <div className="flex gap-1 border-b">
        <button
          onClick={() => {
            setActiveTab("inbox");
            setSelectedContact(null);
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors relative",
            activeTab === "inbox"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Inbox
          <span className="ml-2 bg-blue-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {getUnreadCount()}
          </span>
          {activeTab === "inbox" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("awaiting");
            setSelectedContact(null);
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors relative",
            activeTab === "awaiting"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Awaiting approval
          <span className="ml-2 bg-amber-500 text-white text-xs px-1.5 py-0.5 rounded-full">
            {getAwaitingCount()}
          </span>
          {activeTab === "awaiting" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
          )}
        </button>

        <button
          onClick={() => {
            setActiveTab("archived");
            setSelectedContact(null);
          }}
          className={cn(
            "px-4 py-2 text-sm font-medium transition-colors relative",
            activeTab === "archived"
              ? "text-foreground"
              : "text-muted-foreground hover:text-foreground"
          )}
        >
          Archived
          <span className="ml-2 bg-muted text-muted-foreground text-xs px-1.5 py-0.5 rounded-full">
            {getArchivedCount()}
          </span>
          {activeTab === "archived" && (
            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-foreground" />
          )}
        </button>
      </div>

      {selectedContact ? (
        <Card className="flex-1">
          <CardContent className="p-0 h-full">
            <ContactDetail
              contact={selectedContact}
              onStatusChange={handleStatusChange}
              onBack={() => setSelectedContact(null)}
            />
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base">
              {currentTab.label}
              <span className="ml-2 text-muted-foreground font-normal">
                ({filteredContacts.length})
              </span>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {filteredContacts.length === 0 ? (
              <div className="p-6 text-center text-muted-foreground text-sm">
                Aucun message dans cette catégorie.
              </div>
            ) : (
              <div className="divide-y">
                {filteredContacts.map((contact) => (
                  <ContactListItem
                    key={contact.id}
                    contact={contact}
                    onClick={() => setSelectedContact(contact)}
                  />
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
