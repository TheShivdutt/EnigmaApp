const rotors = [
    { wiring: 'EKMFLGDQVZNTOWYHXUSPAIBRCJ', notch: 'Q' },
    { wiring: 'AJDKSIRUXBLHWTMCQGZNPYFVOE', notch: 'E' },
    { wiring: 'BDFHJLCPRTXVZNYEIWGAKMUSQO', notch: 'V' }
];

const reflector = 'YRUHQSLDPXNGOKMIEBFZCWVJAT';

let plugboard = {};

let rotorPositions = [0, 0, 0];

function setRotorPositions() {
    rotorPositions = [
        parseInt(document.getElementById('rotor1').value),
        parseInt(document.getElementById('rotor2').value),
        parseInt(document.getElementById('rotor3').value)
    ];
}

function setPlugboardSettings() {
    plugboard = {};
    const plugAs = document.querySelectorAll('.plugA');
    const plugBs = document.querySelectorAll('.plugB');
    for (let i = 0; i < plugAs.length; i++) {
        const charA = plugAs[i].value.toUpperCase();
        const charB = plugBs[i].value.toUpperCase();
        if (charA && charB && charA !== charB) {
            plugboard[charA] = charB;
            plugboard[charB] = charA;
        }
    }
}

function rotateRotor(rotor) {
    const wiring = rotor.wiring;
    const firstChar = wiring[0];
    const rest = wiring.substring(1);
    return rest + firstChar;
}

function plugboardPass(char) {
    return plugboard[char] || char;
}

function encodeThroughRotor(char, rotor, position) {
    const inputPos = (char.charCodeAt(0) - 65 + position) % 26;
    const outputChar = rotor.wiring[inputPos];
    const outputPos = (outputChar.charCodeAt(0) - 65 - position + 26) % 26;
    return String.fromCharCode(65 + outputPos);
}

function encodeMessage(message) {
    setRotorPositions();
    setPlugboardSettings();
    let encodedMessage = '';
    for (let i = 0; i < message.length; i++) {
        let char = message[i];
        if (!/[A-Z]/.test(char)) continue;

        char = plugboardPass(char);

        for (let j = 2; j >= 0; j--) {
            char = encodeThroughRotor(char, rotors[j], rotorPositions[j]);
        }

        char = reflector[char.charCodeAt(0) - 65];

        for (let j = 0; j < 3; j++) {
            char = encodeThroughRotor(char, { wiring: reverseWiring(rotors[j].wiring) }, rotorPositions[j]);
        }

        char = plugboardPass(char);

        encodedMessage += char;

        rotorPositions[2] = (rotorPositions[2] + 1) % 26;
        if (rotorPositions[2] === rotors[2].notch.charCodeAt(0) - 65) {
            rotorPositions[1] = (rotorPositions[1] + 1) % 26;
        }
        if (rotorPositions[1] === rotors[1].notch.charCodeAt(0) - 65) {
            rotorPositions[0] = (rotorPositions[0] + 1) % 26;
        }
    }
    return encodedMessage;
}

function reverseWiring(wiring) {
    let reversed = Array(26);
    for (let i = 0; i < 26; i++) {
        const char = wiring[i];
        reversed[char.charCodeAt(0) - 65] = String.fromCharCode(65 + i);
    }
    return reversed.join('');
}

function processMessage(action) {
    const inputMessage = document.getElementById('inputMessage').value.toUpperCase();
    let resultMessage = '';
    if (action === 'encode') {
        resultMessage = encodeMessage(inputMessage);
    } else if (action === 'decode') {
        resultMessage = encodeMessage(inputMessage);
    }
    document.getElementById('outputMessage').value = resultMessage;
}
