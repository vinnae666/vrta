import React from 'react';
import { Box } from '@material-ui/core';
import LogoImage from '@/assets/images/logo.svg';

interface Props {
    sx?;
}

const Logo = (props: Props): JSX.Element => {
    const { sx } = props;
    return <Box component="img" src={LogoImage} sx={{ width: 75, height: 75, ...sx }} />;
};

export default Logo;
