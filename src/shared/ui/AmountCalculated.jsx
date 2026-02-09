import React, { useEffect, useState } from 'react';
import MyModal from './MyModal';
import Input from './Input';
import Button from './Button';
import CustomSelection from './CustomSelection';
import { formatPrice } from '../../services/formatPrice';
import SuccessMessage from './RepllyMessage/SuccessMessage';
import calculateDiscount from './../../services/report/calculateDiscount';
import ErrorMessage from './RepllyMessage/ErrorMessage';
import useTheme from '../theme/useTheme';
import applyDiscount from '../../services/report/applyDiscount';

const AmountCalculated = ({
    modalVisible,
    setModalVisible,
    document,
    setDocument,
    setHasUnsavedChanges
}) => {
    const [sum, setSum] = useState('');
    const [selectedOption, setSelectedOption] = useState('discount');
    let theme = useTheme();

    const options = [
        { key: 'amount', value: 'Məbləğ' },
        { key: 'discount', value: 'Endirim' },
    ];

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            padding: 16,
            justifyContent: 'space-between',
            height: '100%',
            boxSizing: 'border-box'
        },
        titleContainer: {
            gap: 10,
            display: 'flex',
            flexDirection: 'column'
        },
        title: {
            fontSize: 18,
            fontWeight: 'bold',
            color: theme.primary,
            margin: 0
        },
    };

    const handleCalculateTotalAmount = () => {
        const info = { ...document };

        if (selectedOption == 'amount') {
            if (info.Amount > 0) {
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

        if (selectedOption == 'discount') {
            info.Amount = Number(info.BasicAmount) - ((info.BasicAmount / 100) * formatPrice(sum));
            info.Discount = formatPrice(sum);
            info.Positions.forEach(product => {
                product.Price = applyDiscount(product.BasicPrice, formatPrice(sum));
                product.Discount = formatPrice(sum);
            })
            console.log(info);
            SuccessMessage("Endirim olundu")
            setDocument(info);
            setHasUnsavedChanges(true)
            setModalVisible(false)
        }

    }

    useEffect(() => {
        if (!modalVisible) {
            setSum('');
            setSelectedOption('discount')
        }
    }, [modalVisible])

    return (
        <MyModal modalVisible={modalVisible} setModalVisible={setModalVisible} width="90%" height="50%" center>
            <div style={styles.container}>
                <div style={styles.titleContainer}>
                    <span style={styles.title}>Ümumi məbləğ - {formatPrice(document.Amount)}</span>
                    <span style={styles.title}>Ümumi endirim - {formatPrice(document.Discount)}</span>
                </div>

                <Input
                    value={sum}
                    onChange={(value) => setSum(value)}
                    width="100%"
                    placeholder={`${selectedOption == 'amount' ? "Məbləğ" : "Endirim"} daxil edin`}
                    type="number"
                />

                <CustomSelection
                    options={options}
                    value={selectedOption}
                    onChange={(newKey) => setSelectedOption(newKey)}
                    title="Endirim növü"
                    placeholder="Seçim"
                    disabled={false}
                />

                <Button
                    onClick={handleCalculateTotalAmount}
                >
                    Təstiqlə
                </Button>
            </div>
        </MyModal>
    );
};

export default AmountCalculated;
