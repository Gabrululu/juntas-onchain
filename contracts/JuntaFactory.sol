// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

import "./Junta.sol";

contract JuntaFactory {
    address public owner;
    address[] public todasLasJuntas;
    mapping(address => address[]) public juntasPorUsuario;

    event JuntaCreada(
        address indexed creador,
        address indexed junta,
        uint cuota,
        uint participantes,
        uint intervalo
    );

    constructor() {
        owner = msg.sender;
    }

    function crearJunta(
        uint cuota,
        uint maxParticipantes,
        uint intervalo
    ) external {
        Junta nuevaJunta = new Junta(cuota, maxParticipantes, intervalo);
        todasLasJuntas.push(address(nuevaJunta));
        juntasPorUsuario[msg.sender].push(address(nuevaJunta));

        emit JuntaCreada(
            msg.sender,
            address(nuevaJunta),
            cuota,
            maxParticipantes,
            intervalo
        );
    }

    function obtenerJuntas() public view returns (address[] memory) {
        return todasLasJuntas;
    }

    function obtenerMisJuntas() external view returns (address[] memory) {
        return juntasPorUsuario[msg.sender];
    }

    function totalJuntas() external view returns (uint) {
        return todasLasJuntas.length;
    }
}

