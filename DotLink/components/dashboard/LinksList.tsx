import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistance } from "date-fns";
import { Link } from "@/types/link";
import { Badge } from "@/components/ui/badge";

interface LinksListProps {
  links: Link[];
  onReclaim: (id: string) => void;
}

export default function LinksList({ links, onReclaim }: LinksListProps) {
  if (links.length === 0) {
    return (
      <div className="text-center py-16">
        <p className="text-xl text-muted-foreground">
          No transfer links created yet.
        </p>
        <p className="text-lg text-muted-foreground mt-3">
          Create your first link to get started!
        </p>
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="text-lg py-6">Amount (WST)</TableHead>
          <TableHead className="text-lg py-6">Expiration</TableHead>
          <TableHead className="text-lg py-6">Status</TableHead>
          <TableHead className="text-lg py-6 text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {links.map((link) => (
          <TableRow key={link.id}>
            <TableCell className="text-lg font-medium py-6">
              {link.amount}
            </TableCell>
            <TableCell className="text-lg py-6">
              {formatDistance(link.expiresAt, new Date(), { addSuffix: true })}
            </TableCell>
            <TableCell className="py-6">
              <Badge
                className="text-base px-4 py-1"
                variant={link.status === "active" ? "default" : "destructive"}
              >
                {link.status}
              </Badge>
            </TableCell>
            <TableCell className="text-right py-6">
              {link.status === "active" && (
                <Button
                  variant="destructive"
                  size="lg"
                  className="px-6"
                  onClick={() => onReclaim(link.id)}
                >
                  Reclaim
                </Button>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
