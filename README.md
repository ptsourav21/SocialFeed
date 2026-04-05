# SocialFeed

**SocialFeed** is a high-performance, secure, and scalable social media application. Built with a "Security-First" mindset, this project demonstrates the implementation of **Clean Architecture** and defensive programming using the latest **.NET 9** and **React Vite** ecosystems.

---

## Architectural Framework

The system is built using a **Decoupled Layered Architecture**, ensuring that business logic remains independent of the UI and database implementation. This separation of concerns allows for high maintainability and unit-testability.

### The Service-Data Access Pattern
To avoid "Fat Controllers" and ensure a single source of truth for business rules, the application follows a strict request flow:
* **Controller Layer**: Slim entry points focused on routing, model validation, and returning appropriate HTTP status codes.
* **Service Layer (`IService`)**: Houses the core business logic, permission checks, and data transformation between entities and DTOs.
* **Data Access Layer (DA)**: Manages database interactions using **EF Core**. It abstracts the complexity of SQL queries away from the business logic.
* **Dependency Injection (DI)**: Every component is registered in the .NET IoC container, facilitating loose coupling and making modules easily swappable.
* **BaseObject Inheritance**: All database entities (User, Post, Comment) inherit from a centralized `BaseObject`. This ensures every table follows a consistent schema including `ID` (Guid), `CreatedTime`, `CreatedBy`, and `Status` (Enum).

---

## Tech Stack & Engineering Tools

| Component | Technology | Role |
| :--- | :--- | :--- |
| **Backend** | **.NET 9** | The latest evolution of the .NET runtime, optimized for speed and modern C# features. |
| **ORM** | **EF Core** | An advanced object-relational mapper for handling **MSSQL** migrations and queries. |
| **Database** | **MSSQL** | An enterprise-ready relational database for managing complex social data structures. |
| **Frontend** | **React (Vite)** | A modern frontend environment providing near-instant hot module replacement (HMR). |
| **Language** | **TypeScript** | Strict typing across the frontend to prevent runtime errors and improve developer productivity. |
| **Images** | **ImgBB API** | Cloud-based image hosting to keep the database lightweight and improve load times. |

---

## Security Hardening (Defense-in-Depth)

A primary goal of this project was to implement industry-standard security measures to protect user data and infrastructure.

### 1. Identity & Cryptography
* **BCrypt Password Hashing**: User credentials undergo one-way cryptographic hashing using the BCrypt algorithm. This ensures that even in the event of a database breach, plain-text passwords remain unrecoverable.
* **JWT with HMACSHA256**: Authentication is handled via stateless JSON Web Tokens (JWT) signed using the **HS256** (HMAC with SHA-256) algorithm for secure identity verification.
* **Appsettings Encryption**: Sensitive configuration data, including API keys and connection strings, are stored in an encrypted format within `appsettings.json` to prevent accidental exposure.

### 2. Defensive Traffic Management
* **Rate Limiting**: Protects the API from brute-force authentication attempts and Denial of Service (DoS) attacks by restricting request frequency per client.
* **CORS Policies**: Strict Cross-Origin Resource Sharing rules are configured to ensure the API only accepts requests from the verified React Vite origin.
* **Security Headers**: Automated injection of **HSTS**, **X-Content-Type-Options**, and **Content Security Policy (CSP)** to harden the browser's execution environment.

### 3. Application-Level Protection
* **Antiforgery (XSRF)**: The system validates unique secret tokens on every sensitive request (POST/PUT/DELETE) to prevent Cross-Site Request Forgery and session hijacking.
* **Strong Password Enforcement**: Strict validation logic implemented on both Frontend and Backend via Regex. Accounts are only created if they meet the following requirements:
    * Minimum 8 characters.
    * At least one uppercase and one lowercase letter.
    * At least one numeric digit and one special character (`@$!%*?&`).

---

## Detailed Feature Set

### Content & Privacy Logic
The application utilizes a sophisticated permission system for user content:
* **Privacy Toggle**: Every post can be set to **Public** or **Private**.
* **Data Isolation**: The Backend DA layer filters queries so that private posts are strictly excluded from the global feed unless the requesting user is the owner.
* **Optimistic UI**: Likes and comments are updated instantly on the frontend using React state, with background synchronization to the server for a "zero-lag" feel.

### Advanced Social UI
* **Facepile Engagement**: A modern engagement bar that displays overlapping avatars for the first 3 likers. If a post has more than 3 likes, a dynamic "+N" counter is generated to show the total remaining engagement.
* **Recursive Conversations**: The commenting system supports nested "Replies," allowing users to build deep conversation threads. This is handled by a self-referencing relationship in the SQL schema.

---

## Engineering Roadmap & Scalability

The project is architected to transition from a single-server instance to a distributed system handling millions of records.

### Phase 1: Current Implementation
* Clean Architecture & Dependency Injection (IService/DA Layer).
* BCrypt Hashing & JWT HS256 Authentication.
* Antiforgery, Rate Limiting, and Security Header injection.
* Appsettings Encryption and BaseObject schema consistency.
* Real-time "Strong Password" validation and Privacy Toggles.

### Phase 2: Planned Scalability Upgrades
* **Cursor-Based Pagination**: Moving from offset-based (`Skip`/`Take`) to cursor-based fetching (using `AfterID`) to maintain performance at millions of rows.
* **Distributed Caching (Redis)**: Storing "hot" feed data in memory to reduce the read-load on the MSSQL database by up to 90%.
* **Database Indexing**: Implementing non-clustered indexes on high-traffic columns such as `CreatedTime`, `UserId`, and `Status`.
* **Frontend Virtualization**: Integrating `react-window` to only render DOM elements currently within the user's viewport.

---

## Installation & Local Setup

### Backend (.NET 9)
1. Open the solution in **Visual Studio 2022**.
2. Update the SQL Server connection string in `appsettings.json`.
3. Open the Package Manager Console and run: `Update-Database`.
4. Press **F5** to launch the API and view the Swagger documentation.

### Frontend (Vite)
1. Navigate to the client directory: `cd SocialFeed.ReactUI`.
2. Install dependencies: `npm install`.
3. Start the development server: `npm run dev`.

---

> **Professional Note:** This project serves as a showcase of **production-ready standards**. Every architectural decision was made to ensure the system is secure, maintainable, and prepared for enterprise-level growth.
