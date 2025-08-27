// src/components/InscriptionSuccess.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2 } from "lucide-react";
import { Link } from "react-router-dom";

const InscriptionSuccess = () => {
  return (
    <Card className="shadow-divine bg-white text-center">
      <CardHeader>
        <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle2 className="h-10 w-10 text-green-600" />
        </div>
        <CardTitle className="text-3xl font-bold text-green-700">
          Inscrição Recebida!
        </CardTitle>
        <p className="text-muted-foreground">
          Encontro com Deus - 29 a 31 de Agosto
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-lg text-gray-700">
          Sua pré-inscrição foi realizada com sucesso!
        </p>
        <p className="text-gray-600">
          Lembre-se de efetuar o pagamento via <strong>PIX</strong> e enviar o comprovante para seu líder ou discipulador para garantir sua vaga.
        </p>
        <Link to="/">
          <Button variant="outline" size="lg" className="w-full mt-4">
            Voltar para a Página Inicial
          </Button>
        </Link>
      </CardContent>
    </Card>
  );
};

export default InscriptionSuccess;