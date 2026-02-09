import React from 'react';
import ManageCard from '../../../shared/ui/ManageCard';
import { IoPerson } from 'react-icons/io5';
import useTheme from '../../../shared/theme/useTheme';
import { formatPrice } from '../../../services/formatPrice';
import Selection from './../../../shared/ui/Selection';

const BuyerCard = ({ document }) => {

    const theme = useTheme();

    const styles = {
        header: {
            width: '100%',
            padding: 15,
            gap: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            boxSizing: 'border-box'
        },
        container: {
            gap: 15,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            padding: '0 15px 15px 15px',
            boxSizing: 'border-box'
        }
    };

    return (
        <ManageCard>
            <div style={styles.header}>
                <IoPerson size={20} color={theme.grey} />
                <span style={{
                    color: theme.grey
                }}>Qarşı-Tərəf</span>
            </div>

            <div style={styles.container}>

                <Selection
                    disabled={true}
                    isRequired={true}
                    apiBody={{}}
                    apiName={'customers/getfast.php'}
                    searchApi={'customers/getfast.php'}
                    change={() => { }}
                    searchKey={'fast'}
                    title={'Qarşı-Tərəf'}
                    value={document.CustomerId}
                    defaultValue={document.CustomerName}
                    bottomTitle={'Qarşı-tərəf'}
                />

                <Selection
                    disabled={true}
                    isRequired={true}
                    apiBody={{}}
                    apiName={'stocks/get.php'}
                    change={() => { }}
                    title={"Anbar"}
                    value={document.StockId}
                    defaultValue={document.StockName}
                />

            </div>
        </ManageCard>
    )
}

export default BuyerCard;
