import * as React from 'react';
import { Container } from 'reactstrap';
import { Stack } from '@fluentui/react'

export default (props: { children?: React.ReactNode }) => (
    <React.Fragment>
        <Stack verticalFill>
            {props.children}
        </Stack>
    </React.Fragment>
);

