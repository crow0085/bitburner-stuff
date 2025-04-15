import CustomServer from './server.js';

/** @param {NS} ns */
export async function main(ns) {
  const delay = 0;
  const file = 'target.txt'


  ns.ui.renderTail();
  ns.disableLog('ALL');
  while (true) {
    ns.clearLog();
    if (ns.fileExists(file, 'home')) {
      const server = ns.read(file);
      const so = new CustomServer(ns, server);
      ns.print(`Server: ${so.hostname}`);
      ns.print(`server prepped: ${so.isPrepped}`);
      ns.print(`Money: ${ns.formatNumber(so.currentMoney)} / ${ns.formatNumber(so.maxMoney)} (${ns.formatPercent(so.currentMoney / so.maxMoney)})`);
      ns.print(`Time to hack: ${ns.tFormat(so.hackTime)} t=${Math.ceil(ns.hackAnalyzeThreads(so.hostname, so.currentMoney))}`);
      ns.print(`Time to grow: ${ns.tFormat(so.growTime)} t=${Math.ceil(ns.growthAnalyze(so.hostname, so.maxMoney / so.currentMoney, new CustomServer(ns, 'home').cores))}`);
      ns.print(`Time to weaken: ${ns.tFormat(so.weakenTime)} t=${Math.ceil((so.currentSecurity - so.minSecurity) * 20)}`);
      ns.print(`Current security: ${so.currentSecurity}`);
      ns.print(`Minimum security: ${so.minSecurity}`);
      ns.print(`Server hack weight: ${ns.formatNumber(so.weight)}`)
      ns.print(`Hack chance: ${ns.formatPercent(so.hackChance)}`)
    }else{
      ns.print(`no target.txt file found. waiting for a target to monitor`)
    }
    await ns.sleep(delay);
  }
}

export function autocomplete(data, args) {
  return data.servers;
}