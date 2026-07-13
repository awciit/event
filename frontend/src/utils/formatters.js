export function formatCurrency(amount, currency = 'USD', language = 'en') {
  const value = Number(amount) || 0;

  if (currency === 'SAR') {
    const formatted = new Intl.NumberFormat(language === 'ar' ? 'ar-SA' : 'en-US', {
      maximumFractionDigits: 0,
    }).format(value);
    return language === 'ar' ? `${formatted} ريال` : `${formatted} SAR`;
  }

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value);
}

export function priorityColor(priority) {
  switch (priority?.toLowerCase()) {
    case 'high':
      return 'bg-red-500/20 text-red-300 border-red-500/30';
    case 'medium':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
    case 'low':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
  }
}
