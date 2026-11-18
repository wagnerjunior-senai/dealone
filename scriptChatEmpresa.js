// ==========================================
// DEARY - INTELIGÊNCIA ARTIFICIAL DA DEAR ONE
// ==========================================


// Pegando os elementos da página

const apiKey = document.getElementById("apiKey");
const mensagem = document.getElementById("mensagem");
const btnEnviar = document.getElementById("btnEnviar");
const status = document.getElementById("status");
const resposta = document.getElementById("resposta");


// ==========================================
// FUNÇÃO PARA ENVIAR MENSAGEM
// ==========================================

async function enviarMensagem() {

    const chave = apiKey.value.trim();
    const texto = mensagem.value.trim();


    // Verifica se a chave foi preenchida

    if (chave === "") {

        status.textContent = "Digite sua chave da API.";

        resposta.textContent = "";

        return;
    }


    // Verifica se existe mensagem

    if (texto === "") {

        status.textContent = "Digite uma mensagem.";

        resposta.textContent = "";

        return;
    }


    // Desativa o botão enquanto processa

    btnEnviar.disabled = true;

    btnEnviar.textContent = "Enviando...";


    status.textContent = "Deary está pensando...";

    resposta.textContent = "";


    try {

        // ==========================================
        // ENVIA PARA A OPENAI
        // ==========================================

        const response = await fetch(
            "https://api.openai.com/v1/responses",
            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json",

                    "Authorization": "Bearer " + chave

                },

                body: JSON.stringify({

                    model: "gpt-5.4-nano",

                    instructions:
                        "Você é a Deary, assistente virtual da empresa DEAR ONE, uma loja de personalizados. Sua função é auxiliar com dúvidas gerais sobre a loja de personalização. Responda sempre de forma objetiva e em no máximo 75 tokens. Se a pergunta não for sobre a loja ou uma saudação, responda exatamente: Estou configurado com a função de auxiliar com questões gerais da loja. Esta pergunta foge do meu contexto.",

                    input: texto,

                    max_output_tokens: 75

                })

            }
        );


        // ==========================================
        // CONVERTE A RESPOSTA
        // ==========================================

        const data = await response.json();


        // ==========================================
        // VERIFICA ERRO DA API
        // ==========================================

        if (!response.ok) {

            console.error("Erro da API:", data);

            throw new Error(
                data.error?.message ||
                "Erro ao conectar com a API."
            );

        }


        // ==========================================
        // PEGA O TEXTO DA DEARY
        // ==========================================

        let textoResposta = data.output_text;


        // Caso output_text não exista,
        // procura o texto dentro de output

        if (!textoResposta && data.output) {

            textoResposta = "";

            for (const item of data.output) {

                if (item.type === "message") {

                    for (const content of item.content || []) {

                        if (content.type === "output_text") {

                            textoResposta += content.text;

                        }

                    }

                }

            }

        }


        // ==========================================
        // MOSTRA A RESPOSTA
        // ==========================================

        if (textoResposta) {

            resposta.textContent = textoResposta;

            status.textContent = "Deary respondeu!";

        } else {

            resposta.textContent =
                "A Deary não retornou uma resposta.";

            status.textContent =
                "Resposta vazia.";

        }

    }


    // ==========================================
    // TRATAMENTO DE ERROS
    // ==========================================

    catch (erro) {

        console.error(erro);

        status.textContent =
            "Não foi possível enviar a mensagem.";

        resposta.textContent =
            "Erro: " + erro.message;

    }


    // ==========================================
    // REATIVA O BOTÃO
    // ==========================================

    btnEnviar.disabled = false;

    btnEnviar.textContent = "Enviar";

}



// ==========================================
// CLIQUE NO BOTÃO
// ==========================================

btnEnviar.addEventListener(
    "click",
    enviarMensagem
);



// ==========================================
// ENTER PARA ENVIAR
// ==========================================

mensagem.addEventListener(
    "keydown",
    function(evento) {

        if (
            evento.key === "Enter" &&
            !evento.shiftKey
        ) {

            evento.preventDefault();

            enviarMensagem();

        }

    }
);