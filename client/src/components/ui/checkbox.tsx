import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

interface CheckboxProps {
  id?: string;
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  disabled?: boolean;
  className?: string;
}

const Checkbox = ({
  id,
  checked = false,
  onCheckedChange,
  disabled = false,
  className,
}: CheckboxProps) => {
  return (
    <div className="flex items-center">
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        disabled={disabled}
        className="sr-only"
      />
      <div
        className={cn(
          "h-4 w-4 rounded border border-slate-300 flex items-center justify-center cursor-pointer transition-colors",
          checked ? "bg-emerald-600 border-emerald-600" : "bg-white",
          disabled && "opacity-50 cursor-not-allowed",
          className
        )}
        onClick={() => !disabled && onCheckedChange?.(!checked)}
      >
        {checked && <Check className="h-3 w-3 text-white" />}
      </div>
    </div>
  );
};

export { Checkbox };