import * as utils from './utils.js';

/** @param {NS} ns */
export async function main(ns) {
  let servers = utils.netscan(ns);

  ns.disableLog('ALL');
  ns.ui.openTail();
  ns.clearLog();

  while (true) {
    ns.clearLog()
    for (let server of servers) {
      let files = ns.ls(server);
      files = files.filter((a) => a.endsWith('.cct'));
      if (files.length > 0) {
        ns.print(`${server} : ${files}`);
      }
    }
    await ns.sleep(200)
  }
}