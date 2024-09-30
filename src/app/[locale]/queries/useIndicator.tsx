import indicatorApiRequest from "@/apiRequests/indicator";
import { DashboardIndicatorQueryParamsType } from "@/schemaValidations/indicator.schema";
import { useQuery } from "@tanstack/react-query"

export const useIndicatorDashboard = (queryParams: DashboardIndicatorQueryParamsType) => {
    return useQuery({
      queryKey: ["dashboardIndicators", queryParams],
      queryFn: () => indicatorApiRequest.getDashboardIndicator(queryParams),
    });
  };