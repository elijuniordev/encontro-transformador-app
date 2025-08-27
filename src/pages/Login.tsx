// src/pages/Login.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LogIn, Shield } from "lucide-react";
import Footer from "@/components/Footer";
import { useLogin } from "@/hooks/useLogin"; // Importe o novo hook
import heroImage from "@/assets/hero-encontro.jpg"; // Imagem para a lateral

const Login = () => {
  const { formData, isLoading, handleChange, handleSubmit } = useLogin();

  return (
    <div className="min-h-screen bg-gradient-peaceful flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="w-full max-w-4xl mx-auto lg:grid lg:grid-cols-2 rounded-lg shadow-divine overflow-hidden bg-white">
          {/* Coluna da Imagem (visível em telas grandes) */}
          <div className="hidden lg:block">
            <img
              src={heroImage}
              alt="Encontro com Deus"
              className="h-full w-full object-cover"
            />
          </div>

          {/* Coluna do Formulário */}
          <div className="p-6 md:p-8 flex flex-col justify-center">
            <Card className="shadow-none border-none">
              <CardHeader className="text-center">
                <div className="mx-auto mb-4 w-16 h-16 bg-gradient-glow rounded-full flex items-center justify-center">
                  <Shield className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-3xl font-bold text-primary">
                  Área Restrita
                </CardTitle>
                <p className="text-muted-foreground">
                  Sistema de Gestão - Encontro com Deus
                </p>
              </CardHeader>

              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      placeholder="seu.email@exemplo.com"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Senha</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="Sua senha"
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="divine"
                    size="lg"
                    className="w-full"
                    disabled={isLoading}
                  >
                    <LogIn className="mr-2 h-5 w-5" />
                    {isLoading ? "Entrando..." : "Entrar"}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;