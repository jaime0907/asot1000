from flask import Flask, render_template, request
import sqlite3
import os
from datetime import datetime
import json

from flask.json import jsonify

database = os.path.join(os.getcwd(), 'asot1000.db')

def get_db_connection():
    conn = sqlite3.connect(database)
    conn.row_factory = sqlite3.Row
    return conn

app = Flask(__name__, static_folder='static')

@app.route('/')
def index():
    nowiso = datetime.now().isoformat()
    conn = get_db_connection()
    c = conn.cursor()

    c.execute('select * from songs where time <= ? order by time desc', (nowiso,))
    row = c.fetchone()
    song = {}
    song['number'] = row['number']
    song['orden'] = row['orden']
    song['artist'] = row['artist'].upper()
    song['title'] = row['title'].upper()
    time = datetime.fromisoformat(row['time'])
    song['time'] = time.strftime('%a %d %H:%M').upper()
    color = 220 + song['orden']*360/969
    if song['number'].startswith('YM'):
        color = 330 + song['orden']*360/16
    song['color'] = color

    return render_template('main.html', currentsong=song)

@app.route('/data',methods=["POST"])
def getData():
    if request.method == "POST":
        nowiso = datetime.now().isoformat()
        conn = get_db_connection()
        c = conn.cursor()
        c.execute('select * from songs where time >= ? order by time', (nowiso,))
        rows = c.fetchall()
        songs = []
        for row in rows:
            song = {}
            song['number'] = row['number']
            song['orden'] = row['orden']
            song['artist'] = row['artist'].upper()
            song['title'] = row['title'].upper()
            song['time'] = row['time']
            color = 220 + song['orden']*360/969
            if song['number'].startswith('YM'):
                color = 330 + song['orden']*360/16
            
            song['color'] = color
            songs.append(song)
        return json.dumps(songs)
        

if __name__ == '__main__':
    app.run(threaded=True, debug=True, host='0.0.0.0')