import React, { useRef } from 'react';
import moment from 'moment';
import Input from './Input';

const SelectionDate = ({ modalVisible, setModalVisible, document, setDocument, change, disabled }) => {
    const dateInputRef = useRef(null);

    const handleDateChange = (e) => {
        const date = e.target.value;
        const dateMoment = moment(date).format('YYYY-MM-DD HH:mm:ss');

        if (change) {
            change(new Date(dateMoment));
        }

        setDocument(rel => ({ ...rel, ['Moment']: dateMoment }));
        setModalVisible(false);
    };

    const formattedDate = document.Moment ? moment(document.Moment).format('YYYY-MM-DD') : '';

    return (
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <div
                style={{ width: '100%', display: 'flex', justifyContent: 'center' }}
                onClick={() => {
                    if (!disabled && dateInputRef.current) {
                        setModalVisible(true);
                        // dateInputRef.current.showPicker(); // Modern browsers only
                        dateInputRef.current.focus();
                    }
                }}
            >
                <Input
                    disabled={true} // Input appears disabled but the wrapper click triggers date picker
                    placeholder={'Tarix'}
                    type={'string'}
                    width={'70%'}
                    value={document.Moment}
                />
            </div>

            {/* Hidden Date Input or just show it when needed */}
            {modalVisible && (
                <div style={{
                    position: 'fixed',
                    top: 0,
                    left: 0,
                    width: '100vw',
                    height: '100vh',
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 1001
                }} onClick={() => setModalVisible(false)}>
                    <div style={{
                        backgroundColor: 'white',
                        padding: 20,
                        borderRadius: 10,
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 15
                    }} onClick={e => e.stopPropagation()}>
                        <h3>Tarix Seç</h3>
                        <input
                            ref={dateInputRef}
                            type="datetime-local"
                            value={formattedDate}
                            onChange={(e) => {
                                const val = e.target.value;
                                if (val) {
                                    const dateMoment = moment(val).format('YYYY-MM-DD HH:mm:ss');
                                    if (change) change(new Date(val));
                                    setDocument(rel => ({ ...rel, ['Moment']: dateMoment }));
                                    setModalVisible(false);
                                }
                            }}
                            style={{
                                padding: 10,
                                fontSize: 16,
                                border: '1px solid #ccc',
                                borderRadius: 5
                            }}
                        />
                        <button onClick={() => setModalVisible(false)} style={{
                            padding: 10,
                            backgroundColor: '#f44336',
                            color: 'white',
                            border: 'none',
                            borderRadius: 5,
                            cursor: 'pointer'
                        }}>Bağla</button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default SelectionDate;