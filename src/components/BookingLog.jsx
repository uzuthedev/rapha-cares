import { useState } from 'react';

export default function BookingLog({ prayers, onDelete }) {
  // Sort prayers by created_at descending (newest first)
  const sortedPrayers = [...prayers].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );

  function handleDownload() {
    const headers = ['Date & Time', 'Prayer Request'];
    const escape = (val) => `"${String(val).replace(/"/g, '""')}"`;
    const rows = sortedPrayers.map((p) =>
      [new Date(p.created_at).toLocaleString(), p.content].map(escape).join(',')
    );
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'rapha-cares-prayer-requests.csv';
    link.click();
    URL.revokeObjectURL(url);
  }

  return (
    <section className="section-arch-card overflow-hidden">
      <div className="arch-header flex flex-wrap items-center justify-between gap-3">
        <h2 className="font-display text-xl text-rc-terracotta-dark">Prayer Requests</h2>
        <span className="rounded-full bg-white px-3 py-1 text-xs font-semibold text-stone-600">
          {prayers.length} total requests
        </span>
      </div>

      <div className="space-y-4 px-6 pb-6 pt-2">
        <p className="text-sm text-stone-600">
          Here is a log of prayer requests submitted anonymously through the website.
        </p>

        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={handleDownload}
            disabled={prayers.length === 0}
            className="btn-primary-sm disabled:cursor-not-allowed disabled:opacity-50"
          >
            Download CSV
          </button>
        </div>

        {sortedPrayers.length === 0 ? (
          <p className="text-sm text-stone-500">No prayer requests received yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-stone-200 text-stone-500">
                  <th className="py-2 pr-4 font-medium" style={{ width: '20%' }}>
                    Timestamp
                  </th>
                  <th className="py-2 pr-4 font-medium" style={{ width: '70%' }}>
                    Request
                  </th>
                  <th className="py-2 font-medium" style={{ width: '10%' }}>
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {sortedPrayers.map((entry) => (
                  <tr key={entry.id} className="border-b border-stone-100 align-top">
                    <td className="py-3 pr-4 text-stone-500">
                      {new Date(entry.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 text-stone-800 break-words max-w-lg">
                      {entry.content}
                    </td>
                    <td className="py-3">
                      <button
                        type="button"
                        onClick={() => onDelete(entry.id)}
                        className="text-xs font-semibold text-red-500 hover:text-red-700 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </section>
  );
}
