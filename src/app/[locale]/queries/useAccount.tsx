import accountApiRequest from "@/apiRequests/account";
import {
  AccountResType,
  GetGuestListQueryParamsType,
  UpdateEmployeeAccountBodyType,
} from "@/schemaValidations/account.schema";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export const useAccountMe = () => {
  return useQuery({
    queryKey: ["account-me"],
    queryFn: accountApiRequest.me,
  });
};
// export const useAccountMe = (
//   onSuccess?: (data: AccountResType) => void
// ) => {
//   return useQuery({
//     queryKey: ["account-profile"],
//     queryFn: () =>
//       accountApiRequest.me().then((res) => {
//         onSuccess && onSuccess(res.payload);
//         return res;
//       }),
//   });
// };

export const useUpdateMeMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.updateMe,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.changePassword,
  });
};

export const useGetAccountList = () => {
  return useQuery({
    queryKey: ["accounts"],
    queryFn: accountApiRequest.list,
  });
};

export const useGetAccount = ({
  id,
  enabled,
}: {
  id: number;
  enabled: boolean;
}) => {
  return useQuery({
    queryKey: ["account", id],
    queryFn: () => accountApiRequest.getEmployee(id),
    enabled,
  });
};

export const useAddAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApiRequest.addEmployee,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};

export const useUpdateAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      ...body
    }: UpdateEmployeeAccountBodyType & { id: number }) =>
      accountApiRequest.updateEmployee(id, body),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};

export const useDeleteAccountMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: accountApiRequest.deleteEmployee,

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["accounts"],
      });
    },
  });
};

export const useGetGuestListQuery = (
  queryParams: GetGuestListQueryParamsType
) => {
  return useQuery({
    queryKey: ["orders", queryParams],
    queryFn: () => accountApiRequest.guestList(queryParams),
  });
};

export const useCreateGuestMutation = () => {
  return useMutation({
    mutationFn: accountApiRequest.createGuest,
  });
};