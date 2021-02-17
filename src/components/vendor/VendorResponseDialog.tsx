import React, {useState, useEffect} from 'react';
import { Input } from 'reactstrap';
import { useId } from '@uifabric/react-hooks';
import {ICost} from '../../models/costModel';
import { IStyleSet } from 'office-ui-fabric-react/lib/Styling';

import SampleImage from '../styles/Rectangle 36.png';
import { Spinner, SpinnerSize } from 'office-ui-fabric-react/lib/Spinner';

import CommandFooter from '../controls/CommandFooter';

import {
    Pivot,
    PivotItem,
    IPivotStyles,
    Label,
    ILabelStyles,
    getTheme,
    mergeStyleSets,
    FontWeights,
    Modal,
    IconButton,
    IIconProps,
    StackItem,
  } from 'office-ui-fabric-react';

  interface IResponseDialogProps {
    isOpen: boolean,
    defaultButtonKey: string,
    costIds: string[],
    costs: ICost[],
    onClose: () => void,
    onCommandClicked: (commandKey: string, costId?: string, p15_confirmation?: string, costStatusNote?: string) => void
}

interface IDialogState {
  costId: string,
  confirmation: string,
  comment: string
}

const labelStyles: Partial<IStyleSet<ILabelStyles>> = {
    root: { marginTop: 10 },
  };

  const pivotStyles: Partial<IStyleSet<IPivotStyles>> = {
    linkContent: {
        fontSize: "18px",
        height: "60px",
        width: "180px"    
      },
    itemContainer: {
      width: "100%"
    },
    root: {
      width: "100%"
    }
    
  };

const cancelIcon: IIconProps = { iconName: 'Cancel' };

const VendorResponseDialog: React.FC<IResponseDialogProps> = ({ isOpen, costIds, costs, defaultButtonKey, onClose, onCommandClicked }) => {
    const titleId = useId('title');
    const [currentCostIndex, setCurrentCostIndex] = useState(0);
    const [currentCost, setCurrentCost] = useState(costs.find(cost => cost.p15_costsid == costIds[currentCostIndex]));
    
    const [currentResponses, setResponse] = useState([{costId: currentCost?.p15_costsid, p15_confirmation: '', costStatusNote: ''}]);
    const [statusUpdate, showStatusUpdate] = useState(false);
    const [saving, showSaving] = useState(false);
    const [confirmation, setConfirmation] = useState(currentCost?.p15_confirmation);
    const [comment, setComment] = useState('');

    const onCloseLocal = () => {
      setCurrentCostIndex(0);
      setCurrentCost(undefined);
      onClose();
    }

    const onVendorResponseClick = (commandKey: string) => {
      showSaving(true);
      const currentResponse = currentResponses.find((cost) => cost.costId === currentCost?.p15_costsid);
      onCommandClicked(commandKey, currentCost?.p15_costsid, confirmation, comment);
      showSaving(false);
      moveNextPrev(1);
    }

    const moveNextPrev = (direction: number) => {
       if (currentCostIndex + direction < costIds.length) {
        setCurrentCostIndex(currentCostIndex + direction);
        updateCurrentCost();
      } else {
        onCloseLocal();
      }
    }

    const updateCurrentCost = () => {
      if (currentCost?.p15_costsid != costIds[currentCostIndex] && isOpen) {
        let costUpdate = costs.find(cost => cost.p15_costsid == costIds[currentCostIndex]);
        setCurrentCost(costUpdate);
        setConfirmation(costUpdate?.p15_confirmation);
        setComment('');
      }
    }

    const onInputChanged = (fieldName: string, value: string) => {
      const responses = currentResponses;
      const index = currentResponses.findIndex((cost) => cost.costId === currentCost?.p15_costsid);
      let response = index >=0 ? responses[index] : {costId: currentCost?.p15_costsid, p15_confirmation: '', costStatusNote: ''}

      if (fieldName == 'p15_confirmation') {
        response.p15_confirmation = value;
        setConfirmation(value);
      } else if (fieldName == 'costStatusNote') {
        response.costStatusNote = value;
        setComment(value);
      }

      if (index < 0) responses.push(response);
      setResponse(responses);
    }

    // Make sure we have the current cost in the loop set
//   if (currentCost?.p15_costsid != costIds[currentCostIndex]) {
    if (currentCost == undefined || currentCost?.p15_costsid != costIds[currentCostIndex]) {
      updateCurrentCost();
    }

    if (!costs || currentCost == undefined) {
        return null;
    } else {
        return (
            <>
                <Modal
                    titleAriaId={titleId}
                    isOpen={isOpen}
                    onDismiss={onCloseLocal}
                    isBlocking={false}
                    containerClassName={contentStyles.container}
                >
                    <div className={contentStyles.header}>
                        <span id={titleId}>{currentCost.p15_vendorserviceid_name}</span>
                        <IconButton
                            styles={iconButtonStyles}
                            iconProps={cancelIcon}
                            ariaLabel="Close vendor review form"
                            onClick={onCloseLocal}
                        />
                    </div>

                    <div className={contentStyles.navMenu}>
                        <Pivot aria-label="Vendor Response Menu" style={{paddingLeft: "20px"}} >
                            <PivotItem
                              style={{width: "100%"}}
                                headerText="Details"
                                headerButtonProps={{
                                'data-order': 1,
                                'data-title': 'Details',
                            }}>
                              <div className={contentStyles.contentContainer}>
                                
                                <img src={currentCost.p15_attachedimage} className={contentStyles.contentImage}></img>
                                <div className={contentStyles.leftColumn}>
                                  <div className={contentStyles.contentRow}>                                  
                                    <span>Rate Type</span>
                                    <div className={contentStyles.responseItem}>{currentCost.p15_ratetype_desc}</div>
                                  </div>
                                  
                                  <div className={contentStyles.contentRow}>                                  
                                    <span>Rate Plan</span>
                                    <div className={contentStyles.responseItem} >{currentCost.p15_vendorrateplanid_name}</div>
                                  </div>                                  
                                </div>
                                <div className={contentStyles.middleColumn}>
                                  <div className={contentStyles.contentRow}>
                                    <span>Amount ({currentCost.p15_unit_desc.replace('Per', 'Per ')})</span>
                                    <div className={contentStyles.responseItem} >{currentCost.CalcCosts.AmountFormatted}</div>
                                  </div>
                                  <div className={contentStyles.contentRow}>
                                    <span>Duration Type</span>
                                    <div className={contentStyles.responseItem} >{currentCost.p15_unit_desc.replace('Per', 'Per ')}</div>
                                  </div>

                                    <div className={contentStyles.contentRow}>
                                      <span>From day</span>
                                          <div className={contentStyles.responseItem} >{currentCost.CalcCosts.StartDay}</div>
                                    </div>


                                  <div className={contentStyles.contentRow}>
                                    <span>Days</span>
                                    <div className={contentStyles.responseItem} >{currentCost.CalcCosts.Duration}</div>
                                  </div>

                                  <div className={contentStyles.contentRow}>
                                    <span>Guests</span>
                                    <div className={contentStyles.responseItem} >{currentCost.CalcCosts.PriceScenarioDetails[0].NumberOfPeople == null ? currentCost.CalcCosts.PriceScenarioDetails[0].AdjNumberOfPeople : currentCost.CalcCosts.PriceScenarioDetails[0].NumberOfPeople}</div>
                                  </div>
                                  <div className={contentStyles.contentRow}>
                                    <span>Guest Type</span>
                                    <div className={contentStyles.responseItem} >{currentCost.p15_guesttype_desc}</div>
                                  </div>
                                </div>

                                <div className={contentStyles.rightColumn}>
                                  <span>Total</span>
                                  <div className={contentStyles.responseItem} >{currentCost.CalcCosts.TotalCostAmountFormatted}</div>
                                </div>

                                <div className={contentStyles.inputContent}>
                                  <div style={{borderBottom: '1px solid #CBD2DC', paddingTop: '0', marginBottom: "10px"}}>&nbsp;</div>
                                  <span>Confirmation Number</span>
                                  <div className={contentStyles.contentRow}>
                                    <Input 
                                      type="text" style={{width: "250px"}} 
                                      value={confirmation}
                                      onChange={(event) => onInputChanged('p15_confirmation', event.target.value)} 
                                    />
                                  </div>
                                  <span>Comments</span>
                                  <div className={contentStyles.contentRow}>                                  
                                    <textarea 
                                      style={{height: '75px', width: '100%', borderColor: "#CBD2DC"}}
                                      value={comment}
                                      onChange={(event) => onInputChanged('costStatusNote', event.target.value)} 
                                    />
                                  </div>


                                  {(saving === true ) &&
                                    <Spinner size={SpinnerSize.large} label='Saving Status...' />
                                  }

                                  {(statusUpdate === true) && 
                                    <div className={contentStyles.contentRow} style={{textAlign: 'center'}}>
                                      <span>Status Updated...</span>
                                    </div>
                                  }

                                </div>
                              </div>
                              
                            </PivotItem>
                            <PivotItem headerText="Descriptions">
                                <Label styles={labelStyles}>Pivot #2</Label>
                            </PivotItem>
                            <PivotItem headerText="Other">
                                <Label styles={labelStyles}>Pivot #3</Label>
                            </PivotItem>
                            <PivotItem headerText="More rates">
                                <Label styles={labelStyles}>Pivot #3</Label>
                            </PivotItem>
                            <PivotItem headerText="Service">
                                <Label styles={labelStyles}>Pivot #3</Label>
                            </PivotItem>
                            <PivotItem headerText="Vendor">
                                <Label styles={labelStyles}>Pivot #3</Label>
                            </PivotItem>
                        </Pivot>
                    </div>

                    <div className={contentStyles.footer}>
                        <CommandFooter onButtonClick={onVendorResponseClick} selectedCount={costIds.length} primaryButton={defaultButtonKey} footerMessage={(currentCostIndex + 1).toString() + ' of ' + costIds.length + ' Selected'}></CommandFooter>
                    </div>                    
                </Modal>
            </>
        )
    }

}

const theme = getTheme();
const contentStyles = mergeStyleSets({
  container: {
    width: '800px',
    height: '852px',
    display: 'flex',
    flexFlow: 'column nowrap',
    alignItems: 'stretch',
    padding: "0 0 0 0",
  },
  header: [
    theme.fonts.xLargePlus,
    {
      flex: '1 1 auto',
      color: theme.palette.neutralPrimary,
      display: 'flex',
      alignItems: 'center',
      fontWeight: FontWeights.semibold,
      padding: "24px 40px 0 40px"
    },
  ],
  body: {
    width: "100%",
    paddingTop: "24px",
  },

  contentImage: {
      width: "300px",
      height: "224px",
      position: "absolute",
      top: '125px',
      left: '40px'
  },

  leftColumn: {
    position: "absolute",
    top: "355px",
    left: "40px"
    
  },
  middleColumn: {
    position: "absolute",
    top: "125px",
    left: "375px"
  },
  rightColumn: {
    position: "absolute",
    top: "125px",
    left: "575px"
  },
  inputContent: {
    position: "absolute",
    width: "720px",
    top: "475px",
  },

  navMenu: {
    height: '40px',
    padding: "0 40px 0 18px"
  },
  navMenuItems: {
    color: '#757575',
    width: '100px'
  },
  footer: {
    position: 'absolute',
    bottom: '0',
    height: '80',
    width: '100%'
  },

  responseItem: {
    paddingLeft: "10px",
    fontWeight: "bold"
  },

  contentContainer: {
    width: '100%',
    color: '#757575'
  },

  contentRow: {
    width: '100%',
    marginBottom: "15px"

  },

  bold: {
    fontWeight: "bold"
  }
});

const toggleStyles = { root: { marginBottom: '20px' } };
const iconButtonStyles = {
  root: {
    color: theme.palette.neutralPrimary,
    marginLeft: 'auto',
    marginTop: '4px',
    marginRight: '2px',
  },
  rootHovered: {
    color: theme.palette.neutralDark,
  },
};

export default VendorResponseDialog;
