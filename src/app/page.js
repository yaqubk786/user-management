'use client'; 

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import UserTable from './userTable'; // Adjust path as necessary
import UsersPage from './users/page';

// Create a QueryClient instance
const queryClient = new QueryClient();

export default function Home() {
  return (
    // Provide the QueryClient instance to your application
    <QueryClientProvider client={queryClient}>
      <div>
        <h1>User Management</h1>
        {/* <UserTable /> */}
        <UsersPage/>
      </div>
    </QueryClientProvider>
  );
}
