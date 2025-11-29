import { 
  BarChart, Bar, LineChart, Line, PieChart, Pie, AreaChart, Area,
  ScatterChart, Scatter, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell
} from 'recharts';
import { COLOR_SCHEMES } from '../../utils/chartConfigs';

/**
 * UniversalChartRenderer - Renders any chart type
 * Supports all chart types from the Chart MCP server
 */
export default function UniversalChartRenderer({ type, data, options = {}, style = {} }) {
  const colors = style.colors || COLOR_SCHEMES.default;

  // Common chart props
  const commonProps = {
    data,
    margin: { top: 20, right: 30, left: 20, bottom: 20 },
  };

  const tooltipStyle = {
    backgroundColor: '#1F2937',
    border: '1px solid #374151',
    borderRadius: '8px',
    color: '#F9FAFB',
  };

  // Render based on chart type
  switch (type) {
    case 'bar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={tooltipStyle} />
            {options.showLegend && <Legend />}
            <Bar 
              dataKey="value" 
              fill={colors[0]} 
              radius={[8, 8, 0, 0]}
              animationDuration={options.animationDuration || 300}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      );

    case 'line':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={tooltipStyle} />
            {options.showLegend && <Legend />}
            <Line 
              type={options.smooth ? "monotone" : "linear"}
              dataKey="value" 
              stroke={colors[0]} 
              strokeWidth={style.strokeWidth || 2}
              dot={options.showDots !== false}
              animationDuration={300}
            />
          </LineChart>
        </ResponsiveContainer>
      );

    case 'pie':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={80}
              label={options.showLabels !== false}
              animationDuration={300}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Pie>
            <Tooltip contentStyle={tooltipStyle} />
            {options.showLegend && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      );

    case 'area':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="name" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={tooltipStyle} />
            {options.showLegend && <Legend />}
            <Area 
              type="monotone" 
              dataKey="value" 
              stroke={colors[0]} 
              fill={colors[0]}
              fillOpacity={style.opacity || 0.6}
              animationDuration={300}
            />
          </AreaChart>
        </ResponsiveContainer>
      );

    case 'scatter':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <ScatterChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="x" stroke="#9CA3AF" name={options.xLabel || 'X'} />
            <YAxis dataKey="y" stroke="#9CA3AF" name={options.yLabel || 'Y'} />
            <Tooltip contentStyle={tooltipStyle} cursor={{ strokeDasharray: '3 3' }} />
            {options.showLegend && <Legend />}
            <Scatter 
              name="Data Points" 
              data={data} 
              fill={colors[0]}
              animationDuration={300}
            />
          </ScatterChart>
        </ResponsiveContainer>
      );

    case 'radar':
      return (
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart {...commonProps} cx="50%" cy="50%" outerRadius="80%">
            <PolarGrid stroke="#374151" />
            <PolarAngleAxis dataKey="name" stroke="#9CA3AF" />
            <PolarRadiusAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={tooltipStyle} />
            {options.showLegend && <Legend />}
            <Radar 
              name="Values" 
              dataKey="value" 
              stroke={colors[0]} 
              fill={colors[0]} 
              fillOpacity={options.fillOpacity || 0.6}
              animationDuration={300}
            />
          </RadarChart>
        </ResponsiveContainer>
      );

    case 'table':
      return (
        <div className="chart-table-container">
          <table className="chart-table">
            <thead>
              <tr>
                {data.length > 0 && Object.keys(data[0]).map((key) => (
                  <th key={key}>{key}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {data.map((row, idx) => (
                <tr key={idx}>
                  {Object.values(row).map((value, cellIdx) => (
                    <td key={cellIdx}>{value}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );

    case 'gauge':
      // Simple gauge representation using a pie chart
      const gaugeData = [
        { name: 'Value', value: data[0]?.value || 0 },
        { name: 'Remaining', value: (data[0]?.max || 100) - (data[0]?.value || 0) },
      ];
      return (
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={gaugeData}
              dataKey="value"
              cx="50%"
              cy="50%"
              startAngle={180}
              endAngle={0}
              innerRadius={60}
              outerRadius={80}
            >
              <Cell fill={colors[0]} />
              <Cell fill="#374151" />
            </Pie>
            <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle" className="gauge-text">
              {data[0]?.value || 0}
            </text>
          </PieChart>
        </ResponsiveContainer>
      );

    case 'histogram':
      // Use bar chart for histogram
      return (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="range" stroke="#9CA3AF" />
            <YAxis stroke="#9CA3AF" />
            <Tooltip contentStyle={tooltipStyle} />
            <Bar dataKey="frequency" fill={colors[0]} />
          </BarChart>
        </ResponsiveContainer>
      );

    default:
      return (
        <div className="chart-unsupported">
          <p>Chart type "{type}" will be rendered here</p>
          <p className="text-sm">Using agent-generated chart from MCP server</p>
          {data && data.chartUrl && (
            <img src={data.chartUrl} alt={`${type} chart`} className="mcp-chart-image" />
          )}
        </div>
      );
  }
}
