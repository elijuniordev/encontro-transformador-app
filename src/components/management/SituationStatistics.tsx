// src/components/management/SituationStatistics.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Briefcase, Utensils, BookOpen } from "lucide-react"; // Importar ícones necessários

interface SituationStatisticsProps {
  situationCounts: { [key: string]: number }; // Objeto com as contagens por situação
}

const SituationStatistics = ({ situationCounts }: SituationStatisticsProps) => {
  return (
    // Seção de Estatísticas por Função (Encontrista, Equipe, Cozinha)
    <Card className="shadow-peaceful mb-6">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-primary flex items-center gap-2">
          <Users className="h-5 w-5" />
          Inscrições por Função
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4"> {/* Ajustado para 2 colunas em mobile/tablet e 3 em desktop */}
          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <BookOpen className="h-7 w-7 text-green-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-green-700">{situationCounts.Encontrista || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Encontristas</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Briefcase className="h-7 w-7 text-blue-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-blue-700">{situationCounts.Equipe || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Equipe</p>
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm border">
            <CardContent className="pt-6 flex items-center gap-3">
              <Utensils className="h-7 w-7 text-yellow-600" />
              <div>
                <p className="text-xl sm:text-2xl font-bold text-yellow-700">{situationCounts.Cozinha || 0}</p>
                <p className="text-xs sm:text-sm text-muted-foreground">Cozinha</p>
              </div>
            </CardContent>
          </Card>
          {/* Adicione mais cards aqui para outras situações se necessário */}
        </div>
      </CardContent>
    </Card>
  );
};

export default SituationStatistics;