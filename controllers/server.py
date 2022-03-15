from baralho21 import *
import asyncio
import websockets
import json

baralho = Auxiliar.devolver_baralho_embaralhado() # baralho embaralhado

bot = Bot(baralho)                      #Objeto bot
baralho = bot.jogar()                   #Bot puxa suas cartas
cartas_bot = bot.returnCartas()         #Bot retorna suas cartas numa lista
#bot.mostrar_cartas()       
#print(bot.pontos())                     


#Código do servidor
porta_servidor = 9300
print("Servidor ouvindo na Porta %d"  % (porta_servidor))

async def echo(websocket):
    print("Cliente conectado!")
    flag = Flag("b",cartas_bot,baralho).to_json()
    await websocket.send(flag)
    try:
        async for message in websocket:
            pass
            
    except websockets.exceptions.ConnectionClosed as e:
        print("Cliente desconectado")

start_server = websockets.serve(echo, "localhost", porta_servidor)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()






