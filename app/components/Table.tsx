"use client";

interface Column {
  header: string;
  accessor: string;
  className?: string;
}

interface TableProps {
  columns: Column[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}

const Table = ({
  columns,
  renderRow,
  data,
}: {
  columns: { header: string; accessor: string; className?: string }[];
  renderRow: (item: any) => React.ReactNode;
  data: any[];
}) => {
  return (
    <div className="overflow-x-auto rounded-xl shadow-md">
      <table className="w-full min-w-[600px] border-collapse">
        <thead>
          <tr className="text-left text-gray-500 text-sm bg-gray-100">
            {columns.map((col) => (
              <th key={col.accessor} className={`px-4 py-3 ${col.className || ""}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => renderRow(item))}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
