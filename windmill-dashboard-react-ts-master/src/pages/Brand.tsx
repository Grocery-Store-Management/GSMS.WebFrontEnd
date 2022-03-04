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
  Button,
  Pagination,
} from '@windmill/react-ui';
import { HeartIcon, TrashIcon } from '../icons';
import { type } from '../utils/demo/tableData';
import { getBrandList } from '../Services/BrandService';
import { pageLoader } from '../utils/PageLoadingUtility/PageLoader';
import '../styles/General.css';

function Brand() {
  const [pageLoading, setPageLoading] = useState<boolean>(false);

  const [response, setResponse] = useState<any>();
  const [totalResults, setResult] = useState<any>();
  const [pageTable1, setPageTable1] = useState(1)

  const [dataTable1, setDataTable1] = useState<any[]>([])

  const resultsPerPage = 10;

  function onPageChangeTable1(p: number) {
    setPageTable1(p)
  }
  useEffect(() => {
    setPageLoading(true)
    getBrandList().then((res: any) => {
      if (res) { setResponse(res); setResult(res.length); setPageLoading(false) }
    })
  }, [])

  useEffect(() => {
    if (response) {
      setDataTable1(response.slice((pageTable1 - 1) * resultsPerPage, pageTable1 * resultsPerPage))
    }
  }, [response, pageTable1])

  return (
    <div className="container mt-3">
      {pageLoading && pageLoader()}

      <div className="row">
        <div className="col col-md-7">
          <SectionTitle>Quản lý chuỗi cửa hàng</SectionTitle>
          <TableContainer className="mb-8">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>Tên chuỗi Cửa hàng</TableCell>
                  <TableCell>Tình trạng</TableCell>
                  {/* <TableCell>Tương tác</TableCell> */}
                </tr>
              </TableHeader>
              <TableBody>
                {dataTable1.map((brand, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        {/* <Avatar className="hidden mr-3 md:block" src={brand.avatar} alt="brand avatar" /> */}
                        <div>
                          <p className="font-semibold">{brand.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        type={brand.isDeleted ? type.SUCCESS as any : type.NEUTRAL}>
                        {brand.isDeleted ? "Đang hoạt động" : "Đã đóng cửa"}
                      </Badge>
                    </TableCell>
                    {/* <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button layout="link" size="small" aria-label="Edit">
                          <HeartIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                        <Button layout="link" size="small" aria-label="Delete">
                          <TrashIcon className="w-5 h-5" aria-hidden="true" />
                        </Button>
                      </div>
                    </TableCell> */}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            <TableFooter>
              <Pagination
                totalResults={totalResults}
                resultsPerPage={resultsPerPage}
                onChange={onPageChangeTable1}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        </div>
      </div>
    </div>
  );
}

export default Brand
