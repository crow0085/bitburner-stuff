const runtimeMultiplier = 3.2;

/** @param {NS} ns */
export async function main(ns) {
  let target = ns.args[0]
  let repeat = ns.args[1];
  let batchLand = ns.args[2];
  let msecDelay = 0;

  let runtime = runtimeMultiplier * ns.getHackTime(target);
  do {
    if (batchLand) {
      let currentTime = performance.now();
      msecDelay = batchLand - currentTime - runtime
    }
    await ns.grow(target, {additionalMsec:msecDelay})
  } while (repeat);
}

export function autocomplete(data, args) {
  return data.servers;
}