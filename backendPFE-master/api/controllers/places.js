var knex = require('../config');
var config = require('../app-config');

exports.index = function(req, res) {
    knex('lieu') .where('type', '=', req.params.type)
        .then(function(rsp){
            res.json({error: false, data: rsp});          
        })
        .catch(function(err){
            res.status(500).json({
                error: true,
                data: {
                    message: err.message
                }
            });
        })
};

exports.top = function(req, res) {
    knex('lieu')
        .select('*', knex.raw('avg(note) as avg_note'))
        .join('avis', 'lieu.id', '=', 'avis.lieu_id')
        .groupBy('lieu.id')
        .orderBy('avg_note', 'desc')
        .then(function(rsp){
            res.json({error: false, data: rsp});          
        })
        .catch(function(err){
            res.status(500).json({
                error: true,
                data: {
                    message: err.message
                }
            });
        })
};

exports.index2 = function(req, res){
   
    knex('lieu') .where('id', '=', req.params.id).first()
        .then(function(rsp){
            res.json({error: false, data: rsp});          
        })
        .catch(function(err){
            res.status(500).json({
                error: true,
                data: {
                    message: err.message
                }
            });
        })
}

exports.lieubus = function (req,res){
    knex.raw("select bus.Destination,bus.Terminus,bus.Numero,lieu.name from r_bus_lieu,bus,lieu WHERE bus.Id = r_bus_lieu.IdBus AND r_bus_lieu.IdLieu = lieu.id AND lieu.id = ?",[req.params.id]).then(function(rsp){
        res.json({error: false, data: rsp});     
    })
    .catch(function(err){
        res.status(500).json({
            error: true,
            data: {
                message: err.message
            }
        });
    })
}

exports.lieutaxi = function (req,res){
    knex.raw("select taxi.Destination,taxi.Terminus from r_taxi_lieu,taxi,lieu WHERE taxi.Id = r_taxi_lieu.IdTaxi AND r_taxi_lieu.IdLieu = lieu.id AND lieu.id = ?",[req.params.id]).then(function(rsp){
        res.json({error: false, data: rsp});     
    })
    .catch(function(err){
        res.status(500).json({
            error: true,
            data: {
                message: err.message
            }
        });
    })
}

exports.lieutram = function (req,res){
    knex.raw("select tramway.Destination,tramway.Terminus,lieu.name from r_tramway_lieu,tramway,lieu WHERE tramway.Id = r_tramway_lieu.IdTram AND r_tramway_lieu.IdLieu = lieu.id AND lieu.id = ?",[req.params.id]).then(function(rsp){
        res.json({error: false, data: rsp});     
    })
    .catch(function(err){
        res.status(500).json({
            error: true,
            data: {
                message: err.message
            }
        });
    })
}

exports.vote = function(req, res){
   
    // res.send({
    //     data : req.body
    // })

    knex('avis').insert(
        {
            user_id: req.body.userId,
            lieu_id: req.body.lieuId,
            note: req.body.note
        })
        .then(function (id) {
            res.json({
                error: false,
                data: id
            })
        })
        .catch(function (err) {
            res.status(500).json({
                error: true,
                data: {
                    message: err.message
                }
            })
        });
        

}