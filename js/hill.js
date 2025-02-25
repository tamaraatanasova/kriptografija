function getMatrix(size) {
    let matrix = [];
    for (let i = 0; i < size; i++) {
        let row = [];
        for (let j = 0; j < size; j++) {
            let value = document.getElementById(`key${i}${j}`).value;
            if (!value) {
                alert("Внесете сите вредности за клучната матрица!");
                return null;
            }
            row.push(parseInt(value));
        }
        matrix.push(row);
    }
    return matrix;
}

function textToNumbers(text, size) {
    let numericText = text.toUpperCase().replace(/[^A-Z]/g, "").split('').map(letter => letter.charCodeAt(0) - 65);
    while (numericText.length % size !== 0) {
        numericText.push(23); // Padding with 'X' (23)
    }
    return numericText;
}

function multiplyMatrixVector(matrix, vector, mod) {
    let result = [];
    let calculations = [];
    for (let i = 0; i < matrix.length; i++) {
        let sum = matrix[i].reduce((acc, val, j) => acc + val * vector[j], 0);
        result.push(((sum % mod) + mod) % mod);
        calculations.push(`📌 ${i + 1}. (${matrix[i].map((val, j) => `${val}*${vector[j]}`).join(" + ")}) = ${sum} mod ${mod} = ${result[i]}`);
    }
    return { result, calculations };
}

function modInverse(a, m) {
    a = ((a % m) + m) % m;
    for (let x = 1; x < m; x++) {
        if ((a * x) % m === 1) return x;
    }
    throw new Error("No modular inverse exists");
}

function determinant(matrix) {
    const n = matrix.length;
    if (n === 1) return matrix[0][0];
    if (n === 2) return ((matrix[0][0] * matrix[1][1]) - (matrix[0][1] * matrix[1][0])) % 26;
    
    let det = 0;
    for (let i = 0; i < n; i++) {
        const subMatrix = matrix.slice(1).map(row => row.filter((_, j) => j !== i));
        det += ((i % 2 === 0 ? 1 : -1) * matrix[0][i] * determinant(subMatrix)) % 26;
    }
    return ((det % 26) + 26) % 26;
}

function getInverseMatrix(matrix) {
    const n = matrix.length;
    const det = determinant(matrix);
    if (gcd(det, 26) !== 1) {
        throw new Error("Matrix is not invertible in mod 26");
    }
    const detInv = modInverse(det, 26);
    
    const adjugate = matrix.map((row, i) => 
        row.map((_, j) => {
            const subMatrix = matrix.filter((_, rowIdx) => rowIdx !== i).map(r => r.filter((_, colIdx) => colIdx !== j));
            return (((i + j) % 2 === 0 ? 1 : -1) * determinant(subMatrix) * detInv + 26) % 26;
        })
    );
    
    return adjugate[0].map((_, colIndex) => adjugate.map(row => row[colIndex])); // Transpose
}

function gcd(a, b) {
    return b === 0 ? a : gcd(b, a % b);
}
function encrypt() {
    let text = document.getElementById("inputText").value;
    let size = parseInt(document.getElementById("matrixSize").value);
    let keyMatrix = getMatrix(size);
    if (!keyMatrix) return;
    
    let numericText = textToNumbers(text, size);
    let encryptedText = "";
    let steps = [`📌 1. Конверзија во броеви: ${numericText.join(", ")}`];

    for (let i = 0; i < numericText.length; i += size) {
        let vector = numericText.slice(i, i + size);
        let { result: encryptedVector, calculations } = multiplyMatrixVector(keyMatrix, vector, 26);
        encryptedText += encryptedVector.map(num => String.fromCharCode(num + 65)).join('');
        steps.push(`📌 ${i / size + 2}. ${calculations.join("<br>")}`);
    }

    document.getElementById("result").innerText = encryptedText;
    document.getElementById("steps").innerHTML = steps.join("<br>");
    document.getElementById("toggleStepsBtn").style.display = "block";
    document.getElementById("toggleStepsBtn").style.margin = "10px auto"; 
    document.getElementById("toggleStepsBtn").style.display = "flex"; 
    document.getElementById("toggleStepsBtn").style.justifyContent = "center";
    

}

function decrypt() {
    let text = document.getElementById("inputText").value;
    let size = parseInt(document.getElementById("matrixSize").value);
    let keyMatrix = getMatrix(size);
    if (!keyMatrix) return;

    try {
        let inverseMatrix = getInverseMatrix(keyMatrix);
        let numericText = textToNumbers(text, size);
        let decryptedText = "";
        let steps = [`📌 1. Конверзија во броеви: ${numericText.join(", ")}`];

        for (let i = 0; i < numericText.length; i += size) {
            let vector = numericText.slice(i, i + size);
            let { result: decryptedVector, calculations } = multiplyMatrixVector(inverseMatrix, vector, 26);
            decryptedText += decryptedVector.map(num => String.fromCharCode(num + 65)).join('');
            steps.push(`📌 ${i / size + 2}. ${calculations.join("<br>")}`);
        }

        document.getElementById("result").innerText = decryptedText;
        document.getElementById("steps").innerHTML = steps.join("<br>");
        document.getElementById("toggleStepsBtn").style.display = "block"; 
        document.getElementById("toggleStepsBtn").style.margin = "10px auto"; 
        document.getElementById("toggleStepsBtn").style.display = "flex"; 
        document.getElementById("toggleStepsBtn").style.justifyContent = "center"; 
        
    } catch (error) {
        alert(error.message);
    }
}

function toggleSteps() {
    let stepsDiv = document.getElementById("steps");
    let toggleBtn = document.getElementById("toggleStepsBtn");

    if (stepsDiv.style.display === "none") {
        stepsDiv.style.display = "block";
        toggleBtn.innerText = "❌ Сокриј пресметка";
    } else {
        stepsDiv.style.display = "none";
        toggleBtn.innerText = "📜 Покажи пресметка";
    }
}
