import CustomServer from './server.js';
import * as utils from './utils.js';


/** 
 * @param {NS} ns 
 * */
export async function main(ns) {

  ns.ui.openTail();
  ns.ui.resizeTail(891, 155);
  ns.ui.moveTail(1652, 316);
  ns.disableLog('ALL');
  ns.clearLog();

  let home = new CustomServer(ns, 'home');

  let growRamCost = ns.getScriptRam('grow.js');
  let weakRamCost = ns.getScriptRam('weak.js');
  let hackRamCost = ns.getScriptRam('hack.js')

  let target = getTarget(ns);
  ns.write('current-target.txt', target.hostname)
  let file = 'target.txt';
  ns.write(file, target.hostname, 'w');
  ns.print(`Found a new target: ${target.hostname}`);

  ns.print(`prepping: ${target.hostname}`);
  // prep target
  while (!target.isPrepped) {

    let servers = getServers(ns);
    await ns.sleep(50);

    let cores = home.cores;
    let growThreads = Math.ceil(ns.growthAnalyze(target.hostname, target.maxMoney / target.currentMoney, cores));
    let weakThreads1 = Math.ceil((target.currentSecurity - target.minSecurity) * 20);
    let weakThreads2 = Math.ceil(growThreads / 12.5);

    let delay = 0;

    if (home.freeRam >= (growThreads * growRamCost) + (weakThreads1 * weakRamCost) + (weakThreads2 * weakRamCost)) {
      if (growThreads > 0)
        ns.exec('grow.js', home.hostname, growThreads, target.hostname);
      if (weakThreads1 > 0)
        ns.exec('weak.js', home.hostname, weakThreads1, target.hostname);
      if (weakThreads2 > 0)
        ns.exec('weak.js', home.hostname, weakThreads2, target.hostname);
      delay = target.weakenTime;
    }
    else {
      for (let server of servers) {
        if (weakThreads1 > 0 && server.threadCount(weakRamCost) > 0) {
          ns.exec('weak.js', server.hostname, Math.min(weakThreads1, server.threadCount(weakRamCost)), target.hostname);
          delay = target.weakenTime;
        } else if (growThreads > 0 && server.threadCount(growRamCost) > 0) {
          ns.exec('grow.js', server.hostname, Math.min(growThreads, server.threadCount(growRamCost)), target.hostname);
          delay = target.growTime;
        } else if (weakThreads2 > 0 && server.threadCount(weakRamCost) > 0) {
          ns.exec('weak.js', server.hostname, Math.min(weakThreads2, server.threadCount(weakRamCost)), target.hostname);
          delay = target.weakenTime;
        }
      }

    }


    await ns.sleep(delay + 50);
  }

  // kill all hwg scripts before starting batches just to make sure things dont get out of sync
  ns.print(`${target.hostname} is now prepped, killing any leftover hwg scripts to not desync timings`)
  let servers = getServers(ns);
  for (let server of servers) {
    ns.scriptKill('/weak.js', server.hostname);
    ns.scriptKill('/grow.js', server.hostname);
    ns.scriptKill('/hack.js', server.hostname);
    ns.scriptKill('/batching/hk.js', server.hostname);
    ns.scriptKill('/batching/gr.js', server.hostname);
    ns.scriptKill('/batching/wk.js', server.hostname);
  }

  await ns.sleep(1000);
  ns.print(`Ready to start firing batches on all available servers targetting: ${target.hostname}`)

  while (true) {
    let servers = getServers(ns);
    servers.sort((a, b) => a.isHome - b.isHome);

    // start batching hwgw
    const greed = 0.01;

    // threads for each hwgw
    // let hackThreads = Math.max(Math.floor(ns.hackAnalyzeThreads(target.hostname, target.maxMoney * hackThresh)), 1)
    // let hkAmnt = ns.hackAnalyze(target.hostname) * hackThreads
    // ns.print(ns.formatNumber(hkAmnt))
    // let weakThreads1 = Math.ceil(hackThreads / 25);
    // //let percentH = 1 / (1 - Math.max((ns.hackAnalyze(target.hostname) * hackThreads), ns.hackAnalyze(target.hostname)))
    // let percentH = 1 / (1 - (ns.hackAnalyze(target.hostname) * hackThreads))
    // let growThreads = Math.ceil(ns.growthAnalyze(target.hostname, Math.max(percentH, 1)));
    // growThreads += Math.ceil(growThreads * 0.25);
    // let weakThreads2 = Math.ceil(growThreads / 12);

    const batchSize = 40000;
    for (let i = 0; i < batchSize; i++) {
      const hPercent = ns.hackAnalyze(target.hostname);
      const amount = target.maxMoney * greed;
      const hackThreads = Math.max(Math.floor(ns.hackAnalyzeThreads(target.hostname, amount)), 1);
      const tGreed = hPercent * hackThreads;
      const growThreads = Math.ceil(ns.growthAnalyze(target.hostname, target.maxMoney / (target.maxMoney - target.maxMoney * tGreed)) * 1.02);
      const weakThreads1 = Math.max(Math.ceil(hackThreads * 0.002 / 0.05), 1);
      const weakThreads2 = Math.max(Math.ceil(hackThreads * 0.004 / 0.05), 1);

      let currentTime = performance.now();
      let nextLanding = target.weakenTime + currentTime + 5000;

      let nextBatch = [];

      let proposedBatch = {
        hk: hackThreads,
        wk: weakThreads1,
        gr: growThreads,
        wk2: weakThreads2
      };

      //ns.print(proposedBatch)

      for (let server of servers) {
        if (nextBatch.length == 4)
          break;

        let ram = server.freeRam;

        if (proposedBatch.hk > 0 && ram > proposedBatch.hk * hackRamCost) {
          nextBatch.push({
            attacker: server.hostname,
            filename: '/batching/hk.js',
            threads: proposedBatch.hk,
            landing: nextLanding,
            runtime: 1 * ns.getHackTime(target.hostname)
          });
          ram -= proposedBatch.hk * hackRamCost;
          proposedBatch.hk = 0;
        }

        if (proposedBatch.wk > 0 && ram > proposedBatch.wk * weakRamCost) {
          nextBatch.push({
            attacker: server.hostname,
            filename: '/batching/wk.js',
            threads: proposedBatch.wk,
            landing: nextLanding + 20,
            runtime: 4 * ns.getHackTime(target.hostname)
          });
          ram -= proposedBatch.wk * weakRamCost;
          proposedBatch.wk = 0;
        }

        if (proposedBatch.gr > 0 && ram > proposedBatch.gr * growRamCost) {
          nextBatch.push({
            attacker: server.hostname,
            filename: '/batching/gr.js',
            threads: proposedBatch.gr,
            landing: nextLanding + 40,
            runtime: 3.2 * ns.getHackTime(target.hostname)
          });
          ram -= proposedBatch.gr * growRamCost;
          proposedBatch.gr = 0;
        }

        if (proposedBatch.wk2 > 0 && ram > proposedBatch.wk2 * weakRamCost) {
          nextBatch.push({
            attacker: server.hostname,
            filename: '/batching/wk.js',
            threads: proposedBatch.wk2,
            landing: nextLanding + 60,
            runtime: 4 * ns.getHackTime(target.hostname)
          });
          proposedBatch.wk2 = 0;
        }

        const pids = [];
        if (nextBatch.length == 4) {
          //ns.print(nextBatch)
          for (let cmd of nextBatch) {
            //ns.tprint(`executing command ${cmd.filename} from ${cmd.attacker} hitting server ${target.hostname}`)
            pids.push(ns.exec(cmd.filename, cmd.attacker, cmd.threads, target.hostname, cmd.landing, cmd.runtime))
          }

          const allRunning = pids.filter(p => p > 0).length == 4 ? true : false
          if (!allRunning) {
            ns.alert(`Something happened and didnt return 4 pids so memory alloc failed`);
            ns.exit();
          }
        }
      }
    }


    await ns.sleep(0);
    await ns.sleep(400)
  }
}

/** 
 * @param {NS} ns 
 * */
function getServers(ns) {
  let slist = utils.netscan(ns);

  for (let server of slist) {
    utils.nukeServer(ns, server);
    ns.scp('/weak.js', server);
    ns.scp('/grow.js', server);
    ns.scp('/hack.js', server);
    ns.scp('/batching/hk.js', server);
    ns.scp('/batching/gr.js', server);
    ns.scp('/batching/wk.js', server);
  }

  let servers = [];
  for (let s of slist) {
    servers.push(new CustomServer(ns, s));
  }

  servers = servers.filter((s) => s.isAdmin);
  return servers;
}

/** 
 * @param {NS} ns 
 * */
function getTarget(ns) {
  let file = ns.read('target.txt');
  let target = new CustomServer(ns, file);
  return target;
}