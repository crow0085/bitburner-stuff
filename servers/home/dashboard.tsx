import React, { useEffect, useState } from 'react';

let ns: NS;

const TableComponent = () => {
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const jsonData = JSON.parse(ns.read('server-data.txt'));
      setData(jsonData);
    }, 350); // Update every 350ms

    return () => clearInterval(interval); // Cleanup interval on component unmount
  }, []);

  return (
    <div>
      <table style={{ border: '1px dotted red', borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr>
            <th style={{ border: '1px dotted red', padding: '8px' }}>Hostname</th>
            <th style={{ border: '1px dotted red', padding: '8px' }}>Prepped</th>
            <th style={{ border: '1px dotted red', padding: '8px' }}>Money</th>
            <th style={{ border: '1px dotted red', padding: '8px' }}>Security</th>
            <th style={{ border: '1px dotted red', padding: '8px' }}>Hack</th>
            <th style={{ border: '1px dotted red', padding: '8px' }}>Grow</th>
            <th style={{ border: '1px dotted red', padding: '8px' }}>Weak</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index}>
              <td
                style={{
                  border: '1px dotted red',
                  padding: '8px',
                  color: item.isTarget ? 'green' : 'inherit', //Teal if isTarget is true 008080
                  fontWeight: item.isTarget ? 'bold' : 'normal', // Optional: Make it bold for better visibility
                }}
              >
                {item.hostname}
              </td>
              <td
                style={{
                  border: '1px dotted red',
                  padding: '8px',
                  color: item.prepped ? 'green' : 'red', // Green for true, red for false
                  fontWeight: item.prepped ? 'bold' : 'normal', // Optional: Make it bold for better visibility
                }}
              >
                {item.prepped.toString()}
              </td>
              <td
                style={{
                  border: '1px dotted red',
                  padding: '8px',
                  color: item.money.endsWith('(100.00%)') ? 'green' : 'inherit', // Green if money ends with (100%)
                  fontWeight: item.money.endsWith('(100.00%)') ? 'bold' : 'normal', // Optional: Make it bold for better visibility
                }}
              >
                {item.money}
              </td>
              <td
                style={{
                  border: '1px dotted red',
                  padding: '8px',
                  color: item.security.endsWith('(100.00%)') ? 'green' : 'inherit', // Green if security ends with (100.00%)
                  fontWeight: item.security.endsWith('(100.00%)') ? 'bold' : 'normal', // Optional: Make it bold for better visibility
                }}
              >
                {item.security}
              </td>
              <td
                style={{
                  border: '1px dotted red',
                  padding: '8px',
                  color: item.hack === 't=0' ? 'green' : 'inherit', // Green if hack is t=0
                  fontWeight: item.hack === 't=0' ? 'bold' : 'normal', // Optional: Make it bold for better visibility
                }}
              >
                {item.hack}
              </td>
              <td
                style={{
                  border: '1px dotted red',
                  padding: '8px',
                  color: item.grow === 't=0' ? 'green' : 'inherit', // Green if grow is t=0
                  fontWeight: item.grow === 't=0' ? 'bold' : 'normal', // Optional: Make it bold for better visibility
                }}
              >
                {item.grow}
              </td>
              <td
                style={{
                  border: '1px dotted red',
                  padding: '8px',
                  color: item.weak === 't=0' ? 'green' : 'inherit', // Green if weak is t=0
                  fontWeight: item.weak === 't=0' ? 'bold' : 'normal', // Optional: Make it bold for better visibility
                }}
              >
                {item.weak}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export async function main(_ns: NS) {
  ns = _ns;
  ns.ui.openTail();
  ns.ui.setTailTitle('Dashboard Monitor');
  ns.clearLog();
  ns.disableLog('ALL');

  // Directly pass the React component to ns.printRaw
  ns.printRaw(<TableComponent />);

  while (true) {
    await ns.asleep(10000);
  }
}