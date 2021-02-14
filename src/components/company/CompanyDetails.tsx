import React from 'react';
import { Stack, StackItem } from "@fluentui/react/lib/Stack";
import { FontIcon } from 'office-ui-fabric-react/lib/Icon';
import * as CompanyModel from '../../models/companyModel';

import styles from "./CompanyDetails.module.scss";
import CompanyLogo from './test.svg';

import { mergeStyles } from 'office-ui-fabric-react/lib/Styling';

const iconClass = mergeStyles({
  fontSize: 20,
  height: 20,
  width: 20,
  margin: '0 0',
});


interface ICompanyDetailProps {
    Company?: CompanyModel.ICompany;
    DepartureName?: string
}

const CompanyDetails: React.FC<ICompanyDetailProps> = ({ Company, DepartureName }) => {
    if (Company)
        return (
            <>
            <Stack
                className={styles.companyDetailsContainer}
                horizontal={true}
                horizontalAlign="space-between"
                verticalAlign="start"
            >
                <StackItem className={styles.companyDetailsContainerImage}>
                    <img src={CompanyLogo}></img>
                </StackItem>
                <StackItem className={styles.companyDetailsInfo}>
                    <Stack>
                        <StackItem className={styles.companyDetailsInfoHeader}>
                            <span>ABC Travel</span>
                        </StackItem>
                        <StackItem className={styles.companyDetailsWeb}>
                            <span><a href='#' target="blank">abctravel.com</a></span>
                        </StackItem>
                        <StackItem>
                            <span className={styles.companyDetailsAddress}>1234 Travel Street, Carlsbad, CA 92008</span>
                        </StackItem>
                    </Stack>
                </StackItem>
                <StackItem className={styles.companyDetailsContact}>
                    <Stack>
                        <StackItem className={styles.contactItemRow}>
                            <FontIcon iconName="Contact" className={iconClass} /><span className={styles.contactName}>Dennis Sebenick</span>
                        </StackItem>
                        <StackItem className={styles.contactItemRow}>
                            <FontIcon iconName="Phone" className={iconClass} /><span className={styles.contactPhone}>310-555-5555</span>
                        </StackItem>
                        <StackItem className={styles.contactItemRow}>
                            <FontIcon iconName="Globe" className={iconClass} /><span className={styles.contactEmail}><a href={`mailto:dennis@abctravel.com`}>denniss@abctravel.com</a></span>
                        </StackItem>
                    </Stack>
                </StackItem>
            </Stack>
            </>
        )
    else return null;
}

export default CompanyDetails;