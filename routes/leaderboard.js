var express = require('express');
var router = express.Router();
var session = require('cookie-session');
router.get('/',function(req,res){
    var teamInSession = req.session.team;
    if(teamInSession == null){
        req.session.loginRedirect = '/leaderboard';
        res.redirect('/login');
        return;
    }
    models.Match.find({
       "winner":{
         $ne:null
       }
    })
    .populate("winner")
    .exec(function(err,results){
        var teams = {};
        var teamResult = [];
        for(var i=0;i<results.length;i++){
            if(!(results[i]["winner"]["_id"] in teams)){
                teams[results[i]["winner"]["_id"]] = teamResult.length;
                teamResult.push({});
                teamResult[teamResult.length-1]["info"] = results[i].winner;
                teamResult[teamResult.length-1]["count"] = 1;
            }else{
                teamResult[teams[results[i]["winner"]["_id"]]]["count"]++;
            }
            if(i==results.length-1){
                teamResult.sort(function(a,b) {return (a.count < b.count) ? 1 : ((b.count < a.count) ? -1 : 0);} );
                //console.log(JSON.stringify(teamResult));
		//console.log(JSON.stringify(teams));
                res.render('leaderboard',{
                    LayoutTeam : req.session.team,
                    teamjs:JSON.stringify(teamInSession),
                    teamResult : teamResult,
                    partials:{
                        layout : 'layout'
                    }
                });
                }
            }
        });
    });
module.exports = router;
