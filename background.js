// Limpa a lista de conexões sempre que uma nova página é carregada
browser.webNavigation.onCommitted.addListener(clearConnections, { url: [{ schemes: ["http", "https"] }] });

// Função para limpar a lista de conexões
function clearConnections(details) {
    thirdPartyConnections = [];
    enviarMensagemParaPopup();
}




// Array para armazenar as conexões a domínios de terceiros
var thirdPartyConnections = [];

// Adiciona um ouvinte para observar as solicitações de rede
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    // Verifica se a solicitação é para um domínio de terceiros
    if (!details.url.startsWith(details.originUrl)) {
      // Obtém o tabId da guia ativa atual
      browser.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        var activeTabId = tabs[0].id;
        // Verifica se o tabId da solicitação é o mesmo que o tabId da guia ativa
        if (details.tabId === activeTabId) {
          console.log("Conexão a domínio de terceiros detectada:", details.url);
          // Adiciona a conexão à lista
          addConnection(details.url);
          // Envie a informação sobre a conexão para o popup
          browser.runtime.sendMessage({ action: "updateConnections", connections: thirdPartyConnections });
        }
      });
    }
  },
  { urls: ["<all_urls>"] },
  ["blocking"]
);



// Função para adicionar uma conexão a domínios de terceiros à lista
function addConnection(connection) {
  thirdPartyConnections.push(connection);
}

// Adiciona um ouvinte para mensagens do popup
browser.runtime.onMessage.addListener(function(message, sender, sendResponse) {
  if (message.action === "getThirdPartyConnections") {
    // Responda com a lista de conexões a domínios de terceiros
    sendResponse({ connections: thirdPartyConnections });
  }
});






// Função para verificar se o navegador foi redirecionado para uma outra URL
function verificarRedirecionamento(details) {
    if (details.statusCode === 301 || details.statusCode === 302) {
        console.log("Redirecionamento detectado para:", details.url);
        exibirMensagem("O navegador foi redirecionado para a URL : " + details.url);
    }
}

// Função para verificar se houve alterações na página inicial
function verificarPaginaInicial(details) {
    browser.browserSettings.homepageOverride.get({}).then(result => {
        if (result.value !== details.url) {
            console.log("Alteração na página inicial detectada para:", details.url);
            exibirMensagem("Houve uma alteração na página inicial para: " + details.url);
        }
    });
}

// Adiciona ouvintes para detectar redirecionamentos e alterações na página inicial
browser.webRequest.onHeadersReceived.addListener(
    verificarRedirecionamento,
    { urls: ["<all_urls>"], types: ["main_frame"] },
    ["responseHeaders"]
);

browser.webNavigation.onCommitted.addListener(
    verificarPaginaInicial,
    { url: [{ schemes: ["http", "https"] }] }
);

// Função para exibir uma mensagem no popup
function exibirMensagem(mensagem) {
    browser.runtime.sendMessage({ action: "exibirMensagem", mensagem: mensagem });
}





