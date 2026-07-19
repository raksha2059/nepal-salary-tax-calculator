/**
 * Format number as Nepali Rupees (2,2,3 system) with 2 decimal places
 * @param {number} amount - Amount to format
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return 'Rs. 0.00';
  }

  const num = Number(amount);
  if (isNaN(num)) {
    return 'Rs. 0.00';
  }

  // ✅ Decimal पछि 2 अंक राख्ने
  const formatted = num.toFixed(2);
  
  // ✅ पूर्णांक र दशमलव छुट्टाउने
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '00';

  // ✅ पूर्णांक part लाई Nepali format मा बदल्ने
  const nepaliFormat = (n) => {
    if (n === '0') return '0';
    
    const str = n.toString();
    if (str.length <= 3) {
      return str;
    }
    
    const parts = [];
    let remaining = str;
    
    parts.push(remaining.slice(-3));
    remaining = remaining.slice(0, -3);
    
    while (remaining.length > 0) {
      if (remaining.length <= 2) {
        parts.push(remaining);
        break;
      }
      parts.push(remaining.slice(-2));
      remaining = remaining.slice(0, -2);
    }
    
    return parts.reverse().join(',');
  };

  const formattedInteger = nepaliFormat(integerPart);
  
  // ✅ दशमलव पछि 2 अंक सधैं देखाउने
  return `Rs. ${formattedInteger}.${decimalPart}`;
};

/**
 * Format number without Rs. prefix (Nepali format) with 2 decimal places
 * @param {number} amount - Amount to format
 * @returns {string} Formatted number string
 */
export const formatNumber = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) {
    return '0.00';
  }

  const num = Number(amount);
  if (isNaN(num)) {
    return '0.00';
  }

  // ✅ Decimal पछि 2 अंक राख्ने
  const formatted = num.toFixed(2);
  
  // ✅ पूर्णांक र दशमलव छुट्टाउने
  const parts = formatted.split('.');
  const integerPart = parts[0];
  const decimalPart = parts[1] || '00';

  // ✅ पूर्णांक part लाई Nepali format मा बदल्ने
  const nepaliFormat = (n) => {
    if (n === '0') return '0';
    
    const str = n.toString();
    if (str.length <= 3) {
      return str;
    }
    
    const parts = [];
    let remaining = str;
    
    parts.push(remaining.slice(-3));
    remaining = remaining.slice(0, -3);
    
    while (remaining.length > 0) {
      if (remaining.length <= 2) {
        parts.push(remaining);
        break;
      }
      parts.push(remaining.slice(-2));
      remaining = remaining.slice(0, -2);
    }
    
    return parts.reverse().join(',');
  };

  const formattedInteger = nepaliFormat(integerPart);
  
  // ✅ दशमलव पछि 2 अंक सधैं देखाउने
  return `${formattedInteger}.${decimalPart}`;
};