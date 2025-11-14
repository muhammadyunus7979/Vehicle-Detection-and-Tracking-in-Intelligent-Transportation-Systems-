import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

interface MetricsChartProps {
  accuracySeries: Array<{ timestamp: string; value: number }>;
  fpsSeries: Array<{ timestamp: string; value: number }>;
  speedSeries: Array<{ timestamp: string; value: number }>;
  classDistribution: Array<{ clazz: string; count: number }>;
}

const MetricsChart = ({ accuracySeries, fpsSeries, speedSeries, classDistribution }: MetricsChartProps) => {
  const formatTimestamp = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      if (isNaN(date.getTime())) {
        // If it's not a valid date, try to extract time info or return as-is
        return timestamp.length > 20 ? timestamp.substring(11, 19) : timestamp;
      }
      return date.toLocaleTimeString();
    } catch {
      return timestamp.length > 20 ? timestamp.substring(11, 19) : timestamp;
    }
  };

  // Format timestamp for speed graphs - show frame/time info
  const formatSpeedTimestamp = (timestamp: string, index: number) => {
    try {
      const date = new Date(timestamp);
      if (!isNaN(date.getTime())) {
        return date.toLocaleTimeString();
      }
    } catch {
      // Fallback to index-based labeling
    }
    return `T${index + 1}`;
  };

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <h3 className="text-lg font-semibold mb-4">Accuracy Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={accuracySeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
            <YAxis />
            <Tooltip labelFormatter={formatTimestamp} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#6366f1" name="mAP50" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <h3 className="text-lg font-semibold mb-4">FPS Over Time</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={fpsSeries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" tickFormatter={formatTimestamp} />
            <YAxis />
            <Tooltip labelFormatter={formatTimestamp} />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#10b981" name="FPS" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <h3 className="text-lg font-semibold mb-4">Vehicle Speed Over Time (Line Graph)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={speedSeries.map((point, idx) => ({ ...point, index: idx }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value, index) => formatSpeedTimestamp(value, index)}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis label={{ value: "Speed (km/h)", angle: -90, position: "insideLeft" }} />
            <Tooltip 
              labelFormatter={(value) => formatTimestamp(value)} 
              formatter={(value: number) => [`${value.toFixed(1)} km/h`, "Speed"]} 
            />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#f59e0b" name="Speed (km/h)" strokeWidth={2} dot={{ r: 3 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <h3 className="text-lg font-semibold mb-4">Vehicle Speed Over Time (Bar Graph)</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={speedSeries.map((point, idx) => ({ ...point, index: idx }))}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(value, index) => formatSpeedTimestamp(value, index)}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis label={{ value: "Speed (km/h)", angle: -90, position: "insideLeft" }} />
            <Tooltip 
              labelFormatter={(value) => formatTimestamp(value)} 
              formatter={(value: number) => [`${value.toFixed(1)} km/h`, "Speed"]} 
            />
            <Legend />
            <Bar dataKey="value" fill="#f59e0b" name="Speed (km/h)" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="rounded-lg border border-gray-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4">
        <h3 className="text-lg font-semibold mb-4">Vehicle Class Distribution</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={classDistribution}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="clazz" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="count" fill="#6366f1" name="Count" />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};

export default MetricsChart;

