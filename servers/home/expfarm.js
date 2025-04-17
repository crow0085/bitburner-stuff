import CustomServer from "./server";

/** @param {NS} ns */
export async function main(ns) {
    const target = new CustomServer(ns, 'joesguns')

    const growRamCost = ns.getScriptRam('grow.js');
    const weakRamCost = ns.getScriptRam('weak.js');

    const max = Math.max(growRamCost, weakRamCost)

    const hosts = ns.getPurchasedServers();

    for (let h of hosts) {
        const host = new CustomServer(ns, h)
        const threads = host.threadCount(max) / 2
        ns.exec('grow.js', host.hostname, threads, target.hostname, true)
        ns.exec('weak.js', host.hostname, threads, target.hostname, true)
        await ns.sleep(0)
    }
}