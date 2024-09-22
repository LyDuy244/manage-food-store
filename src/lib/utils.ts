import authApiRequest from "@/apiRequests/auth"
import { toast } from "@/hooks/use-toast"
import { EntityError } from "@/lib/http"
import { clsx, type ClassValue } from "clsx"
import { UseFormSetError } from "react-hook-form"
import { twMerge } from "tailwind-merge"
import jwt from "jsonwebtoken";
import { DishStatus, OrderStatus, TableStatus } from "@/constants/type"
import envConfig from "@/config"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
export const handleErrorApi = ({
  error,
  setError,
  duration
}: {
  error: any
  setError?: UseFormSetError<any>
  duration?: number
}) => {
  if (error instanceof EntityError && setError) {
    error.payload.errors.forEach((item) => {
      setError(item.field, {
        type: 'server',
        message: item.message
      })
    })
  } else {
    toast({
      title: 'Lỗi',
      description: error?.payload?.message ?? 'Lỗi không xác định',
      variant: 'destructive',
      duration: duration ?? 5000
    })
  }
}
/**
 * Xóa đi ký tự `/` đầu tiên của path
 */
export const normalizePath = (path: string) => {
  return path.startsWith('/') ? path.slice(1) : path
}
const isBrowser = typeof window !== "undefined";
export const getAccessTokenFromLocalStorage = () => isBrowser ? localStorage.getItem("accessToken") : null;
export const getRefreshTokenFromLocalStorage = () => isBrowser ? localStorage.getItem("refreshToken") : null;
export const setAccessTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem("accessToken", value)
export const setRefreshTokenToLocalStorage = (value: string) => isBrowser && localStorage.setItem("refreshToken", value)
export const removeTokensFromLocalStorage = () => {
  isBrowser && localStorage.removeItem("accessToken")
  isBrowser && localStorage.removeItem("refreshToken")
}

export const checkAndRefreshToken = async (param?: {
  onError?: () => void,
  onSuccess?: () => void
}) => {
  // Không nên đưa logic lấy access và refresh token ra khỏi function checkAndRefreshToken
  // vì để mỗi lần được gọi thì ta sẽ có 1 access và refresh token mới
  // Tránh hiện tượng bug lấy access và refresh token cũ ở lần đầu gọi cho các lần tiếp theo
  const accessToken = getAccessTokenFromLocalStorage();
  const refreshToken = getRefreshTokenFromLocalStorage();
  // chưa đăng nhập thì cũng không cho chạy vào function
  if (!accessToken || !refreshToken) {
    return;
  }

  const decodeAccessToken = jwt.decode(accessToken) as {
    exp: number;
    iat: number;
  };
  const decodeRefreshToken = jwt.decode(refreshToken) as {
    exp: number;
    iat: number;
  };
  //   Thời điểm hết hạn của token tính theo epoch time (s)
  // Còn khi dùng cú pháp new Date() thì sẽ trả về (ml)
  const now = (new Date().getTime() / 1000) - 1;
  //   trường hợp refresh token hết hạn thì không xử lý
  if (decodeRefreshToken.exp <= now) {
    removeTokensFromLocalStorage();
    return param?.onError && param?.onError();
  };
  //   Ví dụ access token có thời gian hết hạn là 10s
  // thì mình sẽ kiểm tra còn 1/3 thời gian (3s) thì mình sẽ cho refresh token lại
  // thời gian còn lại sẽ tính dựa trên công thức decodeAccessToken.exp - now
  // thời gian hết hạn của accessToken dưa trên công thức decodeAccessToken.exp - decodeAccessToken.iat
  if (
    decodeAccessToken.exp - now <
    (decodeAccessToken.exp - decodeAccessToken.iat) / 3
  ) {
    // Gọi API refresh token
    try {
      const res = await authApiRequest.refreshToken();
      setAccessTokenToLocalStorage(res.payload.data.accessToken);
      setRefreshTokenToLocalStorage(res.payload.data.refreshToken);
      param?.onSuccess && param?.onSuccess();

    } catch (error) {
      param?.onError && param?.onError();
    }
  }
};
export const formatCurrency = (number: number) => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND'
  }).format(number)
}

export const getVietnameseDishStatus = (status: (typeof DishStatus)[keyof typeof DishStatus]) => {
  switch (status) {
    case DishStatus.Available:
      return 'Có sẵn'
    case DishStatus.Unavailable:
      return 'Không có sẵn'
    default:
      return 'Ẩn'
  }
}

export const getVietnameseOrderStatus = (status: (typeof OrderStatus)[keyof typeof OrderStatus]) => {
  switch (status) {
    case OrderStatus.Delivered:
      return 'Đã phục vụ'
    case OrderStatus.Paid:
      return 'Đã thanh toán'
    case OrderStatus.Pending:
      return 'Chờ xử lý'
    case OrderStatus.Processing:
      return 'Đang nấu'
    default:
      return 'Từ chối'
  }
}

export const getVietnameseTableStatus = (status: (typeof TableStatus)[keyof typeof TableStatus]) => {
  switch (status) {
    case TableStatus.Available:
      return 'Có sẵn'
    case TableStatus.Reserved:
      return 'Đã đặt'
    default:
      return 'Ẩn'
  }
}

export const getTableLink = ({ token, tableNumber }: { token: string; tableNumber: number }) => {
  return envConfig.NEXT_PUBLIC_URL + '/tables/' + tableNumber + '?token=' + token
}
