import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid
} from "recharts";

type MesVentas = {
  mes: string;  // 'YYYY-MM'
  total: number;
};

type Props = {
  data: MesVentas[];
};

export function ResumenPagosChart({ data }: Props) {
  return (
    <Card className="col-span-2">
      <CardHeader>
        <CardTitle>Ventas mensuales</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="mes" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="total" stroke="#14b8a6" strokeWidth={2} />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}


