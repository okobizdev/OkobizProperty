import React from "react";

const EarningsAnalytics = ({ analytics, formatCurrency }) => {
  if (!analytics) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Recommendations */}
      {analytics.profitabilityInsights?.recommendations && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Business Recommendations
          </h2>
          <div className="space-y-3">
            {analytics.profitabilityInsights.recommendations.map(
              (rec, index) => (
                <div
                  key={index}
                  className="flex items-start space-x-3 p-3 bg-primary-50 border border-yellow-200 rounded-lg"
                >
                  <div className="text-yellow-500 mt-0.5">💡</div>
                  <p className="text-sm text-primary">{rec}</p>
                </div>
              )
            )}
          </div>
        </div>
      )}

      {/* Performance Analysis */}
      {analytics.performanceAnalysis && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Performance Analysis
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Top Performing Categories
              </h3>
              <div className="space-y-2">
                {analytics.performanceAnalysis.topCategories?.map(
                  (category, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">
                        {category.name}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(category.revenue)}
                      </span>
                    </div>
                  )
                ) || (
                  <p className="text-sm text-gray-500">
                    No category data available
                  </p>
                )}
              </div>
            </div>
            <div>
              <h3 className="text-md font-medium text-gray-900 mb-3">
                Monthly Trends
              </h3>
              <div className="space-y-2">
                {analytics.performanceAnalysis.monthlyTrends?.map(
                  (trend, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center p-2 bg-gray-50 rounded"
                    >
                      <span className="text-sm text-gray-700">
                        {trend.month}
                      </span>
                      <span className="text-sm font-medium text-gray-900">
                        {formatCurrency(trend.revenue)}
                      </span>
                    </div>
                  )
                ) || (
                  <p className="text-sm text-gray-500">
                    No trend data available
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EarningsAnalytics;
