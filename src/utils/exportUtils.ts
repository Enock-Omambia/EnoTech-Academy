/**
 * EnoTech Academy - Offline-First Export Utilities
 * Provides seamless client-side CSV and PDF export functionality
 */

export const exportToCSV = (data: any[], filename: string, headers: string[], keys: string[]) => {
  const csvRows: string[] = [];
  
  // Add headers
  csvRows.push(headers.join(","));
  
  // Add rows
  for (const row of data) {
    const values = keys.map(key => {
      let val = row[key];
      if (val === undefined || val === null) {
        val = "";
      } else if (typeof val === "object") {
        val = JSON.stringify(val);
      }
      // Escape quotes and double-wrap
      const escaped = ('' + val).replace(/"/g, '""');
      return `"${escaped}"`;
    });
    csvRows.push(values.join(","));
  }
  
  const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.join("\n");
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement("a");
  link.setAttribute("href", encodedUri);
  link.setAttribute("download", `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

export const exportToPDF = (title: string, headers: string[], keys: string[], data: any[]) => {
  const printWindow = window.open("", "_blank");
  if (!printWindow) {
    alert("Please disable popup blocking to view and save the PDF document.");
    return;
  }
  
  const htmlRows = data.map((row, index) => {
    const cells = keys.map(key => {
      let val = row[key];
      if (val === undefined || val === null) val = "";
      if (typeof val === "object") val = JSON.stringify(val);
      return `<td style="padding: 10px; border-bottom: 1px solid #e2e8f0; font-family: sans-serif;">${val}</td>`;
    }).join("");
    return `<tr style="background-color: ${index % 2 === 0 ? '#f8fafc' : '#ffffff'};">${cells}</tr>`;
  }).join("");

  const headerCells = headers.map(header => 
    `<th style="padding: 12px; background-color: #0f172a; color: #ffffff; text-align: left; font-weight: bold; font-family: sans-serif; border: 1px solid #1e293b;">${header}</th>`
  ).join("");

  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
      <head>
        <title>${title}</title>
        <style>
          body { 
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif; 
            margin: 40px; 
            color: #1e293b; 
            background: #ffffff;
          }
          .header-container {
            border-bottom: 2px solid #0f172a;
            padding-bottom: 15px;
            margin-bottom: 25px;
          }
          .brand {
            font-size: 11px;
            font-weight: 800;
            color: #3b82f6;
            text-transform: uppercase;
            letter-spacing: 0.1em;
            margin-bottom: 4px;
          }
          h1 { 
            font-size: 22px; 
            font-weight: 800; 
            margin: 0; 
            color: #0f172a; 
          }
          .subtitle { 
            font-size: 11px; 
            color: #64748b; 
            margin-top: 5px; 
          }
          table { 
            width: 100%; 
            border-collapse: collapse; 
            font-size: 11px; 
            margin-top: 10px;
          }
          th, td {
            border: 1px solid #e2e8f0;
          }
          .footer { 
            margin-top: 50px; 
            font-size: 10px; 
            color: #94a3b8; 
            text-align: center; 
            border-top: 1px solid #e2e8f0; 
            padding-top: 15px; 
          }
          @media print {
            body { margin: 20px; }
            .no-print { display: none; }
          }
        </style>
      </head>
      <body>
        <div class="header-container">
          <div class="brand">EnoTech Academy Ultimate Learning Platform</div>
          <h1>${title}</h1>
          <div class="subtitle">Official Registry Report • Generated on ${new Date().toLocaleDateString()} at ${new Date().toLocaleTimeString()}</div>
        </div>
        <table>
          <thead>
            <tr>${headerCells}</tr>
          </thead>
          <tbody>
            ${htmlRows}
          </tbody>
        </table>
        <div class="footer">
          © 2026 EnoTech Academy. All rights reserved. This is an official offline-first generated document.
        </div>
        <script>
          window.onload = function() {
            window.print();
            setTimeout(function() { window.close(); }, 1000);
          };
        </script>
      </body>
    </html>
  `);
  printWindow.document.close();
};
