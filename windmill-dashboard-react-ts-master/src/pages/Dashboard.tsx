import React, { useState, useEffect } from 'react'

import CTA from '../components/CTA';
import InfoCard from '../components/Cards/InfoCard';
import ChartCard from '../components/Chart/ChartCard';
import { Doughnut, Line } from 'react-chartjs-2';
import ChartLegend from '../components/Chart/ChartLegend';
import PageTitle from '../components/Typography/PageTitle';
import { ChatIcon, CartIcon, MoneyIcon, PeopleIcon } from '../icons';
import RoundIcon from '../components/RoundIcon';
import response from '../utils/demo/tableData';
import { ITableData } from "../utils/demo/tableData";
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
} from '../utils/demo/chartsData';


function Dashboard() {
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ITableData[]>([]);

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

      {/* <CTA /> */}

      {/* <!-- Cards --> */}

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

      <TableContainer>
        <Table>
          <TableHeader>
            <tr>
              <TableCell>Tên Nhân Viên</TableCell>
              <TableCell>Mật Khẩu</TableCell>
              <TableCell>Trạng thái</TableCell>
              <TableCell>Bắt đầu từ ngày</TableCell>
            </tr>
          </TableHeader>
          <TableBody>
            {data.map((user, i) => (
              <TableRow key={i}>
                <TableCell>
                  <div className="flex items-center text-sm">
                    {/* <Avatar className="hidden mr-3 md:block" src={user.avatar} alt="User image" /> */}
                    <div>
                      <p className="font-semibold">{user.name}</p>
                      <p className="text-xs text-gray-600 dark:text-gray-400">
                        {user.category}
                      </p>
                    </div>
                  </div>
                </TableCell>
                <TableCell>
                  <input
                    type="password"
                    className="text-sm"
                    value={user.password}
                  />
                </TableCell>
                <TableCell>
                  <Badge type={user.type}>{user.status}</Badge>
                </TableCell>
                <TableCell>
                  <span className="text-sm">
                    {new Date(user.date).toLocaleDateString()}
                  </span>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TableFooter>
          <Pagination
            totalResults={totalResults}
            resultsPerPage={resultsPerPage}
            label="Table navigation"
            onChange={onPageChange}
          />
        </TableFooter>
      </TableContainer>
    </>
  );
};

export default Dashboard;
