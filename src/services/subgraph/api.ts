import { BaseQueryApi, BaseQueryFn } from "@reduxjs/toolkit/dist/query/baseQueryTypes"
import { createApi } from "@reduxjs/toolkit/query/react"
import { ClientError, gql, GraphQLClient } from "graphql-request"
import { DocumentNode } from "graphql"
import { DEFAULT_CHAIN_ID } from "src/constants/chains"
import { ChainId } from "src/constants/chains"
import { AppState } from "src/store"

const SUBGRAPH_URLS: { [key: number]: string } = {
  [ChainId.BASE]:
    "https://api.studio.thegraph.com/query/83456/marginal-v1-base/version/latest",
  [ChainId.SEPOLIA]:
    "https://api.studio.thegraph.com/query/83456/marginal-v1-sepolia/version/latest",
  [ChainId.BERACHAIN_BARTIO]:
    "https://api.goldsky.com/api/public/project_clzskpdib2r6301oscaxh0lab/subgraphs/marginal-v1-bartio/1.0.2/gn",
  [ChainId.MAINNET]:
    "https://api.studio.thegraph.com/query/83456/marginal-v1-ethereum-mainnet/version/latest",
}

// Graphql query client wrapper that builds a dynamic url based on chain id
function graphqlRequestBaseQuery(): BaseQueryFn<
  { document: string | DocumentNode; variables?: any },
  unknown,
  Pick<ClientError, "name" | "message" | "stack">,
  Partial<Pick<ClientError, "request" | "response">>
> {
  return async ({ document, variables }, { getState }: BaseQueryApi) => {
    try {
      const chainId = (getState() as AppState).application.chainId

      const subgraphUrl = chainId
        ? SUBGRAPH_URLS[chainId]
        : SUBGRAPH_URLS[DEFAULT_CHAIN_ID]

      if (!subgraphUrl) {
        return {
          error: {
            name: "UnsupportedChainId",
            message: `Subgraph queries against ChainId ${chainId} are not supported.`,
            stack: "",
          },
        }
      }

      return {
        data: await new GraphQLClient(subgraphUrl).request(document, variables),
        meta: {},
      }
    } catch (error) {
      if (error instanceof ClientError) {
        const { name, message, stack, request, response } = error
        return { error: { name, message, stack }, meta: { request, response } }
      }
      throw error
    }
  }
}

export const api = createApi({
  baseQuery: graphqlRequestBaseQuery(),
  endpoints: () => ({}),
})
