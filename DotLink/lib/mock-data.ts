import { Link } from "@/types/link";

// Helper to create dates relative to now
const daysFromNow = (days: number) =>
  new Date(Date.now() + days * 24 * 60 * 60 * 1000);

export const mockLinks: Link[] = [
  {
    id: "link_1",
    amount: 50.5,
    expiresAt: daysFromNow(6),
    status: "active",
  },
  {
    id: "link_2",
    amount: 25.0,
    expiresAt: daysFromNow(29),
    status: "active",
  },
  {
    id: "link_3",
    amount: 100.0,
    expiresAt: daysFromNow(-1),
    status: "claimed",
  },
  {
    id: "link_4",
    amount: 75.25,
    expiresAt: daysFromNow(15),
    status: "active",
  },
];
