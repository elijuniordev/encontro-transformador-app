// src/components/management/StatisticsCards.tsx
import { Card, CardContent } from "@/components/ui/card";
import { Users, DollarSign } from "lucide-react"; // Importar ícones necessários

interface Inscription {
  id: string;
  discipuladores: string;
  lider: string;
  nome_completo: string;
  anjo_guarda: string;
  sexo: string;
  idade: string;
  whatsapp: string;
  irmao_voce_e: string;
  responsavel_1_nome: string | null;
  responsavel_1_whatsapp: string | null;
  responsavel_2_nome: string | null;
  responsavel_2_whatsapp: string | null;
  responsavel_3_nome: string | null;
  responsavel_3_whatsapp: string | null;
  status_pagamento: string;
  forma_pagamento: string | null;
  valor: number;
  observacao: string | null;
  created_at: string;
}

interface StatisticsCardsProps {
  filteredInscriptions: Inscription[];
}

const StatisticsCards = ({ filteredInscriptions }: StatisticsCardsProps) => {
  return (
    // Seção de Estatísticas Gerais (Total, Confirmados, Pendentes, Arrecadado)
    // Ajustado para 1 coluna no mobile, 2 em telas pequenas, e 4 em telas grandes
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6"> 
      <Card className="shadow-peaceful">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <Users className="h-7 w-7 text-primary" /> 
            <div>
              <p className="text-xl sm:text-2xl font-bold text-primary">{filteredInscriptions.length}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total de Inscrições</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-peaceful">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-green-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-green-600">
                {filteredInscriptions.filter(i => i.status_pagamento === "Confirmado").length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Pagamentos Confirmados</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-peaceful">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-yellow-100 rounded-full flex items-center justify-center">
              <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-yellow-600">
                {filteredInscriptions.filter(i => i.status_pagamento === "Pendente").length}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Pagamentos Pendentes</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <Card className="shadow-peaceful">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 bg-blue-100 rounded-full flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                R$ {filteredInscriptions
                  .filter(i => i.status_pagamento === "Confirmado")
                  .reduce((sum, i) => sum + i.valor, 0)
                  .toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Arrecadado</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatisticsCards;