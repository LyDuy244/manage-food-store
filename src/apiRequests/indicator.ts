import http from "@/lib/http";
import { DashboardIndicatorQueryParamsType, DashboardIndicatorResType } from "@/schemaValidations/indicator.schema";
import queryString from "query-string";

const indicatorApiRequest = {
    getDashboardIndicator: (queryParams: DashboardIndicatorQueryParamsType) => http.get<DashboardIndicatorResType>('/indicators/dashboard?' + queryString.stringify({
        toDate: queryParams.toDate?.toISOString(),
        fromDate: queryParams.fromDate?.toISOString()
    })),
}

export default indicatorApiRequest