import CustomServer from "./server"

/** @param {NS} ns */
export async function main(ns) {
    ns.ui.openTail()
    ns.disableLog('ALL')
    ns.clearLog()

    let home = new CustomServer(ns, 'home')
    ns.print(home.freeRam)
}