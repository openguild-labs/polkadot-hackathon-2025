'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SellNFTModal({ isOpen, onClose, onSetPrice, nft }) {
  const [price, setPrice] = useState('')

  const handleSubmit = (e) => {
    e.preventDefault()
    const numPrice = parseFloat(price)
    if (!isNaN(numPrice) && numPrice > 0) {
      onSetPrice(numPrice)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] bg-gray-800 text-white">
        <DialogHeader>
          <DialogTitle>Sell NFT</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center justify-center">
            <Image src={nft.image} alt={nft.name} width={200} height={200} className="rounded-lg" />
          </div>
          <div className="text-center">
            <h3 className="font-semibold text-lg">{nft.name}</h3>
            <p className="text-sm text-gray-500">ID: {nft.id}</p>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">
                Price (ETH)
              </Label>
              <Input
                id="price"
                type="number"
                step="0.01"
                min="0"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter className="mt-4">
              <Button type="submit">Set Price</Button>
            </DialogFooter>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}

