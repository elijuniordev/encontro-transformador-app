import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Search, Filter, LogOut, Eye, Edit, Users, Settings } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface Inscription {
  id: string;
  discipuladores: string;
  lider: string;
  nomeCompleto: string;
  anjoGuarda: string;
  sexo: string;
  idade: string;
  whatsapp: string;
  situacao: string;
  statusPagamento: string;
  formaPagamento: string;
  valor: string;
  observacao: string;
  dataInscricao: string;
}

const Management = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDiscipulado, setFilterDiscipulado] = useState(false);
  const [inscriptions, setInscriptions] = useState<Inscription[]>([]);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editData, setEditData] = useState<Partial<Inscription>>({});

  const userRole = localStorage.getItem("userRole");
  const userEmail = localStorage.getItem("userEmail");
  const userDiscipulado = localStorage.getItem("userDiscipulado");
  const isAuthenticated = localStorage.getItem("isAuthenticated");

  // Dados fictícios para demonstração
  const mockInscriptions: Inscription[] = [
    {
      id: "1",
      discipuladores: "Pastor João e Ana Silva",
      lider: "Líder Carlos",
      nomeCompleto: "Maria Santos",
      anjoGuarda: "Ana Costa",
      sexo: "feminino",
      idade: "28",
      whatsapp: "(11) 99999-1111",
      situacao: "membro",
      statusPagamento: "Confirmado",
      formaPagamento: "Pix",
      valor: "200",
      observacao: "",
      dataInscricao: "2025-01-20"
    },
    {
      id: "2",
      discipuladores: "Marcos e Carla Santos",
      lider: "Líder Roberto",
      nomeCompleto: "João Silva",
      anjoGuarda: "Pedro Lima",
      sexo: "masculino",
      idade: "35",
      whatsapp: "(11) 99999-2222",
      situacao: "visitante",
      statusPagamento: "Pendente",
      formaPagamento: "",
      valor: "200",
      observacao: "Aguardando comprovante",
      dataInscricao: "2025-01-21"
    },
    {
      id: "3",
      discipuladores: "Pastor João e Ana Silva",
      lider: "Líder Ana",
      nomeCompleto: "Lucas Oliveira",
      anjoGuarda: "Maria Santos",
      sexo: "masculino",
      idade: "22",
      whatsapp: "(11) 99999-3333",
      situacao: "novo_convertido",
      statusPagamento: "Confirmado",
      formaPagamento: "Pix",
      valor: "200",
      observacao: "",
      dataInscricao: "2025-01-22"
    }
  ];

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }
    setInscriptions(mockInscriptions);
  }, [isAuthenticated, navigate]);

  const handleLogout = () => {
    localStorage.removeItem("userRole");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("isAuthenticated");
    localStorage.removeItem("userDiscipulado");
    navigate("/");
  };

  const filteredInscriptions = inscriptions.filter(inscription => {
    const matchesSearch = inscription.nomeCompleto.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inscription.whatsapp.includes(searchTerm) ||
                         inscription.discipuladores.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDiscipulado = !filterDiscipulado || 
                              inscription.discipuladores === userDiscipulado;
    
    return matchesSearch && matchesDiscipulado;
  });

  const handleEdit = (inscription: Inscription) => {
    setEditingId(inscription.id);
    setEditData({
      statusPagamento: inscription.statusPagamento,
      formaPagamento: inscription.formaPagamento,
      valor: inscription.valor,
      observacao: inscription.observacao
    });
  };

  const handleSaveEdit = () => {
    if (!editingId) return;
    
    setInscriptions(prev => prev.map(inscription => 
      inscription.id === editingId 
        ? { ...inscription, ...editData }
        : inscription
    ));
    
    setEditingId(null);
    setEditData({});
    
    toast({
      title: "Dados atualizados",
      description: "As informações foram salvas com sucesso.",
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: { [key: string]: "default" | "secondary" | "destructive" | "outline" } = {
      "Confirmado": "default",
      "Pendente": "secondary",
      "Cancelado": "destructive",
      "Isento": "outline"
    };
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>;
  };

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-peaceful p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <Card className="shadow-peaceful mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-2xl font-bold text-primary flex items-center gap-2">
                  <Settings className="h-6 w-6" />
                  Sistema de Gestão - Encontro com Deus
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  Logado como: {userEmail} ({userRole})
                </p>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sair
              </Button>
            </div>
          </CardHeader>
        </Card>

        {/* Filters */}
        <Card className="shadow-peaceful mb-6">
          <CardContent className="pt-6">
            <div className="flex flex-col md:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome, WhatsApp ou discipulador..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              {userRole === "discipulador" && (
                <Button
                  variant={filterDiscipulado ? "default" : "outline"}
                  onClick={() => setFilterDiscipulado(!filterDiscipulado)}
                  className="flex items-center gap-2"
                >
                  <Filter className="h-4 w-4" />
                  Ver Somente Inscrições do Meu Discipulado
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="shadow-peaceful">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <Users className="h-8 w-8 text-primary" />
                <div>
                  <p className="text-2xl font-bold text-primary">{filteredInscriptions.length}</p>
                  <p className="text-sm text-muted-foreground">Total de Inscrições</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-peaceful">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-green-600">
                    {filteredInscriptions.filter(i => i.statusPagamento === "Confirmado").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pagamentos Confirmados</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-peaceful">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <div className="w-4 h-4 bg-yellow-500 rounded-full"></div>
                </div>
                <div>
                  <p className="text-2xl font-bold text-yellow-600">
                    {filteredInscriptions.filter(i => i.statusPagamento === "Pendente").length}
                  </p>
                  <p className="text-sm text-muted-foreground">Pagamentos Pendentes</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="shadow-peaceful">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <span className="text-blue-600 font-bold text-sm">R$</span>
                </div>
                <div>
                  <p className="text-2xl font-bold text-blue-600">
                    {filteredInscriptions
                      .filter(i => i.statusPagamento === "Confirmado")
                      .reduce((sum, i) => sum + Number(i.valor), 0)
                      .toLocaleString('pt-BR')}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Arrecadado</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Table */}
        <Card className="shadow-divine">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Inscrições
              {filterDiscipulado && (
                <Badge variant="secondary" className="ml-2">
                  Filtrado: {userDiscipulado}
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nome</TableHead>
                    <TableHead>Discipuladores</TableHead>
                    <TableHead>Líder</TableHead>
                    <TableHead>WhatsApp</TableHead>
                    <TableHead>Status Pagamento</TableHead>
                    <TableHead>Forma Pagamento</TableHead>
                    <TableHead>Valor</TableHead>
                    <TableHead>Observação</TableHead>
                    <TableHead>Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInscriptions.map((inscription) => (
                    <TableRow key={inscription.id}>
                      <TableCell className="font-medium">{inscription.nomeCompleto}</TableCell>
                      <TableCell>{inscription.discipuladores}</TableCell>
                      <TableCell>{inscription.lider}</TableCell>
                      <TableCell>{inscription.whatsapp}</TableCell>
                      <TableCell>
                        {editingId === inscription.id ? (
                          <Select 
                            value={editData.statusPagamento} 
                            onValueChange={(value) => setEditData({...editData, statusPagamento: value})}
                          >
                            <SelectTrigger className="w-[130px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pendente">Pendente</SelectItem>
                              <SelectItem value="Confirmado">Confirmado</SelectItem>
                              <SelectItem value="Cancelado">Cancelado</SelectItem>
                              <SelectItem value="Isento">Isento</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          getStatusBadge(inscription.statusPagamento)
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === inscription.id ? (
                          <Select 
                            value={editData.formaPagamento} 
                            onValueChange={(value) => setEditData({...editData, formaPagamento: value})}
                          >
                            <SelectTrigger className="w-[120px]">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Pix">Pix</SelectItem>
                              <SelectItem value="Cartão de Crédito">Cartão de Crédito</SelectItem>
                              <SelectItem value="Transferência">Transferência</SelectItem>
                              <SelectItem value="Dinheiro">Dinheiro</SelectItem>
                            </SelectContent>
                          </Select>
                        ) : (
                          inscription.formaPagamento || "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === inscription.id ? (
                          <Input
                            type="number"
                            value={editData.valor}
                            onChange={(e) => setEditData({...editData, valor: e.target.value})}
                            className="w-20"
                          />
                        ) : (
                          `R$ ${inscription.valor}`
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === inscription.id ? (
                          <Input
                            value={editData.observacao}
                            onChange={(e) => setEditData({...editData, observacao: e.target.value})}
                            className="w-40"
                            placeholder="Observação..."
                          />
                        ) : (
                          inscription.observacao || "-"
                        )}
                      </TableCell>
                      <TableCell>
                        {editingId === inscription.id ? (
                          <div className="flex gap-2">
                            <Button size="sm" onClick={handleSaveEdit}>
                              Salvar
                            </Button>
                            <Button size="sm" variant="outline" onClick={() => setEditingId(null)}>
                              Cancelar
                            </Button>
                          </div>
                        ) : (
                          <Button size="sm" variant="outline" onClick={() => handleEdit(inscription)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Management;