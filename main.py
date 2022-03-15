from baralho21 import *
import asyncio
import websockets
import json

baralho = Auxiliar.devolver_baralho_embaralhado() #str
print (baralho)
chupeta = Lista_usuario()
jogadores = 0

#baralho = json.loads(baralho) #lista
#print(baralho)
# while(chupeta.somar_valor() <= 17):
#      chupeta.puxar_carta(baralho.pop(0))

# chupeta.mostrar_cartas()
# print (chupeta.somar_valor())
porta_servidor = 9300
print("Servidor ouvindo na Porta %d"  % (porta_servidor))

async def echo(websocket):
    print("Cliente conectado!")
    flag = Flag("b",baralho).to_json()
    await websocket.send(flag)   
    try:
        async for message in websocket:
            pass
            
    except websockets.exceptions.ConnectionClosed as e:
        print("Cliente desconectado")

start_server = websockets.serve(echo, "localhost", porta_servidor)
asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()






