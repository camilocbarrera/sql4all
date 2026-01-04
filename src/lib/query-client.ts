import {
  defaultShouldDehydrateQuery,
  isServer,
  QueryClient,
} from "@tanstack/react-query";

function makeQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 60 * 1000, // 1 minute
        refetchOnWindowFocus: false,
      },
      dehydrate: {
        shouldDehydrateQuery: (query) =>
          defaultShouldDehydrateQuery(query) ||
          query.state.status === "pending",
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined;

export function getQueryClient() {
  if (isServer) {
    return makeQueryClient();
  }
  if (!browserQueryClient) {
    browserQueryClient = makeQueryClient();
  }
  return browserQueryClient;
}

// Query keys
export const queryKeys = {
  exercises: ["exercises"] as const,
  exercise: (id: string) => ["exercise", id] as const,
  userScore: (userId: string) => ["userScore", userId] as const,
  userStreak: (userId: string) => ["userStreak", userId] as const,
  weekProgress: (userId: string) => ["weekProgress", userId] as const,
  solvedExercises: (userId: string) => ["solvedExercises", userId] as const,
};
