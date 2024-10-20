import { useContractRead } from "wagmi"
import { V1_ORACLE_ADDRESS } from "../constants/addresses"
import marginalV1OracleAbi from "../abis/MarginalV1Oracle.json"
import { isListDefined } from "../utils/isListDefined"

export const useLiquidationPrice = (
  chainId: number,
  zeroForOne?: boolean,
  size?: bigint,
  debt?: bigint,
  margin?: bigint,
  maintenance?: string,
) => {
  const isValidProps = isListDefined([zeroForOne, size, debt, margin, maintenance])

  const { data } = useContractRead({
    address: V1_ORACLE_ADDRESS[chainId],
    abi: marginalV1OracleAbi,
    args: [zeroForOne, size, debt, margin, maintenance],
    functionName: "liquidationSqrtPriceX96",
    enabled: isValidProps,
  })
  
  return data ? data.toString() : undefined
}
