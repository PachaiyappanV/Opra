import { QueryFunction, QueryKey, useQuery } from "@tanstack/react-query";

export const useQueryData = (queryKey: QueryKey, queryFn: QueryFunction) => {
  const { data, isPending, isFetched, isFetching, isLoading } = useQuery({
    queryKey,
    queryFn,
  });

  return { data, isPending, isFetched, isFetching, isLoading };
};
