import React, { useState, useEffect } from 'react';
import PageTitle from '../components/Typography/PageTitle';
import SectionTitle from '../components/Typography/SectionTitle';
import CTA from '../components/CTA';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Avatar,
  Button,
  Pagination,
} from '@windmill/react-ui';
import { HeartIcon, TrashIcon, FireIcon } from '../icons';
import { type, emp, category } from '../utils/demo/tableData';
// make a copy of the data, for the second table
function Employee() {
  /**
   * DISCLAIMER: This code could be badly improved, but for the sake of the example
   * and readability, all the logic for both table are here.
   * You would be better served by dividing each table in its own
   * component, like Table(?) and TableWithActions(?) hiding the
   * presentation details away from the page view.
   */

  // setup pages control for every table
  const [pageTableEmployee, setPageTableEmployee] = useState(1)

  // setup data for every table
  const [dataTableEmployee, setDataTableEmployee] = useState<any[]>(emp)

  // pagination setup
  const resultsPerPage = 10;
  const totalResults = emp.length;

  // pagination change control
  function onPageChangeTableEmployee(p: number) {
    setPageTableEmployee(p)
  }

  // on page change, load new sliced data
  // here you would make another server request for new data
  useEffect(() => {
    setDataTableEmployee(emp.slice((pageTableEmployee - 1) * resultsPerPage, pageTableEmployee * resultsPerPage))
  }, [pageTableEmployee])
  return (
    <div className="container mt-3">
      <div className="row">
        <div className="col col-md-12">
          <SectionTitle>Danh sách nhân viên</SectionTitle>
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
                {dataTableEmployee.map((user, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        {/* <Avatar className="hidden mr-3 md:block" src={user.avatar} alt="User image" /> */}
                        <div>
                          <p className="font-semibold">{user.name}</p>
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
                onChange={onPageChangeTableEmployee}
              />
            </TableFooter>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Employee
