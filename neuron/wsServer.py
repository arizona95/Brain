from flask_socketio import SocketIO, emit, send
from flask import Response, Flask
import time

app =Flask(__name__)
app.secret_key = "mysecret"
socketio = SocketIO(app)


@socketio.on('connect')
def connect():
    print('connect!')


@socketio.on("mlStart")
def mlStart(message):
    print("mlStart!")

@socketio.on("epoch_edit")
def epochEdit(epoch):
    print("epoch_edit!")
    emit('epoch_edit', epoch, broadcast=True)


socketio.run(app, host='localhost', port=3030)
