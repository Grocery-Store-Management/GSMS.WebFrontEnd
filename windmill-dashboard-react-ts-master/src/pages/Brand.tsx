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
import { type } from '../utils/demo/tableData';
import { pageLoader } from '../utils/PageLoadingUtility/PageLoader';
import '../styles/General.css';
import { getStoreList, updateStore } from '../Services/StoreService';

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

  function refreshData(){
    setPageLoading(true)
    getStoreList().then((res: any) => {
      if (res) { setResponse(res); setResult(res.length); setPageLoading(false) }
    })
  }
  useEffect(() => {
    refreshData();
  }, [])

  useEffect(() => {
    if (response) {
      setDataTable1(response.slice((pageTable1 - 1) * resultsPerPage, pageTable1 * resultsPerPage))
    }
  }, [response, pageTable1])

  function changeStoreStatus(store : any){
    store = {
      ...store,
      status: store.status === 1 || store.status === null ? store.status = 0 : store.status = 1
    }
    updateStore(store);
    refreshData();
  }

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
                  <TableCell>Tên Cửa hàng</TableCell>
                  <TableCell>Tình trạng</TableCell>
                  <TableCell>Tương tác</TableCell>
                </tr>
              </TableHeader>
              <TableBody>
                {dataTable1.map((store, i) => (
                  <TableRow key={i}>
                    <TableCell>
                      <div className="flex items-center text-sm">
                        <div>
                          <p className="font-semibold">{store.name}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge
                        type={store.status === 1 ? type.SUCCESS as any : type.NEUTRAL}>
                        {store.status === 1  ? "Đang hoạt động" : "Đã đóng cửa"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-4">
                        <Button className='btn btn-primary' layout="link" size="small" aria-label="Edit" onClick={() => changeStoreStatus(store)}>
                          Đổi trạng thái
                        </Button>
                      </div>
                    </TableCell>
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
