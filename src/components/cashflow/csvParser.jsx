// CSV Parser and Validator for Bank Transactions

export const REQUIRED_COLUMNS = ['date', 'type', 'description', 'amount', 'current balance'];

export const INCOME_TYPES = ['deposit', 'direct payment', 'interest earned'];
export const EXPENSE_TYPES = ['withdrawal', 'debit card', 'zelle'];

export function parseCSV(csvText) {
  const lines = csvText.trim().split('\n');
  if (lines.length < 2) {
    return { success: false, error: 'CSV file must contain a header row and at least one data row.' };
  }

  const headerLine = lines[0].toLowerCase();
  const headers = parseCSVLine(headerLine);
  
  const missingColumns = REQUIRED_COLUMNS.filter(col => 
    !headers.some(h => h.trim() === col)
  );
  
  if (missingColumns.length > 0) {
    const boldPart = missingColumns.join(', ');
    return {
      success: false,
      error: `Missing required columns: ${boldPart}. Ensure the spelling of the columns match what is shown in the expected CSV format.`,
      errorBold: boldPart
    };
  }

  const columnIndices = {};
  REQUIRED_COLUMNS.forEach(col => {
    columnIndices[col] = headers.findIndex(h => h.trim() === col);
  });

  const transactions = [];
  const errors = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    
    const values = parseCSVLine(lines[i]);
    
    try {
      const transaction = {
        date: parseDate(values[columnIndices['date']]),
        type: values[columnIndices['type']]?.trim().toLowerCase() || '',
        description: values[columnIndices['description']]?.trim() || '',
        amount: parseAmount(values[columnIndices['amount']]),
        balance: parseAmount(values[columnIndices['current balance']])
      };

      if (isNaN(transaction.date.getTime())) {
        errors.push(`Row ${i + 1}: Invalid date format`);
        continue;
      }

      if (isNaN(transaction.amount)) {
        errors.push(`Row ${i + 1}: Invalid amount`);
        continue;
      }

      transactions.push(transaction);
    } catch (e) {
      errors.push(`Row ${i + 1}: ${e.message}`);
    }
  }

  if (transactions.length === 0) {
    return { 
      success: false, 
      error: errors.length > 0 ? errors.join('\n') : 'No valid transactions found in CSV.' 
    };
  }

  transactions.sort((a, b) => a.date - b.date);

  return { 
    success: true, 
    data: transactions,
    warnings: errors.length > 0 ? errors : null
  };
}

function parseCSVLine(line) {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }
  result.push(current);
  
  return result.map(v => v.replace(/^"|"$/g, '').trim());
}

function parseDate(dateStr) {
  if (!dateStr) return new Date(NaN);
  const cleaned = dateStr.trim();
  
  const slashMatch = cleaned.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (slashMatch) {
    return new Date(parseInt(slashMatch[3]), parseInt(slashMatch[1]) - 1, parseInt(slashMatch[2]));
  }
  
  const isoMatch = cleaned.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    return new Date(parseInt(isoMatch[1]), parseInt(isoMatch[2]) - 1, parseInt(isoMatch[3]));
  }

  return new Date(cleaned);
}

function parseAmount(amountStr) {
  if (!amountStr) return NaN;
  const cleaned = amountStr.toString().replace(/[$,\s]/g, '');
  return parseFloat(cleaned);
}

export function categorizeTransactions(transactions) {
  return transactions.map(t => ({
    ...t,
    category: INCOME_TYPES.includes(t.type) ? 'income' : 
              EXPENSE_TYPES.includes(t.type) ? 'expense' : 
              t.amount >= 0 ? 'income' : 'expense'
  }));
}