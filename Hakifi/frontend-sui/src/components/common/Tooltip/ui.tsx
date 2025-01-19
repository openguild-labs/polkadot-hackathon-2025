"use client"
 
import * as React from "react"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
 
import { cn } from "@/utils"
 
const TooltipProvider = TooltipPrimitive.Provider
 
const Tooltip = TooltipPrimitive.Root
const TooltipArrow = TooltipPrimitive.TooltipArrow
const TooltipTrigger = TooltipPrimitive.Trigger
 
const TooltipContent = React.forwardRef<
  React.ElementRef<typeof TooltipPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>
>(({ className, sideOffset = 4, ...props }, ref) => (
  <TooltipPrimitive.Content
    ref={ref}
    sideOffset={sideOffset}
    className={cn(
      "z-50 rounded-md border bg-background-tertiary border-divider-secondary px-3 py-1.5 text-sm animate-in fade-in-0 zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=closed]:zoom-out-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2",
      "before:absolute before:bottom-[-5px] before:size-2.5 before:bg-support-black before:left-[50%] before:border-r before:border-b before:rotate-45 before:border-divider-secondary",
      className
    )}
    {...props}
  />
))
TooltipContent.displayName = TooltipPrimitive.Content.displayName
 
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider,TooltipArrow }