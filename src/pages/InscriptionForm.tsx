// src/pages/InscriptionForm.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Footer from "@/components/Footer";
import { useToast } from "@/hooks/use-toast";
import { UserPlus, Send, AlertTriangle, CheckCircle } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { motion, AnimatePresence } from "framer-motion";

const InscriptionForm = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    discipuladores: "",
    lider: "",
    nomeCompleto: "",
    anjoGuarda: "",
    sexo: "",
    idade: "",
    whatsapp: "",
    situacao: "",
    nomeResponsavel1: "",
    whatsappResponsavel1: "",
    nomeResponsavel2: "",
    whatsappResponsavel2: "",
    nomeResponsavel3: "",
    whatsappResponsavel3: ""
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isRegistrationsOpen, setIsRegistrationsOpen] = useState(true);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const discipuladoresOptions = [
    "Arthur e Beatriz",
    "José Gomes e Edna",
    "Rosana",
    "Rafael Ângelo e Ingrid"
  ].sort((a, b) => a.localeCompare(b, "pt-BR"));

  const lideresMap: { [key: string]: string[] } = {
    "Arthur e Beatriz": ["Maria e Mauro", "Welligton e Nathalia", "Rafael Vicente e Fabiana", "Lucas e Gabriela Tangerino", "Marcio e Rita", "Alfredo e Luana"].sort((a, b) => a.localeCompare(b, "pt-BR")),
    "José Gomes e Edna": ["Celina", "Junior e Patricia", "José Gomes e Edna", "Eliana", "Vinicius e Eliane"].sort((a, b) => a.localeCompare(b, "pt-BR")),
    "Rosana": ["Deusa", "Maria Sandrimara"].sort((a, b) => a.localeCompare(b, "pt-BR")),
    "Rafael Ângelo e Ingrid": ["Renan e Edziane", "Vladimir e Elaine", "Rafael Ângelo e Ingrid", "Hugo e Luciane", "Alexandre e Carol"].sort((a, b) => a.localeCompare(b, "pt-BR"))
  };

  useEffect(() => {
    const fetchRegistrationStatus = async () => {
      const { data, error } = await supabase
        .from("event_settings")
        .select("registrations_open")
        .single();
      if (error) {
        console.error("Erro ao buscar status das inscrições:", error);
        setIsRegistrationsOpen(false);
      } else {
        setIsRegistrationsOpen(data.registrations_open);
      }
    };
    fetchRegistrationStatus();
  }, []);

  const validateField = (field: string, value: string) => {
    if (!value) return "Campo obrigatório";
    if (field === "whatsapp" && !/^\d{10,11}$/.test(value.replace(/\D/g, "")))
      return "Número inválido";
    return "";
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData({ ...formData, [field]: value });
    setErrors({ ...errors, [field]: validateField(field, value) });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors: { [key: string]: string } = {};
    Object.entries(formData).forEach(([key, value]) => {
      if (["situacao", "nomeCompleto", "sexo", "idade", "whatsapp"].includes(key)) {
        const error = validateField(key, value);
        if (error) validationErrors[key] = error;
      }
    });

    if (formData.situacao === "Encontrista") {
      if (!formData.nomeResponsavel1)
        validationErrors["nomeResponsavel1"] = "Campo obrigatório";
      if (!formData.whatsappResponsavel1)
        validationErrors["whatsappResponsavel1"] = "Campo obrigatório";
    }

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, corrija os campos destacados.",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    const isPastorObreiro = formData.situacao === "Pastor, obreiro ou discipulador";
    const discipuladorFinal = isPastorObreiro ? formData.nomeCompleto : formData.discipuladores;
    const liderFinal = isPastorObreiro ? formData.nomeCompleto : formData.lider;
    const anjoFinal =
      formData.situacao === "Encontrista"
        ? formData.anjoGuarda
        : isPastorObreiro
        ? formData.nomeCompleto
        : "";

    try {
      const inscriptionData = {
        nome_completo: formData.nomeCompleto,
        anjo_guarda: anjoFinal,
        sexo: formData.sexo,
        idade: formData.idade,
        whatsapp: formData.whatsapp,
        discipuladores: discipuladorFinal,
        lider: liderFinal,
        irmao_voce_e: formData.situacao,
        responsavel_1_nome: formData.nomeResponsavel1 || null,
        responsavel_1_whatsapp: formData.whatsappResponsavel1 || null,
        responsavel_2_nome: formData.nomeResponsavel2 || null,
        responsavel_2_whatsapp: formData.whatsappResponsavel2 || null,
        responsavel_3_nome: formData.nomeResponsavel3 || null,
        responsavel_3_whatsapp: formData.whatsappResponsavel3 || null,
        status_pagamento: "Pendente",
        valor: 200.0
      };

      const { error } = await supabase.from("inscriptions").insert([inscriptionData]);
      if (error) throw error;

      setShowSuccessModal(true);

      setFormData({
        discipuladores: "",
        lider: "",
        nomeCompleto: "",
        anjoGuarda: "",
        sexo: "",
        idade: "",
        whatsapp: "",
        situacao: "",
        nomeResponsavel1: "",
        whatsappResponsavel1: "",
        nomeResponsavel2: "",
        whatsappResponsavel2: "",
        nomeResponsavel3: "",
        whatsappResponsavel3: ""
      });
      setErrors({});
    } catch (error) {
      console.error(error);
      toast({
        title: "Erro na inscrição",
        description: "Ocorreu um erro ao processar sua inscrição. Tente novamente.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-peaceful flex flex-col relative">
      <AnimatePresence>
        {isSubmitting && (
          <motion.div
            className="absolute inset-0 bg-black/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="w-16 h-16 border-4 border-white border-t-transparent rounded-full animate-spin"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showSuccessModal && (
          <motion.div
            className="absolute inset-0 bg-black/50 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white p-8 rounded-lg flex flex-col items-center"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
            >
              <CheckCircle className="h-16 w-16 text-green-500 mb-4" />
              <h2 className="text-2xl font-bold mb-2">Inscrição realizada!</h2>
              <p className="text-center mb-4">
                Sua inscrição foi registrada com sucesso. Aguarde a confirmação do pagamento.
              </p>
              <Button onClick={() => setShowSuccessModal(false)}>Fechar</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="flex-grow flex items-center justify-center p-4">
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-divine bg-white">
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 w-16 h-16 bg-gradient-glow rounded-full flex items-center justify-center">
                <UserPlus className="h-8 w-8 text-primary" />
              </div>
              <CardTitle className="text-3xl font-bold text-primary">Formulário de Inscrição</CardTitle>
              <p className="text-muted-foreground">Encontro com Deus - 29 a 31 de Agosto</p>
            </CardHeader>
            <CardContent>
              {!isRegistrationsOpen ? (
                <div className="flex flex-col items-center justify-center p-8 bg-red-50 border border-red-300 rounded-lg text-red-800">
                  <AlertTriangle className="h-12 w-12 mb-4" />
                  <h3 className="text-2xl font-bold mb-2">Inscrições Encerradas!</h3>
                  <p className="text-center">As inscrições para o Encontro com Deus estão encerradas no momento.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Nome Completo */}
                  <div className="space-y-1">
                    <Label htmlFor="nomeCompleto">Nome Completo</Label>
                    <Input
                      id="nomeCompleto"
                      value={formData.nomeCompleto}
                      onChange={(e) => handleInputChange("nomeCompleto", e.target.value)}
                      className={errors.nomeCompleto ? "border-red-500" : ""}
                      placeholder="Digite seu nome completo"
                    />
                    {errors.nomeCompleto && <p className="text-red-500 text-sm">{errors.nomeCompleto}</p>}
                  </div>

                  {/* Situação */}
                  <div className="space-y-1">
                    <Label htmlFor="situacao">Situação</Label>
                    <Select
                      value={formData.situacao}
                      onValueChange={(value) => handleInputChange("situacao", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione sua situação" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Encontrista">Encontrista</SelectItem>
                        <SelectItem value="Pastor, obreiro ou discipulador">Pastor, obreiro ou discipulador</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.situacao && <p className="text-red-500 text-sm">{errors.situacao}</p>}
                  </div>

                  {/* Discipuladores */}
                  {formData.situacao !== "Pastor, obreiro ou discipulador" && (
                    <div className="space-y-1">
                      <Label htmlFor="discipuladores">Discipulador</Label>
                      <Select
                        value={formData.discipuladores}
                        onValueChange={(value) => handleInputChange("discipuladores", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o discipulador" />
                        </SelectTrigger>
                        <SelectContent>
                          {discipuladoresOptions.map((d) => (
                            <SelectItem key={d} value={d}>
                              {d}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.discipuladores && <p className="text-red-500 text-sm">{errors.discipuladores}</p>}
                    </div>
                  )}

                  {/* Líder */}
                  {formData.discipuladores && (
                    <div className="space-y-1">
                      <Label htmlFor="lider">Líder</Label>
                      <Select
                        value={formData.lider}
                        onValueChange={(value) => handleInputChange("lider", value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione o líder" />
                        </SelectTrigger>
                        <SelectContent>
                          {lideresMap[formData.discipuladores]?.map((l) => (
                            <SelectItem key={l} value={l}>
                              {l}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {errors.lider && <p className="text-red-500 text-sm">{errors.lider}</p>}
                    </div>
                  )}

                  {/* Campos restantes */}
                  <div className="space-y-1">
                    <Label htmlFor="sexo">Sexo</Label>
                    <Select
                      value={formData.sexo}
                      onValueChange={(value) => handleInputChange("sexo", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o sexo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Masculino">Masculino</SelectItem>
                        <SelectItem value="Feminino">Feminino</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.sexo && <p className="text-red-500 text-sm">{errors.sexo}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="idade">Idade</Label>
                    <Input
                      id="idade"
                      value={formData.idade}
                      onChange={(e) => handleInputChange("idade", e.target.value)}
                      className={errors.idade ? "border-red-500" : ""}
                      placeholder="Digite sua idade"
                      type="number"
                    />
                    {errors.idade && <p className="text-red-500 text-sm">{errors.idade}</p>}
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="whatsapp">WhatsApp</Label>
                    <Input
                      id="whatsapp"
                      value={formData.whatsapp}
                      onChange={(e) => handleInputChange("whatsapp", e.target.value)}
                      className={errors.whatsapp ? "border-red-500" : ""}
                      placeholder="Digite seu WhatsApp"
                    />
                    {errors.whatsapp && <p className="text-red-500 text-sm">{errors.whatsapp}</p>}
                  </div>

                  <Button type="submit" className="w-full" disabled={isSubmitting}>
                    {isSubmitting ? "Enviando..." : "Enviar Inscrição"}
                    <Send className="ml-2 h-4 w-4" />
                  </Button>
                </form>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default InscriptionForm;
