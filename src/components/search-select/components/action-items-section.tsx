"use client";
import { Button } from "@/components/ui/button";
import { handleActionClick, handleActionKeyDown } from "../helpers";
import type { ActionItemsSectionProps } from "../types";

export function ActionItemsSection({
  actionItems,
  onActionItemClick,
  onClose,
}: ActionItemsSectionProps) {
  if (actionItems.length === 0) return null;

  return (
    <div className="border-b">
      {actionItems.map((item) => (
        <Button
          key={item.id}
          variant="ghost"
          className="flex items-center gap-2 px-2 py-1.5 text-base md:text-lg justify-start w-full"
          onClick={(e) =>
            handleActionClick(e, item.id, onActionItemClick, onClose)
          }
          onKeyDown={(e) =>
            handleActionKeyDown(e, item.id, onActionItemClick, onClose)
          }
        >
          {item.icon}
          <span className="font-medium">{item.label}</span>
        </Button>
      ))}
    </div>
  );
}
