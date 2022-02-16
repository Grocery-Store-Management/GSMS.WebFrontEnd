import React from 'react';

interface ISectionTitle{
  children: React.ReactNode,
  className?:any
}

function SectionTitle({ children, className }: ISectionTitle) {
  return <h2 className={`${className} mb-4 text-lg font-semibold text-gray-600 dark:text-gray-300`}>{children}</h2>
}

export default SectionTitle;
