# Deskline - Support Ticket CRM

This is my submission for the Support CRM assignment. It's a MERN app
(MongoDB, Express, React, Node) for logging and tracking customer support
tickets - create a ticket, search/filter the list, open one up, change its
status, leave notes.

```
backend/    Express API + MongoDB
frontend/   React (Vite) + Tailwind
```
## Technical Approach & Architecture

Built using the MERN stack:

* **Frontend:** React.js, Tailwind CSS
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose
* **API:** REST API with Axios

Architecture:

```text
React → Express REST API → Mongoose → MongoDB
```

The application uses a simple separation of frontend, routes, controllers, and database models.

## Key Features

* Create support tickets with customer details
* Automatic ticket ID and timestamps
* Search and filter tickets by status
* View detailed ticket information
* Update ticket status
* Add ticket notes/activity
* Responsive and user-friendly UI
* Loading and error handling

## Challenges & Solutions

* **Frontend–Backend Integration:** Connected React with Express REST APIs using Axios.
* **Ticket ID Generation:** Implemented automatic unique ticket IDs.
* **Search & Filtering:** Added API-based search and status filtering.
* **State Synchronization:** Updated/refreshed ticket data after status and note changes.
* **Deployment:** Used environment variables for production API and database configuration.

## Future Improvements

* Authentication and role-based access
* Ticket assignment and priority
* Pagination and analytics
* Email notifications

