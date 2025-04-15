/** @param {NS} ns */
export async function main(ns) {
    let target = ns.args[0]
    let batchLand = ns.args[1];
    let runtime = ns.args[2];
    let currentTime = performance.now();
    let msecDelay = batchLand - currentTime - runtime
    await ns.weaken(target, { additionalMsec: msecDelay })
}
