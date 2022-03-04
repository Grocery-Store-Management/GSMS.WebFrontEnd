import React, { useState, useEffect } from 'react';
import SectionTitle from '../components/Typography/SectionTitle';
import {
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  TableFooter,
  TableContainer,
  Badge,
  Pagination,
} from '@windmill/react-ui';
import {  emp } from '../utils/demo/tableData';
import '../styles/General.css';

function Employee() {
 
  const [pageTableEmployee, setPageTableEmployee] = useState(1)

  const [dataTableEmployee, setDataTableEmployee] = useState<any[]>(emp)

  const resultsPerPage = 10;
  const totalResults = emp.length;

  function onPageChangeTableEmployee(p: number) {
    setPageTableEmployee(p)
  }

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
