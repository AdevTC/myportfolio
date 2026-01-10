import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function useGithubStats() {
    const { data, error, isLoading } = useSWR(
        "https://api.github.com/users/AdevTC",
        fetcher,
        {
            revalidateOnFocus: false,
            revalidateIfStale: false, // Don't spam GitHub API
        }
    );

    return {
        user: data,
        isLoading,
        isError: error,
    };
}
