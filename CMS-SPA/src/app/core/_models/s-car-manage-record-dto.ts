import { Pagination } from "./pagination";

export class SCarManageRecordDto extends Pagination {
  licenseNumber: string;
  signInDateS: string;
  signInDateE: string;
  companyId: number;
  driverName: string;
  signInReason: string;
  departmentId: number;
  contactPerson: string;
  signOutDate:string;

  constructor() {
    super();
    this.licenseNumber = "";
    this.signInDateS = "";
    this.signInDateE = "";
    this.isPaging = true; //開分頁
    this.driverName = "";
    this.signInReason = "";
    this.contactPerson = "";
    this.signOutDate = "";  //預設全部All
  }
  public setPagination(pagination: Pagination) {
    this.currentPage = pagination.currentPage;
    this.itemsPerPage = pagination.itemsPerPage;
    this.totalItems = pagination.totalItems;
    this.totalPages = pagination.totalPages;
  }
}
