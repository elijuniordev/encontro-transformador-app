// src/components/management/InscriptionBarChart.tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';
import { DisciplineChartData, STAFF_CONSOLIDATED_KEY } from '@/lib/statistics'; 
import { IRMAO_VOCE_E_OPTIONS as FUNCAO_OPTIONS } from '@/config/options';

// Custom colors for Pie chart slices (cores de alto contraste para a Rosca)
const PIE_COLORS = [
    "#3b82f6", // blue
    "#10b981", // emerald
    "#8b5cf6", // violet
    "#f59e0b", // amber
    "#ec4899", // pink
    "#f97316", // orange
    "#6b7280", // gray
    "#7e22ce", // purple
    "#059669", // dark green
];

// Interface para dados de rosca (simples nome/valor)
interface InscriptionDoughnutProps {
  chartData: { name: string; value: number }[];
}

// Render custom label inside the doughnut slices
import type { PieLabelRenderProps } from 'recharts';

const renderCustomizedLabel = ({ cx = 0, cy = 0, midAngle = 0, innerRadius = 0, outerRadius = 0, percent, name }: PieLabelRenderProps) => {
    const inner = typeof innerRadius === 'number' ? innerRadius : parseFloat(innerRadius as string) || 0;
    const outer = typeof outerRadius === 'number' ? outerRadius : parseFloat(outerRadius as string) || 0;
    const radius = inner + (outer - inner) * 0.5;
    const cxNum = typeof cx === 'number' ? cx : parseFloat(cx as string) || 0;
    const cyNum = typeof cy === 'number' ? cy : parseFloat(cy as string) || 0;
    const x = cxNum + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cyNum + radius * Math.sin(-midAngle * (Math.PI / 180));

    // Exibe o label percentual se o slice for grande o suficiente
    if (percent && percent > 0.05) {
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cxNum ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '10px' }}>
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        );
    }
};

const InscriptionDoughnutChart = ({ chartData }: InscriptionDoughnutProps) => {
  const total = chartData.reduce((sum, entry) => sum + entry.value, 0);

  if (chartData.length === 0 || total === 0) {
    return (
      <Card className="shadow-peaceful h-full">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
            <Users className="h-5 w-5 md:h-6 md:w-6" /> Distribuição por Discipulado
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-center text-muted-foreground">Nenhuma inscrição total para exibir no gráfico.</p>
        </CardContent>
      </Card>
    );
  }
  
  // Altura fixa otimizada para o layout 6/12
  const fixedHeight = 400; 

  return (
    <Card className="shadow-peaceful">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl md:text-2xl">
          <Users className="h-5 w-5 md:h-6 md:w-6" />
          Distribuição por Discipulado
        </CardTitle>
      </CardHeader>
      
      {/* Container com altura fixa */}
      <CardContent style={{ height: fixedHeight }} className="p-4 pt-0">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%" // CORREÇÃO: Centraliza a Rosca para melhor visualização mobile
              cy="50%" 
              innerRadius={60} // Doughnut/Rosca
              outerRadius={100}
              fill="#8884d8"
              paddingAngle={2}
              labelLine={false}
              label={renderCustomizedLabel} // Mostra % dentro das fatias
            >
              {chartData.map((entry, index) => (
                <Cell 
                    key={`cell-${entry.name}`} 
                    fill={PIE_COLORS[index % PIE_COLORS.length]} 
                />
              ))}
            </Pie>
            <Tooltip 
                formatter={(value: number, name: string) => [
                    `${value} Inscrições`, 
                    `${name} (${(value / total * 100).toFixed(1)}%)`
                ]}
                contentStyle={{ backgroundColor: 'white', border: '1px solid #e5e7eb', borderRadius: '4px' }}
                itemStyle={{ color: '#1f2937' }}
            />
            <Legend 
                wrapperStyle={{ paddingTop: 10 }} 
                layout="horizontal" // CORREÇÃO: Legenda abaixo para mobile/6-column layout
                verticalAlign="bottom"
                align="center"
                iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InscriptionDoughnutChart;