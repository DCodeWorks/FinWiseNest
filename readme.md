## Development In Progress... 
# FinWiseNest 📈

A comprehensive personal finance and investment management platform, meticulously designed and engineered for the specifics of the Swiss financial market.

-----
## 🎯 The Problem

Investors in Switzerland navigate a unique and complex financial landscape. From tracking portfolios across multiple banks to planning retirement with Pillar 2 & 3 systems and optimizing for specific tax laws, generic financial tools fall short. `FinWiseNest` was built to address this gap, providing a single, powerful platform tailored for Swiss investors.

## ✨ Key Features

  * **📊 Unified Portfolio Dashboard:** Track and analyze investment performance, asset allocation, and overall net worth in one place.
  * **💸 Transaction Management:** Log all financial activities, including trades, dividends, and contributions, with precision.
  * **📈 Market Data Integration:** Real-time and historical market data to keep your portfolio up-to-date.
  * **🇨🇭 Swiss Pension Calculators:** Custom tools to model and optimize Pillar 2 & Pillar 3 retirement plans.
  * **🧾 Tax Optimization & Reporting:** Generate automated reports designed to help manage and minimize Swiss tax liabilities, compliant with local standards.
  * **🔐 Security & Compliance:** Built with data privacy at its core, ensuring GDPR and FINMA-compliant data handling.

## 🏛️ System Architecture

The application is built on a modern, scalable, and event-driven microservices architecture hosted entirely on Microsoft Azure. This design ensures high availability, resilience, and separation of concerns.

### Architectural Flow:

1.  **Authentication:** The end user interacts with the **Next.js/React** frontend. Authentication is handled securely by **Azure AD B2C**, which provides a bearer token upon successful login.
2.  **API Gateway:** All authenticated API calls from the frontend are routed through **Azure API Management**. This centralized gateway directs requests to the appropriate backend microservice.
3.  **Backend Microservices:** The core business logic is encapsulated in several **.NET 8** microservices, all running as containers on **Azure Kubernetes Service (AKS)**.
4.  **Data & Caching:**
      * When the `Portfolio Service` needs data, it first checks for "hot" data in **Azure Cache for Redis** for low-latency responses.
      * On a cache miss, it reads from the primary **Azure SQL DB**. The cache is then primed with the new data.
      * The `Transaction Service` writes to the SQL database and publishes an event to the service bus.
      * The `Market Data Service` fetches external data, storing time-series information in **Azure Cosmos DB** for its flexible schema and scalability.
5.  **Event-Driven Communication:** Microservices communicate asynchronously using **Azure Service Bus**. For example, when a new transaction is created, the `Transaction Service` publishes an event that other services, like the `Portfolio Service`, can consume to update their state.
6.  **Reporting & Storage:** The `Swiss Hub Service` generates complex PDF reports (e.g., for tax purposes) which are stored securely in **Azure Blob Storage**.

## 🛠️ Tech Stack

### Frontend

### Backend

### Cloud & DevOps

## 🚀 Getting Started

### Prerequisites

  * [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
  * [Node.js](https://nodejs.org/) (v18 or later)
  * [Docker Desktop](https://www.docker.com/products/docker-desktop)
  * An Azure subscription and the [Azure CLI](https://docs.microsoft.com/en-us/cli/azure/install-azure-cli)

### Installation

1.  **Clone the repository:**

    ```bash
    git clone https://github.com/DCodeWorks/FinWiseNest.git
    cd FinWiseNest
    ```

2.  **Configure Backend:**

      * Navigate to the backend solution directory.
      * Set up your secrets management (e.g., using `dotnet user-secrets`) to provide connection strings for Azure services.
      * Run the database migrations.
      * Build and run the services.

3.  **Configure Frontend:**

      * Navigate to the frontend directory: `cd frontend`
      * Install dependencies:
        ```bash
        npm install
        ```
      * Create a `.env.local` file and provide the necessary Azure AD B2C configuration values and the API endpoint for your backend.
      * Start the development server:
        ```bash
        npm run dev
        ```

## 🔮 Future Improvements

  * [ ] AI-driven investment recommendations using Azure Machine Learning.
  * [ ] Integration with more Swiss financial institutions (banks, pension providers) via APIs.
  * [ ] Mobile applications for iOS and Android.
  * [ ] Multi-language support (German, French, Italian).
