"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import UsersPage from "../users/page.js";
import UserTable from "../userTable.js";

// Create a QueryClient instance
const queryClient = new QueryClient();

export default function Home() {
  return (
    <QueryClientProvider client={queryClient}>
      <div>
        <UserTable />
      </div>
    </QueryClientProvider>
  );
}
