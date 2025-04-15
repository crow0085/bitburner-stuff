/** @param {NS} ns */
export async function main(ns) {
  let pservs = ns.getPurchasedServers()
  ns.tprint(pservs)
  for (let i = 0; i < pservs.length; i++) {
    ns.deleteServer(pservs[i]);
  }
  
  pservs = ns.getPurchasedServers()
  ns.tprint(pservs)
}