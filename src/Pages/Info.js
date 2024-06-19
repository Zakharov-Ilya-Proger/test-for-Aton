import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "./styles/Info.css"

function InfoPage() {
    const [info, setInfo] = useState([]);
    const [updatedAccounts, setUpdatedAccounts] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            console.log(localStorage.getItem("token"));
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    throw new Error('Token not found');
                }
                const response = await axios.get('http://127.0.0.1:8000/get/table', {
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
                item.accountNumber === accountNumber ? { ...item, status: newStatus } : item
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
            console.log(accountsToSend)
            await axios.post('http://127.0.0.1:8000/update/accounts', { accounts: accountsToSend }, {
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
        <div className="info-container">
            <h1 className="info-title">Info Page</h1>
            <div className="info-table-wrapper">
                <table className="info-table">
                    <thead>
                    <tr>
                        <th>Account Number</th>
                        <th>Surname</th>
                        <th>Name</th>
                        <th>Middle Name</th>
                        <th>Birthday</th>
                        <th>INN</th>
                        <th>Responsible Person</th>
                        <th>Status</th>
                    </tr>
                    </thead>
                    <tbody>
                    {info.map((item, index) => (
                        <tr key={index}>
                            <td>{item.accountNumber}</td>
                            <td>{item.surname}</td>
                            <td>{item.name}</td>
                            <td>{item.middleName}</td>
                            <td>{item.birthday}</td>
                            <td>{item.INN}</td>
                            <td>{item.responsiblePerson}</td>
                            <td>
                                <select
                                    value={item.status}
                                    onChange={(e) => handleStatusChange(item.accountNumber, e.target.value)}
                                    className="info-select"
                                >
                                    <option value="Не в работе">Не в работе</option>
                                    <option value="В работе">В работе</option>
                                    <option value="Отказ">Отказ</option>
                                    <option value="Сделка закрыта">Сделка закрыта</option>
                                </select>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
            <button onClick={handleSave} className="info-button">
                Save
            </button>
        </div>
    );
}

export default InfoPage;
