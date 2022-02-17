export interface IReceipt {
    id: string,
    customerId: string,
    employeeId: string,
    storeId: string,
    createdDate: any,
}

export class Receipt implements IReceipt {
    id: string;
    customerId: string;
    employeeId: string;
    storeId: string;
    createdDate: any;
    constructor() {
        this.id = "";
        this.customerId = "";
        this.employeeId = "";
        this.storeId = "";
        this.createdDate = null;
     }
}

