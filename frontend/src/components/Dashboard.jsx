import { Database, Users, Activity, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard({ stats }) {
  const cards = [
    {
      title: 'Total Databases',
      value: stats?.databases || '5',
      icon: Database,
      color: 'from-blue-500 to-blue-600',
      change: '+2 this month'
    },
    {
      title: 'Total Employees',
      value: stats?.employees || '100',
      icon: Users,
      color: 'from-purple-500 to-purple-600',
      change: '+12 this month'
    },
    {
      title: 'Active Queries',
      value: stats?.queries || '247',
      icon: Activity,
      color: 'from-green-500 to-green-600',
      change: '+18% this week'
    },
    {
      title: 'Performance Score',
      value: stats?.performance || '94%',
      icon: TrendingUp,
      color: 'from-orange-500 to-orange-600',
      change: '+5% improvement'
    }
  ];

  const chartData = [
    { name: 'HR', employees: 10 },
    { name: 'Marketing', employees: 15 },
    { name: 'Finance', employees: 12 },
    { name: 'Engineering', employees: 25 },
    { name: 'Sales', employees: 20 },
  ];

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <h1>Dashboard Overview</h1>
        <p className="dashboard-subtitle">Monitor your MongoDB analytics in real-time</p>
      </div>

      {/* Stats Cards */}
      <div className="stats-grid">
        {cards.map((card, idx) => (
          <div key={idx} className="stat-card">
            <div className={`stat-icon bg-gradient-to-br ${card.color}`}>
              <card.icon size={24} />
            </div>
            <div className="stat-content">
              <p className="stat-label">{card.title}</p>
              <h3 className="stat-value">{card.value}</h3>
              <p className="stat-change">{card.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Chart Section */}
      <div className="chart-section">
        <div className="chart-card">
          <h3 className="chart-title">Employees by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
              <XAxis dataKey="name" stroke="#9CA3AF" />
              <YAxis stroke="#9CA3AF" />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#1F2937', 
                  border: '1px solid #374151',
                  borderRadius: '8px'
                }}
              />
              <Bar dataKey="employees" fill="#8B5CF6" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="recent-activity">
          <h3 className="chart-title">Recent Activity</h3>
          <div className="activity-list">
            <div className="activity-item">
              <div className="activity-dot bg-blue-500"></div>
              <div>
                <p className="activity-text">New employee added to Engineering</p>
                <p className="activity-time">2 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot bg-green-500"></div>
              <div>
                <p className="activity-text">Performance review completed</p>
                <p className="activity-time">5 hours ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot bg-purple-500"></div>
              <div>
                <p className="activity-text">Payroll processed for November</p>
                <p className="activity-time">1 day ago</p>
              </div>
            </div>
            <div className="activity-item">
              <div className="activity-dot bg-orange-500"></div>
              <div>
                <p className="activity-text">Database backup completed</p>
                <p className="activity-time">2 days ago</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
