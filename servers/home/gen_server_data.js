import CustomServer from './server.js';
import * as utils from './utils.js';

/** @param {NS} ns */
export async function main(ns) {
  const fileName = 'server-data.txt' 

  while (true) {
    const target = ns.read('target.txt')
    let slist = utils.netscan(ns);
    let servers = [];
    for (let s of slist) {
      servers.push(new CustomServer(ns, s));
    }
    
    servers = servers.filter(s => s.maxMoney > 0 && s.isAdmin)
    servers.sort((a, b) => b.weight - a.weight);

    var jsonObj = []
    for (let server of servers) {
      var serverData = {
        hostname: server.hostname,
        prepped: server.isPrepped,
        money: `${ns.formatNumber(server.currentMoney)} / ${ns.formatNumber(server.maxMoney)} (${ns.formatPercent(server.currentMoney / server.maxMoney)})`,
        security: `${server.minSecurity} (${ns.formatPercent(server.hackChance)})`,
        hack: `t=${Math.ceil(ns.hackAnalyzeThreads(server.hostname, server.currentMoney))}`,
        grow: `t=${Math.ceil(ns.growthAnalyze(server.hostname, server.maxMoney / server.currentMoney))}`,
        weak: `t=${Math.ceil((server.currentSecurity - server.minSecurity) * 20)}`,
        isTarget: server.hostname == target ? true : false



      }
      jsonObj.push(serverData);
    }

    ns.write(fileName, JSON.stringify(jsonObj), 'w');
    await ns.sleep(0);
  }
}