var socket;

var baralho = [] //array com cartas do baralho
var mycards = [] //array com minhas cartas
var oponentcards = [] //array com as cartas do oponente

var cartas_baralho = document.getElementById('cartas_baralho');
var qnt_minhas_cartas = document.getElementById('mycards');
var minhas_cartas = document.getElementById('minhas_cartas');
var pontos_div = document.getElementById('pontos');

function encerrar_vez(){
    mostrar_cartas_oponente();

    var pontos_oponente = 0;
    for (i = 0; i < oponentcards.length;i++){
        pontos_oponente += oponentcards[i].valor;
    }

    var meus_pontos = parseInt(pontos_div.innerHTML);
    alert("PONTOS COMPUTADOR: "+pontos_oponente+"\nSEUS PONTOS: "+meus_pontos);
    if(pontos_oponente > 21 && meus_pontos > 21){
        alert("Empate!");
    }else if(pontos_oponente > 21){
        alert("Você venceu!");
    }else if(meus_pontos > 21){
        alert("O computador venceu!");
    }else if(pontos_oponente == meus_pontos){
        alert("Empate");
    }else if(pontos_oponente > meus_pontos){
        alert("O computador venceu!");
    }else{
        alert("Você venceu!");
    }

    desabilitar_botoes();
    socket.close();
}

function mostrar_cartas_oponente(){
    //Removendo cartas viradas
    const opo_cards = document.getElementById('cartas_do_oponente');
    const filhos = opo_cards.children;
    if(filhos.length > 2){
        while(filhos.length > 2){
            opo_cards.removeChild(filhos[filhos.length-1]);
            i++;
        }
    }
    //Inserindo cartas com face voltada para cima
    
    i = 0
    while(i < oponentcards.length){
        const modelo = document.getElementById(oponentcards[i].naipe);
        const clone = modelo.cloneNode(true);
        clone.removeAttribute('id');
        let filhos = clone.children;
        filhos[2].innerHTML = oponentcards[i].letra;
        opo_cards.appendChild(clone);
        i++;
    }
}
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
    socket = new WebSocket("ws://localhost:9300");

    socket.onopen = function(e) {
        alert("Conexão estabelecida com o servidor");
        let texto = "Cartas nominais/númericas [0-10]: têm valor igual ao número da carta\nCarta especiais, como A,J,Q,K valem 1";
        //alert("Sending to server");
        alert(texto);
        socket.send("My name is John");
    };

    socket.onmessage = function(event) {
        //alert(`[message] Data received from server: ${event.data}`);
        var dados = JSON.parse(event.data);
        inserir_cartas_no_baralho(dados);
    };

    socket.onclose = function(event) {
        if (event.wasClean) {
            alert('Conexão fechada!');
        } else {
            // e.g. server process killed or network down
            // event.code is usually 1006 in this case
            alert('Conexão encerrada!');
        }
    };

    socket.onerror = function(error) {
        alert(`[error] ${error.message}`);
    };
}
function inserir_cartas_no_baralho(baralho_json){
    document.getElementById("mycards").innerHTML = baralho_json['conteudo'].length;
    document.getElementById("adversarycards").innerHTML = baralho_json['conteudo_oponente'].length;
    baralho = baralho_json['conteudo'];
    oponentcards = baralho_json['conteudo_oponente'];
    mostrar_cartas_oponente_viradas();
}


function mostrar_cartas_oponente_viradas(){
    const modelo = document.getElementById('V');
    const opo_cards = document.getElementById('cartas_do_oponente');
    for (i = 0;i < oponentcards.length;i++){
        const clone = modelo.cloneNode(true);
        clone.removeAttribute('id');
        opo_cards.appendChild(clone);
    }
}

function recontar_meus_pontos(){
    let pontos = 0;
    for (i = 0; i < mycards.length;i++){
        pontos += mycards[i].valor;
    }
    pontos_div.innerHTML = pontos;
}

function desabilitar_botoes(){
    const botaopuxar = document.getElementById("botao_puxar");
    botaopuxar.classList.add("disabled");
    const botaoencerrar = document.getElementById("botao_encerrar");
    botaoencerrar.classList.add("disabled");
    const carta_baralho = document.getElementById("VV");
    carta_baralho.style.visibility = 'hidden';
}