import React from 'react';
import { clsx } from 'clsx';

interface DataTableProps {
  headers: string[];
  children: React.ReactNode; // rows (<tr>)
  className?: string;
}

/**
 * Simple data table wrapper that applies consistent styles.
 * Usage:
 * <DataTable headers={["Name", "Email"]}>
 *   {rows.map(row => <tr>...</tr>)}
 * </DataTable>
 */
export const DataTable: React.FC<DataTableProps> = ({ headers, children, className }) => (
  <div className={clsx('overflow-x-auto', className)}>
    <table className="min-w-full divide-y divide-gray-200">
      <thead className="bg-gray-50">
        <tr>
          {headers.map((h) => (
            <th
              key={h}
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
            >
              {h}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">{children}</tbody>
    </table>
  </div>
);

export default DataTable;
