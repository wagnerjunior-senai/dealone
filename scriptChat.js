const MODELO = "gpt-5.4-nano";
const API_URL = "https://api.openai.com/v1/chat/completions";

const inputApiKey = document.getElementById("apiKey");
const inputMensagem = document.getElementById("mensagem");
const btnEnviar = document.getElementById("btnEnviar");
const divResposta = document.getElementById("resposta");

async function enviarMensagem() {
    const apiKey = inputApiKey.value.trim();
    const mensagem = inputMensagem.value.trim();

    if (!apiKey) {
        divResposta.textContent = "⚠️ Informe a chave da API.";
        return;
    }

    if (!mensagem) {
        divResposta.textContent = "⚠️ Digite uma mensagem.";
        return;
    }

    btnEnviar.disabled = true;
    btnEnviar.textContent = "Enviando...";
    divResposta.textContent = "⏳ Aguardando resposta...";

    try {
        const resposta = await fetch(API_URL, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: MODELO,
                messages: [
                    { role: "system", content: "Você é um assistente inteligente e prestativo." },
                    { role: "user", content: mensagem }
                ]
            })
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            const erro = dados.error?.message || `Erro HTTP ${resposta.status}`;
            throw new Error(erro);
        }

        divResposta.textContent = dados.choices?.[0]?.message?.content || "Sem resposta do modelo.";
    } catch (erro) {
        divResposta.textContent = "❌ Erro: " + erro.message;
    } finally {
        btnEnviar.disabled = false;
        btnEnviar.textContent = "Enviar";
    }
}

btnEnviar.addEventListener("click", enviarMensagem);

// Ctrl + Enter envia a mensagem
inputMensagem.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.key === "Enter") {
        enviarMensagem();
    }
});