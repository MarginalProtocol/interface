import { CodegenConfig } from "@graphql-codegen/cli"

const config: CodegenConfig = {
  overwrite: true,
  documents: "./src/graphql/*.graphql",
  schema:
    "https://api.studio.thegraph.com/query/83456/marginal-v1-ethereum-mainnet/version/latest",
  generates: {
    "src/services/subgraph/generated.ts": {
      plugins: [
        "typescript",
        "typescript-operations",
        {
          "typescript-rtk-query": {
            importBaseApiFrom: "./api",
            exportHooks: true,
          },
        },
      ],
      hooks: {
        afterOneFileWrite: ["prettier --write"],
      },
    },
  },
}

export default config
