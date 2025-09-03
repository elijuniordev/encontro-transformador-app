// src/components/InscriptionSuccess.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, LogIn, RefreshCw, Home } from "lucide-react"; // Importe os ícones necessários
import { Link } from "react-router-dom";
import { eventDetails } from "@/config/eventDetails"; // Importe eventDetails

const InscriptionSuccess = () => {
  return (
    <Card className="shadow-divine bg-white text-center">
      <CardHeader>
        <div className="mx-auto mb-4 w-16 h-16 bg-gradient-glow rounded-full flex items-center justify-center">
          <CheckCircle className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-3xl font-bold text-primary">Inscrição Enviada!</CardTitle>
        <CardDescription>Falta pouco para garantir sua vaga.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Seção 1: Grupo do WhatsApp */}
        <div>
          <p className="text-lg text-primary font-semibold">
            Passo 1: Entre no Grupo do WhatsApp
          </p>
          <p className="text-gray-600 mb-4">
            É essencial entrar no grupo para receber todas as informações importantes sobre o Encontro.
          </p>
          <a href={eventDetails.whatsappGroupLink} target="_blank" rel="noopener noreferrer">
            <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
              <LogIn className="mr-2 h-5 w-5" />
              Entrar no Grupo Oficial
            </Button>
          </a>
        </div>

        {/* Seção 2: Pagamento */}
        <div className="border-t pt-4">
          <p className="text-lg text-primary font-semibold">
            Passo 2: Efetue o Pagamento
          </p>
          <p className="text-gray-600">
            Lembre-se de efetuar o pagamento via <strong>PIX</strong> e enviar o comprovante para seu líder ou discipulador para validar sua vaga.
          </p>
        </div>
        
        {/* Seção 3: Ações */}
        <div className="border-t pt-6 space-y-3">
          <Button
            onClick={() => window.location.reload()}
            variant="secondary"
            className="w-full flex items-center gap-2"
            size="lg"
          >
            <RefreshCw className="h-4 w-4" /> Fazer Nova Inscrição
          </Button>
          <Link to="/">
            <Button variant="outline" size="lg" className="w-full flex items-center gap-2">
              <Home className="h-4 w-4" /> Voltar para a Página Inicial
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};

export default InscriptionSuccess;