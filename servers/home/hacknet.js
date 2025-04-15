/** @param {NS} ns */
export async function main(ns) {
  const MAX_LEVEL = 50;
  const MAX_RAM = 4;
  const MAX_CORES = 8;
  const MAX_NODES = 4;
  let hnetNodes = ns.hacknet.numNodes();
  let player = ns.getPlayer();

  while (hnetNodes < MAX_NODES) {
    let cost = ns.hacknet.getPurchaseNodeCost();
    if (player.money > cost) {
      ns.hacknet.purchaseNode();
      hnetNodes++;
    }
    await ns.sleep(200);
  }

  while (true) {
    hnetNodes = ns.hacknet.numNodes();
    for (let i = 0; i < hnetNodes; i++) {
      let stats = ns.hacknet.getNodeStats(i);
      let levelCost = ns.hacknet.getLevelUpgradeCost(i, 1);
      let ramCost = ns.hacknet.getRamUpgradeCost(i, 1);
      let coreCost = ns.hacknet.getCoreUpgradeCost(i, 1);
      if (stats.level < MAX_LEVEL) {
        if (player.money > levelCost)
          ns.hacknet.upgradeLevel(i, 1)
      }

      if (stats.ram < MAX_RAM) {
        if (player.money > ramCost)
          ns.hacknet.upgradeRam(i, 1)
      }

      if (stats.cores < MAX_CORES) {
        if (player.money > coreCost)
          ns.hacknet.upgradeCore(i, 1)
      }
    }
    await ns.sleep(200);
  }

}