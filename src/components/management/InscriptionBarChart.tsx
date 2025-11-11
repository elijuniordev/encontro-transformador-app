// src/components/management/InscriptionBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { DisciplineChartData, STAFF_CONSOLIDATED_KEY } from '@/lib/statistics'; 
import { IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS } from '@/config/options';

interface InscriptionBarChartProps {
  chartData: DisciplineChartData[];
}

const colors: { [key: string]: string } = {
  // Mapeamento de cores para as categorias (tailwind colors)
  'Encontrista': '#3b82f6', // blue-500
  'Equipe': '#10b981',      // emerald-500
  // Usamos a cor primária para destacar a categoria de pastor/obreiro
  'Pastor, obreiro ou discipulador': 'hsl(var(--primary))', 
  'Criança': '#f59e0b',      // amber-500
  'Cozinha': '#f97316',      // orange-500
  'Acompanhante': '#ec4899', // pink-500
  'Outro': '#6b7280',        // gray-500
};

// Funçao auxiliar para mapear a chave interna para o texto desejado pelo usuário.
const mapDiscipuladorLabel = (label: string) => {
    if (label === STAFF_CONSOLIDATED_KEY) {
        // Texto solicitado: "Pastor, obreiro ou discipulador"
        return 'Pastor, obreiro ou discipulador'; 
    }
    return label;
};

const InscriptionBarChart = ({ chartData: originalChartData }: InscriptionBarChartProps) => {
  // Mapeia os dados para renomear a chave interna para o label desejado.
  const chartData = originalChartData.map(d => ({
      ...d,
      discipulador: mapDiscipuladorLabel(d.discipulador as string)
  }));

  // Corrigido o acesso à chave para resolver o erro TS7053.
  const chartKeys = FUNCAO_OPTIONS.filter(key => 
      chartData.some(d => ((d as DisciplineChartData)[key as keyof DisciplineChartData] as number) > 0)
  );
  
  if (chartData.length === 0) {
    return (
      <Card className="shadow-peaceful">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Users className="h-5 w-5 md:h-6 md:w-6" /> Total de Inscrições por Discipulado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Nenhuma inscrição total para exibir.</p>
        </CardContent>
      </Card>
    );
  }

  // Altura fixa para gráfico de colunas
  const fixedHeight = 500;

  return (
    <Card className="shadow-peaceful">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Users className="h-5 w-5 md:h-6 md:w-6" />
          Total de Inscrições por Discipulado
        </CardTitle>
      </CardHeader>
      <CardContent style={{ height: fixedHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            // Removendo layout="vertical" para ter colunas verticais
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} /> 
            
            {/* Eixo X (Horizontal): Nomes dos Discipuladores */}
            <XAxis 
                dataKey="discipulador" 
                type="category" 
                angle={-45} // Inclina o texto para caber nomes longos
                textAnchor="end"
                height={100} // Aumenta a altura para os labels inclinados
                stroke="#6b7280" 
                tick={{ fontSize: 10 }}
                interval={0} // Garante que todos os nomes apareçam
            />
            
            {/* Eixo Y (Vertical): Valores de contagem. Tipo number. */}
            <YAxis 
                type="number" 
                stroke="#6b7280" 
                tick={{ fontSize: 12 }} 
            />
            
            {/* Tooltip: Exibe os valores detalhados ao passar o mouse */}
            <Tooltip 
                labelFormatter={(label: string) => `Discipulador: ${label}`}
                formatter={(value: number, name: string) => [`${value} Inscrições`, name]}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                itemStyle={{ color: '#1f2937' }}
            />
            
            {/* Legenda: Exibe as cores para cada tipo de inscrição */}
            <Legend wrapperStyle={{ paddingTop: 20 }} />
            
            {/* Barras Agrupadas: Removido stackId="a" */}
            {chartKeys.map(key => (
              <Bar 
                key={key} 
                dataKey={key} 
                // REMOVIDO: stackId="a"
                fill={colors[key] || colors['Outro']} 
                name={key}
                maxBarSize={15} // Reduzido para melhor visualização agrupada
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InscriptionBarChart;