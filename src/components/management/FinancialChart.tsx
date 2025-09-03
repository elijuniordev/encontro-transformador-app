// src/components/management/FinancialChart.tsx
import { forwardRef } from 'react';
import { Pie } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
  Title
} from 'chart.js';

// É necessário registrar os componentes do Chart.js que serão utilizados
ChartJS.register(ArcElement, Tooltip, Legend, Title);

interface FinancialChartProps {
  summaryData: { "Forma de Pagamento": string; "Valor Total Arrecadado": number }[];
}

export const FinancialChart = forwardRef<HTMLDivElement, FinancialChartProps>(({ summaryData }, ref) => {
  const data = {
    labels: summaryData.map(d => d["Forma de Pagamento"]),
    datasets: [
      {
        label: 'Valor Arrecadado',
        data: summaryData.map(d => d["Valor Total Arrecadado"]),
        backgroundColor: [
          'rgba(54, 162, 235, 0.8)',
          'rgba(255, 99, 132, 0.8)',
          'rgba(255, 206, 86, 0.8)',
          'rgba(75, 192, 192, 0.8)',
          'rgba(153, 102, 255, 0.8)',
          'rgba(255, 159, 64, 0.8)',
        ],
        borderColor: [
          'rgba(255, 255, 255, 1)',
        ],
        borderWidth: 2,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Arrecadação por Forma de Pagamento',
        font: {
          size: 18,
          weight: 'bold' as const
        },
        padding: {
          top: 10,
          bottom: 20
        }
      },
    },
  };

  return (
    // Este container posiciona o gráfico fora da tela para não ser visível ao usuário
    <div ref={ref} style={{ 
        position: 'absolute', 
        left: '-9999px', 
        top: '-9999px',
        width: '700px', 
        height: '500px', 
        backgroundColor: 'white', 
        padding: '1rem',
        border: '1px solid #ccc'
    }}>
        {summaryData.length > 0 ? <Pie data={data} options={options} /> : <p>Sem dados suficientes para gerar o gráfico.</p>}
    </div>
  );
});