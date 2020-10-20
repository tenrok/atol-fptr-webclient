// FptrWebServer API
var FptrAPI = (function () {
	'use strict';

	var addr = 'http://127.0.0.1:16732/api/v2/',
			deviceId;

	function API() {
		this.addr = addr;
		this.deviceId = deviceId;
		this._initialized = false;
	}

	/**
	 * Инициализирует
	 * @returns {undefined}
	 */
	API.prototype.init = function () {
		this._initialized = true;
	};

	/**
	 * Генерирует UUID v4
	 * @returns {String}
	 */
	API.prototype._createUUID = function () {
		var dt = new Date().getTime();
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
			var r = (dt + Math.random() * 16) % 16 | 0;
			dt = Math.floor(dt / 16);
			return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
		});
		return uuid;
	};

	/**
	 * Выполняет GET-запрос
	 * @param {String} url
	 * @returns {jqXHR}
	 */
	API.prototype.get = function (url) {
		return $.ajax({
			url: this.addr + url,
			type: 'GET',
			dataType: 'json'
		});
	};

	/**
	 * Выполняет POST-запрос
	 * @param {String} url
	 * @param {Object} obj
	 * @returns {jqXHR}
	 */
	API.prototype.post = function (url, obj) {
		return $.ajax({
			url: this.addr + url,
			type: 'POST',
			data: JSON.stringify($.extend({deviceID: this.deviceId}, obj)),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json'
		});
	};

	/**
	 * Выполняет PUT-запрос
	 * @param {String} url
	 * @param {Object} obj
	 * @returns {jqXHR}
	 */
	API.prototype.put = function (url, obj) {
		return $.ajax({
			url: this.addr + url,
			type: 'PUT',
			data: JSON.stringify($.extend({deviceID: this.deviceId}, obj)),
			contentType: 'application/json; charset=utf-8',
			dataType: 'json'
		});
	};

	/**
	 * Получает информацию о сервере
	 * @returns {jqXHR}
	 */
	API.prototype.getServerInfo = function () {
		return this.get('serverInfo');
	};

	/**
	 * Получает настройки веб-сервера
	 * @returns {jqXHR}
	 */
	API.prototype.getSettings = function () {
		return this.get('settings');
	};

	/**
	 * Изменяет настройки веб-сервера
	 * @param {Object} obj
	 * @returns {jqXHR}
	 */
	API.prototype.setSettings = function (obj) {
		return this.put('settings', obj);
	};

	/**
	 * Запрашивает информацию о ККТ
	 * @returns {jqXHR}
	 */
	API.prototype.queryDeviceInfo = function () {
		return this.post('operations/queryDeviceInfo', null);
	};

	/**
	 * Запрашивает статус ККТ
	 * @returns {jqXHR}
	 */
	API.prototype.queryDeviceStatus = function () {
		return this.post('operations/queryDeviceStatus', null);
	};

	/**
	 * Запрашивает информацию о смене в ККТ
	 * @returns {jqXHR}
	 */
	API.prototype.queryShiftStatus = function () {
		return this.post('operations/queryShiftStatus', null);
	};

	/**
	 * Запрос сменных счётчиков
	 * @returns {jqXHR}
	 */
	API.prototype.queryShiftTotals = function () {
		return this.post('operations/queryShiftTotals', null);
	};

	/**
	 * Запрос сменных счетчиков по внесениям
	 * @returns {jqXHR}
	 */
	API.prototype.queryIncomeTotals = function () {
		return this.post('operations/queryIncomeTotals', null);
	};

	/**
	 * Запрос сменных счетчиков по выплатам
	 * @returns {jqXHR}
	 */
	API.prototype.queryOutcomeTotals = function () {
		return this.post('operations/queryOutcomeTotals', null);
	};

	/**
	 * Запрос сменных счетчиков по чекам
	 * @param {Object} obj
	 * @returns {jqXHR}
	 */
	API.prototype.queryReceiptTotals = function (obj) {
		return this.post('operations/queryReceiptTotals', obj);
	};

	/**
	 * Запрос информации о ФН
	 * @returns {jqXHR}
	 */
	API.prototype.queryFnInfo = function () {
		return this.post('operations/queryFnInfo', null);
	};

	/**
	 * Запрос статуса ФН
	 * @returns {jqXHR}
	 */
	API.prototype.queryFnStatus = function () {
		return this.post('operations/queryFnStatus', null);
	};

	/**
	 * Запрос статуса обмена с ОФД
	 * @returns {jqXHR}
	 */
	API.prototype.queryOfdExchangeStatus = function () {
		return this.post('operations/queryOfdExchangeStatus', null);
	};

	/**
	 * Добавляет новое JSON-задание для ККТ
	 * @param {Object} obj
	 * @returns {jqXHR}
	 */
	API.prototype.request = function (obj) {
		return this.post('requests', $.extend({uuid: this._createUUID(), request: []}, obj));
	};

	/**
	 * Открывает смену
	 * @param {String} operatorName  ФИО кассира
	 * @param {String} operatorVatin ИНН кассира
	 * @returns {jqXHR}
	 */
	API.prototype.openShift = function (operatorName, operatorVatin) {
		return this.request({
			//uuid: this._createUUID(), // Необязательно, т.к. uuid генерируется в request
			request: [
				{
					type: 'openShift',
					operator: {
						name: operatorName || '',
						vatin: operatorVatin + ''
					}
				}
			]
		});
	};

	/**
	 * Закрывает смену
	 * @param {String} operatorName  ФИО кассира
	 * @param {String} operatorVatin ИНН кассира
	 * @returns {jqXHR}
	 */
	API.prototype.closeShift = function (operatorName, operatorVatin) {
		return this.request({
			//uuid: this._createUUID(), // Необязательно, т.к. uuid генерируется в request
			request: [
				{
					type: 'closeShift',
					operator: {
						name: operatorName || '',
						vatin: operatorVatin + ''
					}
				}
			]
		});
	};

	/**
	 * Получает результат выполнения задания
	 * @param {String} uuid       Идентификатор задания
	 * @param {Function} callback Callback-функция
	 * @returns {undefined}
	 */
	API.prototype.getResult = function (uuid, callback) {
		var self = this;
		this.get('requests/' + uuid).done(function (data) {
			if (data.results) {
				if (data.results[0].status === 'inProgress') { // Задание ещё не выполнено
					// Повторно запрашиваем результат
					setTimeout(function () {
						self.getResult(uuid, callback);
					}, 1000);
					return;
				}
			}
			if (callback && typeof callback === 'function') {
				callback(data);
			}
		});
	};

	var api = new API();
	api.init();
	api.API = API;
	return api;
})();

// Задание ещё выполняется
//{
//	"results": [
//		{
//			"error": {
//				"code": 0,
//				"description": ""
//			},
//			"status": "inProgress",
//			"result": null
//		}
//	]
//}
