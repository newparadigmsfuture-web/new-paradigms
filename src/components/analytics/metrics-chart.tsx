'use client';

import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
  name: string;
  [key: string]: string | number;
}

interface MetricsChartProps {
  title: string;
  description?: string;
  data: ChartData[];
  type?: 'line' | 'bar';
  dataKeys: {
    key: string;
    color: string;
    name?: string;
  }[];
  xAxisKey?: string;
}

export function MetricsChart({
  title,
  description,
  data,
  type = 'line',
  dataKeys,
  xAxisKey = 'name',
}: MetricsChartProps) {
  const ChartComponent = type === 'line' ? LineChart : BarChart;

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        {description && <CardDescription>{description}</CardDescription>}
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <ChartComponent data={data}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey={xAxisKey}
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis tick={{ fontSize: 12 }} tickLine={false} axisLine={false} />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              <Legend />
              {dataKeys.map((dk) =>
                type === 'line' ? (
                  <Line
                    key={dk.key}
                    type="monotone"
                    dataKey={dk.key}
                    name={dk.name || dk.key}
                    stroke={dk.color}
                    strokeWidth={2}
                    dot={{ fill: dk.color, strokeWidth: 2 }}
                  />
                ) : (
                  <Bar
                    key={dk.key}
                    dataKey={dk.key}
                    name={dk.name || dk.key}
                    fill={dk.color}
                    radius={[4, 4, 0, 0]}
                  />
                )
              )}
            </ChartComponent>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

interface SimpleStatProps {
  value: number;
  label: string;
  change?: number;
  changeLabel?: string;
}

export function SimpleStat({ value, label, change, changeLabel }: SimpleStatProps) {
  return (
    <div className="text-center">
      <p className="text-3xl font-bold">{value}</p>
      <p className="text-sm text-muted-foreground">{label}</p>
      {change !== undefined && (
        <p
          className={`text-xs mt-1 ${
            change >= 0 ? 'text-green-600' : 'text-red-600'
          }`}
        >
          {change >= 0 ? '+' : ''}
          {change}% {changeLabel}
        </p>
      )}
    </div>
  );
}
