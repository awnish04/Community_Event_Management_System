import { createYoga } from "graphql-yoga"
import { createSchema } from "graphql-yoga"
import { typeDefs } from "@/lib/graphql/schema"
import { resolvers } from "@/lib/graphql/resolvers"

/**
 * GraphQL API Route
 * Demonstrates: GraphQL server setup with Next.js App Router
 */

// Create GraphQL schema
const schema = createSchema({
  typeDefs,
  resolvers,
})

// Create Yoga instance
const yoga = createYoga({
  schema,
  graphqlEndpoint: "/api/graphql",
  fetchAPI: { Response },

  // Context function - extract user from headers/session
  context: async ({ request }) => {
    // In production, verify JWT token from Authorization header
    // For now, we'll use a simple mock
    const authHeader = request.headers.get("authorization")

    if (authHeader && authHeader.startsWith("Bearer ")) {
      const token = authHeader.substring(7)

      // Mock token parsing (in production, use JWT verification)
      // Format: "fake-jwt-token-{userId}"
      if (token.startsWith("fake-jwt-token-")) {
        const userId = parseInt(token.replace("fake-jwt-token-", ""))

        // In production, fetch user from database
        return {
          user: {
            id: userId,
            email: "user@example.com",
            role: "user", // or "admin"
          },
        }
      }
    }

    return {}
  },
})

// Export handlers for Next.js App Router
export const GET = yoga
export const POST = yoga
