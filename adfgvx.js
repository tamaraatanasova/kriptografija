let lastSteps = "";

function generatePolybiusSquare(key) {
    let alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let uniqueKey = Array.from(new Set(key.toUpperCase().replace(/[^A-Z0-9]/g, "") + alphabet));
    let square = {};
    let reverseSquare = {};
    let adfgvx = "ADFGVX";
    let index = 0;
    let squareMatrix = "Полибиусов квадрат:\n";
    for (let row of adfgvx) {
        for (let col of adfgvx) {
            if (index < uniqueKey.length) {
                square[uniqueKey[index]] = row + col;
                reverseSquare[row + col] = uniqueKey[index];
                squareMatrix += `${uniqueKey[index]} -> ${row}${col}\n`;
                index++;
            }
        }
    }
    lastSteps += squareMatrix + "\n";
    return { square, reverseSquare };
}

function encrypt() {
    let text = document.getElementById("inputText").value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    let squareKey = document.getElementById("squareKey").value;
    let transpositionKey = document.getElementById("transpositionKey").value.toUpperCase();
    if (!squareKey || !transpositionKey) { alert("Внесете двата клуча!"); return; }

    lastSteps = "Внесен текст: " + text + "\n"+"\n";
    let { square } = generatePolybiusSquare(squareKey);
    let substitution = text.split('').map(c => square[c] || '').join('');
    lastSteps += "\nШифрирање со Полибиусов квадрат:\n" + substitution + "\n";

    let columns = transpositionKey.split('').map((c, i) => ({ letter: c, index: i }));
    columns.sort((a, b) => a.letter.localeCompare(b.letter));
    
    let transposition = new Array(substitution.length).fill('');
    let index = 0;
    for (let col of columns) {
        for (let i = col.index; i < substitution.length; i += transpositionKey.length) {
            transposition[i] = substitution[index++];
        }
    }
    let result = transposition.join('');
    document.getElementById("outputText").value = result;
    document.getElementById("showStepsBtn").style.display = "block";
    lastSteps += "\nРезултат по транспозиција:\n" + result;
}

function decrypt() {
    let text = document.getElementById("inputText").value;
    let squareKey = document.getElementById("squareKey").value;
    let transpositionKey = document.getElementById("transpositionKey").value.toUpperCase();
    if (!squareKey || !transpositionKey) { alert("Внесете двата клуча!"); return; }

    lastSteps = "\nШифриран текст: " + text + "\n";
    let { reverseSquare } = generatePolybiusSquare(squareKey);
    let columns = transpositionKey.split('').map((c, i) => ({ letter: c, index: i }));
    columns.sort((a, b) => a.letter.localeCompare(b.letter));
    
    let transposition = new Array(text.length).fill('');
    let index = 0;
    for (let col of columns) {
        for (let i = col.index; i < text.length; i += transpositionKey.length) {
            transposition[index++] = text[i];
        }
    }
    let transposedText = transposition.join('');
    lastSteps += "\nОбратна транспозиција:\n" + transposedText + "\n\n";
    
    let substitutionPairs = transposedText.match(/.{2}/g) || [];
    let originalText = substitutionPairs.map(pair => reverseSquare[pair] || '').join('');
    document.getElementById("outputText").value = originalText;
    lastSteps += "\nДекодирање со Полибиусов квадрат:\n\n" + originalText;
}

function showSteps() {
    document.getElementById("steps").innerHTML = lastSteps;
    document.getElementById("steps").style.display = "block";
}