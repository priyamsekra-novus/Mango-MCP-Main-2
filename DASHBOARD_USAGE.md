# AI Dashboard Assistant - Usage Guide

## Overview

The AI Dashboard Assistant is a powerful interactive analytics platform that creates dynamic, customizable dashboards from your MongoDB data using natural language.

## Features

### ✨ **Autonomous Dashboard Generation**
- Ask the AI to create dashboards and it automatically queries your database
- Intelligently selects appropriate chart types based on your data
- Generates 3-6 visualizations with insights and context

### 🎨 **Full Chart Customization**
- **Drag & Drop**: Rearrange charts by dragging
- **Resize**: Adjust chart dimensions with resize handles
- **Edit**: Click any chart to open the comprehensive editor
  - Change chart types (15+ types available)
  - Customize colors with 7 predefined schemes
  - Adjust styling options (grid, legend, labels, etc.)
  - Configure animations

### 💬 **Chat-Based Control**
Control your dashboard through conversation:
- "Create a dashboard for employee performance"
- "Add a pie chart showing department distribution"
- "Change the bar chart to a line chart"
- "Show last 6 months instead of 3"
- "Make the sales chart bigger"

### 📊 **Available Chart Types**

**Basic Charts:**
- Bar Chart - Compare values across categories
- Line Chart - Show trends over time
- Pie Chart - Display proportions
- Area Chart - Cumulative trends

**Statistical Charts:**
- Scatter Plot - Correlation analysis
- Histogram - Distribution analysis
- Box Plot - Statistical summary

**Specialized Charts:**
- Radar Chart - Multi-dimensional comparison
- Heatmap - Pattern detection
- Gauge - KPI tracking
- Funnel - Conversion analysis
- Table - Detailed data view

## How to Use

### 1. **Access the Dashboard**
Click on **"AI Dashboard Assistant"** in the sidebar (Sparkles icon ✨)

### 2. **Create Your First Dashboard**

**Option A: Ask the AI**
```
"Create a dashboard for employee performance metrics"
"Show me sales analytics for 2024"
"Generate a dashboard for the dev-cluster database"
```

**Option B: Manual Chart Generation**
If the AI provides data but doesn't create charts automatically:
1. Look for the **"Generate Charts from Conversation"** button
2. Click it to automatically create visualizations from the chat

### 3. **Interact with Charts**

**Edit a Chart:**
- Click the ✏️ edit icon on any chart
- Use the tabbed editor:
  - **Chart Type**: Switch between 15+ chart types
  - **Style**: Change colors, line widths, opacity
  - **Options**: Toggle legend, grid, labels, animations
  - **Data**: View the underlying data structure

**Rearrange Charts:**
- Drag charts by their header to new positions
- Charts automatically adjust to fit the grid

**Resize Charts:**
- Drag the bottom-right corner of any chart
- Resize to emphasize important visualizations

**More Actions (⋮ menu):**
- Duplicate chart
- Refresh data
- Delete chart

### 4. **Manage Your Dashboard**

**Export:**
- Click the download icon to save dashboard configuration as JSON

**Clear:**
- Click the trash icon to remove all charts

## Example Workflows

### Employee Performance Dashboard
```
User: "Create an employee performance dashboard"

AI: [Analyzes database and generates:]
- Top 10 Employees by Performance (Bar Chart)
- Department Distribution (Pie Chart)
- Average Salary by Department (Bar Chart)
- Employee Strengths (Bar Chart)
- Areas for Improvement (Bar Chart)
- Goal Achievement Rate (Pie Chart)
```

### Sales Analytics Dashboard
```
User: "Show me sales analytics"

AI: [Creates:]
- Revenue Trend (Line Chart)
- Sales by Region (Bar Chart)
- Top Products (Table)
- Customer Acquisition (Area Chart)
```

### Custom Modifications
```
User: "Change the revenue chart to show last 12 months"
User: "Make the top products chart bigger"
User: "Add a chart showing customer demographics"
User: "Change colors to ocean theme"
```

## Tips & Best Practices

### 🎯 **Getting Better Results**
- Be specific about what metrics you want to see
- Mention timeframes ("last 6 months", "2024 data")
- Specify chart preferences when needed
- Ask for specific comparisons or breakdowns

### 📈 **Chart Type Selection**
- **Few categories (2-7)**: Use Pie Charts
- **Many categories**: Use Bar Charts
- **Time-based data**: Use Line or Area Charts
- **Correlations**: Use Scatter Plots
- **Detailed data**: Use Tables

### 🎨 **Visual Design**
- Use consistent color schemes across related charts
- Resize important charts to make them prominent
- Arrange related charts near each other
- Keep dashboards focused (5-8 charts is optimal)

## Keyboard Shortcuts

- **Enter**: Send chat message
- **Drag chart header**: Move chart
- **Drag resize handle**: Resize chart

## Troubleshooting

**No charts generated?**
- Click the "📊 Generate Charts from Conversation" button
- Ask more specific questions about your data
- Ensure your database has accessible data

**Charts not displaying data?**
- Check MongoDB connection
- Verify you have permissions to access the database
- Try refreshing the chart using the refresh icon

**Want to start over?**
- Click the trash icon to clear all charts
- Start a new conversation with fresh queries

## Advanced Features

### Color Schemes
- **Default**: Purple, blue, green gradient
- **Professional**: Deep blues and purples
- **Pastel**: Soft, muted tones
- **Vibrant**: Bold, saturated colors
- **Monochrome**: Grayscale palette
- **Ocean**: Blue-green gradient
- **Sunset**: Warm orange-red gradient

### Chart Options
Each chart type has specific customization options:
- Animation duration control
- Grid line toggles
- Legend positioning
- Label formatting
- Data point markers
- Smooth curves for line charts
- Percentage display for pie charts

## Integration with AI Agent

The dashboard is powered by the same AI agent that handles your MongoDB queries. It:
- ✅ Queries real data from your MongoDB database
- ✅ Analyzes data structure automatically
- ✅ Suggests optimal visualizations
- ✅ Provides insights and context
- ✅ Responds to natural language commands

## Future Enhancements

Planned features:
- Save/load dashboard configurations
- Share dashboards with team members
- Scheduled auto-refresh
- Export dashboards as PDF/images
- Drill-down capabilities
- Custom filters and date ranges
- More chart types (Sankey, Sunburst, Network graphs)

---

**Need help?** Ask the AI assistant in the chat panel!
