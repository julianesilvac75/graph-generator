import React, { useRef } from 'react';
import { ComposedChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Line } from 'recharts';
import { toPng } from 'html-to-image';
import download from 'downloadjs';

const unsortedData = [
  { group: 'BNCPHB5', rate_0: 0.83871, rate_72: 0.122449, difference: 0.716261 },
  { group: 'BNCPHB10', rate_0: 0.873433, rate_72: 0.213542, difference: 0.659892 },
  { group: 'EoC', rate_0: 0.851847, rate_72: 0.207822, difference: 0.644026 },
  { group: 'control', rate_0: 0.865023, rate_72: 0.245446, difference: 0.619577 },
  { group: 'BNCPHB2', rate_0: 0.833992, rate_72: 0.233673, difference: 0.600318 },
  { group: 'EoD2', rate_0: 0.610646, rate_72: 0.0133333, difference: 0.597313 },
  { group: 'blank', rate_0: 0.851587, rate_72: 0.266553, difference: 0.585034 },
  { group: 'PHB', rate_0: 0.0560747, rate_72: 0, difference: 0.0560747 },
  { group: 'EoD10', rate_0: 0.711823, rate_72: 0.0134163, difference: 0.698407 }
];

const data = [
  ...unsortedData.filter(item => item.group === 'blank' || item.group === 'control'),
  ...unsortedData
    .filter(item => item.group !== 'blank' && item.group !== 'control')
    .sort((a, b) => a.difference - b.difference)
];

const SurvivalRateChart = () => {
  const chartRef = useRef<HTMLDivElement>(null);

  const downloadImage = () => {
    if (chartRef.current === null) {
      return;
    }

    toPng(chartRef.current, { cacheBust: true })
      .then((dataUrl) => {
        download(dataUrl, 'survival-rate-chart.png');
      })
      .catch((err) => {
        console.error('Erro ao gerar a imagem:', err);
      });
  };

  return (
    <div>
      <button onClick={downloadImage}>Baixar Gráfico como PNG</button>
      <div ref={chartRef}>
        <ResponsiveContainer width="100%" height={500}>
          <ComposedChart
            data={data}
            margin={{ top: 20, right: 30, left: 50, bottom: 100 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="group" 
              angle={-45} 
              textAnchor="end" 
              interval={0} 
              height={80} 
              tick={{fontSize: 12}}
            />
            <YAxis 
              yAxisId="left"
              label={{ value: 'Survival Rate', angle: -90, position: 'insideLeft', offset: -40 }}
              tick={{fontSize: 12}}
            />
            <YAxis 
              yAxisId="right"
              orientation="right"
              label={{ value: 'Difference', angle: 90, position: 'insideRight', offset: -30 }}
              tick={{fontSize: 12}}
            />
            <Tooltip />
            <Legend wrapperStyle={{paddingTop: "20px"}} />
            <Bar yAxisId="left" dataKey="rate_0" fill="#8884d8" name="t=0" />
            <Bar yAxisId="left" dataKey="rate_72" fill="#82ca9d" name="t=72" />
            <Line yAxisId="right" type="monotone" dataKey="difference" stroke="#ff7300" name="Difference" strokeWidth={2} />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default SurvivalRateChart;
