import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'

export default function BuyNFTModal({ isOpen, onClose, onBuy, nft }) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Buy NFT</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p>
            Are you sure you want to buy {nft.name} for {nft.price} ETH?
          </p>
        </div>
        <DialogFooter>
          <Button onClick={onBuy}>Confirm Purchase</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

