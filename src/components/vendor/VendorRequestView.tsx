import * as React from 'react';
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { ApplicationState } from '../../store';
import { IRenderFunction, StackItem, IStyleFunction, TextField } from '@fluentui/react';
import { Stack } from '@fluentui/react';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';
import { getTheme } from '@fluentui/react/lib/Styling';

import {
    DetailsList,
    DetailsListLayoutMode,
    Selection,
    SelectionMode,
    IColumn,
    DetailsRow, 
    DetailsHeader,
    IDetailsRowStyles, 
    IDetailsHeaderStyles,
    IDetailsHeaderProps,
    IDetailsListProps,    
    IDetailsRowStyleProps
  } from 'office-ui-fabric-react/lib/DetailsList';

import * as VendorRequestStore from '../../store/vendorRequestView';

import CommandFooter from '../controls/CommandFooter';
import CompanyDetails from '../company/CompanyDetails';
import VendorHeader from './VendorHeader';
import VendorResponseDialog from './VendorResponseDialog'

import styles from "./VendorRequestView.module.scss";
import { ICost } from '../../models/costModel';

const theme = getTheme();

type VendorRequestProps =
    VendorRequestStore.VendorState
    & typeof VendorRequestStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ orgId: string, vendorId: string, departureId: string }>; // ... plus incoming routing parameters

class VendorRequestView extends React.PureComponent<VendorRequestProps> {
    private _orgId : string = '';
    private _vendorId: string = '';
    private _departureId: string = '';

    constructor(props: VendorRequestProps) {
      super(props);
      this.onCostReviewSubmitted = this.onCostReviewSubmitted.bind(this);
    }

    private _columns: IColumn[] = [
        {
          key: 'keySelect',
          name: '',
          minWidth: 16,
          maxWidth: 16,
//          onColumnClick: this._onColumnClick,
          onRender: (item: ICost) => (
            <Checkbox key={item.p15_costsid} id={item.p15_costsid} onChange={this.onCostSelected} />
          ),
        },
        {
          key: 'p15_companyid_name',
          name: 'Vendor',
          fieldName: 'p15_companyid_name',
          minWidth: 75,
          maxWidth: 130,
          isRowHeader: false,
          isResizable: true,
          isSorted: true,
          isSortedDescending: false,
          sortAscendingAriaLabel: 'Sorted A to Z',
          sortDescendingAriaLabel: 'Sorted Z to A',
          //onColumnClick: this._onColumnClick,
          data: 'string',
          isPadded: true,
        },
        {
          key: 'p15_vendorserviceid_name',
          name: 'Name',
          fieldName: 'p15_vendorserviceid_name',
          minWidth: 50,
          maxWidth: 150,
          isResizable: true,
//          onColumnClick: this._onColumnClick,
          data: 'number',
/*          
          onRender: (item: IDocument) => {
            return <span>{item.dateModified}</span>;
          },
*/          
          isPadded: true,
        },
        {
          key: 'p15_vendorrateplanid_name',
          name: 'Rate Plan',
          fieldName: 'p15_vendorrateplanid_name',
          minWidth: 75,
          maxWidth: 100,
          isResizable: true,
          isCollapsible: true,
          data: 'string',
//          onColumnClick: this._onColumnClick,
/*
          onRender: (item: IDocument) => {
            return <span>{item.modifiedBy}</span>;
          },
*/          
          isPadded: true,
        },
        {
          key: 'p15_paytocompanyid_name',
          name: 'Pay To',
          fieldName: 'p15_paytocompanyid_name',
          minWidth: 50,
          maxWidth: 125,
          isResizable: true,
          isCollapsible: true,
          data: 'string',
//          onColumnClick: this._onColumnClick,
/*
          onRender: (item: IDocument) => {
            return <span>{item.fileSize}</span>;
          },
*/          
        },
        {
          key: 'keyPerPersonCost',
          name: 'Rate',
          fieldName: 'CalcCosts.PriceScenarioDetails[0].PerPersonCostFormatted',
          minWidth: 30,
          maxWidth: 60,
          isResizable: true,
          isCollapsible: true,
          data: 'number',
          onRender: (item: ICost) => {
            if (item.CalcCosts.PriceScenarioDetails.length == 0) return null 
            else
            return <span>{item.CalcCosts.AmountFormatted}</span>;
          },
        },        
        {
          key: 'keyQuantity',
          name: 'Quantity',
          fieldName: 'CalcCosts.Units',
          minWidth: 70,
          maxWidth: 160,
          isResizable: true,
          isCollapsible: true,
          data: 'number',
          onRender: (item: ICost) => {
            
            let guestType = item.p15_guesttype_desc;
            let unitDesc = item.p15_unit_desc.replace('Per', '');
            let numPeople = item.CalcCosts.PriceScenarioDetails[0].NumberOfPeople;
            let adjNumPeople =  item.CalcCosts.PriceScenarioDetails[0].AdjNumberOfPeople;
            let desc = ''

            if (adjNumPeople != null) {
              desc =  `${adjNumPeople} ${guestType}${adjNumPeople > 1 ? 's' : ''}`  // ' (' + adjNumPeople + ' ' + guestType + adjNumPeople > 1 ? 's' ')';
            }
            else 
              desc = `${numPeople} ${guestType}${numPeople > 1 ? 's' : ''}`

            let type = item.CalcCosts.RateTypeGuestType.replace('/' + guestType, '');

            if (unitDesc == 'Person') 
              return <span>{desc}</span>;
            else 
            {
              if (item.CalcCosts.Units > 1) unitDesc += 's';
              if (item.p15_costcategoryid_name == 'Accommodations') unitDesc = type + ' ' + unitDesc;

              return <span>{item.CalcCosts.Units} {unitDesc} ({desc})</span>;
            }
          },
        },    
        {
          key: 'keyDuration',
          name: 'Duration',
          fieldName: 'CalcCosts.Duration',
          minWidth: 70,
          maxWidth: 90,
          isResizable: true,
          isCollapsible: true,
          data: 'number',
          onRender: (item: ICost) => {
            if (item.p15_durationtype_desc){
              let durationDesc = item.p15_durationtype_desc.replace('Per','');
              
              if (item.CalcCosts.Duration > 1) durationDesc += 's';
              
              return <span>{item.CalcCosts.Duration + ' ' + durationDesc}</span>;
            }
            else
              return '1 Day';
          },
        },    
        {
          key: 'keyTotalAmount',
          name: 'Amount',
          fieldName: 'CalcCosts.TotalCostAmount',
          minWidth: 70,
          maxWidth: 90,
          isResizable: true,
          isCollapsible: true,
          data: 'number',
          onRender: (item: ICost) => {
            return <span>{item.CalcCosts.TotalCostAmountFormatted}</span>;
          },
        },                    
        
        
      ];

    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    // This method is called when the route parameters change
    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    private ensureDataFetched() {
        this._orgId = this.props.match.params.orgId;
        this._vendorId = this.props.match.params.vendorId;
        this._departureId = this.props.match.params.departureId;

        if (this._orgId && this._vendorId && this._departureId && (!this.props.vendor))
            this.props.requestCompany(this._orgId, this._vendorId, this._departureId);
    }

    private onButtonClick = (buttonKey: string): void => 
    {
      this.props.reviewCosts(buttonKey, true);
    };

    private onCostReviewClosed = (): void => {
      this.props.reviewCosts('', false);
    }

    private onCostReviewSubmitted = (commandKey: string, costId?: string, p15_confirmation?: string, costStatusNote?: string) : void => {
      this.props.changeStatus(this._orgId, commandKey, costId, p15_confirmation, costStatusNote);
    }

   private onCostSelected = (ev?: React.FormEvent<HTMLElement | HTMLInputElement>, checked?: boolean): void =>
   {
    let costId = ev?.currentTarget.id;

     if (ev?.currentTarget)
      this.props.costSelectChange(ev?.currentTarget.id, checked);
    }

    private _getKey(item: any, index?: number): string {
        return item.key;
      }

      private _onRenderDetailsHeader: IRenderFunction<IDetailsHeaderProps> = (props, defaultRender) => {
        const customStyles: Partial<IDetailsHeaderStyles> = {};

        if (props) {
            customStyles.root = { height: '32px', padding: 0, margin: 0}
            return <DetailsHeader {...props} styles={customStyles} ></DetailsHeader>
        }
        else return null;
      }

    private _onRenderRow: IDetailsListProps['onRenderRow'] = props => {
      const customStyles: Partial<IDetailsRowStyles> = {};
      if (props) {
        if (props.itemIndex % 2 === 0) {
          // Every other row renders with a different background color
          customStyles.root = { backgroundColor: theme.palette.themeLighterAlt, height: '32px' };
        } else {
          customStyles.root = { height: '32px' };
        }
 
        return <DetailsRow {...props} styles={customStyles} />;
      }
      return null;
    };

    public renderDialog() {
      if(this.props.vendor?.Departure.Costs && this.props.costsSelected.length > 0) {
        return (
          <VendorResponseDialog
            isOpen={this.props.showReviewCosts}
            costIds={this.props.costsSelected}
            costs={this.props.vendor?.Departure.Costs}
            defaultButtonKey={this.props.selectedReviewType}
            onClose={this.onCostReviewClosed}
            onCommandClicked={this.onCostReviewSubmitted}
          ></VendorResponseDialog>
        );
      } else {
        return null;
      }
    }

    public render() {
      if (this.props.vendor && this.props.vendor.Departure && this.props.vendor.Departure.Costs)
            return (
                <React.Fragment>
                    <VendorHeader Company={this.props.vendor?.Vendor} DepartureName={this.props.vendor.Departure.p15_name}></VendorHeader>
                    <Stack className={styles.content}>
                        <CompanyDetails Company={this.props.vendor?.Vendor} DepartureName={this.props.vendor.Departure.p15_name}></CompanyDetails>
                        
                        <StackItem className={styles.vendorInstructions}>
                            <span>Please review the requested reservations to confirm availability, rates and payment terms.</span>
                        </StackItem>

                        <DetailsList className={styles.vendorCostSelect}
                            items={this.props.vendor.Departure.Costs}
                            compact={true}
                            columns={this._columns}
                            selectionMode={SelectionMode.none}
                            getKey={this._getKey}
                            setKey="none"
                            layoutMode={DetailsListLayoutMode.justified}
                            isHeaderVisible={true}
                            onRenderDetailsHeader={this._onRenderDetailsHeader}
                            onRenderRow={this._onRenderRow}
//                            onItemInvoked={this._onItemInvoked}
                        />
                  
                    </Stack>
                    <CommandFooter onButtonClick={this.onButtonClick} selectedCount={this.props.costsSelected.length}></CommandFooter>

                    {this.renderDialog()}
                </React.Fragment>
            );
        else
            return (
                <Spinner size={SpinnerSize.large} label='Loading Cost Data...' />
            );
    }
}       

export default connect(
    (state: ApplicationState) => state.vendorRequestView, // Selects which state properties are merged into the component's props
    VendorRequestStore.actionCreators // Selects which action creators are merged into the component's props
)(VendorRequestView as any);