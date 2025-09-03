// src/components/forms/FormInput.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
}

export const FormInput = ({ id, label, error, className, ...props }: FormInputProps) => {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        className={cn(error && "border-destructive focus-visible:ring-destructive")}
        {...props}
      />
      {error && <p className="text-sm text-destructive font-medium">{error}</p>}
    </div>
  );
};