// src/components/forms/AdditionalInfoSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Users } from "lucide-react";
import { InscriptionFormData } from "@/hooks/useInscriptionFormLogic";

interface AdditionalInfoSectionProps {
  formData: InscriptionFormData;
  setFormData: React.Dispatch<React.SetStateAction<InscriptionFormData>>;
  handleInputChange: (field: string, value: string) => void;
  discipuladoresOptions: string[];
  parentescoOptions: string[];
  filteredLideresOptions: string[];
}

export const AdditionalInfoSection = ({
  formData,
  setFormData,
  handleInputChange,
  discipuladoresOptions,
  parentescoOptions,
  filteredLideresOptions
}: AdditionalInfoSectionProps) => {
  // Não renderiza esta seção para Pastores, obreiros ou Cozinha
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
            <div className="space-y-2">
              <Label htmlFor="nomeAcompanhante">Nome do Acompanhante: *</Label>
              <Input id="nomeAcompanhante" type="text" value={formData.nomeAcompanhante} onChange={(e) => handleInputChange('nomeAcompanhante', e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="parentescoAcompanhante">Parentesco: *</Label>
              <Select value={formData.parentescoAcompanhante} onValueChange={(value) => setFormData({ ...formData, parentescoAcompanhante: value })}>
                <SelectTrigger id="parentescoAcompanhante"><SelectValue placeholder="Selecione..." /></SelectTrigger>
                <SelectContent>
                  {parentescoOptions.map(opt => <SelectItem key={opt} value={opt}>{opt}</SelectItem>)}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
        {formData.situacao === 'Encontrista' && (
          <div className="space-y-2">
            <Label htmlFor="anjoGuarda">Quem te convidou (Anjo da Guarda)?</Label>
            <Input id="anjoGuarda" type="text" value={formData.anjoGuarda} onChange={(e) => handleInputChange('anjoGuarda', e.target.value)} placeholder="Nome da pessoa que te convidou" />
          </div>
        )}
        <div className="space-y-2">
          <Label htmlFor="discipuladores">Discipuladores (dos pais, se criança): *</Label>
          <Select value={formData.discipuladores} onValueChange={(value) => setFormData({ ...formData, discipuladores: value, lider: "" })}>
            <SelectTrigger id="discipuladores"><SelectValue placeholder="Selecione os discipuladores" /></SelectTrigger>
            <SelectContent>{discipuladoresOptions.map((discipulador) => (<SelectItem key={discipulador} value={discipulador}>{discipulador}</SelectItem>))}</SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          <Label htmlFor="lider">Líder de Célula (dos pais, se criança): *</Label>
          <Select value={formData.lider} onValueChange={(value) => setFormData({ ...formData, lider: value })} disabled={!formData.discipuladores}>
            <SelectTrigger id="lider"><SelectValue placeholder="Selecione o líder" /></SelectTrigger>
            <SelectContent>{filteredLideresOptions?.map((lider) => (<SelectItem key={lider} value={lider}>{lider}</SelectItem>))}</SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};