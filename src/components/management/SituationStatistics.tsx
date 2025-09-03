// src/components/management/SituationStatistics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Users, HelpingHand, UserCheck, Baby, UtensilsCrossed, UserPlus, Package, Users2 } from "lucide-react";

interface SituationStatisticsProps {
  situationCounts: { [key: string]: number };
  totalInscriptions: number;
  isRegistrationsOpen: boolean;
}

// Mapeia cada função a um ícone e cor específicos para uma melhor visualização
const functionDetails: { [key: string]: { icon: React.ElementType; color: string } } = {
  "Encontrista": { icon: Users, color: "text-blue-600" },
  "Equipe": { icon: HelpingHand, color: "text-green-600" },
  "Pastor, obreiro ou discipulador": { icon: UserCheck, color: "text-purple-600" },
  "Criança": { icon: Baby, color: "text-yellow-600" },
  "Cozinha": { icon: UtensilsCrossed, color: "text-orange-600" },
  "Acompanhante": { icon: UserPlus, color: "text-pink-600" },
  "Outros": { icon: Package, color: "text-gray-600" },
};

const SituationStatistics = ({
  situationCounts,
  totalInscriptions,
  isRegistrationsOpen,
}: SituationStatisticsProps) => {
  // Ordena as funções para uma exibição consistente, deixando "Outros" por último
  const orderedFunctions = Object.keys(situationCounts)
    .filter(key => key !== 'Total')
    .sort((a, b) => {
      if (a === 'Outros') return 1;
      if (b === 'Outros') return -1;
      return a.localeCompare(b);
    });

  return (
    <Card className="shadow-peaceful">
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Users2 className="h-5 w-5" />
            Inscrições por Função
          </CardTitle>
          <Badge variant={isRegistrationsOpen ? "default" : "destructive"}>
            {isRegistrationsOpen ? "Inscrições Abertas" : "Inscrições Fechadas"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        {/* Card de Total com destaque */}
        <div className="bg-primary text-primary-foreground p-4 rounded-lg mb-4 text-center">
          <p className="text-sm uppercase font-semibold">Total de Inscrições</p>
          <p className="text-4xl font-bold">{totalInscriptions}</p>
        </div>

        {/* Grid responsivo para as funções individuais */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
          {orderedFunctions.map((funcao) => {
            const count = situationCounts[funcao];
            // Não renderiza o card se a contagem for zero
            if (count === 0) return null;

            const details = functionDetails[funcao] || functionDetails["Outros"];
            const Icon = details.icon;

            return (
              <div key={funcao} className="bg-slate-50 border rounded-lg p-3 flex flex-col items-center justify-center text-center hover:shadow-md transition-shadow">
                <Icon className={`h-7 w-7 mb-2 ${details.color}`} />
                <p className="text-2xl font-bold text-slate-800">{count}</p>
                <p className="text-xs font-medium text-slate-500">{funcao}</p>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default SituationStatistics;