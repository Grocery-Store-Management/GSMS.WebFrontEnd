import React, { useState, useEffect } from 'react'
import CTA from '../components/CTA';
import InfoCard from '../components/Cards/InfoCard';
import ChartCard from '../components/Chart/ChartCard';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import ChartLegend from '../components/Chart/ChartLegend';
import PageTitle from '../components/Typography/PageTitle';
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from '../icons';
import RoundIcon from '../components/RoundIcon';
import response from '../utils/demo/tableData';
import {
  TableBody,
  TableContainer,
  Table,
  TableHeader,
  TableCell,
  TableRow,
  TableFooter,
  Avatar,
  Badge,
  Pagination,
} from '@windmill/react-ui';

import {
  doughnutOptions,
  lineOptions,
  doughnutLegends,
  lineLegends,
  barOptions,
  barLegends,
} from '../utils/demo/chartsData';
import Employee from './Employee';


function Dashboards() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<any[]>([]);

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = response.length;

  // pagination change control
  function onPageChange(p: number) {
    setPage(p)
  };

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setData(response.slice((page - 1) * resultsPerPage, page * resultsPerPage))
  }, [page]);


  return (
    <>
      <PageTitle>FullThings Grocery Store</PageTitle>
      <PageTitle>Charts</PageTitle>
      <div className="grid gap-6 mb-8 md:grid-cols-2">
        <ChartCard title="Best Seller">
          <Line {...lineOptions} />
          <ChartLegend legends={lineLegends} />
        </ChartCard>
        <ChartCard title="Bars">
          <Bar {...barOptions} />
          <ChartLegend legends={barLegends} />
        </ChartCard>
      </div>
      <Employee />
    </>
  );
};

export default Dashboards;
