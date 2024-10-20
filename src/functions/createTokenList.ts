import { TokenFromList } from "../state/lists/tokenFromList"
import { TokenInfo } from "@uniswap/token-lists"
import { Token as TokenType } from "@uniswap/sdk-core"

export function createTokenList(tokens: { [address: string]: TokenType }): TokenInfo[] {
  const tokenList: TokenInfo[] = []

  for (const address in tokens) {
    if (Object.prototype.hasOwnProperty.call(tokens, address)) {
      const token = tokens[address] as TokenFromList
      tokenList.push(token.tokenInfo)
    }
  }

  return tokenList
}
