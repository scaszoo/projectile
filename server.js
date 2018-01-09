
var request = require("request");


var options = { method: 'POST',
    url: 'https://projectile.office.sevenval.de/projectile/start',
    headers:
        {'content-type': 'application/x-www-form-urlencoded' },
    form:
        { action: 'login2',
            clientId: '0',
            jsenabled: '1',
            isAjax: '0',
            develop: '0',
            login: '',
            password: '' },
    strictSSL: false //TODO: SSL Zertifizierung mit node.js
};

/**
 * login with User Credentials
 */
request(options, function (error, response, body) {
    if (error) throw new Error(error);
    console.log(response.statusCode);
    console.log(typeof body);
    console.log(body);
    console.log(response.headers['set-cookie']);
    let temp = response.headers['set-cookie'][0];
    let cookie = temp.split(';')[0];


      // getURL('GET', 'https://projectile.office.sevenval.de/projectile/start#%21/Intro', cookie);

    getEmployee(cookie).then(item=> {
        let bod = {};
        bod[item] = [ 'DayList',
            'JobList',
            'Begin',
            'Favorites',
            'TrackingRestriction',
            'FilterCustomer',
            'FilterProject' ];

        bod["Dock"]=  [ 'Area.TrackingArea', 'Area.ProjectManagementArea' ];

        showJobList('POST','https://projectile.office.sevenval.de/projectile/gui5ajax?action=get&_dc=1515080349669', cookie, bod);
    });

});

/**
 *
 * @param string
 * @param url
 * @param cookie
 * returns the body of an HTTP post Request
 */
function getURL(string , url, cookie){
    var options = { method: string,
        url: url,
        headers:
            {
                cookie: cookie },
        strictSSL: false};

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
         console.log(body);
    });
}

function option (method, url, cookie, body){
    var options = { method: method,
        url: url ,
        headers:
            {
                cookie: cookie,
                'content-type': 'application/json' },
        body: body,
        json: true,
        strictSSL: false
    };
    return options;
}

function showJobList(method, url, cookie, body){
    let options = option(method, url, cookie, body);

    request(options, function (error, response, body) {
        if (error) throw new Error(error);



        let EmplNumber = Object.keys(body["values"])[0].split('|');
        let tem = EmplNumber.splice(3,7);

        /**
         *
         * @type {string}
         * first attribute of values:
         */
        let Employee = tem.join('|');

        /**
         * get name and NO. of Employee
         */
        let temp  = body["values"][Employee][11]["v"];
        let joblist = [];


        for(var i=0; i<temp.length; i++){
            joblist.push(temp[i]);
        }

        console.log(joblist);


        let advJoblist = [];

        /*    for(var i= 0; i<joblist.length; i++){
                body["values"][joblist[i]].forEach((item=> {

                    if (item["n"]== 'JobName'){
                        let obj={};
                        obj.name = item["v"];
                    }
                    if (item["n"]== 'Job'){
                        obj.no = item["v"];
                    }
                    advJoblist.push(obj);
                    console.log(advJoblist);
                }));
            }*/

        for(var i= 0; i<joblist.length; i++){
            let obj = {};
            obj.name = body["values"][joblist[i]][32]["v"]; //TODO: function to retrieve index of jobname and joblink
            obj.no = body["values"][joblist[i]][11]["v"];
            advJoblist.push(obj);
        }

        console.log(advJoblist);
        console.log(cookie);
    });
}


function normalPostURL(method, url, cookie, body){
   option( method, url, cookie, body);

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(body);
    });
}

function getEmployee(cookie){
    return new Promise((resolve) => {
        let options=  option ('POST', 'https://projectile.office.sevenval.de/projectile/gui5ajax?action=action&_dc=1515496876799', cookie, {"ref":"Start","name":"*","action":"TimeTracker1","Params":{}} );
        request(options, function(error, response, body){
            if (error) throw new Error(error);
            let EmplN = JSON.parse(body["values"]["Dock"][0]["v"][0])["a"];
            let tem = EmplN.substr(1);
            resolve(tem);

            // console.log(JSON.parse(body["values"]["Dock"][0]["v"][0])["a"]);
        })
    })

}

function saveEntry(cookie, time, note, paket){

   // normalPostURL('POST', 'https://projectile.office.sevenval.de/projectile/gui5ajax?action=commit&_dc=1515080248606', cookie, {"values":{"+.|DayList|22|TimeTracker!^.|Default|Employee|1|357":[{"n":"Time","v":time}]}} )
   // normalPostURL('POST', 'https://projectile.office.sevenval.de/projectile/gui5ajax?action=options&_dc=1515080619255', cookie, {"+.|DayList|22|TimeTracker!^.|Default|Employee|1|357":["What"]}        )

}
