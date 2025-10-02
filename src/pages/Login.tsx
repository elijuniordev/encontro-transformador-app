// src/pages/Login.tsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { LoginHeader } from "@/components/auth/LoginHeader"; // Importe o novo cabeçalho
import { LoginForm } from "@/components/auth/LoginForm";   // Importe o novo formulário

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("LOGIN INICIADO: Tentando autenticar...");
    try {
      // 1. Tenta autenticar via Supabase
      const { error: authError } = await supabase.auth.signInWithPassword({ email, password });
      
      if (authError) {
        console.error("ERRO DE AUTENTICAÇÃO:", authError);
        throw authError;
      }
      
      // 2. Busca o perfil (role e discipulado) no banco de dados
      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('role, discipulado')
        .eq('email', email)
        .single();
        
      if (userFetchError || !userData) {
          console.error("ERRO AO BUSCAR PERFIL:", userFetchError || "Dados não encontrados.");
          throw new Error("Seu perfil de usuário não foi localizado. Contate o administrador.");
      }

      // 3. Salva no localStorage para a gestão de rotas e permissões
      localStorage.setItem("userRole", userData.role);
      localStorage.setItem("userEmail", email);
      localStorage.setItem("isAuthenticated", "true");
      localStorage.setItem("userDiscipulado", userData.discipulado || '');
      
      // 4. Notifica e Redireciona
      toast({ title: "Login bem-sucedido!", description: "Você foi redirecionado para o painel de gerenciamento." });
      console.log("LOGIN SUCESSO. Redirecionando para /management...");
      navigate("/management");
      
    } catch (error: unknown) {
      let errorMessage = "Erro ao fazer login. Verifique suas credenciais.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast({ title: "Erro de Login", description: errorMessage, variant: "destructive" });
      console.log("LOGIN FALHOU. Mensagem:", errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md mx-auto w-full">
          <Card className="shadow-divine bg-white">
            <LoginHeader />
            <CardContent>
              <LoginForm
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                handleSubmit={handleSubmit}
                isLoading={isLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Login;