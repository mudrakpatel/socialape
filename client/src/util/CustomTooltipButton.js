import React from 'react';
//MUI(Material UI) imports
import Tooltip from '@material-ui/core/Tooltip';
import IconButton from '@material-ui/core/IconButton';

export default ({children, onClick, btnClassName, tip, tipClassName, placement}) => (
    <Tooltip title={tip} className={tipClassName} placement={placement}>
        <IconButton onClick={onClick} className={btnClassName}>
            {children}
        </IconButton>
    </Tooltip>
);
