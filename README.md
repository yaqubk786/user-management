# User Management App

A user management web application that allows searching, filtering, sorting, and paginating user data fetched from an API.

## Features

- **Global Search**: Search across all columns.
- **Column-wise Filtering**: Filter specific columns (e.g., Name, Email, Location).
- **Sorting**: Sort by Name, Email, or Location.
- **Pagination**: Navigate through user data with pagination.

## Technologies Used

- **Next.js**: A React framework for building static and dynamic websites.
- **TanStack Query (formerly React Query)**: A data fetching and caching library.
- **TanStack Table**: A headless table library for creating flexible tables with sorting, filtering, and pagination.
- **React**: A JavaScript library for building user interfaces.
- **Tailwind CSS**: A utility-first CSS framework for creating modern UIs.

## Project Setup

### Prerequisites

- Node.js (>= v14.0.0)
- npm or yarn (for managing dependencies)

### Steps to Run Locally

1. **Clone the repository**:
   ```bash
   git clone https://github.com/your-username/user-management-app.git

Approach
The project was developed using Next.js for server-side rendering and static generation.
TanStack Query is used to fetch data from an API (https://randomuser.me) and handle pagination, with the state management of the queries handled by the library itself.
TanStack Table is employed to manage the display and functionality of the table, including sorting, filtering, and pagination.
Tailwind CSS was used to style the UI, which provides a modern and responsive layout.
React Suspense was integrated to handle asynchronous data fetching, ensuring smooth client-side rendering without blocking the UI.
The useSearchParams hook from Next.js was utilized to manage pagination and query parameters in the URL for better user navigation.


Challenges Faced
Handling Query Parameters:

The biggest challenge was correctly synchronizing the pagination with the URL query parameters using useSearchParams. This ensures that when the user navigates between pages, the correct page number is reflected in the URL, and the data fetches accordingly.
Suspense Boundary:

Another challenge was dealing with the error related to useSearchParams not being wrapped in a Suspense boundary. I had to ensure that useSearchParams was called within a Suspense wrapper to avoid client-side errors related to missing Suspense boundaries.
UI and Responsiveness:

Tailwind CSS was used to create a responsive UI. However, making sure that the table layout works well on all screen sizes, especially for pagination and sorting features, required fine-tuning of styles and ensuring that the table was scrollable when necessary.