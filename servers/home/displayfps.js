/** @param {NS} ns */
export async function main(ns) {
    ns.ui.openTail();
    ns.disableLog('ALL');
    
    let lastTime = performance.now(); // Initialize the last timestamp

    while (true) {
        const currentTime = performance.now(); // Get the current timestamp
        const fps = (1000 / (currentTime - lastTime)).toFixed(2); // Calculate FPS
        lastTime = currentTime; // Update the last timestamp

        ns.clearLog();        
        ns.print(`FPS: ${fps}`); // Display FPS in the log
        ns.write('fps.txt', fps, 'w')

        await ns.sleep(16); // Sleep for ~16ms to simulate ~60 FPS
    }
}