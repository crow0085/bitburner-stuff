/** @param {NS} ns */
export async function main(ns) {
    ns.scp('/dashboard.js', 'pserv-0');
    ns.scp('/find_target.js', 'pserv-0');
    ns.scp('/gen_server_data.js', 'pserv-0');
    ns.scp('/controller.js', 'pserv-0');
    ns.scp('/weak.js', 'pserv-0');
    ns.scp('/grow.js', 'pserv-0');
    ns.scp('/hack.js', 'pserv-0');
    ns.scp('/batching/hk.js', 'pserv-0');
    ns.scp('/batching/gr.js', 'pserv-0');
    ns.scp('/batching/wk.js', 'pserv-0');
}