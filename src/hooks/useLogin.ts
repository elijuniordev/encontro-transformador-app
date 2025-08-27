// src/hooks/useLogin.ts
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

export const useLogin = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      });

      if (authError) throw new Error(authError.message || "Credenciais inválidas. Verifique seu email e senha.");

      const { data: userData, error: userFetchError } = await supabase
        .from('users')
        .select('role, discipulado')
        .eq('email', formData.email)
        .single();

      if (userFetchError) throw new Error("Não foi possível carregar os dados do seu perfil. Tente novamente.");

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
        throw new Error("Seu perfil de usuário não foi localizado. Contate o administrador.");
      }
    } catch (error: unknown) { // <-- MUDANÇA AQUI
      let errorMessage = "Ocorreu um erro inesperado.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      
      toast({
        title: "Erro no Login",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formData,
    isLoading,
    handleChange,
    handleSubmit,
  };
};