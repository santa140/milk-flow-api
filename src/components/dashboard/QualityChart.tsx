import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface QualityData {
  A: number;
  B: number;
  C: number;
}

interface QualityChartProps {
  data: QualityData;
  title?: string;
}

const COLORS = {
  A: '#22c55e', // Green for Grade A
  B: '#f59e0b', // Amber for Grade B
  C: '#ef4444', // Red for Grade C
};

const GRADE_LABELS = {
  A: 'Premium (A)',
  B: 'Standard (B)', 
  C: 'Basic (C)',
};

export function QualityChart({ data, title = "Milk Quality Distribution" }: QualityChartProps) {
  const chartData = Object.entries(data).map(([grade, value]) => ({
    name: GRADE_LABELS[grade as keyof typeof GRADE_LABELS],
    value,
    grade,
    percentage: ((value / Object.values(data).reduce((a, b) => a + b, 0)) * 100).toFixed(1),
  }));

  const CustomTooltip = ({ active, payload }: any) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
        <div className="glass-card p-3 shadow-elevated">
          <p className="font-medium text-foreground">{data.name}</p>
          <p className="text-sm text-muted-foreground">
            {data.value} collections ({data.percentage}%)
          </p>
        </div>
      );
    }
    return null;
  };

  const CustomLegend = ({ payload }: any) => (
    <div className="flex justify-center gap-6 mt-4">
      {payload.map((entry: any, index: number) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="flex items-center gap-2"
        >
          <div
            className="w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-muted-foreground">
            {entry.value}
          </span>
        </motion.div>
      ))}
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="glass-card border-border/50">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={0}
                  animationDuration={800}
                >
                  {chartData.map((entry, index) => (
                    <Cell 
                      key={`cell-${index}`} 
                      fill={COLORS[entry.grade as keyof typeof COLORS]}
                      className="hover:brightness-110 transition-all duration-200"
                    />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
                <Legend content={<CustomLegend />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          {/* Quality Breakdown */}
          <div className="grid grid-cols-3 gap-4 mt-6">
            {chartData.map((item) => (
              <motion.div
                key={item.grade}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="text-center p-3 rounded-lg bg-muted/20"
              >
                <div
                  className="w-4 h-4 rounded-full mx-auto mb-2"
                  style={{ backgroundColor: COLORS[item.grade as keyof typeof COLORS] }}
                />
                <p className="text-sm font-medium text-foreground">
                  Grade {item.grade}
                </p>
                <p className="text-lg font-bold" style={{ color: COLORS[item.grade as keyof typeof COLORS] }}>
                  {item.value}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.percentage}%
                </p>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}