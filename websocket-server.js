var socketServer=require('ws');
var http=require('http');
var path=require('path');
var fs=require('fs');

var server=http.createServer(function(req, res){
    var filepath='./'+req.url;
    if(filepath == './'){
        filepath='./index.html';
    }
    var contentType='text/html';
    fs.readFile(filepath, function(err, con){
        if(err){
            res.writeHead(400);
            res.end();
        } else {
            res.writeHead(200, { 'ContentType' : contentType });
            res.end(con, 'utf-8');
        }
    });
});

var socket = new socketServer({ server });
socket.on('connection', function(ws){
    ws.on('open', function(){
        console.log('connection open');
    });

    ws.on('message', function(msg){
        msg=JSON.parse(msg);
        console.log('msg from client', msg);

        switch(msg.type){
            case 'login':
            clientDataList = updateList({ 'user': msg.name, 'status': 'online' }, clientDataList);
            // console.log('list of online users',clientDataList); 
            ws.personName = msg.name;
            socket.clients.forEach(function e(client) {
                // if(client!=ws){
                client.send(JSON.stringify({
                    clientlist: clientDataList,
                    type: 'notify',
                    currentUser:ws.personName
                }));
                // }
            });
            break;

            case 'call':
            // console.log('call msg====================',msg);
            // console.log('call person name============',ws.personName);
            socket.clients.forEach(function e(client) {
                 console.log('client is calling',client.personName);
                 console.log(msg)
                if (client != ws) {
                    // console.log('inside if')
                    let data=JSON.stringify({
                        sender: msg.sender,
                        receiver: msg.receiver,
                        type: 'call'
                    });
                    client.send(data);
                }
            });
            break;

            case 'answer' :
            socket.clients.forEach(function e(client){
                console.log('user has accepted the offer', client.personName);
                console.log(msg);
                if(client){
                    var data=JSON.stringify({
                        receiver:msg.sender,
                        type:'answer'
                    });
                    client.send(data);
                }
            });
            break;
        }
    });
});

server.listen(9000);
console.log('server started.....');

var clientDataList = [];
function updateList(newEntry, list) {
    let updateFlag = false;
    list.forEach(function (e) {
        if (e.user == newEntry.user) {
            e.status = newEntry.status;
            updateFlag = true;
        }
    })
    if (!updateFlag) {
        list.push(newEntry);
    }
    return list;
}