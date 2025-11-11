// src/components/management/InscriptionBarChart.tsx
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer, Sector } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users } from 'lucide-react';

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
interface CustomizedLabelProps {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index?: number;
    name?: string;
    value?: number;
}

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: CustomizedLabelProps) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * (Math.PI / 180));
    const y = cy + radius * Math.sin(-midAngle * (Math.PI / 180));

    // Exibe o label percentual se o slice for grande o suficiente
    if (percent > 0.05) {
        return (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" style={{ fontSize: '10px' }}>
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
              cx="40%" // Move o centro para a esquerda para dar espaço para a legenda à direita
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
                layout="vertical" // Layout vertical é ideal para Rosca com nomes longos
                verticalAlign="middle"
                align="right"
                iconSize={10}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default InscriptionDoughnutChart;