import http from "@/lib/http";
import { GuestCreateOrdersBodyType } from "@/schemaValidations/guest.schema";
import { CreateOrdersBodyType, CreateOrdersResType, GetOrderDetailResType, GetOrdersQueryParamsType, GetOrdersResType, PayGuestOrdersBodyType, PayGuestOrdersResType, UpdateOrderBodyType, UpdateOrderResType } from "@/schemaValidations/order.schema";
import queryString from 'query-string';

const orderApiRequest = {
    createOrders: (body: CreateOrdersBodyType) => http.post<CreateOrdersResType>("/orders", body),
    getOrderList: (queryParams: GetOrdersQueryParamsType) => http.get<GetOrdersResType>('/orders?' + queryString.stringify({
        toDate: queryParams.toDate?.toISOString(),
        fromDate: queryParams.fromDate?.toISOString()
    })),
    updateOrder: (orderId: number, body: UpdateOrderBodyType) => http.put<UpdateOrderResType>(`/orders/${orderId}`, body),
    getOrdersDetails: (orderId: number) => http.get<GetOrderDetailResType>(`/orders/${orderId}`),
    pay: (body: PayGuestOrdersBodyType) => http.post<PayGuestOrdersResType>("/orders/pay", body)
}

export default orderApiRequest