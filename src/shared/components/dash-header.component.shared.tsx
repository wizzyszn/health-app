import { ReactNode } from "react";
import { VscBell } from "react-icons/vsc";

interface Props {
  headerChild?: ReactNode;
}
function DashHeader({ headerChild }: Props) {
  return (
    <header className="bg-[#fff] border-b border-[#E5E5E5] h-[72px] w-full flex justify-end items-center px-8 gap-4 sticky top-0 z-10 shadow-sm">
      <div className="group size-10 rounded-full flex justify-center items-center bg-[#F4F4F4] cursor-pointer transition-all duration-300 hover:bg-[#E5E5E5] hover:shadow-sm hover:-translate-y-0.5 active:translate-y-0 active:scale-95 relative">
        <VscBell
          size={22}
          color="#555"
          className="transition-transform duration-300 group-hover:rotate-[15deg] group-hover:scale-110 origin-top"
        />
        <span className="absolute top-2 right-2 size-2 bg-red-500 rounded-full border-2 border-white transition-transform duration-300 group-hover:scale-125"></span>
      </div>
      {headerChild ? headerChild : null}
    </header>
  );
}

export default DashHeader;
