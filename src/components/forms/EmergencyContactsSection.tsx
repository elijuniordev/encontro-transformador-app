// src/components/forms/EmergencyContactsSection.tsx
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Phone } from "lucide-react";
import { InscriptionFormData } from "@/types/forms"; // <-- CORREÇÃO AQUI
import { ResponsavelInput } from "./ResponsavelInput";

interface EmergencyContactsSectionProps {
  formData: InscriptionFormData;
  handleInputChange: (field: string, value: string) => void;
  errors: { [key: string]: string | undefined };
}

export const EmergencyContactsSection = ({ formData, handleInputChange, errors }: EmergencyContactsSectionProps) => {
  if (!["Encontrista", "Criança"].includes(formData.situacao)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Phone className="h-5 w-5" />
          Contatos de Emergência
        </CardTitle>
        <CardDescription>
          Informe pelo menos um contato de familiar.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <ResponsavelInput index={1} formData={formData} handleInputChange={handleInputChange} errors={errors} />
        <ResponsavelInput index={2} formData={formData} handleInputChange={handleInputChange} errors={errors} />
        <ResponsavelInput index={3} formData={formData} handleInputChange={handleInputChange} errors={errors} />
      </CardContent>
    </Card>
  );
};