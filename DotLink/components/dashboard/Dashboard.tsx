"use client";

import { useEffect, useState } from "react";
import LinksList from "./LinksList";
import CreateLinkModal from "./CreateLinkModal";
import { Link } from "@/types/link";
import { mockLinks } from "@/lib/mock-data";
import { useReadContract } from "wagmi";
import { abi } from "@/lib/abi";
import { useAccount } from "wagmi";

const CONTRACT_ADDRESS = "0xbef368894A05B7F1E0e64a78eE530222e0e63471";

export default function Dashboard() {
  const [links, setLinks] = useState<Link[]>(mockLinks);
  const [linkId, setLinkId] = useState<string | null>(null);
  const { address, status } = useAccount();

  const { data: senderLinks, refetch: refetchLinks } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "getSenderLinks",
    args: [address as `0x${string}`],
    query: {
      enabled: !!address,
    },
  });

  const { data: linkData, refetch: refetchLink } = useReadContract({
    address: CONTRACT_ADDRESS as `0x${string}`,
    abi,
    functionName: "links",
    args: linkId ? [linkId as `0x${string}`] : undefined,
    query: {
      enabled: !!linkId,
    },
  });

  useEffect(() => {
    async function fetchLinks() {
      console.log("fetching links");
      await refetchLinks();
      console.log("senderLinks", senderLinks);
      if (senderLinks && Array.isArray(senderLinks) && senderLinks.length > 0) {
        for (const linkId of senderLinks) {
          setLinkId(linkId as `0x${string}`);
          await refetchLink();
          if (linkData) {
            const [sender, amount, expirationTime, claimed] = linkData as [
              `0x${string}`,
              bigint,
              bigint,
              boolean
            ];

            setLinks([
              {
                id: linkId,
                amount: Number(amount) / 1e18,
                expiresAt: new Date(Number(expirationTime) * 1000),
                status: claimed ? "claimed" : "active",
              },
              ...links,
            ]);
          }
        }
      }
    }
    fetchLinks();
  }, []);

  const handleCreateLink = async () => {
    await refetchLinks();
    if (senderLinks && Array.isArray(senderLinks) && senderLinks.length > 0) {
      const linkId = senderLinks[senderLinks.length - 1] as `0x${string}`;
      setLinkId(linkId);

      await refetchLink();

      if (linkData) {
        const [sender, amount, expirationTime, claimed] = linkData as [
          `0x${string}`,
          bigint,
          bigint,
          boolean
        ];

        setLinks([
          {
            id: linkId,
            amount: Number(amount) / 1e18,
            expiresAt: new Date(Number(expirationTime) * 1000),
            status: claimed ? "claimed" : "active",
          },
          ...links,
        ]);
      }
    }
  };

  return (
    <main className="container mx-auto px-8 py-16">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-12">
          <h2 className="text-4xl font-bold text-foreground">
            Your Transfer Links
          </h2>
          <CreateLinkModal onCreateLink={handleCreateLink} />
        </div>

        <div className="bg-card p-12 rounded-3xl shadow-lg border border-border">
          <LinksList
            links={links}
            onReclaim={(id) => {
              setLinks(links.filter((link) => link.id !== id));
            }}
          />
        </div>
      </div>
    </main>
  );
}
