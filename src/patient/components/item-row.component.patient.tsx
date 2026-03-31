import { Calendar } from "lucide-react";
import React from "react";
import { BaseItem } from "../types/consultation.types";

export function ItemRow({
  item,
  children,
}: {
  item: BaseItem;
  children: React.ReactNode;
}) {
  return (
    <div className="flex bg-[#F7F7F7] items-center justify-between px-4 py-4 rounded-[12px]">
      <div className="flex items-start gap-4">
        <div className="flex flex-col items-center border py-[6px] px-[10px] bg-white rounded-[8px] gap-1">
          <span className="font-medium text-[16px] leading-none text-foreground">
            {item.date.day}
          </span>
          <span className="text-xs font-normal text-[#E85151]">
            {item.date.month}
          </span>
        </div>
        <div>
          <p className="text-[16px] font-medium text-foreground">
            {item.doctorName} ({item.specialty})
          </p>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-[#6C6C6C]">
            <span>Ref: {item.ref}</span>
            <span>•</span>
            <span>{item.type}</span>
            <span>•</span>
            <Calendar className="h-3 w-3" />
            <span>{item.time}</span>
          </div>
        </div>
      </div>
      {children}
    </div>
  );
}
