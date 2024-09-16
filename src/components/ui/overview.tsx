import {Bar, BarChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts"
import * as React from "react";

interface OverviewProps {
  data: MonthlyData[]; // Typ der Daten, die Overview erwartet
}

interface MonthlyData {
  name: string;
  [year: string]: number | string;
}

let color = ["#f97316", "#e11d48", "#18181b", "#2563eb"]
export const Overview: React.FC<OverviewProps> = ({data}) => {
  return (
      <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        {data.length > 0 && Object.keys(data.reduce((acc, obj) => ({...acc, ...obj}), {})).map((key, index) => {
          if (key !== 'name') {
            return (
                <Bar
                    key={index}
                    dataKey={key}
                    fill={color[index%4]} // Funktion, die die Farbe je nach Schlüssel liefert
                    radius={[4, 4, 0, 0]}
                />
            );
          }
          return null;
        })}
      </BarChart>
    </ResponsiveContainer>
  )
}


