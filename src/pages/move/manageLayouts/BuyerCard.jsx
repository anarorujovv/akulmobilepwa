import React, { useContext } from 'react';
import { Card, Form } from 'antd-mobile';
import { IoPerson } from 'react-icons/io5';
import useTheme from '../../../shared/theme/useTheme';
import Selection from './../../../shared/ui/Selection';
import { MoveGlobalContext } from '../../../shared/data/MoveGlobalState';

const BuyerCard = ({ changeSelection }) => {

    const { document, setDocument } = useContext(MoveGlobalContext);
    const theme = useTheme();

    if (!document) return null;

    const styles = {
        header: {
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            fontSize: 16,
            fontWeight: 'bold',
            color: theme.grey
        }
    };

    return (
        <Card title={
            <div style={styles.header}>
                <IoPerson size={20} />
                <span>Qarşı-Tərəf</span>
            </div>
        }>
            <Form layout='horizontal'>
                <Form.Item label='Anbardan'>
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
                </Form.Item>

                <Form.Item label='Anbara'>
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
                </Form.Item>
            </Form>
        </Card>
    )
}

export default BuyerCard;
