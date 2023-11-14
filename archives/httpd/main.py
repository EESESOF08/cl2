from flask import Flask, render_template,send_from_directory, redirect, abort, url_for, request, jsonify
from markupsafe import escape
from pprint import pprint
import os
import json


DATA_DIRECTORY = "data"

app = Flask(__name__)

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/favicon.ico')
def favicon():
    return send_from_directory(app.static_folder, 'favicon.ico', mimetype='image/vnd.microsoft.icon')

@app.route('/load/<string:key>', methods=['GET'])
def archive(key):
    pprint(key)
    filename = f"data_{key}.json"
    path      = os.path.join(DATA_DIRECTORY, filename)

    print("YES")
    print(path)
    if (os.path.exists(path)):
        print("YES3")
        with open(path, 'r') as file:
            pprint("YES2")
            bb = file.read()
            print(bb)

        return jsonify(bb)
    else:
        return jsonify({"status":"error" })

    #return render_template('index.html')

@app.route('/save/<string:key>', methods=['POST'])
def new_archive(key):

    print("key:")
    print(key)
    data = request.get_json()
    if not data:
        json_data = request.get_json()
    json_data = json.dumps(data, indent=4)
    print(json_data)

    #filename  = f"data_{os.urandom(6).hex()}.json"

    filename = f"data_{key}.json"
    path      = os.path.join(DATA_DIRECTORY, filename)

    if (os.path.exists(path)):
        os.rename(path, f"{path}_{os.urandom(6).hex()}")

    with open(path, 'w') as file:
        file.write(json_data)

    return jsonify({"status":"success", "file":filename})

if __name__ == '__main__':
    app.run(debug=True)
