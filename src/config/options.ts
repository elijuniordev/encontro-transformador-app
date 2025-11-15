// src/config/options.ts

export const DISCIPULADORES_OPTIONS = [
  "Arthur e Beatriz",
  "José Gomes e Edna",
  "Rosana",
  "Rafael Ângelo e Ingrid",
];

// ADICIONE a tipagem : Record<string, string[]> aqui
export const LIDERES_MAP: Record<string, string[]> = {
  "Arthur e Beatriz": ["Maria e Mauro", "Welligton e Nathalia", "Rafael Vicente e Fabiana", "Lucas e Gabriela Tangerino", "Marcio e Rita", "Alfredo e Luana"].sort((a, b) => a.localeCompare(b, 'pt-BR')),
  "José Gomes e Edna": ["Celina", "Junior e Patricia", "José Gomes e Edna", "Eliana", "Vinicius e Eliane"].sort((a, b) => a.localeCompare(b, 'pt-BR')),
  "Rosana": ["Deusa", "Maria Sandrimara"].sort((a, b) => a.localeCompare(b, 'pt-BR')),
  "Rafael Ângelo e Ingrid": ["Renan e Edziane", "Vladimir e Elaine", "Rafael Ângelo e Ingrid", "Hugo e Luciane", "Alexandre e Carol"].sort((a, b) => a.localeCompare(b, 'pt-BR')),
};

export const IRMAO_VOCE_E_OPTIONS = [
  "Encontrista",
  "Equipe",
  "Acompanhante",
  "Cozinha",
  "Criança",
  "Pastor, obreiro ou discipulador"
];

export const PARENTESCO_OPTIONS = [
  "Pai",
  "Mãe",
  "Avô",
  "Avó",
  "Tio",
  "Tia",
  "Irmão",
  "Irmã",
  "Outro",
];

export const STATUS_PAGAMENTO_OPTIONS = ["Pendente", "Confirmado", "Parcial", "Cancelado", "Isento"];

export const FORMA_PAGAMENTO_OPTIONS = ["Pix", "Cartão de Crédito", "CartaoCredito2x", "CartaoDebito", "Dinheiro", "Transferência", "Pagamento Incompleto"];

export const SEXO_OPTIONS = ["Masculino", "Feminino"];
