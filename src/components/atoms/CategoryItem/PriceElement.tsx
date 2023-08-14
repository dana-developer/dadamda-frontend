import { Typography } from "@mui/material";
import theme from "../../../assets/styles/theme";
import RowContainer from "../RowContainer";

const mobileProductStyle = {
    fontSize: '0.875rem',
    color: theme.color.primary_color,
    fontWeight: '700',
    lineHeight: '160%',
};

const desktopProductStyle = {

};

const siteNameStyles = {
    mobileProduct: mobileProductStyle,
    desktopProduct: desktopProductStyle,
};

export function PriceElement({ price, varient }) {
    return (
        <RowContainer
            style={{
                width: '100%',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-all',
                color: theme.color.primary_color,
                fontWeight: 'bold',
            }}>
            <Typography sx={siteNameStyles[varient as keyof typeof siteNameStyles]}>
                {price}
            </Typography>
        </RowContainer>
    );
}
