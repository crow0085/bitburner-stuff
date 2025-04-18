/** @param {NS} ns */
export async function main(ns) {
    const host = ns.args[0]
    ns.scp('/dashboard.js', host);
    ns.scp('/find_target.js', host);
    ns.scp('/gen_server_data.js', host);
    ns.scp('/controller.js', host);
    ns.scp('/weak.js', host);
    ns.scp('/grow.js', host);
    ns.scp('/hack.js', host);
    ns.scp('/batching/hk.js', host);
    ns.scp('/batching/gr.js', host);
    ns.scp('/batching/wk.js', host);
}

export function autocomplete(data, args) {
    return data.servers;
}