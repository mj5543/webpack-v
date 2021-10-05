import React from 'react';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import { styled } from '@material-ui/core/styles';

export const TooltipB = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.black,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    ...theme.typography.body2,
    backgroundColor: theme.palette.common.black,
  },
}));

export const TooltipW = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: theme.palette.common.white,
  },
  [`& .${tooltipClasses.tooltip}`]: {
    ...theme.typography.body2,
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: theme.palette.common.white,
    boxShadow: theme.shadows[1],
  },
}));
export const TooltipG = styled(({ className, ...props }) => (
  <Tooltip {...props} arrow classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.arrow}`]: {
    color: '#f5f5f9',
  },
  [`& .${tooltipClasses.tooltip}`]: {
    ...theme.typography.body2,
    color: 'rgba(0, 0, 0, 0.87)',
    backgroundColor: '#f5f5f9',
    boxShadow: theme.shadows[1],
  },
}));