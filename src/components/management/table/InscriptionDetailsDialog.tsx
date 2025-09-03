// src/components/management/table/InscriptionDetailsDialog.tsx
import { Inscription } from "@/types/supabase";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";

interface InscriptionDetailsDialogProps {
  isOpen: boolean;
  onClose: () => void;
  inscription: Inscription | null;
}

export const InscriptionDetailsDialog = ({ isOpen, onClose, inscription }: InscriptionDetailsDialogProps) => {
  if (!inscription) {
    return null;
  }

  const sections = [
    {
      title: "Informações Pessoais",
      fields: [
        { label: "Nome", value: inscription.nome_completo },
        { label: "Idade", value: inscription.idade },
        { label: "WhatsApp", value: inscription.whatsapp },
        { label: "Sexo", value: inscription.sexo },
      ],
    },
    {
      title: "Informações de Discipulado",
      fields: [
        { label: "Função", value: inscription.irmao_voce_e },
        { label: "Discipulador", value: inscription.discipuladores },
        { label: "Líder", value: inscription.lider },
        { label: "Anjo da Guarda", value: inscription.anjo_guarda },
      ],
    },
    {
      title: "Detalhes de Pagamento",
      fields: [
        { label: "Status de Pagamento", value: inscription.status_pagamento },
        { label: "Valor Pago", value: `R$ ${inscription.paid_amount.toFixed(2).replace('.', ',')}` },
        { label: "Valor Total", value: `R$ ${inscription.total_value.toFixed(2).replace('.', ',')}` },
        { label: "Forma de Pagamento", value: inscription.forma_pagamento || 'Não informado' },
      ],
    },
    {
      title: "Responsáveis",
      fields: [
        { label: "Nome Resp. 1", value: inscription.responsavel_1_nome },
        { label: "WhatsApp Resp. 1", value: inscription.responsavel_1_whatsapp },
        { label: "Nome Resp. 2", value: inscription.responsavel_2_nome },
        { label: "WhatsApp Resp. 2", value: inscription.responsavel_2_whatsapp },
        { label: "Nome Resp. 3", value: inscription.responsavel_3_nome },
        { label: "WhatsApp Resp. 3", value: inscription.responsavel_3_whatsapp },
      ],
    },
    {
        title: "Observações",
        fields: [
            { label: "Observação", value: inscription.observacao || "N/A" }
        ]
    }
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] md:max-w-xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold">Detalhes da Inscrição</DialogTitle>
          <DialogDescription>
            Informações completas de{" "}
            <span className="font-semibold">{inscription.nome_completo}</span>.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {sections.map((section, sectionIndex) => (
            <div key={section.title}>
              <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
                {section.fields.map((field, fieldIndex) => (
                  <div key={field.label} className="flex flex-col">
                    <span className="text-sm font-medium text-muted-foreground">{field.label}</span>
                    <span className="text-base font-semibold">{field.value || 'N/A'}</span>
                  </div>
                ))}
              </div>
              {sectionIndex < sections.length - 1 && <Separator className="my-4 md:my-6" />}
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};