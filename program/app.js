const express = require('express');
var app = express();
var bodyParser = require('body-parser');
var async = require('async');

let multichain = require("multichain-node")({
    port: 4802,
    host: '172.17.0.2',
    user: "multichainrpc",
    pass: "3mSZsZ5F8fwioTgX9RgK8AfziAUV7tykTiK714o9k7gb"
});

let add1 = "1Qg1wKxad9vt9FFrLCjFdqwxQTbLESJ55UFZgt"; //has laptops
let add2 = "1UH9u8d4wifowK3fRhXQ5jk2tTHP41W7PzfiG"; //has money

let db = {
    decodedTx: {},
    partialRawTx: "",
    completedRawTx: "",
    tx: "",
    buyerAddress: add2,
    sellerAddress: add1,
    completed: false,
    milestone:[]
}

app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    if (req.method == 'OPTIONS') {
        return res.send(200);
    }
    next();
});
//issue asset, should be admin api
app.post('/issueasset', function(req, res){
    /**
     * address
     * assetname
     * qty
     * units
     * details
     */
    multichain.issue({address: req.body.address, asset: req.body.assetname, qty: req.body.qty, units: req.body.units, details: req.body.details}, (err, res) => {
        if(err){
            console.log(err);
            return res.status(400).json({message:'error', err:err});
        }
        return res.json({message:'success', res:res});
    });
});


//send asset
app.post('/sendasset', function(req, res){
    /**
     * fromAdress
     * toAddress
     * assetname
     * qty
    */
    multichain.sendAssetFrom({from: req.body.fromAddress, to: req.body.toAddress, asset: req.body.assetname, qty: req.body.qty}, (err, tx) => {
        if(err){
            console.log(err);
            return res.status(400).json({message:'error', err:err});
        }
        return res.json({message:'success', tx:tx});
    });
});

//getnew address
app.post('/getnewaddress', function(req, res){

});

//create atomic transactions
app.post('/createrawexchange', function(req, res){
    /**
     * 
     */
    multichain.prepareLockUnspentFrom({from:req.body.fromAddress, assets: { [req.body.assetname]: req.body.qty}}, (err, tx)=>{
        if(err){
            console.log(err);
            return res.status(400).json({message:'error', err:err});
        }
        return res.json({message:'success', tx:tx});
    });
});

//execute atomic transaction
app.post('/execatomic', function(req, res){
    
});

app.post('/preparelockunspentfrom', function(req, res){
    /**
     * fromAdress
     * assetname
     * qty
    */
    multichain.prepareLockUnspentFrom({from:req.body.fromAddress, assets: { [req.body.assetname]: req.body.qty}}, (err, tx)=>{
        if(err){
            console.log(err);
            return res.status(400).json({message:'error', err:err});
        }
        return res.json({message:'success', tx:tx});
    });
});

//place order
app.post('/placeorder', function(req, res){
    /**
     * asset1.name
     * asset1.qty
     * asset2.name
     * asset2.qty
     */
    /**
     * Hardcoding addresses for demo purpose
     */
    let address1 = req.body.asset1.addr1;
    let address2 = add2;
    console.log(req.body);
    multichain.prepareLockUnspentFrom({from: address1, assets: {[req.body.asset1.name]: req.body.asset1.qty}}, (err, data)=>{
        if(err){
            console.log(err);
            return res.status(400).json({message:'error', err:err});
        }
        multichain.createRawExchange({txid: data.txid, vout: data.vout, assets: {[req.body.asset2.name]: req.body.asset2.qty}}, (err, rawPartialTx)=>{
            console.log('Raw Partial Exchnage', rawPartialTx);
            if(err){
                console.log(err);
                return res.status(400).json({message:'error', err:err});
            }
            db.partialRawTx = rawPartialTx;
            multichain.prepareLockUnspentFrom({from: address2, assets: {[req.body.asset2.name]: req.body.asset2.qty}}, (err, data)=>{
                if(err){
                    console.log(err);
                    return res.status(400).json({message:'error', err:err});
                }
                multichain.appendRawExchange({hexstring: rawPartialTx, txid: data.txid, vout: data.vout, assets: {[req.body.asset1.name]: req.body.asset1.qty}}, (err, rawExchange)=>{
                    if(err){
                        console.log(err);
                        return res.status(400).json({message:'error', err:err});
                    }
                    db.completedRawTx = rawExchange.hex;
                    multichain.decodeRawExchange({hexstring: rawPartialTx}, (err, data)=>{
                        if(err){
                            console.log(err);
                            db.decodedTx = data;
                        }
                    });
                    db.milestone = [];
                    db.milestone.push({ caption: 'OrderPlaced', date: new Date(2014, 1, 16), selected: true, title: 'Horizontal Timeline', content: "" });
                    return res.json({message:'success', rawExchange: rawExchange, timeline: db.milestone});
                });
            });
        });
    });
});

app.get('/buyer', function(req, res){
    multichain.getMultiBalances({addresses: add2, assets: ['$', 'LaptopK4'], includeLocked: true}, (err, data)=>{
        if(err){
            return res.status(400).json({message:'error', err:err});
        }
        let buyer = {};
        buyer.address = add2;
        buyer.label = "Buyer";
        buyer.assets = data[add2];
        return res.json({message:'success', buyer: buyer});
    });
});

app.get('/seller', function(req, res){
    multichain.getMultiBalances({addresses: add1, assets: ['$', 'LaptopK4'], includeLocked: true}, (err, data)=>{
        if(err){
            return res.status(400).json({message:'error', err:err});
        }
        let seller = {};
        seller.address = add1;
        seller.label = "Seller";
        seller.assets = data[add1];
        return res.json({message:'success', seller: seller});
    });
});

app.get('/action/:action', function(req, res){
    switch(req.params.action){
        case 'order':
            db.milestone.push({ caption: 'OrderPlaced', date: new Date(2014, 1, 16), selected: true, title: 'Horizontal Timeline', content: "" });
            return res.json({message:'success', timeline: db.milestone});
        break;
        case 'package':
            db.milestone.push({ caption: 'Packaged', date: new Date(2014, 1, 20), selected: true, title: 'Horizontal Timeline', content: "" });
            return res.json({message:'success', timeline: db.milestone});
        break;
        case 'ship':
            db.milestone.push({ caption: 'Shipped', date: new Date(2014, 1, 24), selected: true, title: 'Horizontal Timeline', content: "" });
            return res.json({message:'success', timeline: db.milestone});
        break;
        case 'deliver':
            if(!db.completedRawTx){
                res.status(404).json({'message': 'error', error: "No transaction to process"});
            }
            multichain.sendRawTransaction({hexstring: db.completedRawTx}, (err, tx)=>{
                if(err){
                    console.log(err);
                    return res.status(400).json({message:'error', err:err});
                }
                db.tx = tx;
                db.milestone.push({ caption: 'Delivered', date: new Date(2014, 1, 28), selected: true, title: 'Horizontal Timeline', content: "" });
                return res.json({message:'success', tx: tx, timeline: db.milestone});
            });
        break;
        case 'reset':
            db.milestone = [];
            return res.json({message:'success', timeline: db.milestone});
        break;
        default:
            return res.json({message:'success', timeline: db.milestone});
        break;
    }
});

app.get('/currenttransaction', function(req, res){
    return res.json({message: 'success', details: db});
});


//view transactions

// multichain.issue({address: add1, asset: "zcoin", qty: 50000, units: 0.01, details: {hello: "world"}}, (err, res) => {
//     console.log(err)
// });

let users = {
    manufacturer: ["1GGQGqb2ScbicR1DkC5aF8tjfECTB4moHmjJnK"],
    distributor: ["1ZBxF5tJeoby3XoNt4s2BeXwKaYbBtSkeE3iS2"],
    subdistributor: ["1Qse2PsUGJ9unUDNwAskZtDkzDeBQmaUmx63f9","1LS2f5hqokoKSeqeZEjsjPwjKnpRf21DmfF7NG"],
    retailers: ["1XjnqxFqeL6dTdERPPQJy3rCzXHs8mbtEu3c6","1Stt3R57KYWvv9RBP6ukJUGMCmNCv9zZczTVry","1XZ5vrgdRhmCYbuNbtjmRQmErvmVUyivSwPFgu"]
}

app.get('/manufacture/:assetname/:qty', function(req, res){
    let assetName = req.params.assetname;
    let issueQty = parseInt(req.params.qty);
    multichain.issue({address: users.manufacturer[0], asset: {name: assetName, open: true}, qty: issueQty, units: 1}, (err, issueTxid)=>{
        if(err){
            console.log(err);
            return res.status(400).json({message:'error', err:err});
        }
        return res.json({message:'success', tx: issueTxid});
    });
});

app.get('/distribute/:assetname/:qty', function(req, res){
    let assetName = req.params.assetname;
    let issueQty = parseInt(req.params.qty);
    multichain.sendAssetFrom({from: users.manufacturer[0], to:users.distributor[0], asset: assetName, qty: issueQty}, (err, issueTxid)=>{
        if(err){
            console.log(err);
            return res.status(400).json({message:'error', err:err});
        }
        return res.json({message:'success', tx: issueTxid});
    });
});

app.get('/subdistribute/:assetname/:qty', function(req, res){
    let assetName = req.params.assetname;
    let issueQty = parseInt(req.params.qty);
    let response = [];
    async.each(users.subdistributor, (address, callback)=>{
        multichain.sendAssetFrom({from: users.distributor[0], to:address, asset: assetName, qty: issueQty/2}, (err, issueTxid)=>{
            if(err){
                return callback(err);
            }
            response.push[issueTxid];
            callback(null);
        });
    }, (err)=>{
        if(err){
            console.log(err);
            return res.status(400).json({message:'error', err:err});
        }
        return res.json({message:'success', tx: response});
    });
});

app.get('/retail/:assetname/:qty', function(req, res){
    let assetName = req.params.assetname;
    let issueQty = parseInt(req.params.qty);
    let response = [];
    async.waterfall(
        [
            (callback)=>{
                multichain.sendAssetFrom({from: users.subdistributor[0], to:users.retailers[0], asset: assetName, qty: 500}, (err, issueTxid)=>{
                    if(err){
                        return callback(err);
                    }
                    response.push[issueTxid];
                    callback(null);
                });
            },
            (callback)=>{
                multichain.sendAssetFrom({from: users.subdistributor[1], to:users.retailers[1], asset: assetName, qty: 201}, (err, issueTxid)=>{
                    if(err){
                        return callback(err);
                    }
                    response.push[issueTxid];
                    callback(null);
                });
            },
            (callback)=>{
                multichain.sendAssetFrom({from: users.subdistributor[1], to:users.retailers[2], asset: assetName, qty: 299}, (err, issueTxid)=>{
                    if(err){
                        return callback(err);
                    }
                    response.push[issueTxid];
                    callback(null);
                });
            }
        ], 
        function(err, data){
            if(err){
                console.log(err);
                return res.status(400).json({message:'error', err:err});
            }
            return res.json({message:'success', tx: response});
        });
});

app.post('/send/:assetname/:qty', function(req, res){
    let from = req.body.from;
    let to = req.body.to;
    let assetName = req.params.assetname;
    let issueQty = parseInt(req.params.qty);
    multichain.sendAssetFrom({from: from, to:to, asset: assetName, qty: issueQty}, (err, issueTxid)=>{
        if(err){
            return res.status(400).json({message:'error', err:err});
        }
        return res.json({message:'success', tx: issueTxid});
    });
});

app.get('/listassettransactions/:assetname', function(req, res){
    let assetName = req.params.assetname;
    let issueQty = parseInt(req.params.qty);
    let response = [];
    console.log(assetName);
    async.waterfall(
        [
            (callback)=>{
                multichain.subscribe({stream: assetName}, (err, issueTxid)=>{
                    console.log('Incoming one');
                    if(err){
                        return callback(err);
                    }
                    response.push[issueTxid];
                    callback(null);
                });
            },
            (callback)=>{
                multichain.listAssetTransactions({asset: assetName}, (err, data)=>{
                    console.log('Incoming two');
                    if(err){
                        return callback(err);
                    }
                    callback(null, data);
                });
            }
        ], 
        function(err, data){
            if(err){
                console.log(err);
                return res.status(400).json({message:'error', err:err});
            }
            return res.json({message:'success', tx: data});
        });
});


app.get('/listactors/:assetname', function(req, res){
    let isSeller = req.query.isSeller;
    let assetName = req.params.assetname;
    let actors = [];
    for (let key in users){
        for(let i=0; i< users[key].length; i++){
            let actor = {};
            actor.address = users[key][i];
            actor.label = `${key} ${i+1}`;
            actors.push(actor);
            if(isSeller && actor.address !== add2){
                actors.pop();
            }
        }
    }
    let assetList = [];
    multichain.listAssets({asset: '*', count: 100, start: -100}, (err, data)=>{
        assetList = data.map((obj)=>{
            return obj.name
        });
        async.map(actors, function(actor, callback){
            let request = {};
            if(assetName == 'all'){
                request = {addresses: actor.address, assets: assetList}
            } else {
                request = {addresses: actor.address, assets: assetName};
            }
            multichain.getMultiBalances(request, (err, data)=>{
                if(err){
                    return callback(null, actor);
                }
                console.log(data);
                actor.assets = data[actor.address];
                callback(null, actor)
            });
        }, (err, result)=>{
            if(err){
                console.log(err);
                return res.status(400).json({message:'error', err:err});
            }
            return res.json({message:'success', result: result});
        });
    });
});

app.get('/getbalance/:address', function(req, res){
    multichain.getMultiBalances({addresses: req.params.address, assets: '*'}, (err, data)=>{
        let actor = {};
        if(err){
            console.log(err);
            return res.status(400).json({message:'error', err:err});
        }
        for (let key in users){
            for(let i=0; i< users[key].length; i++){
                if(users[key][i] != req.params.address){
                    continue;
                }
                actor.address = users[key][i];
                actor.label = `${key} ${i+1}`;
                actor.assets = data[req.params.address];
            }
        }
        return res.json({message:'success', result: actor});
    });
});

app.use('/', function(req, res){
    multichain.getInfo((err, info) => {
        if(err){
            throw err;
        }
        res.json(info);
    });
});

app.use(function (err, req, res, next) {
    // logic
    console.log('Major error', err);
    return res.status(500).send(err);
});

app.listen(3333, (err)=>{
    console.log('Listening to 3333');
});




