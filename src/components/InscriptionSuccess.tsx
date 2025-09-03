// src/components/InscriptionSuccess.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, LogIn } from "lucide-react";
import { Link } from "react-router-dom";
import { eventDetails } from "@/config/eventDetails"; // Importe eventDetails

// Link do grupo pode ser centralizado no futuro, por enquanto o definimos aqui.
// REMOVA a linha abaixo
// const WHATSAPP_GROUP_LINK = "https://chat.whatsapp.com/KAh5AivWP9O9jUpeKd7q1O";

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
          Falta pouco para garantir sua vaga!
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        <div>
            <p className="text-lg text-primary font-semibold">
            Passo 1: Entre no Grupo do WhatsApp
            </p>
            <p className="text-gray-600 mb-4">
            É essencial entrar no grupo para receber todas as informações importantes sobre o Encontro.
            </p>
            {/* REMOVA a linha abaixo */}
            {/* <a href={WHATSAPP_GROUP_LINK} target="_blank" rel="noopener noreferrer"> */}
            
            {/* ADICIONE a linha abaixo */}
            <a href={eventDetails.whatsappGroupLink} target="_blank" rel="noopener noreferrer">
                <Button size="lg" className="w-full bg-green-600 hover:bg-green-700">
                    <LogIn className="mr-2 h-5 w-5" />
                    Entrar no Grupo Oficial
                </Button>
            </a>
        </div>

        <div className="border-t pt-4">
            <p className="text-lg text-primary font-semibold">
                Passo 2: Efetue o Pagamento
            </p>
            <p className="text-gray-600">
            Lembre-se de efetuar o pagamento via <strong>PIX</strong> e enviar o comprovante para seu líder ou discipulador para garantir sua vaga.
            </p>
        </div>

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