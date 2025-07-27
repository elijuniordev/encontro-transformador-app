// src/components/management/StatisticsCards.tsx
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { User, CheckCircle2, XCircle, Clock } from "lucide-react";

interface StatisticsCardsProps {
  totalInscriptions: number; // Adicionada esta propriedade
  isRegistrationsOpen: boolean;
}

const StatisticsCards = ({ totalInscriptions, isRegistrationsOpen }: StatisticsCardsProps) => {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="shadow-peaceful">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total de Inscrições</CardTitle>
          <User className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalInscriptions}</div>
          <p className="text-xs text-muted-foreground">
            Inscrições ativas
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-peaceful">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Status do Evento</CardTitle>
          {isRegistrationsOpen ? (
            <CheckCircle2 className="h-4 w-4 text-green-500" />
          ) : (
            <XCircle className="h-4 w-4 text-red-500" />
          )}
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {isRegistrationsOpen ? "Aberto" : "Encerrado"}
          </div>
          <p className="text-xs text-muted-foreground">
            {isRegistrationsOpen
              ? "Inscrições ativas no momento"
              : "Inscrições fechadas"}
          </p>
        </CardContent>
      </Card>
      
      {/* Cards de exemplo para outros status, remova se não for usar */}
      {/* <Card className="shadow-peaceful">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inscrições Confirmadas</CardTitle>
          <CheckCircle2 className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            Inscrições com pagamento confirmado
          </p>
        </CardContent>
      </Card>

      <Card className="shadow-peaceful">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Inscrições Pendentes</CardTitle>
          <Clock className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">0</div>
          <p className="text-xs text-muted-foreground">
            Aguardando confirmação de pagamento
          </p>
        </CardContent>
      </Card> */}
    </div>
  );
};

export default StatisticsCards;