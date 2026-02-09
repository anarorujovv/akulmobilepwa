import React, { useEffect, useState, useRef } from 'react';
import useTheme from '../../shared/theme/useTheme';
import { formatPrice } from '../../services/formatPrice';
import calculateDiscount from '../../services/report/calculateDiscount';
import api from '../../services/api';
import AsyncStorageWrapper from '../../services/AsyncStorageWrapper';
import { useLocation } from 'react-router-dom';
import ErrorMessage from '../../shared/ui/RepllyMessage/ErrorMessage';

const Check = () => {
    const location = useLocation();
    const { demand } = location.state || {};
    const theme = useTheme();

    const [customer, setCustomer] = useState({});
    const [loading, setLoading] = useState(true);
    const iframeRef = useRef(null);

    const styles = {
        container: {
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            backgroundColor: '#fff',
            position: 'relative'
        },
        iframe: {
            flex: 1,
            border: 'none',
            width: '100%',
            height: '100%'
        },
        printButton: {
            position: 'absolute',
            bottom: 30,
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: theme.primary || '#0078D4',
            padding: '14px 30px',
            borderRadius: 30,
            boxShadow: '0 4px 8px rgba(0,0,0,0.3)',
            cursor: 'pointer',
            border: 'none',
            color: 'white',
            fontSize: 16,
            fontWeight: 'bold',
            zIndex: 10
        },
        loadingContainer: {
            flex: 1,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center'
        }
    };

    const getCustomerDetails = async () => {
        if (!demand) {
            setLoading(false);
            return;
        }
        const customerId = demand.CustomerId;
        const token = await AsyncStorageWrapper.getItem('token');
        await api('customers/getdata.php', {
            id: customerId,
            token: token
        }).then(element => {
            setCustomer(element);
        }).catch(err => {
            console.error(err);
        })
        setLoading(false)
    }

    useEffect(() => {
        getCustomerDetails();
    }, [])

    if (!demand) {
        return <div style={styles.loadingContainer}><span>Məlumat yoxdur</span></div>;
    }

    const html = `<!DOCTYPE html>
<html lang="az">
<head>
    <meta charset="UTF-8">
    <meta http-equiv="content-type" content="text/html; charset=utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Elektron Çek</title>
    <style>

        body {
            background-color: #f0f0f0;
            font-family: Arial, Helvetica, sans-serif;
            display: flex;
            justify-content: center;
            padding: 10px;
            margin: 0;
        }

        .receipt {
            width: 100%;
            max-width: 80mm;
            background-color: white;
            padding: 15px;
            box-sizing: border-box;
            color: #333;
            font-size: 14px;
            line-height: 1.4;
        }

        .header-info {
            margin-bottom: 10px;
        }

        .header-info p {
            margin: 2px 0;
            font-size:12px
        }

        .divider {
            margin: 10px 0;
        }

        .item {
            margin-bottom: 0;
        }

        .item-name {
            display: block;
            font-size:12px
        }

        .item-details {
            display: flex;
            justify-content: flex-end;
            gap:5px;
            font-size: 13px;
        }
        .row-between {
            display: flex;
            justify-content: space-between;
            align-items: center;
            width:90%;
            font-size:12px;
        }

        .debt-box {
            gap:0;
            margin-top:-30px;
            display: flex;
            justify-content: space-between;
            width:80%;
            font-size:12px;
        }

        .dold-box{
        text-align:right;
        margin-top: -10px;
        width:80%;
        font-size:12px
        }

        .signature {
            margin-top: 20px;
            padding-top: 5px;
            width: 50%;
            font-size:12px
        }

        .azn{
        }

        @media print {
            body { background: none; padding: 0; }
            .receipt { box-shadow: none; width: 100%; max-width: 100%; }
        }

        .item-details-p{
        margin-top:0px;
        margin-bottom:0px;
        width:100%;
        font-size:10px;
        margin-left:20px
        }

        .span-hours{
        margin-left:65px;
        }
    </style>
</head>
<body>

<div class="receipt">
    <div class="header-info">
        <p>Tarix: ${demand.Moment ? demand.Moment.split(' ')[0] : ''} <span class="span-hours">${demand.Moment ? demand.Moment.split(' ')[1] : ''}</span></p>
        
        <p>Satıcı: ${demand.CompanyName}</p>
        <p>Satış nümayəndəsi: ${demand.OwnerName}</p>
        <p>Alıcı: ${demand.CustomerName}</p>
    </div>

    <div style="font-size: 11px; margin-bottom: 5px;">
        Malın adı<br>
        say*qiymət = endirimsiz məbləğ, endirim (%), məbləğ
    </div>

    ${demand.Positions.map((item) => (`
        <div class="item">
            <span class="item-name">${item.Name}</span>
            <div class="item-details">
                <p class="item-details-p">${formatPrice(item.Quantity)} ${item.UnitName || ''} * ${formatPrice(item.Price)} = ${formatPrice(item.Quantity * item.BasicPrice)}. endirim ${formatPrice(calculateDiscount(item.Price, item.BasicPrice)) || "0.00"}%: ${formatPrice(item.Quantity * item.Price)}</p>
            </div>
        </div>
    `)).join('')}


    <div class="total-section">
        <div class="row-between">
            <span>CƏMİ</span>
            <span>= ${formatPrice(demand.Amount)}</span>
        </div>
    </div>

    <div class="dold-box">
    <p>Долг: ${customer.Debt ? formatPrice(customer.Debt) : '0.00'}</p>
    </div>

    <div class="debt-box">
        <p>Alıcının borcu:</p> <p class="azn">AZN</p>
    </div>

     <div class="signature">
        Təhvil verdi:
    </div>

</div>

</body>
</html>
    `;

    const handlePrint = () => {
        if (iframeRef.current && iframeRef.current.contentWindow) {
            iframeRef.current.contentWindow.print();
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div className="spinner"></div>
            </div>
        )
    }

    return (
        <div style={styles.container}>
            <iframe
                ref={iframeRef}
                srcDoc={html}
                style={styles.iframe}
                title="Receipt"
            />
            <button onClick={handlePrint} style={styles.printButton}>
                Çap Et
            </button>
        </div>
    );
}

export default Check;