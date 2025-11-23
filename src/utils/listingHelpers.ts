export function formatPrice(price: number, type: 'sale' | 'rent'): string {
  const formatted = new Intl.NumberFormat('en-KE', {
    style: 'currency',
    currency: 'KES',
    maximumFractionDigits: 0,
  }).format(price);
  
  return type === 'rent' ? `${formatted}/month` : formatted;
}

export function getStatusColor(status: string): string {
  const colors = {
    draft: 'bg-muted',
    pending: 'bg-yellow-500',
    approved: 'bg-green-500',
    rejected: 'bg-destructive',
  };
  return colors[status as keyof typeof colors] || 'bg-muted';
}

export function getStatusLabel(status: string): string {
  return status.charAt(0).toUpperCase() + status.slice(1);
}
