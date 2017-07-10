function alert(text, $ionicPopup) {
    var confirmPopup = $ionicPopup.alert({
        title: 'CinePlanet',
        template: '<center>' + text + '</center>',
        buttons: [
            { text: 'Aceptar', type: 'button-positive' }
        ]
    });
}

function requestGetBalance(dni, configFirebase) {
    console.log("Configueacon utils, balance: ", configFirebase);
    var objBalance = {
        "jsonrpc": "2.0",
        "method": "query",
        "params": {
            "type": 1,
            "chaincodeID": {
                "name": configFirebase.name
            },
            "ctorMsg": {
                "function": "getbalance",
                "args": [
                    dni
                ]
            },
            "secureContext": configFirebase.secureContext
        },
        "id": 0
    }
    var data = JSON.stringify(objBalance);
    return data;
}

function requestBuy(dni, totalSoles, coinsCajeados) {
    if (totalSoles === null || totalSoles === "") {
        totalSoles = "0";
    }
    if (coinsCajeados === null || coinsCajeados === "") {
        coinsCajeados = "0";
    }
    console.log("total sols: ", totalSoles);
    console.log("coion canjeados: ", coinsCajeados);

    console.log("request util: ", dni, totalSoles, coinsCajeados);
    var objTransfer =
        {
            "dni": dni,
            "totalSoles": totalSoles,
            "coinsCanjeados": coinsCajeados
        };
    var data = JSON.stringify(objTransfer);
    return data;
}



