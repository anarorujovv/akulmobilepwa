import React, { useContext } from 'react';
import { Card, Form, Selector } from 'antd-mobile';
import { IoPerson } from 'react-icons/io5';
import useTheme from '../../../shared/theme/useTheme';
import { EnterGlobalContext } from '../../../shared/data/EnterGlobalState';
import Selection from '../../../shared/ui/Selection';

const BuyerCard = ({ changeSelection }) => {

    const { document } = useContext(EnterGlobalContext);
    const theme = useTheme();

    if (!document) return null;

    return (
        <Card title={
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 16, fontWeight: 'bold', color: theme.grey }}>
                <IoPerson size={20} />
                <span>Qarşı-Tərəf</span>
            </div>
        }>
            <Form layout='horizontal'>
                <Form.Item label='Anbar'>
                    {/* <Selector
                        options={stocks}
                        value={[document.StockId]}
                        onChange={(val) => {
                            const selectedStock = stocks.find(s => s.value === val[0]);
                            if (selectedStock) {
                                changeSelection('StockId', selectedStock.value);
                            }
                        }}
                        columns={1}
                    /> */}
                    <Selection
                        isRequired={true}
                        apiBody={{}}
                        apiName={'stocks/get.php'}
                        change={(e) => {
                            changeSelection('StockId', e.Id)
                        }}
                        title={"Anbar"}
                        value={document.StockId}
                        defaultValue={document.StockName}
                    />
                </Form.Item>
            </Form>
        </Card>
    )
}

export default BuyerCard;
