import React, { useEffect, useState } from 'react';
import useTheme from '../../shared/theme/useTheme';
import ManageHeader from '../../shared/ui/ManageHeader';
import MainCard from './manageLayouts/MainCard';
import BuyerCard from './manageLayouts/BuyerCard';
import ProductCard from './manageLayouts/ProductCard';
import DestinationCard from '../../shared/ui/DestinationCard';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import api from '../../services/api';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';
import { useLocation, useNavigate } from 'react-router-dom';

const ReturnManage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    let theme = useTheme();
    let { id } = location.state || {}; // Get ID from state

    const [document, setDocument] = useState(null);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: theme.bg,
            overflow: 'hidden'
        },
        content: {
            flex: 1,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            padding: '10px'
        },
        loading: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    };

    const makeApiRequest = async () => {
        let obj = {
            id: id,
            token: await AsyncStorageWrapper.getItem("token")
        }

        await api('returns/get.php', obj)
            .then(element => {
                if (element != null) {
                    setDocument(element.List[0]);
                }
            })
            .catch(err => {
                ErrorMessage(err)
            })
    }

    useEffect(() => {
        if (id) {
            makeApiRequest();
        }
    }, [id])

    return (
        <div style={styles.container}>

            <ManageHeader
                document={document}
                // navigation={navigation}
                hasUnsavedChanges={false}
            />

            {
                document == null
                    ?
                    <div style={styles.loading}>
                        <div className="spinner"></div> // Web spinner
                    </div>
                    :
                    <div style={styles.content}>
                        <MainCard document={document} />
                        <BuyerCard document={document} />
                        <ProductCard document={document} setDocument={setDocument} />
                        <DestinationCard isAllDisabled={true} changeInput={() => { }} changeSelection={() => { }} document={document} setDocument={() => { }} />
                    </div>
            }
        </div>
    )
}

export default ReturnManage;