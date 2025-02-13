import {
  MutationFunction,
  MutationKey,
  useMutation,
  useQueryClient,
  useMutationState,
} from "@tanstack/react-query";
import { toast } from "sonner";

export const useMutationData = (
  mutationKey: MutationKey,
  mutationFn: MutationFunction<any, any>,
  queryKeys?: string[][],
  onSuccess?: () => void
) => {
  const client = useQueryClient();
  const { mutate, isPending } = useMutation({
    mutationKey,
    mutationFn,
    onSuccess(data) {
      if (onSuccess) onSuccess();

      return toast(
        data?.status === 200 || data?.status === 201 ? "Success" : "Error",
        {
          description: data?.message,
        }
      );
    },
    onSettled: async () => {
      if (queryKeys && queryKeys[0]) {
        await client.invalidateQueries({
          queryKey: queryKeys[0],
          exact: true,
        });
      }

      if (queryKeys && queryKeys[1]) {
        await client.invalidateQueries({
          queryKey: queryKeys[1],
          exact: true,
        });
      }
    },
  });

  return { mutate, isPending };
};

export const useMutationDataState = (mutationKey: MutationKey) => {
  const data = useMutationState({
    filters: { mutationKey },
    select: (mutation) => {
      return {
        variables: mutation.state.variables as any,
        status: mutation.state.status,
      };
    },
  });

  const latestVariables = data[data.length - 1];
  return { latestVariables };
};
