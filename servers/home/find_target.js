import CustomServer from './server';
import * as utils from './utils.js';

/** @param {NS} ns */
export async function main(ns) {
    while (true) {
        let target =  getTarget(ns)
        if (ns.getPlayer().skills.hacking < 100){
            ns.write('target.txt', 'n00dles', 'w');
        }else{
            ns.write('target.txt', target, 'w');
        }
        
        await ns.sleep(5000);
    }
}

/** 
 * @param {NS} ns 
 * */
function getTarget(ns) {
    let slist = utils.netscan(ns);

    for (let server of slist) {
        utils.nukeServer(ns, server);
        ns.scp('weak.js', server);
        ns.scp('grow.js', server);
        ns.scp('hack.js', server);
    }
    let servers = [];
    for (let s of slist) {
        servers.push(new CustomServer(ns, s));
    }

    servers = servers.filter(s => s.maxMoney > 0 && s.isAdmin)
    // get a target
    servers.sort((a, b) => b.weight - a.weight);
    let target = servers[0].hostname;

    return target;
}