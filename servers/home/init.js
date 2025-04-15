/** @param {NS} ns */
export async function main(ns) {
    ns.exec('gen_server_data.js', 'home');
    await ns.sleep(200);
    ns.exec('find_target.js', 'home');
    await ns.sleep(200);
    ns.exec('share_controller.js', 'home');
    await ns.sleep(200);
    ns.exec('buy_servers.js', 'home');
    await ns.sleep(200);
    //ns.exec('hacknet.js', 'home');
    //await ns.sleep(200);
    ns.exec('controller.js', 'home');
    await ns.sleep(200);
    ns.exec('dashboard.js', 'home');
    await ns.sleep(200);
    ns.exec('monitor.js', 'home');
    await ns.sleep(200);
}