var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
fs = require('fs');
var session = require('cookie-session');
models = require('models');
mongoose.connect('mongodb://localhost:27017/PPL');
db = mongoose.connection;
db.on('error', function (err) {

    console.log('connection error', err);
});
db.once('open', function () {

    console.log('connected.');
});
router.get('/',function(req,res){
            var sess = req.session;
            console.log(sess.team);
            teamInSession=sess.team;
            if(teamInSession == null){
                req.session.loginRedirect = "/Match/selectPlayers"
                res.redirect('/login');
                return;
            }
            models.Match.findOne({
                    $or:[
                    {
                        "team1.team": teamInSession._id
                    },
                    {
                        "team2.team": teamInSession._id
                    }
                    ],
            })
            .sort({
// the lastest match collection for the team, so create match collection in admin panel only for the upcoming match, not for all future matches
                timeOfMatch:-1
            })
            .populate('team1.team team2.team')
            .exec(function(err,match){
                if(err)
                    console.log(err);
                else if(!match||match.winner!=null){
                    res.send('You have no matches. <a href="/Arena">Click here to go to Arena</a>');
                }
                else{
                    if((match.team1.team.toString()==teamInSession._id.toString()&&match.team1.playersStats.length!=1)||(match.team2.team.toString()==teamInSession._id.toString()&&match.team2.playersStats.length!=1)){
                        //have to do this, because data storage on cookie is limited and will result in destruction of the session if limit is exceeded
                        match.team1.playersStats = null;
                        match.team2.playersStats = null;
                        req.session.match = match;
                        res.send("You have already chosen players for the match <a href='/Match'>Click here to go to match</a>");
                    }else{
                        //have to do this, because data storage on cookie is limited and will result in destruction of the session if limit is exceeded
                        match.team1.playersStats = null;
                        match.team2.playersStats = null;
                        req.session.match = match;
                        models.Player.find({
                            team:teamInSession._id
                        },function(err,players){
                          //  console.log(req.session.match);
                            if(err)
                                console.log(err);
                            else{
                                req.session.matchStatus = "pre-match";
                                res.render('selectPlayers',{
                                    list:players,
                                    LayoutTeam : req.session.team,
                                    matchId:match._id,
                                    team1:match.team1.team.name,
                                    team2:match.team2.team.name,
                                    partials : {
                                        layout:'layout'
                                    }
                                });
                            }
                        });
                }
                }
                });
});


module.exports = router;
// admin for creating match

 
