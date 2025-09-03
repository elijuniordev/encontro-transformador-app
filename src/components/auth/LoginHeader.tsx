// src/components/auth/LoginHeader.tsx
import { CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { LogIn } from "lucide-react";

export const LoginHeader = () => {
  return (
    <CardHeader className="text-center">
      <div className="mx-auto mb-4 w-16 h-16 bg-gradient-glow rounded-full flex items-center justify-center">
        <LogIn className="h-8 w-8 text-primary" />
      </div>
      <CardTitle className="text-3xl font-bold text-primary">Login de Acesso</CardTitle>
      <CardDescription>Acesse a área de gerenciamento.</CardDescription>
    </CardHeader>
  );
};