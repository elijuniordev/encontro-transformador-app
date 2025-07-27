// src/hooks/useRegisterDiscipulador.tsx
import { useState, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

// Reutilizamos a lista de discipuladores (excluindo a opção "Sou Obreiro...")
// Você pode ajustar esta lista conforme as necessidades de cadastro de discipuladores
const DISCIPULADOS_PARA_CADASTRO = [
  "Arthur e Beatriz",
  "José Gomes e Edna",
  "Rosana",
  "Isaac e Andrea",
  "Rafael Ângelo e Ingrid",
];

export const useRegisterDiscipulador = () => {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [discipulado, setDiscipulado] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    if (!email || !password || !confirmPassword || !discipulado) {
      toast({
        title: "Campos Obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password !== confirmPassword) {
      toast({
        title: "Senhas Não Correspondem",
        description: "A senha e a confirmação de senha não são iguais.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    if (password.length < 6) { // Mínimo de 6 caracteres exigido pelo Supabase
      toast({
        title: "Senha Fraca",
        description: "A senha deve ter pelo menos 6 caracteres.",
        variant: "destructive",
      });
      setIsLoading(false);
      return;
    }

    try {
      // 1. Registrar o usuário no Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
        // No Supabase, dados personalizados são geralmente armazenados em user_metadata
        // Se a coluna 'discipulado' foi adicionada diretamente na tabela auth.users,
        // você precisaria de uma função de banco de dados ou RLS avançado para atualizá-la
        // diretamente do cliente. A forma padrão para dados personalizados é 'user_metadata'.
        // Vamos usar user_metadata aqui, que é diretamente suportado pela API de cliente.
        options: {
          data: {
            discipulado: discipulado,
            // Adicionar role aqui também é uma boa prática se você tiver um sistema de roles
            // role: 'discipulador'
          }
        }
      });

      if (authError) {
        console.error("Erro no registro de autenticação:", authError);
        let errorMessage = "Erro ao registrar usuário. Tente novamente.";
        if (authError.message.includes("already registered")) {
          errorMessage = "Este e-mail já está cadastrado. Tente fazer login ou use outro e-mail.";
        }
        toast({
          title: "Erro de Registro",
          description: errorMessage,
          variant: "destructive",
        });
        setIsLoading(false);
        return;
      }

      // Verificação de user e session para garantir que o registro ocorreu e o user está disponível
      // Nota: Com signUp usando 'options.data', o user_metadata já é definido no momento do registro.
      // Se você precisasse atualizar um campo que não fosse user_metadata, seria feito assim:
      // if (authData.user) {
      //   const { error: updateError } = await supabase.auth.updateUser({
      //     data: { discipulado: discipulado } // Isso atualiza user_metadata
      //   });
      //   if (updateError) {
      //     console.error("Erro ao atualizar user_metadata:", updateError);
      //     toast({ title: "Erro", description: "Falha ao salvar dados adicionais.", variant: "destructive" });
      //   }
      // }


      toast({
        title: "Registro Concluído!",
        description: "Seu cadastro foi realizado com sucesso. Agora você pode fazer login.",
      });

      // Limpar formulário
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDiscipulado("");

    } catch (error) {
      console.error("Erro inesperado durante o registro:", error);
      toast({
        title: "Erro Inesperado",
        description: "Ocorreu um erro durante o registro. Tente novamente mais tarde.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [email, password, confirmPassword, discipulado, toast]);

  return {
    email,
    setEmail,
    password,
    setPassword,
    confirmPassword,
    setConfirmPassword,
    discipulado,
    setDiscipulado,
    isLoading,
    handleRegister,
    discipuladosOptions: DISCIPULADOS_PARA_CADASTRO,
  };
};