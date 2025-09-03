// src/components/forms/PersonalInfoSection.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { AlertTriangle, Heart } from "lucide-react";
import { InscriptionFormData } from "@/types/forms"; // <-- CORREÇÃO AQUI
import { FormInput } from "./FormInput";

interface PersonalInfoSectionProps {
  formData: InscriptionFormData;
  setFormData: React.Dispatch<React.SetStateAction<InscriptionFormData>>;
  handleInputChange: (field: string, value: string) => void;
  situacaoOptions: string[];
  errors: { [key: string]: string | undefined };
}

export const PersonalInfoSection = ({
  formData,
  setFormData,
  handleInputChange,
  situacaoOptions,
  errors,
}: PersonalInfoSectionProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <Heart className="h-5 w-5" />
          Informações Pessoais
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="situacao">Eu sou: *</Label>
          <Select value={formData.situacao} onValueChange={(value) => setFormData({ ...formData, situacao: value, anjoGuarda: '' })}>
            <SelectTrigger id="situacao" className={errors.situacao ? "border-destructive focus-visible:ring-destructive" : ""}><SelectValue placeholder="Selecione sua função no evento" /></SelectTrigger>
            <SelectContent>{situacaoOptions.map((situacao) => (<SelectItem key={situacao} value={situacao}>{situacao}</SelectItem>))}</SelectContent>
          </Select>
           {errors.situacao && <p className="text-sm text-destructive font-medium">{errors.situacao}</p>}
        </div>
        
        {formData.situacao === 'Criança' && (
          <div className="flex items-start bg-yellow-100 border-l-4 border-yellow-500 text-yellow-800 p-4 rounded-r-lg shadow-md">
            <AlertTriangle className="h-8 w-8 mr-3 mt-1 flex-shrink-0" />
            <div>
              <h4 className="font-bold text-lg">Atenção Responsáveis!</h4>
              <p className="text-sm mt-1">Ao inscrever uma criança, você concorda que a organização do evento **não se responsabiliza** por incidentes que possam ocorrer no local (sítio).</p>
            </div>
          </div>
        )}

        <FormInput id="nomeCompleto" label="Nome Completo: *" type="text" value={formData.nomeCompleto} onChange={(e) => handleInputChange('nomeCompleto', e.target.value)} placeholder="Digite o nome completo" error={errors.nomeCompleto}/>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="sexo">Sexo: *</Label>
            <Select value={formData.sexo} onValueChange={(value) => setFormData({ ...formData, sexo: value })}>
              <SelectTrigger id="sexo" className={errors.sexo ? "border-destructive focus-visible:ring-destructive" : ""}><SelectValue placeholder="Selecione" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="masculino">Masculino</SelectItem>
                <SelectItem value="feminino">Feminino</SelectItem>
              </SelectContent>
            </Select>
            {errors.sexo && <p className="text-sm text-destructive font-medium">{errors.sexo}</p>}
          </div>
          <FormInput id="idade" label="Idade: *" type="number" value={formData.idade} onChange={(e) => handleInputChange('idade', e.target.value)} placeholder="Sua idade" min="0" max="120" error={errors.idade}/>
        </div>

        <FormInput id="whatsapp" label="Seu WhatsApp de Contato: *" type="tel" value={formData.whatsapp} onChange={(e) => handleInputChange('whatsapp', e.target.value)} placeholder="(11) 99999-9999" maxLength={15} error={errors.whatsapp}/>
      </CardContent>
    </Card>
  );
};