import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion from '@mui/material/Accordion';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import MuiAccordionSummary from '@mui/material/AccordionSummary';
import MuiIconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';

const Accordion = styled((props) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
  background: "#121f27",
  color: '#ffffff',
}));

const AccordionSummary = styled((props) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '14px' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));

const IconButton = styled(MuiIconButton)(({ theme, disable }) => ({
  svg: {
    opacity: disable ? 0.3 : 1,
  },
}));

const TableRow = styled('tr')(({ percentage, type }) => ({
  position: "relative",
  transition: "background-color .3s ease-out",

  "&:after": {
    content: '""',
    position: "absolute",
    background: type === 'asks' ? 'rgba(1, 167, 129, 0.2)' : 'rgba(228, 75, 68, 0.2)',
    top: 0,
    bottom: 0,
    right: type === 'asks' ? 0 : 'unset',
    left: type === 'asks' ? 'unset' : 0,
    width: percentage,
    transition: "all .3s ease-out",
  },
}));

export { Accordion, AccordionDetails, AccordionSummary, IconButton, TableRow };

