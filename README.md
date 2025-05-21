# 🪙 Juntas Onchain – Ahorro Comunitario Web3

**Juntas Onchain** es un sistema de ahorro comunitario basado en contratos inteligentes que digitaliza las tradicionales "juntas" peruanas (también conocidas como ROSCAs o panderos), ofreciendo seguridad, transparencia y recompensas gracias a Web3.

## 📋 Tabla de Contenidos
- [Objetivo](#-objetivo)
- [Características](#-características-principales)
- [Estructura del Proyecto](#-estructura-del-proyecto)
- [Tecnologías](#-tecnologías-utilizadas)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Despliegue](#-despliegue)
- [Uso](#-uso)
- [Contribución](#-contribución)
- [Licencia](#-licencia)
- [Contacto](#-contacto)

## 🚀 Objetivo

Permitir que grupos de personas ahorren colectivamente en ciclos estructurados, donde cada miembro aporta en un turno fijo y recibe el fondo total una vez durante el ciclo. Todo gestionado de forma automática mediante smart contracts.

## 🧩 Características Principales

- 💰 **Aportes Automatizados**: Gestión automática de aportes periódicos (semanales, mensuales) mediante smart contracts
- 🔒 **Seguridad Garantizada**: Custodia automática y transparente de fondos en la blockchain
- 🎯 **Gestión Imparcial**: Sorteo o calendario de turnos sin intervención humana
- 🏅 **Sistema de Reputación**: Gamificación y reputación para quienes cumplen sus pagos puntualmente
- 🔐 **Descentralizado**: Operación sin intermediarios sobre la red Ethereum (Sepolia Testnet)
- 📱 **Interfaz Intuitiva**: Panel de control fácil de usar para gestionar tu junta
- 📊 **Transparencia Total**: Historial completo de transacciones y estado de la junta

## 📁 Estructura del Proyecto

```
juntas-onchain/
├── contracts/           # Contratos inteligentes
│   ├── Juntas.sol      # Contrato principal
│   └── interfaces/      # Interfaces de contratos
├── scripts/            # Scripts de despliegue y utilidades
├── test/              # Tests de contratos
├── frontend/          # Aplicación web (pendiente)
└── docs/             # Documentación adicional
```

## ⚙️ Tecnologías Utilizadas

- [Hardhat](https://hardhat.org/) - Entorno de desarrollo para Ethereum
- [Solidity 0.8.x](https://docs.soliditylang.org/) - Lenguaje de contratos inteligentes
- [Ethers.js](https://docs.ethers.org/) - Biblioteca para interactuar con Ethereum
- [Ethereum Sepolia Testnet](https://sepolia.dev/) - Red de prueba
- [.env (dotenv)](https://www.npmjs.com/package/dotenv) - Gestión de variables de entorno

## 📋 Requisitos Previos

- Node.js (v16 o superior)
- npm o yarn
- Cuenta en MetaMask
- ETH de prueba en Sepolia Testnet
- Clave privada de wallet (para despliegue)

## 🛠️ Instalación

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/juntas-onchain.git
cd juntas-onchain

# 2. Instalar dependencias
npm install

# 3. Configurar variables de entorno
cp .env.example .env
# Editar .env con tus credenciales:
# - PRIVATE_KEY=tu_clave_privada
# - SEPOLIA_RPC_URL=tu_url_rpc
# - ETHERSCAN_API_KEY=tu_api_key
```

## 🚀 Despliegue

```bash
# 1. Compilar contratos
npx hardhat compile

# 2. Ejecutar tests
npx hardhat test

# 3. Desplegar en Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

## 📖 Uso

1. Conecta tu wallet MetaMask a Sepolia Testnet
2. Accede a la aplicación web (pendiente)
3. Crea una nueva junta o únete a una existente
4. Realiza tus aportes según el calendario establecido
5. Recibe el fondo total en tu turno asignado

## 🤝 Contribución

Las contribuciones son bienvenidas. Por favor, sigue estos pasos:

1. Haz fork del proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT - ver el archivo [LICENSE.md](LICENSE.md) para más detalles.

## 📞 Contacto

- Sitio Web: [juntas-onchain.com](https://juntas-onchain.com) (pendiente)
- X: [@gabrululu)

---

⭐️ Si te gusta el proyecto, ¡déjanos una estrella en GitHub!

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/juntas-onchain.git
cd juntas-onchain

# 2. Instalar dependencias
npm install

# 3. Crear el archivo .env
touch .env
# Agrega tu clave privada y RPC URL de Sepolia

# 4. Compilar contratos
npx hardhat compile

# 5. Deploy en Sepolia
npx hardhat run scripts/deploy.js --network sepolia
