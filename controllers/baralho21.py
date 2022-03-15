import random
import json
class Carta(object):
    def __init__(self,letra,naipe):
        self.letra = letra
        self.naipe = naipe

        if(self.letra == 'A' or self.letra == 'J' or self.letra == 'Q' or self.letra == 'K'):
            self.valor =  1
        else:
            self.valor = int(self.letra)
    
    def getValor(self):
        return self.valor
    
    def show(self):
        print ("letra: %s, naipe: %s, valor: %d" % (self.letra,self.naipe,self.valor))

class Auxiliar(object):
    def get_naipes():
        return ['E','C','P','O']

    def get_cartas():
        return ['A','2','3','4','5','6','7','8','9','10','J','Q','K']

    def devolver_baralho_embaralhado():
        baralho = []
        for naipe in Auxiliar.get_naipes():
            for c in Auxiliar.get_cartas():
                carta = Carta(c,naipe)
                baralho.append(carta)

        chupeta = Lista_usuario()

        random.shuffle(baralho)
        return baralho
    
class Lista_usuario():
    def __init__(self) -> None:
        self.lista = []
    def puxar_carta(self,carta):
        c = Carta(carta['letra'],carta['naipe'])
        self.lista.append(c)

    def somar_valor(self):
        soma = 0
        for carta in self.lista:
            soma += carta.getValor()
        return soma
    
    def mostrar_cartas(self):
        for carta in self.lista:
            carta.show()

    def to_json(self):
        return json.dumps(self, indent = 4, default=lambda o: o.__dict__)

class Flag:
    def __init__(self,flag,co,conteudo) -> None:
        self.flag = flag
        self.conteudo_oponente = co
        self.conteudo = conteudo
        

    def to_json(self):
        return json.dumps(self, indent = 4, default=lambda o: o.__dict__)

class Bot:
    def __init__(self,baralho):
        self.baralho = baralho
        self.minhas_cartas = []
    
    def pontos(self):
        pontos = 0
        for carta in self.minhas_cartas:
            pontos += carta.getValor()
        return pontos
    
    def jogar(self):
        while (self.pontos() < 17):
            self.minhas_cartas.append(self.baralho.pop())
        return self.returnBaralho()

    def returnBaralho(self):
        return self.baralho    

    def mostrar_cartas(self):
        for carta in self.minhas_cartas:
            carta.show()
    
    def returnCartas(self):
        return self.minhas_cartas
        
        

    
