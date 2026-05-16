/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * GraphQL Client
 * Demonstrates: Client-side GraphQL integration
 */

const GRAPHQL_ENDPOINT = "/api/graphql"

interface GraphQLResponse<T = any> {
  data?: T
  errors?: Array<{
    message: string
    extensions?: any
  }>
}

/**
 * GraphQL client for making queries and mutations
 */
export class GraphQLClient {
  private endpoint: string
  private token: string | null = null

  constructor(endpoint: string = GRAPHQL_ENDPOINT) {
    this.endpoint = endpoint
  }

  /**
   * Set authentication token
   */
  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("auth_token", token)
    }
  }

  /**
   * Get authentication token
   */
  getToken(): string | null {
    if (!this.token && typeof window !== "undefined") {
      this.token = localStorage.getItem("auth_token")
    }
    return this.token
  }

  /**
   * Clear authentication token
   */
  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("auth_token")
    }
  }

  /**
   * Execute a GraphQL query or mutation
   */
  async request<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    }

    const token = this.getToken()
    if (token) {
      headers["Authorization"] = `Bearer ${token}`
    }

    const response = await fetch(this.endpoint, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    })

    const result: GraphQLResponse<T> = await response.json()

    if (result.errors) {
      throw new GraphQLError(
        result.errors[0].message,
        result.errors[0].extensions
      )
    }

    return result.data as T
  }

  /**
   * Execute a query
   */
  async query<T = any>(
    query: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return this.request<T>(query, variables)
  }

  /**
   * Execute a mutation
   */
  async mutate<T = any>(
    mutation: string,
    variables?: Record<string, any>
  ): Promise<T> {
    return this.request<T>(mutation, variables)
  }
}

/**
 * Custom GraphQL Error class
 */
export class GraphQLError extends Error {
  extensions?: any

  constructor(message: string, extensions?: any) {
    super(message)
    this.name = "GraphQLError"
    this.extensions = extensions
  }
}

// Export singleton instance
export const graphqlClient = new GraphQLClient()
