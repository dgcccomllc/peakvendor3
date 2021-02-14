import React from 'react';
import { Stack } from "@fluentui/react/lib/Stack";

import * as CompanyModel from '../../models/companyModel';

import styles from "./VendorHeader.module.scss";

interface ICompanyDetailProps {
    Company?: CompanyModel.ICompany;
    DepartureName?: string
}

const VendorHeader: React.FC<ICompanyDetailProps> = ({ Company, DepartureName }) => {
    if (Company)
        return (
            <>
            <Stack
                className={styles.header}
                horizontal={true}
                horizontalAlign="space-between"
                verticalAlign="center"
            >
                <span className={styles.leftText}>Reservation Request for {Company.name} </span>
                <span className={styles.rightText}>{DepartureName}</span>
            </Stack>
            </>
        )
    else return null;
}

export default VendorHeader;