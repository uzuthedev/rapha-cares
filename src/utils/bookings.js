export const BOOKINGS_STORAGE_KEY = 'rapha-cares-bookings';

export const BOOKING_FILTERS = [
  { id: 7, label: '7 days' },
  { id: 14, label: '14 days' },
  { id: 30, label: '30 days' },
  { id: 60, label: '60 days' },
  { id: 90, label: '90 days' },
  { id: 365, label: '1 year' },
];

export function loadBookings() {
  try {
    const raw = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export function saveBookings(bookings) {
  localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(bookings));
}

export function filterBookingsByDays(bookings, days) {
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
  return bookings.filter((b) => (b.createdAt ?? 0) >= cutoff);
}

export function downloadBookingsCsv(bookings, filename = 'rapha-cares-bookings.csv') {
  const headers = ['Email', 'Provider', 'Date & Time'];
  const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
  const rows = bookings.map((b) =>
    [b.email, b.providerName, b.timestamp].map(escape).join(',')
  );
  const csv = [headers.join(','), ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
