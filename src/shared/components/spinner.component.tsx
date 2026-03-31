import { cn } from "@/lib/utils";

type Props = {
  className?: string;
};

function Spinner({ className }: Props) {
  return (
    <div className={`${cn(className)} flex items-center justify-center h-full`}>
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );
}

export default Spinner;
