import { searchUsers } from "@/actions/user";
import { useDebounce } from "./use-debounce";

import { useQuery } from "@tanstack/react-query";

export const useUserSearch = (searchQuery: string) => {
  const debouncedSearchQuery = useDebounce(searchQuery);

  const { data, isLoading } = useQuery({
    queryKey: ["users", debouncedSearchQuery],
    queryFn: () => searchUsers(debouncedSearchQuery),
    enabled: Boolean(debouncedSearchQuery),
  });

  return { users: data?.users || [], isLoading };
};
