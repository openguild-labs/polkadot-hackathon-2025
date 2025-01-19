"use client";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { PlusCircle } from "lucide-react";
import CreateLinkForm from "./CreateLinkForm";
import { useState } from "react";

interface CreateLinkModalProps {
  onCreateLink: (data: {
    amount: number;
    expiration: number;
    linkId: string;
  }) => void;
}

export default function CreateLinkModal({
  onCreateLink,
}: CreateLinkModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          size="lg"
          className="rounded-full blob-button text-lg px-8 py-6"
        >
          <PlusCircle className="mr-3 h-6 w-6" />
          Create New Link
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px] p-8">
        <DialogHeader className="mb-6">
          <DialogTitle className="text-3xl font-bold">
            Create Transfer Link
          </DialogTitle>
        </DialogHeader>
        <CreateLinkForm
          onCreateLink={onCreateLink}
          onClose={() => setOpen(false)}
        />
      </DialogContent>
    </Dialog>
  );
}
