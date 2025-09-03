// src/components/forms/AdditionalInfoSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
// Linha a ser alterada
import { InscriptionFormData } from "@/types/forms";
import { FormInput } from "./FormInput";

interface AdditionalInfoSectionProps {
  formData: InscriptionFormData;
  setFormData: React.Dispatch<React.SetStateAction<InscriptionFormData>>;
  handleInputChange: (field: string, value: string) => void;
  discipuladoresOptions: string[];
  parentescoOptions: string[];
  filteredLideresOptions: string[];
  errors: { [key: string]: string | undefined };
}

// ... (o restante do arquivo permanece igual)
export const AdditionalInfoSection = ({
  formData,
  setFormData,
  handleInputChange,
  discipuladoresOptions,
  parentescoOptions,
  filteredLideresOptions,
  errors
}: AdditionalInfoSectionProps) => {
  if (["Pastor, obreiro ou discipulador", "Cozinha"].includes(formData.situacao)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Users className="h-5 w-5" />
          Informações Adicionais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {formData.situacao === 'Criança' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-end bg-blue-50 p-4 rounded-lg border border-blue-200">
            <FormInput id="nomeAcompanhante" label="Nome do Acompanhante: *" type="text" value={formData.nomeAcompanhante} onChange={(e) => handleInputChange('nomeAcompanhante', e.target.value)} error={errors.nomeAcompanhante}/>
            <div className="space-y-2">
              <Label htmlFor="parentescoAcompanhante">Parentesco: *</Label>
              <Select value={formData.parentescoAcompanhante} onValueChange={(value) => setFormData({ ...formData, parentescoAcompanhante: value })}>
                <SelectTrigger id="parentescoAcompanhante" className={errors.parentescoAcompanhante ? "border-destructive focus-visible:ring-destructive" : ""}><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {parentescoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.parentescoAcompanhante && <p className="text-sm text-destructive font-medium">{errors.parentescoAcompanhante}</p>}
            </div>
          </div>
        )}
        {formData.situacao === 'Encontrista' && (
          <FormInput id="anjoGuarda" label="Quem te convidou (Anjo da Guarda)?" type="text" value={formData.anjoGuarda} onChange={(e) => handleInputChange('anjoGuarda', e.target.value)} placeholder="Nome da pessoa que te convidou" error={errors.anjoGuarda}/>
        )}
        <div className="space-y-2">
          <Label htmlFor="discipuladores">Discipuladores (dos pais, se criança): *</Label>
          <Select value={formData.discipuladores} onValueChange={(value) => setFormData({ ...formData, discipuladores: value, lider: "" })}>
            <SelectTrigger id="discipuladores" className={errors.discipuladores ? "border-destructive focus-visible:ring-destructive" : ""}><SelectValue placeholder="Selecione os discipuladores" /></SelectTrigger>
            <SelectContent>{discipuladoresOptions.map((discipulador) => (<SelectItem key={discipulador} value={discipulador}>{discipulador}</SelectItem>))}</SelectContent>
          </Select>
          {errors.discipuladores && <p className="text-sm text-destructive font-medium">{errors.discipuladores}</p>}
        </div>
        <div className="space-y-2">
          <Label htmlFor="lider">Líder de Célula (dos pais, se criança): *</Label>
          <Select value={formData.lider} onValueChange={(value) => setFormData({ ...formData, lider: value })} disabled={!formData.discipuladores}>
            <SelectTrigger id="lider" className={errors.lider ? "border-destructive focus-visible:ring-destructive" : ""}><SelectValue placeholder="Selecione o líder" /></SelectTrigger>
            <SelectContent>{filteredLideresOptions?.map((lider) => (<SelectItem key={lider} value={lider}>{lider}</SelectItem>))}</SelectContent>
          </Select>
           {errors.lider && <p className="text-sm text-destructive font-medium">{errors.lider}</p>}
        </div>
      </CardContent>
    </Card>
  );
};