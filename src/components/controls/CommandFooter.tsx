import React from 'react';
import { Stack } from "@fluentui/react/lib/Stack";
import { PrimaryButton, DefaultButton } from "@fluentui/react/lib/Button";

import styles from "./CommandFooter.module.scss";

interface ICommandFooterProps {
    onButtonClick: (buttonKey: string) => void;
    selectedCount: number;
}



const CommandFooter: React.FC<ICommandFooterProps> = ({ onButtonClick, selectedCount }) => {
        return (
            <>
            <Stack
                className={styles.commandFooter}
                horizontal={true}
                horizontalAlign="space-between"
                verticalAlign="center"
            >
                <span>
                    <DefaultButton 
                        className={styles.declineButton} 
                        text="Decline" 
                        disabled={selectedCount == 0 ? true : false}
                        onClick={e => onButtonClick('keyDecline')}>
                    </DefaultButton>
                </span>
                
                <span className={styles.selectedCount}>Selected: {selectedCount}</span>
                
                <span className={styles.rightText}>
                    <DefaultButton 
                        className={styles.modifyButton} 
                        disabled={selectedCount == 0 ? true : false}
                        text="Modify" 
                        onClick={e => onButtonClick('keyModify')}>
                    </DefaultButton>
                    <PrimaryButton 
                        text="Default" 
                        disabled={selectedCount == 0 ? true : false}
                        onClick={e => onButtonClick('keyConfirm')}>
                    </PrimaryButton>
                </span>
            </Stack>
            </>
        )
}

export default CommandFooter;