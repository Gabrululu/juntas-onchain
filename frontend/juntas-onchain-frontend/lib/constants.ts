// Direcciones de contrato por red
export const JUNTA_FACTORY_ADDRESS = {
  sepolia: "0x032cac202015AFe9932288798Fd0Cf9696c7C74d",
  baseSepolia: "0x321a83089B68c37c2E4Df60aC30b40330f03998",
  mantleSepolia: "0x321a83089B68c37c2E4Df60aC30b40330f03998"
};

// Devuelve la dirección del contrato según el chainId
export const getJuntaFactoryAddress = (chainId: number): `0x${string}` => {
  switch (chainId) {
    case 11155111: // Ethereum Sepolia
      return JUNTA_FACTORY_ADDRESS.sepolia as `0x${string}`;
    case 84532: // Base Sepolia
      return JUNTA_FACTORY_ADDRESS.baseSepolia as `0x${string}`;
    case 5003: // Mantle Sepolia
      return JUNTA_FACTORY_ADDRESS.mantleSepolia as `0x${string}`;
    default:
      throw new Error("Red no soportada");
  }
}; 