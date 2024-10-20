export const getExplorerTransactionLink = (
  explorerUrl: string,
  transactionHash: string,
) => {
  return `${explorerUrl}/tx/${transactionHash}`
}
