from socketIO_client import SocketIO

socketIO = SocketIO('localhost',3030)

send = {1:"ㅅㅂ"}

socketIO.emit('test',send)