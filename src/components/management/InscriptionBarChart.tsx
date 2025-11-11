// src/components/management/InscriptionBarChart.tsx
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { DisciplineChartData } from '@/lib/statistics';
import { IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS } from '@/config/options';

interface InscriptionBarChartProps {
  chartData: DisciplineChartData[];
}

const colors: { [key: string]: string } = {
  // Mapeamento de cores para as categorias (tailwind colors)
  'Encontrista': '#3b82f6', // blue-500
  'Equipe': '#10b981',      // emerald-500
  'Pastor, obreiro ou discipulador': '#8b5cf6', // violet-500
  'Criança': '#f59e0b',      // amber-500
  'Cozinha': '#f97316',      // orange-500
  'Acompanhante': '#ec4899', // pink-500
  'Outro': '#6b7280',        // gray-500
};

const InscriptionBarChart = ({ chartData }: InscriptionBarChartProps) => {
  // CORREÇÃO: Força o tipo como number antes de filtrar para evitar o erro de TS anterior.
  const chartKeys = FUNCAO_OPTIONS.filter(key => chartData.some(d => (d[key] as number) > 0));
  
  if (chartData.length === 0) {
    return (
      <Card className="shadow-peaceful">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Users className="h-5 w-5 md:h-6 md:w-6" /> Inscrições por Discipulado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Nenhuma inscrição confirmada/isenta para exibir.</p>
        </CardContent>
      </Card>
    );
  }

  const dynamicHeight = Math.max(500, chartData.length * 80);

  return (
    <Card className="shadow-peaceful">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Users className="h-5 w-5 md:h-6 md:w-6" />
          Inscrições por Discipulado (Confirmadas/Isentas)
        </CardTitle>
      </CardHeader>
      <CardContent style={{ height: dynamicHeight }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={chartData}
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            layout="vertical"
          >
            <CartesianGrid strokeDasharray="3 3" vertical={false} />
            
            {/* CORREÇÃO AQUI: Garante que o eixo X é do tipo numérico para exibir a contagem */}
            <XAxis type="number" stroke="#6b7280" />
            
            <YAxis 
                dataKey="discipulador" 
                type="category" 
                width={150} 
                stroke="#6b7280" 
                tick={{ fontSize: 12 }} 
            />
            
            {/* Tooltip: Exibe os valores detalhados ao passar o mouse */}
            <Tooltip 
                formatter={(value: number, name: string) => [`${value} Inscrições`, name]}
                labelFormatter={(label: string) => `Discipulador: ${label}`}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                itemStyle={{ color: '#1f2937' }}
            />
            
            {/* Legenda: Exibe as cores para cada tipo de inscrição */}
            <Legend wrapperStyle={{ paddingTop: 20 }} />
            
            {/* Barras Empilhadas: O stackId="a" é crucial para o empilhamento correto */}
            {chartKeys.map(key => (
              <Bar 
                key={key} 
                dataKey={key} 
                stackId="a" 
                fill={colors[key] || colors['Outro']} 
                name={key}
                maxBarSize={30}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InscriptionBarChart;