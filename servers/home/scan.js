import * as utils from './utils.js'

/** @param {NS} ns */
export async function main(ns) {
    ns.tprint(utils.netscan(ns))
}