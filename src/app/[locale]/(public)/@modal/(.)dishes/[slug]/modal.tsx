"use client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRouter } from "@/navigation";
import React, { useEffect, useState } from "react";

export default function Modal({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [open, setOpen] = useState(true);
  return (
    <Dialog
      open={open}
      onOpenChange={(open) => {
        setOpen(open);
        if (!open) router.back();
      }}
    >
      <DialogContent className="h-[700px] overflow-auto max-w-[820px]">
        <DialogTitle />
        <DialogDescription />
        {children}
      </DialogContent>
    </Dialog>
  );
}
