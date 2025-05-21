// SPDX-License-Identifier: MIT
pragma solidity ^0.8.21;

contract Junta {
    address public owner;
    uint public cuota;
    uint public maxParticipantes;
    uint public turnoActual;
    uint public intervalo;
    uint public ultimaEntrega;

    address[] public participantes;
    mapping(address => bool) public haDepositado;
    mapping(address => bool) public estaRegistrado;

    enum Estado { Inactiva, Activa, Pausada, Finalizada }
    Estado public estado;

    event ParticipanteUnido(address participante);
    event CuotaDepositada(address participante);
    event FondosEntregados(address beneficiario, uint monto);
    event JuntaFinalizada();
    event JuntaPausada();
    event JuntaReanudada();
    event JuntaCerradaAnticipadamente();

    modifier soloOwner() {
        require(msg.sender == owner, "Solo el owner puede ejecutar esto");
        _;
    }

    modifier soloParticipante() {
        require(estaRegistrado[msg.sender], "No estas registrado en esta junta");
        _;
    }

    modifier soloSiActiva() {
        require(estado == Estado.Activa, "La junta no esta activa");
        _;
    }

    modifier noFinalizada() {
        require(estado != Estado.Finalizada, "La junta ya finalizo");
        _;
    }

    constructor(uint _cuota, uint _maxParticipantes, uint _intervalo) {
        require(_cuota > 0, "Cuota debe ser mayor a 0");
        require(_maxParticipantes >= 2, "Debe haber al menos 2 participantes");
        require(_intervalo >= 3600, "Intervalo minimo: 1 hora");

        owner = msg.sender;
        cuota = _cuota;
        maxParticipantes = _maxParticipantes;
        intervalo = _intervalo;
        estado = Estado.Inactiva;
    }

    function unirse() external payable noFinalizada {
        require(estado == Estado.Inactiva, "La junta ya comenzo");
        require(!estaRegistrado[msg.sender], "Ya estas registrado");
        require(participantes.length < maxParticipantes, "Junta llena");
        require(msg.value == cuota, "Debes enviar la cuota exacta");

        participantes.push(msg.sender);
        estaRegistrado[msg.sender] = true;
        haDepositado[msg.sender] = true;

        emit ParticipanteUnido(msg.sender);

        if (participantes.length == maxParticipantes) {
            estado = Estado.Activa;
            ultimaEntrega = block.timestamp;
        }
    }

    function depositar() external payable soloParticipante soloSiActiva {
        require(!haDepositado[msg.sender], "Ya depositaste esta ronda");
        require(msg.value == cuota, "Debes enviar la cuota exacta");

        haDepositado[msg.sender] = true;
        emit CuotaDepositada(msg.sender);
    }

    function entregarFondos() external soloSiActiva {
        require(turnoActual < participantes.length, "La junta ya finalizo");
        require(block.timestamp >= ultimaEntrega + intervalo, "Aun no toca el siguiente turno");

        address beneficiario = participantes[turnoActual];
        require(beneficiario != address(0), "Beneficiario invalido");

        uint monto = cuota * participantes.length;
        payable(beneficiario).transfer(monto);
        emit FondosEntregados(beneficiario, monto);

        ultimaEntrega = block.timestamp;
        turnoActual++;

        for (uint i = 0; i < participantes.length; i++) {
            haDepositado[participantes[i]] = false;
        }

        if (turnoActual == participantes.length) {
            estado = Estado.Finalizada;
            emit JuntaFinalizada();
        }
    }

    function pausarJunta() external soloOwner noFinalizada {
        require(estado == Estado.Activa, "Solo puedes pausar una junta activa");
        estado = Estado.Pausada;
        emit JuntaPausada();
    }

    function reanudarJunta() external soloOwner {
        require(estado == Estado.Pausada, "La junta no esta pausada");
        estado = Estado.Activa;
        emit JuntaReanudada();
    }

    function cerrarJuntaAnticipadamente() external soloOwner noFinalizada {
        estado = Estado.Finalizada;
        emit JuntaCerradaAnticipadamente();
    }

    function verParticipantes() external view returns (address[] memory) {
        return participantes;
    }

    function verEstado() external view returns (string memory) {
        if (estado == Estado.Inactiva) return "Inactiva";
        if (estado == Estado.Activa) return "Activa";
        if (estado == Estado.Pausada) return "Pausada";
        return "Finalizada";
    }

    function verSiguienteBeneficiario() external view returns (address) {
        if (estado != Estado.Activa || turnoActual >= participantes.length) {
            return address(0);
        }
        return participantes[turnoActual];
    }

    function haDepositadoEnTurno(address usuario) external view returns (bool) {
        return haDepositado[usuario];
    }

    receive() external payable {
        revert("No se aceptan pagos directos");
    }
}

