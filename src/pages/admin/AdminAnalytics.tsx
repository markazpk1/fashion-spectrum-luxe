import { Badge } from "@/components/ui/badge";
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell
} from "recharts";
import { TrendingUp, TrendingDown, Eye, ShoppingCart, DollarSign, Users } from "lucide-react";

const dailyVisitors = [
  { day: "Mon", visitors: 1200, pageViews: 3400 },
  { day: "Tue", visitors: 1450, pageViews: 4100 },
  { day: "Wed", visitors: 1100, pageViews: 2900 },
  { day: "Thu", visitors: 1680, pageViews: 4800 },
  { day: "Fri", visitors: 2100, pageViews: 5600 },
  { day: "Sat", visitors: 2400, pageViews: 6200 },
  { day: "Sun", visitors: 1900, pageViews: 5100 },
];

const conversionData = [
  { month: "Jan", rate: 2.1 }, { month: "Feb", rate: 2.4 }, { month: "Mar", rate: 3.1 },
  { month: "Apr", rate: 2.8 }, { month: "May", rate: 3.5 }, { month: "Jun", rate: 3.2 }, { month: "Jul", rate: 3.8 },
];

const trafficSources = [
  { name: "Direct", value: 35, color: "hsl(0, 72%, 40%)" },
  { name: "Social Media", value: 28, color: "hsl(38, 70%, 50%)" },
  { name: "Google", value: 22, color: "hsl(20, 10%, 40%)" },
  { name: "Referral", value: 15, color: "hsl(30, 15%, 60%)" },
];

const deviceData = [
  { name: "Mobile", value: 62, color: "hsl(0, 72%, 40%)" },
  { name: "Desktop", value: 30, color: "hsl(38, 70%, 50%)" },
  { name: "Tablet", value: 8, color: "hsl(30, 15%, 60%)" },
];

const topPages = [
  { page: "/", views: 12400, bounce: "32%" },
  { page: "/shop", views: 8900, bounce: "28%" },
  { page: "/collections", views: 6200, bounce: "35%" },
  { page: "/new-arrivals", views: 4800, bounce: "25%" },
  { page: "/sale", views: 3900, bounce: "22%" },
];

const AdminAnalytics = () => (
  <div className="space-y-6">
    <div>
      <h1 className="font-heading text-3xl font-semibold text-foreground">Analytics</h1>
      <p className="font-body text-sm text-muted-foreground">Store performance insights</p>
    </div>

    {/* Quick Stats */}
    <div className="grid grid-cols-2 xl:grid-cols-4 gap-4">
      {[
        { label: "Page Views", value: "32.1K", change: "+15%", up: true, icon: Eye },
        { label: "Visitors", value: "11.8K", change: "+8%", up: true, icon: Users },
        { label: "Conversion Rate", value: "3.8%", change: "+0.6%", up: true, icon: ShoppingCart },
        { label: "Avg. Order Value", value: "₨ 1,240", change: "-2%", up: false, icon: DollarSign },
      ].map(s => (
        <div key={s.label} className="bg-card border border-border rounded-xl p-4">
          <div className="flex items-center justify-between mb-2">
            <s.icon size={18} className="text-primary" />
            <span className={`text-xs font-body ${s.up ? "text-green-600" : "text-red-500"} flex items-center gap-0.5`}>
              {s.up ? <TrendingUp size={10} /> : <TrendingDown size={10} />} {s.change}
            </span>
          </div>
          <p className="font-heading text-2xl font-semibold text-foreground">{s.value}</p>
          <p className="font-body text-xs text-muted-foreground">{s.label}</p>
        </div>
      ))}
    </div>

    {/* Visitors Chart */}
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Visitors & Page Views</h3>
      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={dailyVisitors}>
          <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
          <XAxis dataKey="day" tick={{ fontSize: 11, fontFamily: "Outfit" }} stroke="hsl(20, 5%, 50%)" />
          <YAxis tick={{ fontSize: 11, fontFamily: "Outfit" }} stroke="hsl(20, 5%, 50%)" />
          <Tooltip contentStyle={{ fontFamily: "Outfit", fontSize: 12, borderRadius: 8 }} />
          <Bar dataKey="visitors" fill="hsl(0, 72%, 40%)" radius={[4, 4, 0, 0]} />
          <Bar dataKey="pageViews" fill="hsl(38, 70%, 50%)" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>

    <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
      {/* Conversion Rate */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Conversion Rate</h3>
        <ResponsiveContainer width="100%" height={220}>
          <LineChart data={conversionData}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(30, 15%, 88%)" />
            <XAxis dataKey="month" tick={{ fontSize: 11, fontFamily: "Outfit" }} stroke="hsl(20, 5%, 50%)" />
            <YAxis tick={{ fontSize: 11, fontFamily: "Outfit" }} stroke="hsl(20, 5%, 50%)" />
            <Tooltip contentStyle={{ fontFamily: "Outfit", fontSize: 12, borderRadius: 8 }} />
            <Line type="monotone" dataKey="rate" stroke="hsl(0, 72%, 40%)" strokeWidth={2} dot={{ fill: "hsl(0, 72%, 40%)" }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Traffic Sources */}
      <div className="bg-card border border-border rounded-xl p-5">
        <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Traffic Sources</h3>
        <div className="flex items-center gap-6">
          <ResponsiveContainer width="50%" height={180}>
            <PieChart>
              <Pie data={trafficSources} cx="50%" cy="50%" innerRadius={45} outerRadius={70} dataKey="value" paddingAngle={3}>
                {trafficSources.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
          <div className="space-y-3">
            {trafficSources.map(s => (
              <div key={s.name} className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full" style={{ backgroundColor: s.color }} />
                <span className="font-body text-sm text-foreground">{s.name}</span>
                <span className="font-body text-sm font-medium text-foreground ml-auto">{s.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>

    {/* Top Pages */}
    <div className="bg-card border border-border rounded-xl p-5">
      <h3 className="font-heading text-lg font-semibold text-foreground mb-4">Top Pages</h3>
      <table className="w-full">
        <thead>
          <tr className="border-b border-border">
            <th className="text-left py-2 font-body text-xs uppercase tracking-wider text-muted-foreground">Page</th>
            <th className="text-right py-2 font-body text-xs uppercase tracking-wider text-muted-foreground">Views</th>
            <th className="text-right py-2 font-body text-xs uppercase tracking-wider text-muted-foreground">Bounce Rate</th>
          </tr>
        </thead>
        <tbody>
          {topPages.map(p => (
            <tr key={p.page} className="border-b border-border">
              <td className="py-3 font-body text-sm text-foreground">{p.page}</td>
              <td className="py-3 font-body text-sm text-foreground text-right">{p.views.toLocaleString()}</td>
              <td className="py-3 font-body text-sm text-muted-foreground text-right">{p.bounce}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </div>
);

export default AdminAnalytics;
