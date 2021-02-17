import React from 'react';
import { Stack } from "@fluentui/react/lib/Stack";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";

import styles from "./CommandFooter.module.scss";
import { NamedTupleMember } from 'typescript';

interface ICommandFooterProps {
    onButtonClick: (buttonKey: string) => void;
    selectedCount: number;
    footerMessage?: string;
    primaryButton?: string;
}

const CommandFooter: React.FC<ICommandFooterProps> = ({ onButtonClick, selectedCount, footerMessage, primaryButton }) => {
        return (
            <>
            <Stack
                className={styles.commandFooter}
                horizontal={true}
                horizontalAlign="space-between"
                verticalAlign="center"
            >
                <span>
                    {primaryButton == 'keyDecline' ?
                        <PrimaryButton 
                            className={styles.declineButtonPrimary} 
                            text="Decline" 
                            disabled={selectedCount == 0 ? true : false}
                            onClick={e => onButtonClick('keyDecline')}>
                        </PrimaryButton>
                        :
                        <DefaultButton 
                            className={styles.declineButton} 
                            text="Decline" 
                            disabled={selectedCount == 0 ? true : false}
                            onClick={e => onButtonClick('keyDecline')}>
                        </DefaultButton>
                    }
                </span>
                
                <span className={styles.selectedCount}>{footerMessage == undefined || footerMessage.length == 0 ? 'Selected: ' + selectedCount.toString() : footerMessage}</span>
                
                <span className={styles.rightText}>
                    {primaryButton == 'keyModify' ?
                        <PrimaryButton 
                            className={styles.modifyButtonPrimary} 
                            disabled={selectedCount == 0 ? true : false}
                            text="Modify" 
                            onClick={e => onButtonClick('keyModify')}>
                        </PrimaryButton>

                        :

                        <DefaultButton 
                            className={styles.modifyButton} 
                            disabled={selectedCount == 0 ? true : false}
                            text="Modify" 
                            onClick={e => onButtonClick('keyModify')}>
                        </DefaultButton>
                    }

                    {primaryButton == 'keyConfirm' || primaryButton == undefined ?
                        <PrimaryButton 
                            className={styles.confirmButtonPrimary}
                            text="Confirm" 
                            disabled={selectedCount == 0 ? true : false}
                            onClick={e => onButtonClick('keyConfirm')}>
                        </PrimaryButton>

                        :

                        <DefaultButton
                            className={styles.confirmButton}
                            text="Confirm" 
                            disabled={selectedCount == 0 ? true : false}
                            onClick={e => onButtonClick('keyConfirm')}>
                        </DefaultButton>
                        
                    }   
                </span>
            </Stack>
            </>
        )
}

export default CommandFooter;