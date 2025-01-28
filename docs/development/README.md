# Development Guide

This guide will help you set up and run the ProjectX development environment.

## Prerequisites

- Docker and Docker Compose
- Node.js (v18 or higher)
- npm or yarn
- Stripe CLI (for webhook testing)
- ngrok (for webhook testing)

## Initial Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd projectx
```

2. Copy the environment file:
```bash
cp .env.example .env
```

3. Update the `.env` file with your credentials:
- `STRIPE_SECRET_KEY`: Your Stripe secret key
- `STRIPE_WEBHOOK_SECRET`: Your Stripe webhook signing secret
- `SENDGRID_API_KEY`: Your SendGrid API key
- Other configuration as needed

## Running the Project

### Using Docker Compose

1. Start all services:
```bash
docker-compose up
```

This will start:
- PostgreSQL database (port 5432)
- Temporal server (port 7233)
- Temporal UI (port 8080)
- Auth service (port 8081)
- Order service (port 8082)
- ngrok for webhook testing (port 4040)

2. View service status:
```bash
docker-compose ps
```

3. View logs:
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f order
```

### Development Workflow

1. Install dependencies:
```bash
npm install
```

2. Generate Prisma client:
```bash
npm run prisma:generate
```

3. Run database migrations:
```bash
npm run prisma:migrate
```

4. Start development servers:
```bash
# Auth service
npm run dev:auth

# Order service
npm run dev:order

# Web application
npm run dev:web
```

## Testing Stripe Webhooks

### Using ngrok

The project includes ngrok configuration in docker-compose.yml for webhook testing:

1. Get your ngrok authentication token from https://dashboard.ngrok.com
2. Add it to your .env file:
```
NGROK_AUTHTOKEN=your_token_here
```

3. Start the ngrok service:
```bash
docker-compose up ngrok-order
```

4. Get your webhook URL from ngrok UI (http://localhost:4040)

### Using Stripe CLI

1. Install Stripe CLI:
```bash
# macOS
brew install stripe/stripe-cli/stripe

# Windows
scoop install stripe
```

2. Login to Stripe:
```bash
stripe login
```

3. Forward webhooks to your local server:
```bash
stripe listen --forward-to localhost:8082/webhook
```

4. In another terminal, trigger webhook events:
```bash
# Test a successful payment
stripe trigger payment_intent.succeeded

# Test a failed payment
stripe trigger payment_intent.payment_failed
```

## Debugging

### Services

- Auth Service: http://localhost:8081/api
- Order Service: http://localhost:8082/api
- Temporal UI: http://localhost:8080
- ngrok Interface: http://localhost:4040

### Debug Ports

- Auth Service: 9229
- Order Service: 9230

To attach a debugger, use the following configurations in VS Code:

```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "node",
      "request": "attach",
      "name": "Debug Auth Service",
      "port": 9229
    },
    {
      "type": "node",
      "request": "attach",
      "name": "Debug Order Service",
      "port": 9230
    }
  ]
}
```

## Common Issues

### Database Connection

If you can't connect to the database:
1. Check if PostgreSQL container is running
2. Verify DATABASE_URL in .env
3. Try running migrations manually:
```bash
npm run prisma:migrate
```

### Webhook Testing

If webhooks are not being received:
1. Check ngrok URL in Stripe dashboard
2. Verify webhook secret in .env
3. Check Order service logs for errors
4. Use Stripe CLI to debug webhook delivery 