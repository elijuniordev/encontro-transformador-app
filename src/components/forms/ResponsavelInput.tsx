// src/components/forms/ResponsavelInput.tsx
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InscriptionFormData } from "@/hooks/useInscriptionFormLogic";

interface ResponsavelInputProps {
  index: 1 | 2 | 3;
  formData: InscriptionFormData;
  handleInputChange: (field: string, value: string) => void;
}

export const ResponsavelInput = ({ index, formData, handleInputChange }: ResponsavelInputProps) => (
  <div className="space-y-2">
    <Label htmlFor={`nomeResponsavel${index}`}>
      Responsável {index}: {index === 1 && '*'}
    </Label>
    <Input
      id={`nomeResponsavel${index}`}
      type="text"
      value={formData[`nomeResponsavel${index}`] || ""}
      onChange={(e) => handleInputChange(e.target.id, e.target.value)}
      placeholder={`Nome do responsável ${index}`}
    />
    <Label htmlFor={`whatsappResponsavel${index}`}>
      WhatsApp Responsável {index}: {index === 1 && '*'}
    </Label>
    <Input
      id={`whatsappResponsavel${index}`}
      type="tel"
      value={formData[`whatsappResponsavel${index}`] || ""}
      onChange={(e) => handleInputChange(e.target.id, e.target.value)}
      maxLength={15}
      placeholder="(XX) XXXXX-XXXX"
    />
  </div>
);