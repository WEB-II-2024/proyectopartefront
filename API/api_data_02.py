from datetime import datetime
import random
from pymongo import MongoClient
from bson.objectid import ObjectId
from werkzeug.utils import secure_filename
from io import BytesIO
import requests

conex = MongoClient(host=['localhost:27017'])
db = conex.apiData_02

from flask import Flask, jsonify, abort, make_response, request
from flask_cors import CORS

# Crear la aplicación Flask
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

# Descargar firma digital 
def descargar_firma_digital(id_contribuyente, idType):
    url_api_externa = 'https://localhos:5001/bank'
    payload = {'id_contribuyente': id_contribuyente, 'idType':idType}

# registrar un nuevo contribuyente
@app.route('/contribuyente', methods=['POST'])
def registrar_contribuyente():
    if 'publicKeyFile' not in request.files:
        return jsonify({'estado': 'Archivo de clave pública es requerido'}), 400

    if not all(k in request.form for k in ('name', 'type', 'id_number', 'address', 'email', 'digital_signature')):
        return jsonify({'estado': 'Datos del formulario incompletos'}), 400

    firma_digital = request.form['digital_signature']
    numero_id = request.form['id_number']
    id_type = request.form['type']

    public_key_file = request.files['publicKeyFile']
    public_key_file_stream = BytesIO(public_key_file.read())
    files = {'publicKeyFile': (public_key_file.filename, public_key_file_stream, public_key_file.content_type)}
    
    #url_api_externa = 'https://localhost:5001/bank/validate-signature'
    #payload = {
    #    'idNumber': numero_id,
    #    'idType': id_type,
    #    'signature': firma_digital
    #}
    #try:
    #    response = requests.post(url_api_externa, data=payload, files=files)
    #    response.raise_for_status()
    #    resultado = response.json()

        # Verifica si la firma es válida según la respuesta de la API externa
    #    if resultado.get('message') != 'Signature is valid':
    #        return jsonify({'estado': 'Firma digital inválida.'}), 400

    #except requests.RequestException as e:
    #    return jsonify({'estado': 'Error al validar la firma digital.', 'error': str(e)}), 500

    contribuyente = {
        'nombre': request.form['name'],
        'tipo': request.form['type'],
        'numero_id': request.form['id_number'],
        'direccion': request.form['address'],
        'correo_electronico': request.form['email'],
        'firma_digital': request.form['digital_signature']
    }
    
    try:
        # Suponiendo que tienes la lógica para guardar en base de datos
        # Ejemplo:
        db.contribuyentes.insert_one(contribuyente)
        return jsonify({'estado': 'Contribuyente registrado exitosamente'}), 201
    except:
        abort(500)


# modificar los datos de un contribuyente
@app.route('/contribuyente/<string:id>', methods=['PUT'])
def modificar_contribuyente(id):
    if not request.json:
        abort(400)
    try:
        contribuyente = db.contribuyentes.find_one({"_id": ObjectId(id)})
        if not contribuyente:
            abort(404)
        db.contribuyentes.update_one({'_id': ObjectId(id)}, {'$set': request.json})
        return jsonify({'estado': 'Datos del contribuyente actualizados exitosamente'})
    except:
        abort(500)

# eliminar a un contribuyente
@app.route('/contribuyente/<string:id>', methods=['DELETE'])
def dar_baja_contribuyente(id):
    try:
        contribuyente = db.contribuyentes.find_one({"_id": ObjectId(id)})
        if not contribuyente:
            abort(404)
        db.contribuyentes.delete_one({'_id': ObjectId(id)})
        return jsonify({'estado': 'Contribuyente dado de baja exitosamente'})
    except:
        abort(500)

# verificar una factura
@app.route('/factura', methods=['POST'])
def emitir_factura():
    if not request.json or not all(k in request.json for k in ('id_contribuyente', 'numero_factura', 'fecha', 'items', 'monto_total', 'firma_digital')):
        abort(400)
    
    factura = {
        'id_contribuyente': request.json['id_contribuyente'],
        'numero_factura': request.json['numero_factura'],
        'fecha': request.json['fecha'],
        'items': request.json['items'],
        'monto_total': request.json['monto_total'],
        'firma_digital': request.json['firma_digital']
    }
    
    try:
        contribuyente = db.contribuyentes.find_one({"_id": ObjectId(factura['id_contribuyente'])})
        if not contribuyente:
            abort(404)
        #if not validar_firma_digital(factura['firma_digital'], contribuyente['numero_id']):
        #    return jsonify({'estado': 'Firma digital inválida'}), 400
        db.facturas.insert_one(factura)
        return jsonify({'estado': 'Factura emitida exitosamente', 'factura_id': str(factura['_id'])}), 201
    except:
        abort(500)

# flask
if __name__ == '__main__':
    app.run(debug=True, port=5000)