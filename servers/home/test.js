import CustomServer from "./server";

/** @param {NS} ns */
export async function main(ns) {
    ns.ui.openTail();
    ns.disableLog('ALL')
    ns.clearLog()
    let target = new CustomServer(ns, 'n00dles')

    let hackThresh = 0.1;
    let hackThreads = Math.floor(ns.hackAnalyzeThreads(target.hostname, target.maxMoney * hackThresh))
    let percentH = 1 / (1 - Math.max((ns.hackAnalyze(target.hostname) * hackThreads), ns.hackAnalyze(target.hostname)))
    ns.print(percentH)
}