const requestToken = "https://api.codenation.dev/v1/challenge/dev-ps/generate-data?token=35ebda70bdc6f30b7f07abc22da326be0ed3c6e1"
const sendToken = "https://api.codenation.dev/v1/challenge/dev-ps/submit-solution?token=35ebda70bdc6f30b7f07abc22da326be0ed3c6e1"
const axios = require('axios')
const sha1 = require('sha1')

const FormData = require('form-data')
const Blob = require('blob')
const fs = require('fs');
const fsPromise = require('fs').promises;

const alfabeto = "abcdefghijklmnopqrstuvwxyz".split('');

function cifra(cripted, num) {
    let frase = ""
    for (i of cripted) {
        const posicao = alfabeto.indexOf(i)
        if (posicao < num && posicao != -1) {
            frase += alfabeto[alfabeto.length - num + posicao]
        } else if (posicao == -1) {
            frase += i
        } else {
            frase += alfabeto[posicao - num];
        }
    }
    return frase;
}


async function obterCifra() {
    let resposta = await axios.get(requestToken)
    fs.writeFileSync("answer.json", resposta)
    const descriptografar = cifra(resposta.data.cifrado, resposta.data.numero_casas);
    resposta.data.decifrado = descriptografar;

    resposta.data.resumo_criptografico = sha1(descriptografar);
    fs.writeFileSync("answer.json", JSON.stringify(resposta.data));
}
obterCifra();

async function enviarCifra() {
    try {
        const body = await fsPromise.readFile('./answer.json', 'utf8')
        let bodyFormData = new FormData();
        bodyFormData.append('file', body)
        console.log(body)
        const response = await axios.post(sendToken, bodyFormData , {
            headers:bodyFormData.getHeaders()})
        console.log(response)
    } catch (error) {
        console.log(error);
    }
}



async function enviar(streamFile) {
    let bodyFormData = new FormData();
    //console.log(streamFile)
    bodyFormData.append('answer.json', streamFile)
    //  console.log(bodyFormData);
    let response = await axios({
        method: 'post',
        url: sendToken,

        data: bodyFormData,
    })
    // console.log(response);

}
enviarCifra();