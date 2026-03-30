"use client";

import type React from "react";

import { X } from "lucide-react";

interface DrawerProps {
  isOpenState: boolean;
  drawerTitle?: string;
  children: React.ReactNode;
  onClose: () => void;
  size?:
    | "w-1/4"
    | "w-2/4"
    | "w-3/4"
    | "w-1/3"
    | "w-2/3"
    | "w-1/2"
    | "w-full"
    | string;
  className?: string;
}

export function CustomDrawer({
  isOpenState,
  drawerTitle = "Drawer",
  children,
  onClose,
  size = "w-1/4",
  className,
}: DrawerProps) {
  return (
    <div className={`relative ${className ? className : ""}`}>
      {/* Backdrop Overlay */}
      {isOpenState && (
        <div
          className="fixed inset-0 z-40 bg-black/5 dark:bg-white/5 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
          aria-label="Close drawer backdrop"
        />
      )}
      {/* Drawer */}
      <div
        className={`fixed inset-y-0 right-0 z-50 ${size} bg-background min-w-[250px] transform shadow-lg transition-transform duration-300 ease-in-out dark:border-l ${
          isOpenState ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex h-full flex-col p-4">
          <div className="flex items-center justify-between border-b pb-2">
            <h2 className="text-lg font-semibold">{drawerTitle}</h2>
            <button
              className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 hover:bg-accent hover:text-accent-foreground h-10 w-10 p-0"
              onClick={onClose}
              aria-label="Close drawer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="flex-1 py-4">{children}</div>
        </div>
      </div>
    </div>
  );
}
