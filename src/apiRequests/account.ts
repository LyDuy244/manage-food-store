import http from "@/lib/http";
import { AccountListResType, AccountResType, ChangePasswordBodyType, ChangePasswordV2BodyType, ChangePasswordV2ResType, CreateEmployeeAccountBodyType, CreateGuestBodyType, CreateGuestResType, GetGuestListQueryParamsType, GetListGuestsResType, UpdateEmployeeAccountBodyType, UpdateMeBodyType } from "@/schemaValidations/account.schema";
import queryString from "query-string";

const accountApiRequest = {
    me: () => http.get<AccountResType>("/accounts/me"),
    sMe: (accessToken: string) => http.get<AccountResType>("/accounts/me", {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }),
    updateMe: (body: UpdateMeBodyType) => http.put<AccountResType>("/accounts/me", body),
    changePassword: (body: ChangePasswordBodyType) => http.put<AccountResType>("/accounts/change-password", body),
    sChangePasswordV2: (accessToken: string, body: ChangePasswordV2BodyType) => http.put<ChangePasswordV2ResType>(`/accounts/change-password-v2`, body, {
        headers: {
            Authorization: `Bearer ${accessToken}`
        }
    }),
    changePasswordV2: (body: ChangePasswordV2BodyType) => http.put<ChangePasswordV2ResType>("/api/accounts/change-password-v2", body, {
        baseUrl: ""
    }),
    list: () => http.get<AccountListResType>("/accounts"),
    addEmployee: (body: CreateEmployeeAccountBodyType) => http.post<AccountResType>("/accounts", body),
    updateEmployee: (id: number, body: UpdateEmployeeAccountBodyType) => http.put<AccountResType>(`/accounts/detail/${id}`, body),
    getEmployee: (id: number) => http.get<AccountResType>(`/accounts/detail/${id}`),
    deleteEmployee: (id: number) => http.delete<AccountResType>(`/accounts/detail/${id}`),
    guestList: (queryParams: GetGuestListQueryParamsType) =>
        http.get<GetListGuestsResType>(
            `/accounts/guests?` +
            queryString.stringify({
                fromDate: queryParams.fromDate?.toISOString(),
                toDate: queryParams.toDate?.toISOString()
            })
        ),
    createGuest: (body: CreateGuestBodyType) =>
        http.post<CreateGuestResType>(`/accounts/guests`, body)
}
export default accountApiRequest;