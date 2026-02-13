import React, { useEffect, useState } from 'react';
import { Modal, Input, Button, Selector, Form } from 'antd-mobile';
import { formatPrice } from '../../services/formatPrice';
import SuccessMessage from './RepllyMessage/SuccessMessage';
import calculateDiscount from './../../services/report/calculateDiscount';
import ErrorMessage from './RepllyMessage/ErrorMessage';
import applyDiscount from '../../services/report/applyDiscount';

const AmountCalculated = ({
    modalVisible,
    setModalVisible,
    document,
    setDocument,
    setHasUnsavedChanges
}) => {
    const [sum, setSum] = useState('');
    const [selectedOption, setSelectedOption] = useState(['discount']);

    const options = [
        { value: 'amount', label: 'Məbləğ' },
        { value: 'discount', label: 'Endirim' },
    ];

    const handleCalculateTotalAmount = () => {
        const info = { ...document };
        const type = selectedOption[0];

        if (!type || !sum) {
            ErrorMessage("Zəhmət olmasa məlumatları doldurun");
            return;
        }

        if (type == 'amount') {
            if (info.Amount > 0) {
                // Məbləğ is entered value to subtract? Or target amount?
                // Logic in original: info.Amount - formatPrice(sum). So sum is value to subtract.
                // Wait, logic: info.Amount = info.Amount - sum.
                // It treats 'sum' as the amount to REDUCE by? Or the new amount?
                // Original: info.Amount = info.Amount - formatPrice(sum);
                // "Məbləğ" usually means "Amount". If I enter 10, does it mean subtract 10?
                // Original logic seems to imply subtracting the input 'sum' from current 'Amount'.
                // And then recalculating discount.

                info.Amount = info.Amount - formatPrice(sum);
                info.Discount = calculateDiscount(info.BasicAmount, info.Amount);
                info.Positions.forEach(product => {
                    product.Price = applyDiscount(product.BasicPrice, info.Discount)
                    product.Discount = info.Discount
                })
                SuccessMessage("Endirim olundu")
                setDocument(info);
                setHasUnsavedChanges(true)
                setModalVisible(false)
            } else {
                ErrorMessage("Cəm məbləğ 0 dır");
            }

        }

        if (type == 'discount') {
            info.Amount = Number(info.BasicAmount) - ((info.BasicAmount / 100) * formatPrice(sum));
            info.Discount = formatPrice(sum);
            info.Positions.forEach(product => {
                product.Price = applyDiscount(product.BasicPrice, formatPrice(sum));
                product.Discount = formatPrice(sum);
            })
            // console.log(info);
            SuccessMessage("Endirim olundu")
            setDocument(info);
            setHasUnsavedChanges(true)
            setModalVisible(false)
        }

    }

    useEffect(() => {
        if (!modalVisible) {
            setSum('');
            setSelectedOption(['discount'])
        }
    }, [modalVisible])

    return (
        <Modal
            visible={modalVisible}
            content={
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16, paddingTop: 10 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 5, textAlign: 'center' }}>
                        <span style={{ fontSize: 18, fontWeight: 'bold', color: 'var(--adm-color-primary)' }}>
                            Ümumi məbləğ: {formatPrice(document.Amount)} ₼
                        </span>
                        <span style={{ fontSize: 16, fontWeight: '500', color: '#666' }}>
                            Ümumi endirim: {formatPrice(document.Discount)} {selectedOption[0] === 'discount' ? '%' : '₼'}
                        </span>
                    </div>

                    <Form layout='vertical' style={{ border: 'none', padding: 0 }}>
                        <Form.Item label="Endirim növü">
                            <Selector
                                options={options}
                                value={selectedOption}
                                onChange={(v) => {
                                    if (v.length > 0) setSelectedOption(v)
                                }}
                                columns={2}
                            />
                        </Form.Item>
                        <Form.Item label={selectedOption[0] == 'amount' ? "Məbləğ (₼)" : "Endirim (%)"}>
                            <Input
                                placeholder={`${selectedOption[0] == 'amount' ? "Məbləğ" : "Endirim"} daxil edin`}
                                value={sum}
                                onChange={setSum}
                                type="number"
                                style={{
                                    border: '1px solid #ddd',
                                    borderRadius: 4,
                                    padding: '4px 8px'
                                }}
                            />
                        </Form.Item>
                    </Form>

                    <Button
                        block
                        color='primary'
                        onClick={handleCalculateTotalAmount}
                    >
                        Təsdiqlə
                    </Button>
                </div>
            }
            closeOnMaskClick
            onClose={() => setModalVisible(false)}
            showCloseButton
        />
    );
};

export default AmountCalculated;
