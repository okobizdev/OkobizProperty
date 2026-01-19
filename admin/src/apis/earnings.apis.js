import axiosClient from "../configs/axios.config";

// Fetch all earnings with optional date range and filters
export const fetchAllEarnings = async (from, to, filters = {}) => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  if (filters.transactionType) params.transactionType = filters.transactionType;
  if (filters.paymentStatus) params.paymentStatus = filters.paymentStatus;
  if (filters.propertyId) params.propertyId = filters.propertyId;
  return axiosClient.get("/earnings", { params });
};

// Fetch comprehensive earnings summary with business insights
export const fetchEarningsSummary = async (from, to) => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  return axiosClient.get("/earnings/summary", { params });
};

// Fetch earnings analytics for business insights
export const fetchEarningsAnalytics = async (from, to) => {
  const params = {};
  if (from) params.from = from;
  if (to) params.to = to;
  
  const [summary, earnings] = await Promise.all([
    axiosClient.get("/earnings/summary", { params }),
    axiosClient.get("/earnings", { params })
  ]);

  const earningsData = earnings.data;
  
  // Calculate business metrics
  const analytics = {
    summary: summary.data,
    profitMargin: summary.data.totalRevenue > 0 ? 
      ((summary.data.totalProfit / summary.data.totalRevenue) * 100).toFixed(2) : 0,
    averageTransactionValue: summary.data.count > 0 ? 
      (summary.data.totalRevenue / summary.data.count).toFixed(2) : 0,
    revenueGrowth: 0, // Will be calculated with historical data
    topPerformingProperties: getTopPerformingProperties(earningsData),
    transactionTypeBreakdown: getTransactionTypeBreakdown(earningsData),
    monthlyTrends: getMonthlyTrends(earningsData),
    paymentStatusDistribution: getPaymentStatusDistribution(earningsData),
    profitabilityInsights: getProfitabilityInsights(earningsData)
  };

  return { data: analytics };
};

// Helper functions for analytics
const getTopPerformingProperties = (earnings) => {
  const propertyStats = {};
  
  earnings.forEach(earning => {
    const propertyId = earning.property?._id || earning.property;
    const propertyTitle = earning.property?.title || 'Unknown Property';
    
    if (!propertyStats[propertyId]) {
      propertyStats[propertyId] = {
        id: propertyId,
        title: propertyTitle,
        totalRevenue: 0,
        totalProfit: 0,
        totalCost: 0,
        transactionCount: 0
      };
    }
    
    propertyStats[propertyId].totalRevenue += earning.revenue;
    propertyStats[propertyId].totalProfit += earning.profit;
    propertyStats[propertyId].totalCost += earning.cost;
    propertyStats[propertyId].transactionCount += 1;
  });
  
  return Object.values(propertyStats)
    .sort((a, b) => b.totalProfit - a.totalProfit)
    .slice(0, 5);
};

const getTransactionTypeBreakdown = (earnings) => {
  const breakdown = {};
  
  earnings.forEach(earning => {
    const type = earning.transactionType;
    if (!breakdown[type]) {
      breakdown[type] = {
        count: 0,
        totalRevenue: 0,
        totalProfit: 0,
        averageValue: 0
      };
    }
    breakdown[type].count += 1;
    breakdown[type].totalRevenue += earning.revenue;
    breakdown[type].totalProfit += earning.profit;
  });
  
  Object.keys(breakdown).forEach(type => {
    breakdown[type].averageValue = breakdown[type].totalRevenue / breakdown[type].count;
  });
  
  return breakdown;
};

const getMonthlyTrends = (earnings) => {
  const monthlyData = {};
  
  earnings.forEach(earning => {
    const date = new Date(earning.transactionDate);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    
    if (!monthlyData[monthKey]) {
      monthlyData[monthKey] = {
        month: monthKey,
        revenue: 0,
        profit: 0,
        cost: 0,
        transactions: 0
      };
    }
    
    monthlyData[monthKey].revenue += earning.revenue;
    monthlyData[monthKey].profit += earning.profit;
    monthlyData[monthKey].cost += earning.cost;
    monthlyData[monthKey].transactions += 1;
  });
  
  return Object.values(monthlyData).sort((a, b) => a.month.localeCompare(b.month));
};

const getPaymentStatusDistribution = (earnings) => {
  const distribution = {};
  
  earnings.forEach(earning => {
    const status = earning.paymentStatus;
    if (!distribution[status]) {
      distribution[status] = {
        count: 0,
        totalAmount: 0
      };
    }
    distribution[status].count += 1;
    distribution[status].totalAmount += earning.revenue;
  });
  
  return distribution;
};

const getProfitabilityInsights = (earnings) => {
  const insights = {
    highestProfitTransaction: null,
    lowestProfitTransaction: null,
    averageProfitMargin: 0,
    unprofitableTransactions: 0,
    recommendations: []
  };
  
  if (earnings.length === 0) return insights;
  
  let totalProfitMargin = 0;
  
  earnings.forEach(earning => {
    const profitMargin = earning.revenue > 0 ? (earning.profit / earning.revenue) * 100 : 0;
    totalProfitMargin += profitMargin;
    
    if (!insights.highestProfitTransaction || earning.profit > insights.highestProfitTransaction.profit) {
      insights.highestProfitTransaction = earning;
    }
    
    if (!insights.lowestProfitTransaction || earning.profit < insights.lowestProfitTransaction.profit) {
      insights.lowestProfitTransaction = earning;
    }
    
    if (earning.profit < 0) {
      insights.unprofitableTransactions += 1;
    }
  });
  
  insights.averageProfitMargin = totalProfitMargin / earnings.length;
  
  // Generate recommendations
  if (insights.unprofitableTransactions > 0) {
    insights.recommendations.push(`You have ${insights.unprofitableTransactions} unprofitable transactions. Review costs for these properties.`);
  }
  
  if (insights.averageProfitMargin < 20) {
    insights.recommendations.push('Your average profit margin is below 20%. Consider optimizing costs or increasing pricing.');
  }
  
  return insights;
};
//fetch properties which has earnings

export const fetchPropertiesWhichHasEarnings = async () => {
  return axiosClient.get("/earnings/properties-with-earnings");
};

// Fetch earnings by property ID
export const fetchEarningsByPropertyId = async (propertyId) => {
  return axiosClient.get(`/earnings/property/${propertyId}`);
};

// Create a new earnings record
export const createEarnings = async (data) => {
  return axiosClient.post("/earnings", data);
};

// Update an earnings record by ID
export const updateEarnings = async (id, data) => {
  return axiosClient.put(`/earnings/${id}`, data);
};

// Delete an earnings record by ID
export const deleteEarnings = async (id) => {
  return axiosClient.delete(`/earnings/${id}`);
};