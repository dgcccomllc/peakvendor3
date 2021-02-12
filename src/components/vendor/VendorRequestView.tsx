import * as React from 'react';
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router';
import { Checkbox } from 'office-ui-fabric-react/lib/Checkbox';
import { Link } from 'react-router-dom';
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

    private _columns: IColumn[] = [
        {
          key: 'keySelect',
          name: '',
          minWidth: 16,
          maxWidth: 16,
//          onColumnClick: this._onColumnClick,
          onRender: (item: ICost) => (
            <Checkbox />
          ),
        },
        {
          key: 'p15_companyid_name',
          name: 'Vendor',
          fieldName: 'p15_companyid_name',
          minWidth: 50,
          maxWidth: 200,
          isRowHeader: true,
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
          minWidth: 70,
          maxWidth: 90,
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
          key: 'p15_VendorRatePlanIdName',
          name: 'Rate Plan',
          fieldName: 'p15_VendorRatePlanIdName',
          minWidth: 70,
          maxWidth: 90,
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
          key: 'p15_companyidName',
          name: 'Pay To',
          fieldName: 'p15_companyidName',
          minWidth: 70,
          maxWidth: 90,
          isResizable: true,
          isCollapsible: true,
          data: 'number',
//          onColumnClick: this._onColumnClick,
/*
          onRender: (item: IDocument) => {
            return <span>{item.fileSize}</span>;
          },
*/          
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
                    <CommandFooter ButtonCount={'3'}></CommandFooter>
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

