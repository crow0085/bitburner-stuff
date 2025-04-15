/** @param {NS} ns */
export async function main(ns) {
   let files = ns.ls('home');
   files = files.filter(file => String(file).startsWith('report_'));
   files.forEach(file => {
      ns.rm(file, 'home');
      ns.tprint(`Removed report file: ${file}`);
   });
}