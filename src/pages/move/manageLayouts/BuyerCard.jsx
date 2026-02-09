import React, { useContext } from 'react';
import ManageCard from '../../../shared/ui/ManageCard';
import { IoPerson } from 'react-icons/io5';
import useTheme from '../../../shared/theme/useTheme';
import Selection from './../../../shared/ui/Selection';
import { MoveGlobalContext } from '../../../shared/data/MoveGlobalState';

const BuyerCard = ({ changeSelection }) => {

    const { document, setDocument } = useContext(MoveGlobalContext);
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
                    isRequired={true}
                    apiBody={{}}
                    apiName={'stocks/get.php'}
                    change={(e) => {
                        changeSelection('StockFromId', e.Id)
                    }}
                    title={"Anbardan"}
                    value={document.StockFromId}
                    defaultValue={document.StockFromName}
                />

                <Selection
                    isRequired={true}
                    apiBody={{}}
                    apiName={'stocks/get.php'}
                    change={(e) => {
                        changeSelection('StockToId', e.Id)
                    }}
                    title={"Anbara"}
                    value={document.StockToId}
                    defaultValue={document.StockToName}
                />

            </div>
        </ManageCard>
    )
}

export default BuyerCard;
