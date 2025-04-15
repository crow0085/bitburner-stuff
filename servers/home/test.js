import CustomServer from "./server";
import * as utils from "./utils";



/** @param {NS} ns */
export async function main(ns) {
    ns.ui.openTail();
    ns.disableLog('ALL')
    ns.clearLog()

    let servers = getServers(ns);
    let target = new CustomServer(ns, 'n00dles')
    servers.sort((a, b) => a.isHome - b.isHome);

    // start batching hwgw
    let hackThresh = 0.1;
    
    let hackThreads = Math.max(Math.floor(ns.hackAnalyzeThreads(target.hostname, target.maxMoney * hackThresh)), 1)
    //let hackThreads = Math.floor(ns.hackAnalyzeThreads(target.hostname, target.maxMoney * hackThresh));
    let weakThreads1 = Math.ceil(hackThreads / 25);
    let percentH = 1 / (1 - ns.hackAnalyze(target.hostname) * hackThreads);
    let growThreads = Math.ceil(ns.growthAnalyze(target.hostname, percentH));
    ns.print(`
        hack threads: ${hackThreads}\n
        weakthreads1: ${weakThreads1}\n
        percentH: ${percentH}\n
        growThreads: ${growThreads}\n
        `);
}

function getServers(ns) {
  let slist = utils.netscan(ns);

  let servers = [];
  for (let s of slist) {
    servers.push(new CustomServer(ns, s));
  }

  servers = servers.filter((s) => s.isAdmin);
  return servers;
}