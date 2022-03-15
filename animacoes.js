var baralho = [] //array com cartas do baralho
var mycards = [] //array com minhas cartas
var oponentcards = [] //array com as cartas do oponente

var cartas_baralho = document.getElementById('cartas_baralho');
var qnt_minhas_cartas = document.getElementById('mycards');
var minhas_cartas = document.getElementById('minhas_cartas');
var pontos_div = document.getElementById('pontos');

function puxar_carta(){
    if (baralho.length > 0){
        if(baralho.length == 1){
            const botaopuxar = document.getElementById("botao_puxar");
            botaopuxar.classList.add("disabled");
            const carta_baralho = document.getElementById("VV");
            carta_baralho.style.visibility = 'hidden';
        }

        const carta_topo = baralho[0];
        mycards.push(carta_topo);
        qnt_minhas_cartas.innerHTML = mycards.length;
        recontar_meus_pontos();
        baralho.shift();
        cartas_baralho.innerHTML = baralho.length;
        const modelo = document.getElementById(carta_topo.naipe);
        let filhos = modelo.children;
        //alert("naipe: "+ carta_topo.naipe);
        filhos[2].innerHTML = carta_topo.letra;
        let clone = modelo.cloneNode(true);
        clone.removeAttribute('id');
        minhas_cartas.appendChild(clone);
    }else{
        alert("baralho não tem cartas");
    }
}

function seleciona_carta(elemento){
    var pilha_descarte = document.getElementById("pilha_descarte");

    var valores_elemento = elemento.children;
    var valores_pilha = pilha_descarte.children;

    alert(valores_elemento[0].innerHTML);
    if(valores_elemento[0].innerHTML === valores_pilha[0].innerHTML || valores_elemento[1].innerHTML  === valores_pilha[1].innerHTML || valores_elemento[0].innerHTML.trim() == "preta"){
        pilha_descarte.innerHTML = elemento.innerHTML;
        pilha_descarte.className = elemento.classList;
    
        var pai = elemento.parentNode;
        pai.removeChild(elemento);
    }else{
        alert("não é possível selecionar essa carta");
    }
}
function criar_cartas(){
    var naipes = ['E','O','P','C'];
    var cartas = ['A','2','3','4','5','6','7','8','9','10','J','Q','K'];

    for(i = 0; i < naipes.length;i++){
        for(c = 0; c < cartas.length;c++){
            const naipe = naipes[i];
            var modelo = document.getElementById(naipe);
            var clone = modelo.cloneNode(true);
            clone.removeAttribute('id');
            var descententes = clone.children;
            descententes[2].innerHTML = cartas[c];
            var row = document.getElementsByClassName("descarte")[0];
            row.appendChild(clone);
        }
    }
}

function connection(){
    let socket = new WebSocket("ws://localhost:9300");

    socket.onopen = function(e) {
        alert("[open] Connection established");
        alert("Sending to server");
        socket.send("My name is John");
    };

    socket.onmessage = function(event) {
        alert(`[message] Data received from server: ${event.data}`);
        var dados = JSON.parse(event.data);
        inserir_cartas_no_baralho(dados['conteudo']);
    };

    socket.onclose = function(event) {
    if (event.wasClean) {
        alert(`[close] Connection closed cleanly, code=${event.code} reason=${event.reason}`);
    } else {
        // e.g. server process killed or network down
        // event.code is usually 1006 in this case
        alert('[close] Connection died');
    }
    };

    socket.onerror = function(error) {
        alert(`[error] ${error.message}`);
    };
}
function inserir_cartas_no_baralho(baralho_json){
    document.getElementById("mycards").innerHTML = baralho_json.length;
    baralho = baralho_json
}

function recontar_meus_pontos(){
    let pontos = 0;
    for (i = 0; i < mycards.length;i++){
        pontos += mycards[i].valor;
    }
    pontos_div.innerHTML = pontos;
}