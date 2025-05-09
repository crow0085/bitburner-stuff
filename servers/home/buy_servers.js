import CustomServer from "./server";
const UPGRADE_DELAY = 120;

/** @param {NS} ns */
export async function main(ns) {
  let power2 = [2, 4, 8, 16, 32, 64, 128, 256, 512, 1024, 2048, 4096, 8192, 16384, 32768, 65536, 131072, 262144, 524288, 1048576];
  const ram = power2[6];
  const purchaseDelay = 5;
  let i = ns.getPurchasedServers().length;

  while (i < ns.getPurchasedServerLimit()) {
    // Check if we have enough money to purchase a server
    if (ns.getServerMoneyAvailable("home") > ns.getPurchasedServerCost(ram)) {
      let hostname = ns.purchaseServer("pserv-" + i, ram);
      ns.tprint(`Purchased new server with hostname: ${hostname}`)
      i++;
    }
    await ns.sleep(purchaseDelay * 1000);
  }

  let isMaxed = false;
  let count = 0;

  while (!isMaxed) {
    let pservs = ns.getPurchasedServers();
    for (let serv of pservs) {
      let cso = new CustomServer(ns, serv);
      let maxRam = cso.maxRam;
      let playerMoney = ns.getServerMoneyAvailable('home');
      if (maxRam < power2.at(-1)) {
        // upgrade ram
        let upgrade = power2[power2.indexOf(maxRam) + 1]
        let upgradeCost = ns.getPurchasedServerUpgradeCost(serv, upgrade);
        if (playerMoney > upgradeCost) {
          ns.upgradePurchasedServer(serv, upgrade);
          ns.tprint(`Upgraded server ${serv} to ${ns.formatRam(upgrade)}`)
        }        
      }else{
        count ++;
        if (count == ns.getPurchasedServers().length){
          isMaxed = true;
        }
      }
    }
    await ns.sleep(UPGRADE_DELAY * 1000);
  }
}