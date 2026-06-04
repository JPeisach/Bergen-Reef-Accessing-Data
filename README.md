# Coral-Reef-Capstone

An [interactive web application](https://youtu.be/zMg2eBdIiAI?si=2iS7eD4Ko_oFpAut) that not only displays graphical representations of coral reef information, but also manages the data of the coral reef tanks. The application will be used in parallel with Apex Fusion in the lab, and displayed on TVS for viewers in the Makerspace.

## Technologies used:

- [Raspberry Pi](https://www.raspberrypi.org/), [Python](https://www.python.org/), [Cron-Job](https://cron-job.org/)
  The tech stack used to pull data from Apex Fusion in the Coral Reef Lab and push it to the server at regular intervals

- [xml2js](https://www.npmjs.com/package/xml2js)
  A package used to convert data from Apex Fusion from XML format to JSON format

- [MySQL Relational Database](https://www.mysql.com/)
  The database used to store data pulled from Apex Fusion

- [Drizzle](https://orm.drizzle.team/)
  An ORM used to query data from the database, chosen for its more lightweight and SQL-centric approach

- [HTML/JS/CSS](https://developer.mozilla.org/en-US/docs/Web/HTML) with [Tailwind CSS](https://tailwindcss.com/) framework
  The languages and framework used for visuals and styling within the UI

- [Headless UI (currently migrating away)](https://headlessui.dev/)
  A library used for building accessible menu components – works seamlessly with Tailwind CSS

- [daisyUI](https://daisyui.com)
  Library for common components. In progress of being used to replace Headless UI.

- [Heroicons](https://heroicons.com/)
  SVG icons that work well with Tailwind CSS

- [Next.js](https://nextjs.org/)
  A React framework used to build full stack web applications

- [Vercel](https://vercel.com/)
  A cloud platform used to deploy web applications – integrates seamlessly with Next.js
- [Recharts](https://recharts.org/), [D3](https://d3js.org/)
  The libraries used for creation of graphical visuals

- [AG Grid](https://www.ag-grid.com/)
  A library for handling large datasets, customizable rows, and pagination

- [flatpickr](https://reactdatepicker.com/)
  A React package used for date selection features, including datetime filtering
- [Auth0](https://auth0.com/)
  An authorization and authentication service

- [Axios](https://www.npmjs.com/package/axios)
  A promise-based HTTP client that simplifies making API requests in React application

### Previously Used
These were used in the 2025 Capstone project, but we're not focused on in the 2026 continuation.

- [Google Sheets](https://workspace.google.com/products/sheets/)
  Used for the database backup, with tabs to keep track of recenty backed-up data and soft-deleted data

- [Google App Scripts](https://developers.google.com/apps-script)
  Used alongside Google Sheets for database backups (not in sync with the Cron Job)

## Installation and Setup

### Prerequisites

- Node.js (v18 or higher)
- A MySQL server (reasonably new)
- Python 3.x (for Raspberry Pi scripts)
- Apex Fusion account with access to locally hosted (in the Bergen County Acadmies Makerspace) XML files
- Auth0 account and application setup

### Database Setup

You can use drizzle-kit's [tools](https://orm.drizzle.team/docs/kit-overview), which should be able to create SQL scripts for the schema and upload it to the database. Make sure you supply the DATABASE_URL env variable when running commands with drizzle-kit.

As for hosting: You can use Docker if self-hosting. On actual deployed instances, the DB needs to be publicly accessible.

### Environment Configuration

Create a `.env.local` file in the root directory with the following variables (with real values, do not include the single quotes):

```env
# Database Configuration
DATABASE_URL=mysql://user:password@localhost:3306/coral_reef_db

# Auth0 Configuration
APP_BASE_URL='http://localhost:3000'
AUTH0_CLIENT_ID='your-auth0-client-id'
AUTH0_CLIENT_SECRET='your-auth0-client-secret'
AUTH0_DOMAIN='your-auth0-domain'
AUTH0_SECRET='your-auth0-secret'
```

### Installation Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/jpeisach/Bergen-Reef-Accessing-Data.git
   cd Bergen-Reef-Accessing-Data
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Set up the Raspberry Pi data collection:
   - On the Raspberry Pi, clone the collection repository and enter the "raspi" directory:
     ```bash
     git clone https://github.com/jpeisach/Bergen-Reef-Accessing-Data.git
     cd Bergen-Reef-Accessing-Data/raspi
     ```
   - Configure the cron job to run the data collection script at regular intervals

4. Start the development server:
   ```bash
   npm run dev
   ```

### Additional Resources

- Database schema and models are located in `src/db`
- Package dependencies are managed through `package.json`

### Deployment

The application is deployed on Vercel @ [https://bergen-reef-accessing-data.vercel.app/](https://bergen-reef-accessing-data.vercel.app/)

### Third-Party Services

1. **Auth0**
   - Authentication and authorization service
   - Configuration required in Auth0 dashboard
   - Environment variables needed (see Environment Configuration)

2. **Apex Fusion**
   - API access required for data collection
   - Credentials needed in environment variables
   - Python scripts handle data collection and transformation

3. **Vercel**
   - Environment variables needed for database, Auth0

### Requirements Documentation

- Node.js dependencies are managed through `package.json`

### Configuration Files

- `.env.local` - Environment variables (see sample above)
- `next.config.js` - Next.js configuration
- `tailwind.config.js` - Tailwind CSS configuration
- `drizzle.config.ts` - Database ORM configuration

### Additional Notes

- The application requires a running MySQL server
- The Raspberry Pi must be configured with the correct network access to reach both Apex Fusion and the database server
- Database backups occur separately from the data pushed to the base
- The application is designed to be displayed on TVs in the Makerspace
- There is a TODO list of tasks for future improvements in TODO.md.
