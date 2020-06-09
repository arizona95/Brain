import os
from flask import Flask, send_from_directory
from flask_socketio import SocketIO, emit
from threading import Lock, Thread

myPath = os.path.dirname(os.path.abspath(__file__))
thread = None,
thread_lock=Lock()

static_path = os.path.join("\\".join(myPath.split('\\')[:-1]), "static")
print(static_path)


app = Flask(__name__, static_folder = static_path)
socketio = SocketIO(app)

@app.route('/static/<path:filename>')
def serve_static(filename):
	return send_from_directory(app.static_folder, filename)


@socketio.on("debug_include")
def debug_include(debug_include):
	print("debug_include")
	emit("debug_include",debug_include,broadcast = True)

@socketio.on("debug_info")
def debug_info(debug_info):
	print("debug_info")
	emit("debug_info",debug_info,broadcast = True)


@socketio.on("test")
def test(test):
	print("test")
	emit("test",test,broadcast = True)


def run_flask():
	t = Thread(target= app.run, kwargs = dict(threaded=True, port = 3031, debug=False))
	t.start()

run_flask()
socketio.run(app, host='127.0.0.1', port = 3030)