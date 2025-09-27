import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Users, Droplets, CreditCard, TrendingUp, Calendar, MapPin } from 'lucide-react';
import { analyticsApi } from '@/lib/api';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { QualityChart } from '@/components/dashboard/QualityChart';
import { Sidebar } from '@/components/layout/Sidebar';
import { useAuth } from '@/hooks/useAuth';

const Index = () => {
  const { user } = useAuth();
  
  // Fetch dashboard data
  const { data: dashboardStats, isLoading: isDashboardLoading } = useQuery({
    queryKey: ['dashboard-stats'],
    queryFn: analyticsApi.getDashboard,
    refetchInterval: 30000, // Refresh every 30 seconds
  });

  const { data: adminStats, isLoading: isAdminLoading } = useQuery({
    queryKey: ['admin-dashboard'],
    queryFn: analyticsApi.getAdminDashboard,
    enabled: user?.is_admin || user?.role === 'admin',
    refetchInterval: 30000,
  });

  const isAdmin = user?.is_admin || user?.role === 'admin';
  const stats = isAdmin ? adminStats : dashboardStats;
  const isLoading = isAdmin ? isAdminLoading : isDashboardLoading;

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-background">
        <Sidebar />
        <main className="flex-1 p-6 md:p-8">
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse space-y-6">
              <div className="h-8 bg-muted rounded w-64" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-32 bg-muted rounded-xl" />
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="h-96 bg-muted rounded-xl" />
                <div className="h-96 bg-muted rounded-xl" />
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar />
      <main className="flex-1 p-6 md:p-8 md:ml-0">
        <div className="max-w-7xl mx-auto space-y-8">
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col gap-2"
          >
            <h1 className="text-3xl font-bold gradient-text">
              Welcome back, {user?.full_name?.split(' ')[0] || 'User'}
            </h1>
            <p className="text-muted-foreground">
              Here's what's happening with your dairy operations today
            </p>
          </motion.div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {isAdmin && adminStats ? (
              <>
                <StatsCard
                  title="Total Farmers"
                  value={adminStats.farmer_stats?.total || 0}
                  icon={Users}
                  trend={{
                    value: 8.2,
                    isPositive: true,
                  }}
                  description="Active registered farmers"
                />
                <StatsCard
                  title="Today's Collections"
                  value={adminStats.collection_stats?.today || 0}
                  icon={Droplets}
                  valueSuffix="L"
                  trend={{
                    value: 12.5,
                    isPositive: true,
                  }}
                  description="Milk collected today"
                />
                <StatsCard
                  title="Pending Payments"
                  value={adminStats.payment_stats?.pending || 0}
                  icon={CreditCard}
                  trend={{
                    value: -3.2,
                    isPositive: false,
                  }}
                  description="Awaiting processing"
                />
                <StatsCard
                  title="Avg Quality Score"
                  value={(adminStats.collection_stats?.avg_quality || 0).toFixed(1)}
                  icon={TrendingUp}
                  trend={{
                    value: 5.7,
                    isPositive: true,
                  }}
                  description="Quality grade average"
                />
              </>
            ) : (
              <>
                <StatsCard
                  title="Total Farmers"
                  value={stats?.total_farmers || 0}
                  icon={Users}
                  trend={{
                    value: 8.2,
                    isPositive: true,
                  }}
                />
                <StatsCard
                  title="Active Collections"
                  value={stats?.active_collections || 0}
                  icon={Droplets}
                  trend={{
                    value: 12.5,
                    isPositive: true,
                  }}
                />
                <StatsCard
                  title="Monthly Revenue"
                  value={stats?.monthly_revenue || 0}
                  icon={CreditCard}
                  valuePrefix="$"
                  trend={{
                    value: 15.3,
                    isPositive: true,
                  }}
                />
                <StatsCard
                  title="Quality Score"
                  value="A+"
                  icon={TrendingUp}
                  trend={{
                    value: 5.7,
                    isPositive: true,
                  }}
                />
              </>
            )}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Quality Distribution */}
            <QualityChart 
              data={stats?.quality_distribution || { A: 45, B: 35, C: 20 }} 
            />

            {/* Recent Activity */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="glass-card p-6 border-border/50"
            >
              <h3 className="text-lg font-semibold mb-4">Recent Activity</h3>
              <div className="space-y-4">
                {[
                  {
                    icon: Droplets,
                    title: "New Collection Recorded",
                    description: "John Doe - 45L Grade A milk",
                    time: "2 minutes ago",
                    color: "text-primary"
                  },
                  {
                    icon: Users,
                    title: "Farmer KYC Approved",
                    description: "Sarah Smith's documents verified",
                    time: "15 minutes ago",
                    color: "text-success"
                  },
                  {
                    icon: CreditCard,
                    title: "Payment Processed",
                    description: "$1,245 sent to 5 farmers",
                    time: "1 hour ago",
                    color: "text-warning"
                  },
                  {
                    icon: MapPin,
                    title: "Route Optimized",
                    description: "Daily route updated for efficiency",
                    time: "2 hours ago",
                    color: "text-accent"
                  },
                ].map((activity, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 * index }}
                    className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/20 transition-colors"
                  >
                    <div className={`p-2 rounded-lg bg-muted/20 ${activity.color}`}>
                      <activity.icon className="w-4 h-4" />
                    </div>
                    <div className="flex-1">
                      <p className="font-medium text-sm">{activity.title}</p>
                      <p className="text-xs text-muted-foreground">{activity.description}</p>
                      <p className="text-xs text-muted-foreground mt-1">{activity.time}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Quick Actions */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="glass-card p-6 border-border/50"
          >
            <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                {
                  title: "Add New Farmer",
                  description: "Register a new farmer to the system",
                  icon: Users,
                  color: "bg-gradient-primary",
                },
                {
                  title: "Record Collection",
                  description: "Log today's milk collection",
                  icon: Droplets,
                  color: "bg-gradient-secondary",
                },
                {
                  title: "Process Payments",
                  description: "Review and process pending payments",
                  icon: CreditCard,
                  color: "bg-gradient-accent",
                },
              ].map((action, index) => (
                <motion.button
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-4 rounded-xl border border-border/50 hover:border-primary/30 transition-all duration-200 text-left group"
                >
                  <div className={`w-10 h-10 rounded-lg ${action.color} flex items-center justify-center mb-3 group-hover:shadow-glow transition-all duration-200`}>
                    <action.icon className="w-5 h-5 text-white" />
                  </div>
                  <h4 className="font-medium mb-1">{action.title}</h4>
                  <p className="text-sm text-muted-foreground">{action.description}</p>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default Index;
