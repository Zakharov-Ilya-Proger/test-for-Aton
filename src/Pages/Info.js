import React, { useEffect, useState } from 'react';
import axios from 'axios';

function InfoPage() {
    const [info, setInfo] = useState([]);
    const [updatedAccounts, setUpdatedAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get('/api/info', {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setInfo(response.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleStatusChange = (accountNumber, newStatus) => {
        setInfo((prevInfo) =>
            prevInfo.map((item) =>
                item['account number'] === accountNumber ? { ...item, status: newStatus } : item
            )
        );
        setUpdatedAccounts((prevUpdatedAccounts) => [
            ...prevUpdatedAccounts,
            { accountNumber, status: newStatus },
        ]);
    };

    const handleSave = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('Token not found');
            }
            const accountsToSend = updatedAccounts.filter(
                (account, index, self) =>
                    index === self.findIndex((acc) => acc.accountNumber === account.accountNumber)
            );
            await axios.post('/api/update-status', { accounts: accountsToSend }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUpdatedAccounts([]);
        } catch (error) {
            console.error('Error saving data:', error);
        }
    };

    return (
        <div>
            <h1>Info Page</h1>
            {info.map((item, index) => (
                <div key={index}>
                    <p>Account Number: {item['account number']}</p>
                    <p>Surname: {item.surname}</p>
                    <p>Name: {item.name}</p>
                    <p>Middle Name: {item['middle name']}</p>
                    <p>Birthday: {item.birthday}</p>
                    <p>INN: {item.INN}</p>
                    <p>Responsible Person: {item['responsible person']}</p>
                    <select
                        value={item.status}
                        onChange={(e) => handleStatusChange(item['account number'], e.target.value)}
                    >
                        <option value="not-working">Не в работе</option>
                        <option value="working">В работе</option>
                        <option value="refusal">Отказ</option>
                        <option value="deal-closed">Сделка закрыта</option>
                    </select>
                    <hr />
                </div>
            ))}
            <button onClick={handleSave}>Save</button>
        </div>
    );
}

export default InfoPage;
