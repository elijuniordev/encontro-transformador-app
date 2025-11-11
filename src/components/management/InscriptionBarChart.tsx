// src/components/management/InscriptionBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { DisciplineChartData, STAFF_CONSOLIDATED_KEY } from '@/lib/statistics'; 
import { IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS } from '@/config/options';

interface InscriptionChartProps {
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

const InscriptionBarChart = ({ chartData: originalChartData }: InscriptionChartProps) => {
  // Mapeia os dados para renomear a chave interna para o label desejado.
  const chartData = originalChartData.map(d => ({
      ...d,
      discipulador: mapDiscipuladorLabel(d.discipulador as string)
  }));

  // Corrigido o acesso à chave para resolver o erro TS7053.
  const chartKeys = FUNCAO_OPTIONS.filter(key => 
      chartData.some(d => ((d as unknown) as Record<string, number>)[key] > 0)
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

  // Altura dinâmica: 40px por barra + espaço para margens/labels (Otimizado para vertical/mobile)
  const dynamicHeight = Math.max(350, chartData.length * 40 + 100); 

  return (
    <Card className="shadow-peaceful">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Users className="h-5 w-5 md:h-6 md:w-6" />
          Total de Inscrições por Discipulado
        </CardTitle>
      </CardHeader>
      
      {/* Container com altura dinâmica */}
      <CardContent style={{ height: dynamicHeight }} className="p-4 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            // MUDANÇA CRUCIAL: layout="vertical" para Gráfico de BARRAS HORIZONTAIS AGRUPADAS
            layout="vertical"
            // Margens ajustadas para otimizar o espaço
            margin={{ top: 10, right: 20, left: 10, bottom: 0 }} 
          >
            {/* Linhas de grade verticais para gráficos horizontais */}
            <CartesianGrid strokeDasharray="3 3" horizontal={false} /> 
            
            {/* Eixo X (Bottom): Valores de Contagem (numérico) */}
            <XAxis 
                type="number" 
                stroke="#6b7280" 
                tick={{ fontSize: 10 }}
                label={{ value: 'Total de Inscrições', position: 'insideBottomRight', offset: 0, fill: '#6b7280', fontSize: 10 }}
            />
            
            {/* Eixo Y (Left): Nomes dos Discipuladores (categoria) */}
            <YAxis 
                dataKey="discipulador" 
                type="category" 
                width={150} // Aumenta a largura para os nomes longos dos Discipuladores
                stroke="#6b7280" 
                tick={{ fontSize: 10 }}
            />
            
            {/* Tooltip: Exibe os valores detalhados ao passar o mouse */}
            <Tooltip 
                labelFormatter={(label: string) => `Discipulador: ${label}`}
                formatter={(value: number, name: string) => [`${value} Inscrições`, name]}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                itemStyle={{ color: '#1f2937' }}
            />
            
            {/* Legenda: Otimiza o layout horizontal */}
            <Legend 
                wrapperStyle={{ paddingTop: 10 }} 
                layout="horizontal" 
                verticalAlign="bottom"
                align="center"
                iconSize={10}
            />
            
            {/* Barras Agrupadas: maxBarSize ajustado para aparência mais clean e compacta */}
            {chartKeys.map(key => (
              <Bar 
                key={key} 
                dataKey={key} 
                fill={colors[key] || colors['Outro']} 
                name={key}
                maxBarSize={10} // Colunas mais finas e próximas
                minPointSize={1}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InscriptionBarChart;