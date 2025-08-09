// src/components/management/SituationStatistics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, CheckCircle2, XCircle } from "lucide-react"; // Importe os ícones necessários

interface SituationStatisticsProps {
  situationCounts: { [key: string]: number };
  totalInscriptions: number; // Nova prop
  isRegistrationsOpen: boolean; // Nova prop
}

const SituationStatistics = ({ situationCounts, totalInscriptions, isRegistrationsOpen }: SituationStatisticsProps) => {
  return (
    <Card className="shadow-peaceful">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <Users className="h-5 w-5" />
          Inscrições por Função
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          {/* Card de Total de Inscrições */}
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Users className="h-7 w-7 text-blue-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{totalInscriptions}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Total de Inscrições</p>
              </div>
            </CardContent>
          </Card>

          {/* Card de Status do Evento (se desejar manter alguma indicação visual) */}
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              {isRegistrationsOpen ? (
                <CheckCircle2 className="h-7 w-7 text-green-500" />
              ) : (
                <XCircle className="h-7 w-7 text-red-500" />
              )}
              <div>
                <p className="text-xl sm:text-2xl font-bold">
                  {isRegistrationsOpen ? "Aberto" : "Encerrado"}
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground">Status das Inscrições</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Users className="h-7 w-7 text-purple-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-purple-700">{situationCounts.Encontrista || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Encontristas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Users className="h-7 w-7 text-indigo-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-indigo-700">{situationCounts.Equipe || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Equipe</p>
              </div>
            </CardContent>
          </Card>

          {/* Novo card para Acompanhante */}
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Users className="h-7 w-7 text-pink-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-pink-700">{situationCounts.Acompanhante || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Acompanhantes</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Users className="h-7 w-7 text-yellow-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-yellow-700">{situationCounts.Cozinha || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Cozinha</p>
              </div>
            </CardContent>
          </Card>
        </div>
      </CardContent>
    </Card>
  );
};

export default SituationStatistics;