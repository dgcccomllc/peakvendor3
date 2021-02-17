import * as React from 'react';
import { connect } from 'react-redux'
import { RouteComponentProps } from 'react-router';
import { Link } from 'react-router-dom';
import { ApplicationState } from '../../store';
import { TextField } from '@fluentui/react'
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import CompanyDetail from '../company/CompanyDetails';

import * as CostStore from '../../store/costs'
import { Input } from 'reactstrap';

import { FaAsterisk } from 'react-icons/fa/index'

// At runtime, Redux will merge together...
type CostProps =
    CostStore.CostState // ... state we've requested from the Redux store
    & typeof CostStore.actionCreators // ... plus action creators we've requested
    & RouteComponentProps<{ orgId: string, costId: string }>; // ... plus incoming routing parameters


class CostView extends React.PureComponent<CostProps> {
    private _orgId : string = '';
    private _costId: string = '';

    // This method is called when the component is first added to the document
    public componentDidMount() {
        this.ensureDataFetched();
    }

    // This method is called when the route parameters change
    public componentDidUpdate() {
        this.ensureDataFetched();
    }

    public render() {
        return (
            <React.Fragment>
                <h1 id="tabelLabel">Trip</h1>
                {this.renderCosts()}
                {this.props.isValid ? this.renderCommands() : null}
            </React.Fragment>
        );
    }


    private ensureDataFetched() {
        this._costId = this.props.match.params.costId;
        this._orgId = this.props.match.params.orgId;
        if (this._costId && this._orgId && (!this.props.cost))
            this.props.requestCost(this._orgId, this._costId);
    }

    private renderCosts() {
        const showSpinner = this.props.isLoading || !this.props.cost ? <Spinner size={SpinnerSize.large} label='Loading Cost Data...' /> : null;
        let result = [
            <div className='container'>
                {showSpinner}
            </div>];

        let error = ''; // this.props.costs ? this.props.costs.Error : '';

        return (
            <div className='w-100'>
                <div>{showSpinner}</div>

                <div className='container' style={this.props.isLoading ? { pointerEvents: "none", opacity: "0.4" } : {}} >
                    {this.props.isValid ?
                        <div>
                            <div>

                            </div>

                            <div className='row'>
                                <div className='col-2 font-weight-bold'>Cost Name:</div>
                                <div className='col-4'>{this.props.cost ? this.props.cost.p15_name : ''}</div>
                            </div>
                            <div className='row'>
                                <div className='col-2 font-weight-bold'>Status:</div>
                                <div className='col-4'>{this.props.cost ? this.props.cost.statuscode_desc : ''}</div>
                            </div>

                            <div className='row'>
                                <div className='col-2 font-weight-bold'>Start Date:</div>
                                <div className='col-3'>{this.props.cost ? this.props.cost.p15_startdate : ''}</div>
                                <div className='col-2 font-weight-bold'>End Date:</div>
                                <div className='col-3'>{this.props.cost ? this.props.cost.p15_enddate : ''}</div>
                            </div>

                            <div className='row'>
                                <div className='col-2 font-weight-bold'>Duration Type:</div>
                                <div className='col-3'>{this.props.cost ? this.props.cost.p15_durationtype_desc : ''}</div>
                            </div>

                            <div className='row mt-1'>
                                <div className='col-2 font-weight-bold pt-2'>Confirmation #: <FaAsterisk style={{color: 'red'}} size="8"/></div>
                                <div className='col-3'>
                                    <Input
                                        type="text"
                                        value={this.props.cost ? this.props.cost.p15_confirmation : ''}
                                        onChange={(event) => this.props.inputChange('p15_confirmation', event.target.value)} 
                                    />

                                </div>
                            </div>

                            <div className='row mt-2'>
                                <div className='col-2 font-weight-bold'>Notes:<br/><span style={{fontStyle: 'italic', fontSize: '11px'}}>Required to 'Decline / Modify'</span></div>
                                <div className='col-10'>
                                    <textarea className="w-100" style={{height: '100px'}}
                                    value={this.props.cost ? this.props.cost.costStatusNote : ''}
                                    onChange={(event) => this.props.inputChange('costStatusNote', event.target.value)} 
                                    />
                                </div>
                            </div>


                        </div>

                        :

                        <div className='col-4 font-weight-bold'>{error}</div>
                    }
                </div>
            </div>
        )
    }

    private renderCommands() {
        let hasConfirmation = this.props.cost ? this.props.cost.p15_confirmation.length > 0 ? true : false : false;
        let hasNote = this.props.cost ? this.props.cost.costStatusNote ? true : false : false;

        return (
            <div className='row mt-3'>
                <button type="button"
                    disabled={this.props.isLoading || !this.props.isValid || !hasConfirmation}
                    className="btn btn-primary btn-lg ml-2"
                 //   onClick={() => { this.props.changeStatus('', this._orgId, '6'); }}
                 >
                    Confirm
                </button>
                <button type="button"
                    disabled={this.props.isLoading || !this.props.isValid || !hasConfirmation || !hasNote}
                    className="btn btn-primary btn-lg ml-2"
                 //   onClick={() => { this.props.changeStatus('', this._orgId, '7'); }}
                 >
                    Decline
                </button>
                <button type="button"
                    disabled={this.props.isLoading || !this.props.isValid  || !hasConfirmation || !hasNote}
                    className="btn btn-primary btn-lg ml-2"
               //     onClick={() => { this.props.changeStatus('', this._orgId, '100000001'); }}
               >
                    Modify
                </button>

            </div>
        )
    }
}

export default connect(
    (state: ApplicationState) => state.cost, // Selects which state properties are merged into the component's props
    CostStore.actionCreators // Selects which action creators are merged into the component's props
)(CostView as any);

