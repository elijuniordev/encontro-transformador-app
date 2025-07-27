// src/pages/RegisterDiscipulador.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Loader2 } from "lucide-react";
import { Link } from "react-router-dom"; // Para o link de login
import { useRegisterDiscipulador } from "@/hooks/useRegisterDiscipulador";
import Footer from "@/components/Footer"; // Se você quiser um footer nesta página

const RegisterDiscipulador = () => {
  const {
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
    discipuladosOptions,
  } = useRegisterDiscipulador();

  return (
    <div className="min-h-screen bg-gradient-peaceful flex flex-col">
      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-md mx-auto w-full">
          <Card className="shadow-divine bg-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-glow rounded-full flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-primary">
                Cadastro de Discipulador
              </CardTitle>
              <p className="text-muted-foreground">
                Registre-se para ter acesso à área de gestão de inscrições.
              </p>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleRegister} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu.email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirmar Senha</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="discipulado">Discipulado ao qual pertence</Label>
                  <Select value={discipulado} onValueChange={setDiscipulado} required>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione seu discipulado" />
                    </SelectTrigger>
                    <SelectContent>
                      {discipuladosOptions.map((option) => (
                        <SelectItem key={option} value={option}>
                          {option}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : (
                    <UserPlus className="mr-2 h-4 w-4" />
                  )}
                  {isLoading ? "Registrando..." : "Registrar"}
                </Button>
              </form>
              <p className="mt-4 text-center text-sm text-muted-foreground">
                Já tem uma conta?{" "}
                <Link to="/login" className="text-primary underline-offset-4 hover:underline">
                  Faça login aqui
                </Link>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer /> {/* Se você decidir incluir o footer */}
    </div>
  );
};

export default RegisterDiscipulador;