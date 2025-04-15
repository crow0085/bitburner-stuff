const HOME_RESERVED_RAM = 30;

/** @param {NS} ns **/
export default class CustomServer {
  constructor(ns, hostname) {
    this.ns = ns;
    this._hostname = hostname;
  }

  get hostname() { return this._hostname }
  get currentMoney() { return this.ns.getServerMoneyAvailable(this.hostname) }
  get maxMoney() { return this.ns.getServerMaxMoney(this.hostname) }
  get growth() { return this.ns.getServerGrowth(this.hostname) }
  get hackTime() { return this.ns.getHackTime(this.hostname) }
  get growTime() { return this.ns.getGrowTime(this.hostname) }
  get weakenTime() { return this.ns.getWeakenTime(this.hostname) }
  get minSecurity() { return this.ns.getServerMinSecurityLevel(this.hostname) }
  get currentSecurity() { return this.ns.getServerSecurityLevel(this.hostname) }
  get weight() {
    let w = this.maxMoney / this.minSecurity;
    //let w = this.maxMoney / this.growth;
    if (this.requiredHackingSkill > Math.ceil(this.ns.getHackingLevel() / 2))
      return 0;
    return w;
  }
  get hackChance() { return this.ns.hackAnalyzeChance(this.hostname) }
  get isHome() { return this.hostname == 'home' ? true : false }
  get isAdmin() { return this.ns.hasRootAccess(this.hostname) ? true : false }
  get usedRam() { return this.ns.getServerUsedRam(this.hostname) }
  get maxRam() {
    if (this.hostname === 'home')
      return this.ns.getServerMaxRam(this.hostname) - HOME_RESERVED_RAM;
    else
      return this.ns.getServerMaxRam(this.hostname);
  }
  get freeRam() { return this.maxRam - this.usedRam }
  threadCount(scriptRam) {
    let threads = 0;
    threads = this.freeRam / scriptRam
    return Math.floor(threads)
  }
  get isPrepped() {
    let prepped = false;
    let hasMaxMoney = this.currentMoney == this.maxMoney ? true : false;
    let isMinSecurity = this.currentSecurity == this.minSecurity ? true : false;
    prepped = hasMaxMoney == true && isMinSecurity == true ? true : false;

    return prepped;
  }
  get requiredHackingSkill() { return this.ns.getServerRequiredHackingLevel(this.hostname) }
  get hackDifficulty() { return this.minSecurity }
  get cores () { return  this.ns.getServer(this.hostname).cpuCores }

 
}

/** @param {NS} ns */
export async function main(ns) {
  ns.getServerGrowth
}
