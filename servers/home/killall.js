import { netscan } from "./utils.js"
/** @param {NS} ns **/
export async function main(ns) {
  const allservers = netscan(ns)
  for (const node of allservers) {
    ns.killall(node, true)
  }
}