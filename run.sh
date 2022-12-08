#/bin/sh

# npx hardhat --network fuji deploy --tags ExampleBasedOFT
# npx hardhat --network goerli deploy --tags ExampleOFT

# npx hardhat --network fuji setTrustedRemote --target-network goerli
# npx hardhat --network goerli setTrustedRemote --target-network fuji

# npx hardhat --network goerli sendRequestCrossChain --target-network fuji --amount 0.000001
# npx hardhat --network fuji answerRequestFunds --target-network goerli





npx hardhat --network goerli deploy --tags ExampleBasedOFT
npx hardhat --network fuji deploy --tags ExampleOFT

npx hardhat --network goerli setTrustedRemote --target-network fuji --local-contract ExampleBasedOFT --remote-contract ExampleOFT
npx hardhat --network fuji setTrustedRemote --target-network goerli --local-contract ExampleOFT --remote-contract ExampleBasedOFT

# npx hardhat --network fuji sendRequestCrossChain --target-network goerli --amount 0.000001
# npx hardhat --network goerli answerRequestFunds --target-network fuji
