import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as P15Auth from '../_services/auth'
import * as VendorRequestView from '../models/vendorRequestViewModel';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

const _appName = 'P15Vendor';
const _baseURL = 'https://localhost:44369/';

export interface VendorState {
    isLoading: boolean;
    isValid: boolean;
    vendor?: VendorRequestView.IVendorRequestViewModel;
    companyId: string;
    departureId: string;
    orgId: string;
    error: string;
    costsSelected: string[];
}

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestVendorAction {
    type: 'REQUEST_VENDOR';
    companyId: string;
    departureId: string;
    orgId: string;
}

interface ReceiveVendorAction {
    type: 'RECEIVE_VENDOR';
    companyId: string;
    departureId: string;
    orgId: string;
    error: string;
    vendor: VendorRequestView.IVendorRequestViewModel;
}

interface CostSelectChange {
    type: 'SELECT_COST';
    costId: string;
    checked: boolean;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestVendorAction | ReceiveVendorAction | CostSelectChange ;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    costSelectChange: (costId: string, isChecked?: boolean) => ({ type: 'SELECT_COST', costId: costId, checked: isChecked } as CostSelectChange),
    requestCompany: (orgId: string, companyId: string, departureId: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        if (companyId && orgId && departureId) {
            const appState = getState();

            if (
                appState && 
                appState.vendorRequestView && 
                appState.vendorRequestView.companyId != companyId &&
                appState.vendorRequestView.departureId != departureId
            ) {
                let token = await(await P15Auth.requestJWT(_appName, orgId));

                fetch(`${_baseURL}org/${orgId}/company/${companyId}/departure/${departureId}`, {

                })                    
                .then(res => res.json() as Promise<VendorRequestView.IVendorRequestViewModel>)
                .then(data => {
                    dispatch({ type: 'RECEIVE_VENDOR', companyId: companyId, departureId: departureId, orgId: orgId, vendor: data, error: '' });
                }).catch(err => {
                    let i = 0;
                });

            }

            dispatch({ type: 'REQUEST_VENDOR', companyId: companyId, departureId: departureId, orgId: orgId });
        }
    },
};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.
const unloadedState: VendorState = { isLoading: false, orgId: '', isValid: false, error: '', companyId: '', departureId: '', vendor: undefined, costsSelected: [] };

export const reducer: Reducer<VendorState> = (state: VendorState | undefined, incomingAction: Action): VendorState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    switch (action.type) {

        case 'SELECT_COST':
            return {
                ...state,
                costsSelected: action.checked ? [...state.costsSelected, action.costId] : state.costsSelected.filter(item => item !== action.costId)
            }

        case 'REQUEST_VENDOR':
            return {
                ...state,
                companyId: action.companyId,
                departureId: action.departureId,
                orgId: action.orgId,
                vendor: state.vendor,
                isLoading: true,
                isValid: true,
                error: ''
             }

        case 'RECEIVE_VENDOR':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.companyId === state.companyId) {
                return {
                    ...state,
                    vendor: action.vendor,
                    isLoading: false,
                    isValid: action.error == '' ? true: false,
                    error: action.error
                };
            }
            break;

        default:
            return {
                ...state,
                isLoading: true,
                isValid: false,
                error: ''
            }
    }

    return state;
};
