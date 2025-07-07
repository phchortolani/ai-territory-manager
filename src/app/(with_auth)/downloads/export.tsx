import moment from "moment";
import * as XLSX from "xlsx-js-style";
export async function exportToExcel(tableRef: React.MutableRefObject<null>) {
    if (!tableRef.current) return;
    // Obtenha os dados da tabela como HTML
    const table = tableRef.current;
    const worksheet = XLSX.utils.table_to_sheet(table);

    // Centralizar o conteúdo em todas as células
    Object.keys(worksheet).forEach((key) => {
        if (key.startsWith('!')) return; // Ignorar metadados do XLSX
        worksheet[key].s = {
            alignment: {
                horizontal: "center",
                vertical: "center",
            },
        };
    });

    // Estilizar cabeçalho (primeira linha)
    const headerRange = XLSX.utils.decode_range(worksheet['!ref']!);
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // Primeira linha (0)
        if (worksheet[cellAddress]) {
            worksheet[cellAddress].s = {
                font: { bold: true }, // Título em negrito
                alignment: { horizontal: "center", vertical: "center" },
            };
        }
    }

    // Ajustar largura das colunas
    const colWidths = [];
    for (let col = headerRange.s.c; col <= headerRange.e.c; col++) {
        let maxWidth = 10; // Largura padrão mínima
        for (let row = headerRange.s.r; row <= headerRange.e.r; row++) {
            const cellAddress = XLSX.utils.encode_cell({ r: row, c: col });
            const cellValue = worksheet[cellAddress]?.v ?? "";
            maxWidth = Math.max(maxWidth, String(cellValue).length);
        }
        colWidths.push({ wch: maxWidth + 2 }); // Ajuste adicional para espaçamento
    }
    worksheet["!cols"] = colWidths;


    const workbook = XLSX.utils.book_new();
    const name = `s13_${moment().format("DDMMYYYY_HHmm")}`
    XLSX.utils.book_append_sheet(workbook, worksheet, name);

    // Gere e faça o download do arquivo
    XLSX.writeFile(workbook, `${name}.xlsx`);
}