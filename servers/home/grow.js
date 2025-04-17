
/** @param {NS} ns */
export async function main(ns) {
  let target = ns.args[0]
  let repeat = ns.args[1];
  do {
    await ns.grow(target)
  } while (repeat);
}

export function autocomplete(data, args) {
  return data.servers;
}