// src/pages/Management/DormitoryPage.tsx
import DormitoryReport from "@/components/management/DormitoryReport";
import { useManagement } from "./useManagement"; // Caminho de importação corrigido
import { Card, CardContent } from "@/components/ui/card";

const DormitoryPage = () => {
    const { inscriptions, isLoading, userRole } = useManagement();

    if (isLoading) {
        return <p>Carregando dados...</p>;
    }

    if (userRole !== "admin") {
        return (
          <Card>
            <CardContent className="p-4">
              <p className="text-center text-muted-foreground">Você não tem permissão para acessar esta seção.</p>
            </CardContent>
          </Card>
        );
    }

    return (
        <div className="space-y-6">
            <DormitoryReport inscriptions={inscriptions} />
        </div>
    );
};

export default DormitoryPage;