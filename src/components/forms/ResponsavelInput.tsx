// src/components/forms/ResponsavelInput.tsx
import { InscriptionFormData } from "@/types/forms"; // <-- CORREÇÃO AQUI
import { FormInput } from "./FormInput";

interface ResponsavelInputProps {
  index: 1 | 2 | 3;
  formData: InscriptionFormData;
  handleInputChange: (field: string, value: string) => void;
  errors: { [key: string]: string | undefined };
}

export const ResponsavelInput = ({ index, formData, handleInputChange, errors }: ResponsavelInputProps) => (
  <div className="space-y-4">
    <FormInput
      id={`nomeResponsavel${index}`}
      label={`Responsável ${index}: ${index === 1 ? '*' : ''}`}
      type="text"
      value={formData[`nomeResponsavel${index}`] || ""}
      onChange={(e) => handleInputChange(e.target.id, e.target.value)}
      placeholder={`Nome do responsável ${index}`}
      error={errors[`nomeResponsavel${index}`]}
    />
    <FormInput
      id={`whatsappResponsavel${index}`}
      label={`WhatsApp Responsável ${index}: ${index === 1 ? '*' : ''}`}
      type="tel"
      value={formData[`whatsappResponsavel${index}`] || ""}
      onChange={(e) => handleInputChange(e.target.id, e.target.value)}
      maxLength={15}
      placeholder="(XX) XXXXX-XXXX"
      error={errors[`whatsappResponsavel${index}`]}
    />
  </div>
);