import CustomServer from "./server";
import * as utils from './utils.js';

/** @param {NS} ns */
export async function main(ns) {

    const ramCost = ns.getScriptRam('/share.js');
    const SHARE_PERCENT = 0; // percentage of max threads to share
    const slist = utils.netscan(ns);
    let servers = [];
    for (let s of slist) {
        servers.push(new CustomServer(ns, s));
    }
    servers = servers.filter((s) => !String(s.hostname).startsWith('pserv'));

    for (let server of servers){
        const threads = server.hostname == 'home' ? Math.ceil(server.threadCount(ramCost) * SHARE_PERCENT) : Math.ceil(server.threadCount(ramCost))
        ns.scp('/share.js', server.hostname)
        if (threads > 0){
            ns.exec('/share.js', server.hostname, threads);
        }
    }
}