//let dictionary = JSON.parse(localStorage.getItem('dictionary')) || {};


let dictionary = {};
let randomGermanWord;

addEventListener('DOMContentLoaded', init);

async function init() {
    await loadDictionaryLocal();
    nextVocabulary();
}

async function loadJSON() {
    try {
        request = await fetch('../js/dictionary.json');
    } catch (error) {
        document.getElementById('errText').innerHTML = error.message;
        console.error(error);
    }
    let response = await request.json();
    dictionary = response;
}


function saveDictinaryLocal() {
    //Wandelt das JOSN in eine String um
    let dictionaryAsString = JSON.stringify(dictionary);
    console.log('dictionaryAsString: ', dictionaryAsString);
    //Speichert einen Localen eintrag unter dem KEY dictionery mit dem WERT dictionaryAsString
    localStorage.setItem('dictionary', dictionaryAsString);
}

async function loadDictionaryLocal() {
    // Übergibt den WERT unter dem KEY 'dictionary' an die Variable dictionaryAsString
    let dictionaryAsString = localStorage.getItem('dictionary');
    // ist ein Wert gespeichet ist die bedingung erfüllt 
    if (dictionaryAsString) {
        // Wandelt den String in ein JSON um und übergibt in an dictionary
        dictionary = JSON.parse(dictionaryAsString);
    } else {
        await loadJSON();
    }
}


/**
 * Show a randomly vocabulary 
 */
function nextVocabulary() {
    let word = document.getElementById('word'); // Element holen
    let obj_keys = Object.keys(dictionary); //greift auf die keys im Object und gibt sie als array zurück
    randomGermanWord = obj_keys[Math.floor(Math.random() * obj_keys.length)]; //Zufälliges Element auswählen
    word.innerHTML = `${dictionary[randomGermanWord]}`; //Element den Wert übergeben
}


/**
 * Add a new German and English Word to the Dictionary
 */
function addVocabulary() {
    let germanText = document.getElementById('germanText').value; //Element holen
    let englishText = document.getElementById('englishText').value; // Element holen

    dictionary[germanText.trim().toLowerCase()] = englishText.trim().toLowerCase(); //Auf JOSN zugreifen 

    germanText.value = ''; //Element Wert überschreiben
    englishText.value = ''; //Element Wert überschreiben

    saveDictinaryLocal();
    render();
}


/**
 * delete the German and English word from the Dictionary
 * @param {Object.key} key 
 */
function deleteVocabulary(key) {
    console.log('keyParameter: ', key);
    delete dictionary[key];
    saveDictinaryLocal();
    render();
}

function deleteLocalStorage() {
    localStorage.clear();
    render();
}


/**
 * Render all Vocabulary into the list
 */
function render() {
    let obj_keys = Object.keys(dictionary); //greift auf die keys im Object und gibt sie als array zurück
    let vocabularyList = document.getElementById('vocabularyList');
    vocabularyList.innerHTML = ``;
    for (let i = 0; i < obj_keys.length; i++) {
        const obj_key = obj_keys[i];
        vocabularyList.innerHTML += `
        <tr>
            <td>${i}</td>
            <td>${obj_key}</td>
            <td>${dictionary[obj_key]}</td>
            <td><button onclick="deleteVocabulary('${obj_key}')" class="x">Löschen</button></td>
        </tr>
        `;
    };
}


/**
 * Compare the answer with the dictionary 
 */
function compare() {
    let answer = document.getElementById('answer');
    let germanAntwort = document.getElementById('germanAntwort');
    answer.innerHTML = ``;
    dictionary[germanAntwort.value.trim().toLowerCase()];
    if (germanAntwort.value.trim().toLowerCase() == randomGermanWord) {
        console.log('Richtig');
        answer.innerHTML = `<h2>${randomGermanWord}</h2>
                            <h4>ist</h4>
                            <h2 style="color: green">Richtig</h2>`;
    } else {
        console.log('Falsch!');
        answer.innerHTML = `<h3>${germanAntwort.value}</h3>
                            <h4>ist leider</h4>
                            <h2 style="color: red";>Falsch</h2>
                            <h4>die Richtige Antwort ist</h4>
                            <h2>${randomGermanWord}</h2>`;
    }
    germanAntwort.value = ``;
    nextVocabulary();
}