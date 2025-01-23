let tapTimes = []; // Almacena los tiempos de los clics
const tapButton = document.getElementById('tapButton');
const bpmDisplay = document.getElementById('bpmDisplay');
const resetButton = document.getElementById('resetButton');
const bpmInput = document.getElementById('bpmInput');
const syncBPM = document.getElementById('syncBPM');

// Elementos para mostrar los resultados
const preDelay = document.getElementById('preDelay');
const decayTime = document.getElementById('decayTime');
const totalReverb = document.getElementById('totalReverb');
const notesDelay = document.getElementById('notesDelay');
const dottedDelay = document.getElementById('dottedDelay');
const tripletDelay = document.getElementById('tripletDelay');
const delayFreq = document.getElementById('delayFreq');

// Función para calcular los parámetros
function calculateReverbAndDelay(bpm) {
    const msPerBeat = 60000 / bpm; // Milisegundos por beat
    const msPerMeasure = msPerBeat * 4; // Milisegundos por compás (4 beats)

    // Reverb Configurations
    const hall = msPerMeasure * 2; // 2 compases
    const largeRoom = msPerMeasure; // 1 compás
    const smallRoom = msPerBeat * 2; // 1/2 nota
    const tightAmbience = msPerBeat; // 1/4 nota

    // Delay
    const dotted = msPerBeat * 1.5; // Dotted
    const triplet = msPerBeat / 3;  // Triplets
    const frequency = bpm / 60;    // Frecuencia en Hz

    // Actualizar resultados en el DOM
    document.getElementById("hall").textContent = hall.toFixed(2) + " ms";
    document.getElementById("large-room").textContent = largeRoom.toFixed(2) + " ms";
    document.getElementById("small-room").textContent = smallRoom.toFixed(2) + " ms";
    document.getElementById("tight-ambience").textContent = tightAmbience.toFixed(2) + " ms";

    document.getElementById("notes-delay").textContent = msPerBeat.toFixed(2) + " ms";
    document.getElementById("dotted-delay").textContent = dotted.toFixed(2) + " ms";
    document.getElementById("triplet-delay").textContent = triplet.toFixed(2) + " ms";
    document.getElementById("delay-freq").textContent = frequency.toFixed(2) + " Hz";
}

// Evento para actualizar los cálculos cuando cambie el BPM
bpmInput.addEventListener('input', () => {
    const bpm = parseFloat(bpmInput.value);
    if (bpm > 0) {
        calculateReverbAndDelay(bpm);
    }
});

// Sincronizar el BPM del tap con el input, si la casilla está activa
tapButton.addEventListener('click', () => {
    const currentTime = Date.now();

    if (tapTimes.length > 0) {
        const deltaTime = currentTime - tapTimes[tapTimes.length - 1];
        if (deltaTime >= 300 && deltaTime <= 2000) {
            tapTimes.push(currentTime);

            if (tapTimes.length > 10) {
                tapTimes.shift();
            }

            const intervals = [];
            for (let i = 1; i < tapTimes.length; i++) {
                intervals.push(tapTimes[i] - tapTimes[i - 1]);
            }
            const averageInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
            const bpm = 60000 / averageInterval;
            bpmDisplay.textContent = Math.round(bpm);

            // Si la casilla está activa, actualizar el input de BPM
            if (syncBPM.checked) {
                bpmInput.value = Math.round(bpm);
                calculateReverbAndDelay(bpm);
            }
        }
    } else {
        tapTimes.push(currentTime);
    }
});

// Reiniciar todo
resetButton.addEventListener('click', () => {
    tapTimes = [];
    bpmDisplay.textContent = 0;
    bpmInput.value = 120;
    calculateReverbAndDelay(120);
});
