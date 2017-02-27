var token = '';
var http = require('http');
const request = require('request');
const fs = require('fs');
var exports = {};
var salesforceInstanceUri = 'https://na40.salesforce.com';
var oauthUri = 'https://login.salesforce.com/services/oauth2/token';
var username = 'ms-testutilsapp@sonomapartners.com',
    password = 'Sonomap1',
    consumerkey = '3MVG9i1HRpGLXp.qv7rBFrY0E3QKuUC_4N2nXzmOnGoyGqprYF.6dqg1O_oib.ySzoL3RoFRAbqxsPB8TrnWG',
    consumersecret = '6667608235763056196';


function processResponse(error, response, body, callback) {
    if (error) {
        console.log("ERROR");
        console.log(error);
    } else {
        try {
            var jsonObject = JSON.parse(body);
            if (callback) {
                callback(jsonObject)
            }
        }
        catch (e) {
            if (callback) {
                callback(body);
            }
        }
    }
}

function submitRequest(requestOptions, callback) {
    request(requestOptions, function(error, response, body) {
        processResponse(error, response, body, callback);
    });
}

function createRequestOptions(uri, method, token, formData) {
    var request = {
            uri: uri,
            method: method
        },
        headers = {
            "Authorization": "Bearer " + token,
            "Cache-Control": "no-cache"
        };

    if (method === "POST") {
        headers["Content-Type"] = "multipart/form-data";
    }
    request["headers"] = headers;

    if (formData) {
        request["formData"] = formData;
    }
    return request;
}

function getToken(callback) {
    var strContent = "?grant_type=password" +
    "&client_id=" + consumerkey +
    "&client_secret=" + consumersecret +
    "&username=" + username +
    "&password=" + password;

    var request = {
            uri: oauthUri + strContent,
            method: 'POST'
        };

    submitRequest(request, function(res) {
        callback(res.access_token);
    });
}

function getObject(object) {
    getToken(function(token) {
        console.log('got token');
        var endpoint = salesforceInstanceUri + '/services/data/v20.0/sobjects/' + object;
        var requestOptions = createRequestOptions(endpoint, 'GET', token);
        submitRequest(requestOptions, print);
    });
}

function print(res) {
    console.log(res);
}

getObject('Account');





