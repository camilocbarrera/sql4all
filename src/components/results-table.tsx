import { motion } from 'framer-motion'

interface ResultsTableProps {
  results: {
    rows: any[];
    fields: { name: string }[];
  };
}

export function ResultsTable({ results }: ResultsTableProps) {
  if (!results.rows || results.rows.length === 0) {
    return <p className="text-muted-foreground">No hay resultados para mostrar</p>;
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05
      }
    }
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
  };

  return (
    <div className="overflow-x-auto">
      <motion.table 
        className="min-w-full divide-y divide-gray-200 dark:divide-gray-700"
        variants={container}
        initial="hidden"
        animate="show"
      >
        <thead>
          <tr>
            {results.fields.map((field, index) => (
              <motion.th
                key={index}
                variants={item}
                className="px-6 py-3 bg-gray-50 dark:bg-gray-800 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
              >
                {field.name}
              </motion.th>
            ))}
          </tr>
        </thead>
        <motion.tbody 
          className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700"
          variants={container}
          initial="hidden"
          animate="show"
        >
          {results.rows.map((row, rowIndex) => (
            <motion.tr 
              key={rowIndex}
              variants={item}
              custom={rowIndex}
            >
              {results.fields.map((field, colIndex) => (
                <motion.td
                  key={colIndex}
                  variants={item}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
                >
                  {row[field.name]?.toString() ?? 'null'}
                </motion.td>
              ))}
            </motion.tr>
          ))}
        </motion.tbody>
      </motion.table>
    </div>
  );
}
