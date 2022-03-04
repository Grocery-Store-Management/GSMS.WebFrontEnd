export interface IReceiptDetail {
    id: string,
    productId: string,
    quantity : number,
}

export class ReceiptDetail implements IReceiptDetail {
    id: string;
    productId: string;
    quantity: number;
    constructor() {
        this.id = "";
        this.productId = "";
        this.quantity = 0;
     }
}

