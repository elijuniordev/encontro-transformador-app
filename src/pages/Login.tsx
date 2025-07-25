import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: ""
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Em produção, isso seria feito via Supabase Auth
      // Simulando login para demonstração
      if (formData.email === "admin@encontro.com" && formData.password === "admin123") {
        localStorage.setItem("userRole", "administrador");
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("isAuthenticated", "true");
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema de gestão.",
        });
        
        navigate("/management");
      } else if (formData.email === "discipulador@encontro.com" && formData.password === "disc123") {
        localStorage.setItem("userRole", "discipulador");
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userDiscipulado", "Pastor João e Ana Silva");
        
        toast({
          title: "Login realizado com sucesso!",
          description: "Bem-vindo ao sistema de gestão.",
        });
        
        navigate("/management");
      } else {
        toast({
          title: "Credenciais inválidas",
          description: "Email ou senha incorretos.",
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro ao tentar fazer login. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful flex items-center justify-center p-4">
      <div className="max-w-md mx-auto w-full">
        <Card className="shadow-divine bg-white">
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
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <div className="mt-8 p-4 bg-accent/30 rounded-lg">
              <h3 className="font-semibold text-sm text-primary mb-2">Credenciais de Demonstração:</h3>
              <div className="text-xs space-y-1">
                <p><strong>Administrador:</strong> admin@encontro.com / admin123</p>
                <p><strong>Discipulador:</strong> discipulador@encontro.com / disc123</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Login;