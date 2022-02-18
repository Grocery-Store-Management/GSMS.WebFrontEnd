export interface IReceipt {
    id: string,
    customerId: string,
    employeeId: string,
    storeId: string,
    createdDate: any,
    receiptDetails : any[],
}

export class Receipt implements IReceipt {
    id: string;
    customerId: string;
    employeeId: string;
    storeId: string;
    createdDate: any;
    receiptDetails: any[];
    constructor() {
        this.id = "";
        this.customerId = "";
        this.employeeId = "";
        this.storeId = "";
        this.createdDate = null;
        this.receiptDetails = [];
     }
}

