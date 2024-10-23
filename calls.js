cues = [
    'Back Block',
    'High Block',
    'Low Block',
    'Head Block',
    'Forearm',
    'Leg Block',
    'Illegal Contact',
    '⭐⭐ Illegal Assist',
    '⭐⭐ Early Hit',
    '⭐⭐ Late Hit',
    '⭐⭐ Out of Play Block',
    'Direction',
    '⭐⭐ Stop Block',
    'Multiplayer',
    'Illegal Position',
    '⭐⭐ Destruction',
    '⭐⭐ Skating Out of Bounds',
    '⭐⭐ Failure to Reform',
    '⭐⭐ Failure to Return',
    '⭐⭐ Failure to Yield',
    'Cut',
    '⭐⭐ Illegal Re-entry',
    'Interference',
    '⭐⭐ Delay of Game',
    'Illegal Procedure',
    '⭐⭐ Star Pass Violation',
    '⭐⭐ Pass Interference',
    '⭐⭐ Illegal Exit',
    'Misconduct',
    '⭐⭐ Insubordination',
    
    
    // old cues
    // 'Back Block',
    // 'Bench Staff Violation',
    // 'Blocking while Down',
    // 'Blocking with the Head',
    // 'Charging',
    // 'Clockwise Assist',
    // 'Clockwise Block',
    // 'Cutting',
    // 'Delay of Game',
    // 'Destroying the Pack',
    // 'Early Hit',
    // 'Elbows',
    // 'Embellishment',
    // 'Equipment Violation',
    // 'Failure to Reform',
    // 'Failure to Return',
    // 'Failure to Yield',
    // 'False Start',
    // 'Forearms',
    // 'Gross Misconduct',
    // 'Game Interference',
    // 'High Block',
    // 'Illegal Call-Off',
    // // 'Illegal Engaging',
    // 'Illegal Positioning',
    // 'Illegal Re-entry',
    // 'Illegal Return',
    // 'Insubordination',
    // 'Late Hit',
    // 'Leaping Contact',
    // 'Low Block',
    // // 'Misconduct',
    // 'Multi-Player Block',
    // 'Out of Bounds Assist',
    // 'Out of Bounds Block',
    // 'Out of Play Assist',
    // 'Out of Play Block',
    // 'Penalty Box Violation',
    // 'Reckless Entry',
    // 'Skating Out of Bounds',
    // 'Stalling',
    // 'Star Pass Interference',
    // 'Star Pass Violation',
    // 'Stopped Assist',
    // 'Stopped Block',
    // 'Too Many Skaters',
    // 'Uniform Violation',
    // 'Unsporting Conduct'
];

colours = [ { 'jersey':'black', 'number':'white' },
            { 'jersey':'purple', 'number':'white' },
            { 'jersey':'blue', 'number':'white' },
            { 'jersey':'green', 'number':'white' },
            { 'jersey':'red', 'number':'white' },
            { 'jersey':'yellow', 'number':'black' },
            { 'jersey':'orange', 'number':'black' },
            { 'jersey':'pink', 'number':'black' }
          ];

digits = [ '0', '1', '2', '3', '4', '5', '6', '7', '8', '9' ];
letters = [ 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M',
            'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z' ];

jersey = document.getElementById('jersey');
number = document.getElementById('number');
call = document.getElementById('call');
autoUpdateText = document.getElementById('autoUpdateText');
delayText = document.getElementById('delayText');

autoUpdate = false;

function randomElement(collection) {
    var index = Math.floor(Math.random() * collection.length);
    return collection[index];
}


function generateNumber() {
    var length = Math.ceil(Math.random() * 4);
    var valid = false;
    var number = ''
    for (var i=0; i < length; i++) {
        number += randomElement(digits);
        // old version: also generate some letters
        // if (Math.random() < .85) {
        //     number += randomElement(digits);
        //     valid = true;
        // } else {
        //     number += randomElement(letters);
        // }
    }
    // if the generated number is not a valid derby number, make it valid
    if (! valid) {
        var toSwap = Math.floor(Math.random() * length);
        number = number.substr(0, toSwap) + randomElement(digits)
            + number.substr(toSwap+1);
    }
    return number;
}

function makeNewCall() {
    newCall = {'cue': randomElement(cues),
               'colour': randomElement(colours),
               'number': generateNumber() };
    historyStage += 1;
    historyStates[historyStage] = newCall;
    setCall(newCall);
}

function setCall(newCall) {
    call.textContent = newCall['cue'];
    jersey.setAttributeNS('', 'fill', newCall['colour']['jersey']);
    number.setAttributeNS('', 'fill', newCall['colour']['number']);
    number.textContent = newCall['number'];
    // console.log('at stage ', historyStage);
}

function requestNewCall() {
    makeNewCall();
    if (autoUpdate) {
        window.clearTimeout(timeout);
        nextUpdateIn = autoUpdateDelay + 1;
        updateTimer();
    }
}

function historyBack() {
    if (historyStage > 0) {
        historyStage -= 1;
        var call = historyStates[historyStage];
        setCall(call);
    }
}

function historyForward() {
    if (historyStates.length > historyStage + 1) {
        historyStage += 1;
        setCall(historyStates[historyStage]);
    } else {
        requestNewCall();
    }
}

function toggleAutoUpdate() {
    if (autoUpdate) {
        autoUpdate = false;
        autoUpdateText.textContent = 'Auto update is off';
        window.clearTimeout(timeout);
    } else {
        autoUpdate = true;
        nextUpdateIn = autoUpdateDelay + 1;
        updateTimer();
    }
}

function updateTimer() {
    if (nextUpdateIn == 1) {
        nextUpdateIn = autoUpdateDelay;
        makeNewCall();
    } else {
        nextUpdateIn -= 1;
    }
    autoUpdateText.textContent = 'Auto update in ' + nextUpdateIn + '"';
    timeout = setTimeout(updateTimer, 1000);
}

function clickOnUpdateButton(evt) {
    toggleAutoUpdate();
    console.log(evt);
    evt.stopPropagation();
}

function clickOnBackground(evt) {
    requestNewCall();
}

function clickOnPlus(evt) {
    requestDelayOffset(1);
    evt.stopPropagation();
}

function clickOnMinus(evt) {
    requestDelayOffset(-1);
    evt.stopPropagation();
}

function clickOnBack(evt) {
    historyBack();
    evt.stopPropagation();
}

function clickOnForward(evt) {
    historyForward();
    evt.stopPropagation();
}

function requestDelayOffset(offset) {
    if (autoUpdateDelay + offset > 0 && autoUpdateDelay + offset <= 60) {
        autoUpdateDelay += offset;
        updateDelay();
    }
}

function updateDelay() {
    delayText.textContent = autoUpdateDelay + '" between updates';
    setDelayToStorage();
//    localStorage.autoUpdateDelay = JSON.stringify(autoUpdateDelay);
}    

function keyDown(evt) {
    code = parseInt(evt.keyCode);
    if (code == 39 || code == 32) { // right key or space
        historyForward();
    } else if (code ==  37) { // left key
        historyBack();
    // } else {
    //     console.log(code);
    }
}

function initialise() {
    // in seconds, default value
    autoUpdateDelay = 7;
    
    getDelayFromStorage();

    historyStates = [];
    historyStage = -1;
    requestNewCall();
}

document.addEventListener('click', clickOnBackground);
document.addEventListener('keydown', keyDown);
document.getElementById('theUpdateButton').
    addEventListener('click', clickOnUpdateButton);
document.getElementById('delayPlusButton').
    addEventListener('click', clickOnPlus);
document.getElementById('delayMinusButton').
    addEventListener('click', clickOnMinus);
document.getElementById('historyBackButton').
    addEventListener('click', clickOnBack);
// document.getElementById('historyForwardButton').
//     addEventListener('click', clickOnForward);

initialise();
