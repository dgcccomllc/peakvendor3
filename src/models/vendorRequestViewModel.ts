import {ITripDeparture} from './tripDepartureModel';
import {ICompany} from './companyModel';

export interface IVendorRequestViewModel {
    Vendor: ICompany;
    Departure: ITripDeparture;
}