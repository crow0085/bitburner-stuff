
/** @param {NS} ns */
export async function main(ns) {
    ns.ui.openTail()
    ns.disableLog('ALL')
    ns.clearLog()

    const target = "n00dles";

    const moneyThresh = ns.getServerMaxMoney(target);

    const securityThresh = ns.getServerMinSecurityLevel(target);

    ns.print(`Attacking: ${target}`)
    while(true) {
        if (ns.getServerSecurityLevel(target) > securityThresh) {
            await ns.weaken(target);
        } else if (ns.getServerMoneyAvailable(target) < moneyThresh) {
            ns.print('running grow')
            await ns.grow(target);
        } else {
            ns.print('running hack')
            await ns.hack(target);
        }
    }
}