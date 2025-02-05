// Функција за прикажување/скривање на чекорите (toggle ефект)
function showSteps() {
    let stepsDiv = document.getElementById("steps");
    if (stepsDiv.style.display === "none" || stepsDiv.innerHTML === "") {
        stepsDiv.style.display = "block";
    } else {
        stepsDiv.style.display = "none";
    }
}

function encrypt() {
    // Земање на внесен текст и проверка дали е внесен
    let textInput = document.getElementById("inputText").value;
    if (!textInput || textInput.trim() === "") {
        alert("Ве молиме внесете текст!");
        return;
    }
    let text = textInput.toUpperCase().replace(/[^A-Z]/g, "");
    
    // Земање на вредностите од матрицата и проверка дали сите се внесени
    let key11 = document.getElementById("key11").value;
    let key12 = document.getElementById("key12").value;
    let key21 = document.getElementById("key21").value;
    let key22 = document.getElementById("key22").value;
    
    if (key11 === "" || key12 === "" || key21 === "" || key22 === "") {
        alert("Ве молиме внесете сите вредности за клучната матрица!");
        return;
    }
    
    let keyMatrix = [
        [parseInt(key11), parseInt(key21)],
        [parseInt(key12), parseInt(key22)]
    ];
     // Проверка дали текстот содржи бројки
     if (/\d/.test(textInput)) {
        alert("Ве молиме внесете само букви, бројки не се дозволени!");
        return;
    }

    // Ако бројот на букви е непарен, додај "X"
    if (text.length % 2 !== 0) text += "X";
    
    // Претворање на текстот во нумерички вредности (A=0, B=1, …, Z=25)
    let numericText = [];
    for (let i = 0; i < text.length; i++) {
        numericText.push(text.charCodeAt(i) - 65);
    }
    
    // Подготовка на чекорите за пресметка
    let step1 = "📌 1. Конверзија во броеви: " + numericText.join(", ");
    let step2 = "📌 2. Матрица на клуч: <br>" +
        `[ ${keyMatrix[0][0]}  ${keyMatrix[0][1]} ]<br>` +
        `[ ${keyMatrix[1][0]}  ${keyMatrix[1][1]} ]`;
    
    let encryptedText = "";
    let newNumbers = [];
    
    // Матрично множење за секој пар од броеви
    for (let i = 0; i < numericText.length; i += 2) {
        let x1 = numericText[i];
        let x2 = numericText[i + 1];
        
        // Пресметка со формулата ((израз % 26) + 26) % 26 за да се осигура позитивна вредност
        let y1 = ((keyMatrix[0][0] * x1 + keyMatrix[0][1] * x2) % 26 + 26) % 26;
        let y2 = ((keyMatrix[1][0] * x1 + keyMatrix[1][1] * x2) % 26 + 26) % 26;
        
        newNumbers.push(y1, y2);
        encryptedText += String.fromCharCode(y1 + 65) + String.fromCharCode(y2 + 65);
    }
    
    let step3 = "📌 3. Пресметка по матрично множење (mod 26): " + newNumbers.join(", ");
    let step4 = "📌 4. Конверзија назад во букви: " + encryptedText;
    
    // Прикажување на резултатот и чекорите
    document.getElementById("result").innerText = encryptedText;
    document.getElementById("step1").innerHTML = step1;
    document.getElementById("step2").innerHTML = step2;
    document.getElementById("step3").innerHTML = step3;
    document.getElementById("step4").innerHTML = step4;
    
    document.getElementById("showStepsBtn").style.display = "inline-block";
    document.getElementById("steps").style.display = "none"; // Почетно скриено
}

function modInverse(a, m) {
    // Наоѓа модуларниот инверз на 'a' по модул 'm'
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    return -1;
}

function decrypt() {
    // Земање на внесен текст и проверка дали е внесен
    let textInput = document.getElementById("inputText").value;
    if (!textInput || textInput.trim() === "") {
        alert("Ве молиме внесете шифриран текст!");
        return;
    }
    let text = textInput.toUpperCase().replace(/[^A-Z]/g, "");
    
    // Земање на вредностите од матрицата и проверка дали сите се внесени
    let key11 = document.getElementById("key11").value;
    let key12 = document.getElementById("key12").value;
    let key21 = document.getElementById("key21").value;
    let key22 = document.getElementById("key22").value;
    
    if (key11 === "" || key12 === "" || key21 === "" || key22 === "") {
        alert("Ве молиме внесете сите вредности за клучната матрица!");
        return;
    }
    
    let keyMatrix = [
        [parseInt(key11), parseInt(key21)],
        [parseInt(key12), parseInt(key22)]
    ];
    
    // Пресметка на детерминанта
    let det = (keyMatrix[0][0] * keyMatrix[1][1] - keyMatrix[0][1] * keyMatrix[1][0]) % 26;
    if (det < 0) det += 26;
    
    let detInverse = modInverse(det, 26);
    if (detInverse === -1) {
        alert("Матрицата нема инверз мод 26, внесете друг клуч.");
        return;
    }
    
    // Пресметка на инверзната матрица
    let inverseMatrix = [
        [ ((keyMatrix[1][1] * detInverse) % 26 + 26) % 26, ((-keyMatrix[0][1] * detInverse) % 26 + 26) % 26 ],
        [ ((-keyMatrix[1][0] * detInverse) % 26 + 26) % 26, ((keyMatrix[0][0] * detInverse) % 26 + 26) % 26 ]
    ];
    
    // Претворање на шифрираниот текст во нумерички вредности
    let numericText = [];
    for (let i = 0; i < text.length; i++) {
        numericText.push(text.charCodeAt(i) - 65);
    }
    
    let decryptedText = "";
    let step1 = "📌 1. Конверзија во броеви: " + numericText.join(", ");
    
    let step2 = "📌 2. Инверзна матрица на клуч: <br>" +
        `[ ${inverseMatrix[0][0]}  ${inverseMatrix[0][1]} ]<br>` +
        `[ ${inverseMatrix[1][0]}  ${inverseMatrix[1][1]} ]`;
    
    let newNumbers = [];
    for (let i = 0; i < numericText.length; i += 2) {
        let y1 = numericText[i];
        let y2 = numericText[i + 1];
        
        let x1 = ((inverseMatrix[0][0] * y1 + inverseMatrix[0][1] * y2) % 26 + 26) % 26;
        let x2 = ((inverseMatrix[1][0] * y1 + inverseMatrix[1][1] * y2) % 26 + 26) % 26;
        
        newNumbers.push(x1, x2);
        decryptedText += String.fromCharCode(x1 + 65) + String.fromCharCode(x2 + 65);
    }
    
    let step3 = "📌 3. Пресметка по инверзна матрица (mod 26): " + newNumbers.join(", ");
    let step4 = "📌 4. Конверзија назад во букви: " + decryptedText;
    
    // Прикажување на резултатот и чекорите
    document.getElementById("result").innerText = decryptedText;
    document.getElementById("step1").innerHTML = step1;
    document.getElementById("step2").innerHTML = step2;
    document.getElementById("step3").innerHTML = step3;
    document.getElementById("step4").innerHTML = step4;
    
    document.getElementById("showStepsBtn").style.display = "inline-block";
    document.getElementById("steps").style.display = "none"; // Почетно скриено
}
