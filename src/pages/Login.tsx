// src/pages/Login.tsx
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { LogIn, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Footer from "@/components/Footer";
import { supabase } from "@/integrations/supabase/client";

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
      const { data, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) {
        console.error("Erro de autenticação Supabase:", authError);
        toast({
          title: "Erro de Login",
          description: authError.message || "Credenciais inválidas. Verifique seu email e senha.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('role, discipulado')
        .eq('email', formData.email)
        .single();

      if (userFetchError) {
        console.error("Erro ao buscar dados do usuário na tabela 'users':", userFetchError);
        toast({
          title: "Erro de Perfil",
          description: "Não foi possível carregar os dados do seu perfil. Tente novamente.",
          variant: "destructive"
        });
        setIsLoading(false);
        return;
      }

      if (userData) {
        localStorage.setItem("userRole", userData.role);
        localStorage.setItem("userEmail", formData.email);
        localStorage.setItem("isAuthenticated", "true");
        localStorage.setItem("userDiscipulado", userData.discipulado || '');

        toast({
          title: "Login realizado com sucesso!",
          description: `Bem-vindo(a) ${formData.email} (${userData.role}).`,
        });

        navigate("/management");
      } else {
        toast({
          title: "Perfil não encontrado",
          description: "Seu perfil de usuário não foi localizado. Contate o administrador.",
          variant: "destructive"
        });
      }

    } catch (generalError) {
      console.error('Erro inesperado durante o login:', generalError);
      toast({
        title: "Erro no login",
        description: "Ocorreu um erro inesperado. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    // CONTAINER DA PÁGINA: flex-col para empilhar conteúdo e footer, min-h-screen para ocupar a tela toda
    // Removido 'p-4' daqui
    <div className="min-h-screen bg-gradient-peaceful flex flex-col">
      {/* CONTEÚDO PRINCIPAL (Card): Ocupa o espaço restante e centraliza o Card */}
      {/* Adicionado 'p-4' ao flex-grow div para manter o espaçamento do conteúdo */}
      <div className="flex-grow flex items-center justify-center p-4">
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
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;