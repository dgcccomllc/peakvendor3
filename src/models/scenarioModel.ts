import {IPrice} from './priceModel';

export interface IScenario {
    p15_lockactualallocations: string;
    statecode: number;
    statecode_desc: string;
    p15_isactualguests: string;
    statuscode: number;
    statuscode_desc: string;
    createdon: string;
    p15_departureid: string;
    p15_departureid_name: string;
    ownerid: string;
    ownerid_name: string;
    modifiedon: string;
    p15_isestimatedguests: string;
    modifiedby: string;
    modifiedby_name: string;
    modifiedonbehalfby?: string | null;
    modifiedonbehalfby_name?: string | null;
    p15_isoriginalguests: string;
    p15_scenarioid: string;
    createdonbehalfby?: string | null;
    createdonbehalfby_name?: string | null;
    createdby: string;
    createdby_name: string;
    owningbusinessunit: string;
    owningbusinessunit_name?: null;
    p15_name: string;
    owninguser: string;
    owninguser_name?: null;
    p15_numberofadults?: string | null;
    ScenarioDetail?: (IScenarioDetail | null)[] | null;
}
export interface IScenarioDetail {
    p15_scenariodetailid: string;
    owningbusinessunit: string;
    owningbusinessunit_name?: null;
    modifiedonbehalfby?: string | null;
    modifiedonbehalfby_name?: string | null;
    createdonbehalfby?: string | null;
    createdonbehalfby_name?: string | null;
    p15_priceid: string;
    p15_priceid_name: string;
    statuscode: number;
    statuscode_desc: string;
    p15_type: number;
    p15_type_desc: string;
    createdby: string;
    createdby_name: string;
    statecode: number;
    statecode_desc: string;
    ownerid: string;
    ownerid_name: string;
    modifiedon: string;
    owninguser: string;
    owninguser_name?: null;
    modifiedby: string;
    modifiedby_name: string;
    p15_numberofpeople?: string | null;
    createdon: string;
    p15_scenarioid: string;
    p15_scenarioid_name: string;
    Price: IPrice;
    p15_adjustednumberofpeople?: string | null;
    p15_costrateid?: string | null;
    p15_costrateid_name?: string | null;
}

export interface IScenarioCost {
    costId: string;
    ScenarioId: string;
    ScenarioDetailId: string;
    PerPersonCost: number;
    CurrencySymbol: string;
    CurrencyPrecision: number;
    Type: number;
    TripPriceP15_Tier1_Amount_Base: number;
    PriceId: string;
    PriceIdName: string;
    CostRateId: string;
    NumberOfPeople: number;
    AdjNumberOfPeople?: null;
    PerPersonCostFormatted: string;
    PriceRateType: number;
    PriceUnit: number;
    TripPriceP15LinkedPriceId: string;
    TripPriceP15PriceCategoryId: string;
  }
  