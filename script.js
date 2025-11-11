
const fs = require('fs');

const readline = require('readline');

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function perguntar(pergunta) {
    return new Promise((resolve) => {
        rl.question(pergunta, (resposta) => resolve(resposta));
    });
}

// Valores das frotas
function getFrota() {
    let dataFrota = fs.readFileSync('frota.json', 'utf8')
    return JSON.parse(dataFrota);
}
function getMotoristas() {
    let dataMotoristas = fs.readFileSync('motoristas.json', 'utf8')
    return JSON.parse(dataMotoristas);
}
function setFrota(obj) {
    fs.writeFileSync('frota.json', JSON.stringify(obj, null, 2), 'utf8');
}
function setMotoristas(obj) {
    fs.writeFileSync('motoristas.json', JSON.stringify(obj, null, 2), 'utf8');
}
//fim valores frotas

//visual
function verMotorista(obj) {
    for (let elements in obj) {
        console.log("Nome do motorista: " + obj[elements].nome + "\nCNH do motorista: " + obj[elements].cnh + "\nStatus: " + obj[elements].status + "\nVeiculo atual: " + obj[elements].veiculoAtual + "\n\n");
    }
}
function verFrota(obj) {
    for (let elements in obj) {
        console.log("Placa do veiculo: " + obj[elements].placa + "\nModelo do veiculo: " + obj[elements].modelo + "\nStatus: " + obj[elements].disponivel + "\nQuilometragem do veiculo: " + obj[elements].quilometragem + "\nCapacidade do veiculo em KG: " + obj[elements].capacidadeKg + "\n\n");
    }
}
//fim visual



//Validaçoes de frota
function verificarExistenciaPlaca(placa, obj) {

    for (let elements in obj) {
        if (placa == obj[elements].placa) {
            console.log("Placa existente digite uma placa valida!");
            return true;
        }
    }
    return false;
}


function validarPlaca(placa, obj) {
    let valor = (/[A-Z]{3}[0-9][A-Z][0-9]{2}$/).test(placa);
    if (!valor) {
        console.log("Valor fora do formato de uma placa AAA1A11!");
        return !valor;
    }
    return verificarExistenciaPlaca(placa, obj);
}


async function addFrota(obj) {
    let placa = await perguntar('Qual a placa do veiculo? ');

    while (validarPlaca(placa, obj)) {
        placa = await perguntar('Qual a placa do veiculo? ');
    }

    let modelo = await perguntar('Qual o modelo do veiculo? ');
    let cap = parseInt(await perguntar('Qual a capacidade em KG? '));
    let quilometragem = parseInt(await perguntar('Qual a placa do veiculo? '));

    obj.push({ palca: placa, modelo: modelo, capacidadeKg: cap, disponivel: true, quilometragem: quilometragem });
    setFrota(obj);
}
//fim validação de frota
//Validação motorista

function validarExistenciaCnh(cnh, obj) {
    for (let elements in obj) {
        if (cnh == obj[elements].cnh) {
            console.log("CNH existente digite uma CNH valida!");
            return true;
        }
    }
    return false;
}

function validarCnh(cnh, obj) {
    let valor = (/[A-Z][0-9]{7}$/).test(cnh);
    if (!valor) {
        console.log("Valor fora do formato da CNH A1111111!");
        return !valor;
    }
    return validarExistenciaCnh(cnh, obj);
}

async function addMotorista(obj) {
    let carteiraMotorista = await perguntar('Qual a CNH do motorista? ');

    while (validarCnh(carteiraMotorista, obj)) {
        carteiraMotorista = await perguntar('Qual a CNH do Motorista? ');
    }

    let nome = await perguntar('Qual o Nome do motorista? ');

    obj.push({ cnh: carteiraMotorista, nome: nome, status: "livre", veiculoAtual: null });
    setMotoristas(obj);
}
//Fim validação motorista
//designar
function buscarVeiculo(placa, obj){
    for(let elements in obj){
        if(placa == obj[elements].placa){
            return elements;
        }
    }
    return null;
}
function buscarMotorista(cnh, obj){
    for(let elements in obj){
        if(cnh == obj[elements].cnh){
            return elements;
        }
    }
    return null;
}
async function designarParaViagem(objMotorista, objFrota){
    let carteiraMotorista = await perguntar('Qual a CNH do motorista? ');
    let placa = await perguntar('Qual a placa do veiculo? ');
    let carteirasN = buscarMotorista(carteiraMotorista, objMotorista);
    let placaN = buscarVeiculo(placa, objFrota);
    if(carteirasN == null || placaN == null){
        console.log("Carteira ou placa invalida");
        return
    }
    objMotorista[carteirasN].veiculoAtual = objFrota[placaN].placa;
    objFrota[placaN].disponivel = false;
    addFrota(objFrota);
    addMotorista(objMotorista);
    rl.close();
}




//fim designar

/*
while (true) {
    let input = await perguntar('Digite a opção: ');

    switch (input) {
        case 'vf':
            verFrota(getFrota());
            break;
        case 'vm':
            verMotorista(getMotoristas());
            break;
        case 'vadd':
            addFrota(getFrota());
            break;
        case 'madd':
            addMotorista(getMotoristas());
            break;
        case 'designar':
            designarParaViagem(getMotoristas(), getFrota());
            break;
        case 'encerrar':
            // ...
            break;
        case 'relatorio':
            // ...
            break;
        case 'help':
            console.log(`
                Comandos disponíveis:
                ----------------------------------
                vf         → Ver frota
                vm         → Ver motoristas
                vadd       → Adicionar veículo à frota
                madd       → Adicionar motorista
                designar   → Designar motorista a veículo
                encerrar   → Encerrar viagem
                relatorio  → Gerar relatório
                exit       → Encerrar o programa
                help       → Mostrar esta lista de comandos
                ----------------------------------
                `);
            break;
        case 'exit':
            console.log("Fim da operação");
            rl.close();
            break;
        default:
            console.log("Insira um valor valido!");
            break;
    }

    break;
}
    */