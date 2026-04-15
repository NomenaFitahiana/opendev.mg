export type ContactStatus = "UNREAD" | "READ" | "ARCHIVED";

export interface ContactMock {
  id: string;
  name: string;
  email: string;
  message: string;
  budget?: string;
  status: ContactStatus;
  createdAt: Date;
}

export const mockContacts: ContactMock[] = [
  {
    id: "1",
    name: "Alice Martin",
    email: "alice@example.com",
    message: "Bonjour, je souhaite discuter d'un projet web pour ma startup. Nous avons besoin d'un site e-commerce complète avec système de paiement.",
    budget: "5000-10000",
    status: "UNREAD",
    createdAt: new Date("2026-04-15T10:30:00"),
  },
  {
    id: "2",
    name: "Bob Durand",
    email: "bob@example.com",
    message: "Intéressé par vos services pour refondre notre site existant.looking for a modern redesign.",
    budget: "10000-20000",
    status: "UNREAD",
    createdAt: new Date("2026-04-14T15:20:00"),
  },
  {
    id: "3",
    name: "Claire Petit",
    email: "claire@example.com",
    message: "Je lance une application mobile et j'ai besoin d'un développeur React Native.",
    budget: "5000-8000",
    status: "UNREAD",
    createdAt: new Date("2026-04-14T09:00:00"),
  },
  {
    id: "4",
    name: "David Moreau",
    email: "david@example.com",
    message: "Demande de devis pour un projet de plateforme éducatif. Besoin de fonctionnalités avancées.",
    budget: "15000-25000",
    status: "READ",
    createdAt: new Date("2026-04-13T14:45:00"),
  },
  {
    id: "5",
    name: "Emma Laurent",
    email: "emma@example.com",
    message: "Bonjour, nous cherchons un partenaire technique pour notre startup fintech.",
    budget: "20000+",
    status: "READ",
    createdAt: new Date("2026-04-12T11:30:00"),
  },
  {
    id: "6",
    name: "Francis Blanc",
    email: "francis@example.com",
    message: "Refonte complete de notre site vitrine avec optimisation SEO.",
    budget: "3000-5000",
    status: "READ",
    createdAt: new Date("2026-04-11T16:00:00"),
  },
  {
    id: "7",
    name: "Grace Huber",
    email: "grace@example.com",
    message: "Projet d'application SaaS - discussion préalable pour évaluer les besoins.",
    budget: "10000-15000",
    status: "ARCHIVED",
    createdAt: new Date("2026-04-10T08:15:00"),
  },
  {
    id: "8",
    name: "Henry Kim",
    email: "henry@example.com",
    message: "Demande déjà traitée previously. Project cancelled par le client.",
    budget: "8000",
    status: "ARCHIVED",
    createdAt: new Date("2026-04-08T13:00:00"),
  },
];
