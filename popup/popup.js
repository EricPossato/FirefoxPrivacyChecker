//geet cookies on page load
document.addEventListener("DOMContentLoaded", () => {
  browser.tabs.query({active: true, currentWindow: true}, function(tabs) {
    var activeTab = tabs[0];
    browser.tabs.sendMessage(activeTab.id, {action: "fetchLocalStorage"});
    browser.tabs.sendMessage(activeTab.id, {type: "fetchCookies"});
  });
}
);


// Envia uma mensagem para o background.js solicitando as conexões a domínios de terceiros
browser.runtime.sendMessage({ action: "getThirdPartyConnections" }, function(response) {
    var connectionsList = document.getElementById("connectionsList");
    // Limpa a lista antes de adicionar novas conexões
    connectionsList.innerHTML = "";
    // Adiciona cada conexão à lista no popup.html
    response.connections.forEach(function(connection) {
      var listItem = document.createElement("li");
      listItem.textContent = connection;
      connectionsList.appendChild(listItem);
    });
  });
  


// Função para atualizar a mensagem exibida no popup
function atualizarMensagem(mensagem) {
    var mensagemDiv = document.getElementById("mensagem");
    mensagemDiv.textContent = mensagem;
}

// Adiciona um ouvinte para receber mensagens do background.js
browser.runtime.onMessage.addListener(function(message) {
    if (message.action === "exibirMensagem") {
        atualizarMensagem(message.mensagem);
    }
    if (message.type === "getLocalStorage") {
        document.getElementById("localStorage").textContent = message.data;
    }
    if (message.type === "getCookies") {
        document.getElementById("cookies").textContent = "Cookies: " + message.data;
    }
});


