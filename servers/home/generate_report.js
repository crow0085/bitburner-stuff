import CustomServer from './server.js';
import * as utils from './utils.js';

/** @param {NS} ns */
export async function main(ns) {
  let slist = utils.netscan(ns);
  let servers = [];
  for (let s of slist) {
    servers.push(new CustomServer(ns, s));
  }

  // let servers = utils.netscan(ns).filter(s => utils.Weight(ns, s) > 0)
  // servers.sort((a, b) => utils.Weight(ns, b) - utils.Weight(ns, a));
  servers = servers.filter(s => s.maxMoney > 0 && s.isAdmin)
    servers.sort((a, b) => b.weight - a.weight);

  let output = '';

  for (let server of servers) {
    output += (`Server: ${server.hostname}\n`);
    output += (`server prepped: ${server.isPrepped}\n`);
    output += (`Money: ${ns.formatNumber(server.currentMoney)} / ${ns.formatNumber(server.maxMoney)} (${ns.formatPercent(server.currentMoney / server.maxMoney)})\n`);
    output += (`Time to hack: ${ns.tFormat(server.hackTime)} t=${Math.ceil(ns.hackAnalyzeThreads(server.hostname, server.currentMoney))}\n`);
    output += (`Time to grow: ${ns.tFormat(server.growTime)} t=${Math.ceil(ns.growthAnalyze(server.hostname, server.maxMoney / server.currentMoney))}\n`);
    output += (`Time to weaken: ${ns.tFormat(server.weakenTime)} t=${Math.ceil((server.currentSecurity - server.minSecurity) * 20)}\n`);
    output += (`Current security: ${server.currentSecurity}\n`);
    output += (`Minimum security: ${server.minSecurity}\n`);
    output += (`Server growth: ${ns.formatNumber(server.growth)}\n`)
    output += (`Server hack weight: ${ns.formatNumber(server.weight)}\n`)
    output += (`Hack chance: ${ns.formatPercent(server.hackChance)}\n`)
    output += ('\n\n');

  }
  let fileName = `report_${Date.now()}.txt`
  ns.write(fileName, output, 'w')
  ns.alert(`wrote report to ${fileName}\n\n${output}`)
}