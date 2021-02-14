import { Action, Reducer } from 'redux';
import { AppThunkAction } from '.';
import * as P15Auth from '../_services/auth'
import * as CostModel from '../models/costModel'
import { ChangeEvent, ReactInstance, useState } from 'react';

// -----------------
// STATE - This defines the type of data maintained in the Redux store.

const _appName = 'P15Vendor';
const _baseURL = 'https://localhost:44369/';

export interface CostState {
    isLoading: boolean;
    isValid: boolean;
    costId?: string;
    orgId?: string;
    cost?: CostModel.ICost;
    error: string;
    redraw: boolean;
}

export interface ApproveAction { type: 'APPROVE_COST' }
export interface RejectAction { type: 'REJECT_COST' }

// -----------------
// ACTIONS - These are serializable (hence replayable) descriptions of state transitions.
// They do not themselves have any side-effects; they just describe something that is going to happen.

interface RequestCostAction {
    type: 'REQUEST_COST';
    costId: string;
}

interface ReceiveCostAction {
    type: 'RECEIVE_COST';
    costId: string;
    error: string;
    cost: CostModel.ICost; 
}

interface UpdateText {
    type: 'UPDATE_TEXT';
    cost?: CostModel.ICost;
    fieldName: string;
    textInput: string;
}

// Declare a 'discriminated union' type. This guarantees that all references to 'type' properties contain one of the
// declared type strings (and not any other arbitrary string).
type KnownAction = RequestCostAction | ReceiveCostAction | ApproveAction | RejectAction | UpdateText;

// ----------------
// ACTION CREATORS - These are functions exposed to UI components that will trigger a state transition.
// They don't directly mutate state, but they can have external side-effects (such as loading data).

export const actionCreators = {
    inputChange: (fieldName: string, value: string): AppThunkAction<UpdateText> => async (dispatch, getState) => {
        const appState = getState();

        dispatch({ type: "UPDATE_TEXT", cost: appState.cost?.cost, fieldName: fieldName, textInput: value });
    },

    requestCost: (orgId: string, costId: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        if (costId && orgId) {
            const appState = getState();

            let i = 0;

            if (appState && appState.cost && costId !== appState.cost.costId) {
                let token = await(await P15Auth.requestJWT(_appName, orgId));

                fetch(`${_baseURL}org/${orgId}/costs/${costId}/detail`, {
                    method: 'GET', // *GET, POST, PUT, DELETE, etc.
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': token
                    }
                })
                    .then(res => res.json() as Promise<CostModel.ICost>)
                    .then(data => {
                        dispatch({ type: 'RECEIVE_COST', costId: costId, cost: data, error: '' });
                    }).catch(err => {

                    });

                dispatch({ type: 'REQUEST_COST', costId: costId });
            }
        }
    },

    changeStatus: (orgId: string, statusCode: string): AppThunkAction<KnownAction> => async (dispatch, getState) => {
        const appState = getState();
        if (appState && appState.cost) {
            if (appState.cost.costId) {
                const _costId = appState.cost.costId;

                let token = await (await P15Auth.requestJWT(_appName, orgId));

                fetch(`${_baseURL}org/${orgId}/costs/${_costId}/updatestatus`, {
                    method: 'POST', // *GET, POST, PUT, DELETE, etc.
                    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
                    headers: {
                        'Accept': 'application/json, text/plain, */*',
                        'Content-Type': 'application/json;charset=utf-8',
                        'Authorization': token
                    },
                    body: JSON.stringify(
                        { status: statusCode, 
                            confirmation: appState.cost.cost?.p15_confirmation,
                            statusnote: appState.cost.cost?.costStatusNote
                         }
                    )
                })
                    .then(res => res.json() as Promise<CostModel.ICost>)
                    .then(data => {
                        let i = 0;
                        dispatch({ type: 'RECEIVE_COST', costId: _costId, cost: data, error: '' });
                    })
                    .catch(err => {
                        let i = 0;
                    });

                dispatch({ type: 'REQUEST_COST', costId: _costId });
            }
        }
    },


};

// ----------------
// REDUCER - For a given state and action, returns the new state. To support time travel, this must not mutate the old state.

const unloadedState: CostState = { isLoading: false, isValid: false, error: '', redraw: false };

export const reducer: Reducer<CostState> = (state: CostState | undefined, incomingAction: Action): CostState => {
    if (state === undefined) {
        return unloadedState;
    }

    const action = incomingAction as KnownAction;

    switch (action.type) {
        case 'UPDATE_TEXT':
            let updatedCost = action.cost;

            if (updatedCost != undefined) {
                let fieldName : string = action.fieldName;
                (<any>updatedCost)[fieldName]  = action.textInput;
            }

            return {
                costId: updatedCost?.p15_costsid,
                cost: Object.assign({}, updatedCost),
                isLoading: false,
                isValid: true,
                redraw: true,
                error: ''
            };

        case 'REQUEST_COST':
            return {
                costId: action.costId,
                cost: state.cost,
                isLoading: true,
                isValid: false,
                redraw: false,
                error: ''
            };
        case 'RECEIVE_COST':
            // Only accept the incoming data if it matches the most recent request. This ensures we correctly
            // handle out-of-order responses.
            if (action.costId === state.costId) {
                return {
                    costId: action.costId,
                    cost: action.cost,
                    isLoading: false,
                    error: action.error,
                    redraw: false,
                    isValid: action.error == '' ? true : false
                };
            }
            break;

        default:
            return {
                cost: undefined,
                isLoading: true,
                isValid: false,
                redraw: false,
                error: ''
            }
    }

    return state;
};
