import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Realisasi from './Realisasi'; // Import komponen Realisasi

const Persetujuan = () => {
    const [listTahun, setListTahun] = useState([]);
    const [listBulan, setListBulan] = useState([]);
    const [postData, setPostData] = useState({ bulan_id: 1, tahun_id: 2 });
    const [showReview, setShowReview] = useState(false);
    const [showTable, setShowTable] = useState(true);
    const [listData, setListData] = useState([]);
    const [selectedKirimRealisasi, setSelectedKirimRealisasi] = useState(null);

    // Mengambil data bulan dan tahun
    const getBulan = async () => {
        try {
            const response = await axios.get('/bulan/show');
            setListBulan(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    const getTahun = async () => {
        try {
            const response = await axios.get('/tahun/show');
            setListTahun(response.data.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Menyegarkan data berdasarkan bulan dan tahun yang dipilih
    const refreshData = () => {
        setShowReview(false);
        setTimeout(() => {
            setShowTable(false);
            setTimeout(() => {
                setShowTable(true);
            }, 10);
        }, 10);
    };

    // Callback untuk menangani klik pada baris tabel
    const callback = () => {
        const table = document.getElementById('myTablePersetujuan');
        table.addEventListener('click', (e) => {
            if (e.target.classList.contains('show')) {
                const id = e.target.getAttribute('data-id');
                const data = listData.find((item) => item.uuid === id);
                setSelectedKirimRealisasi(data);
                setShowReview(true);
            }
        });
    };

    // Mengambil data dari tabel
    useEffect(() => {
        callback();
    }, [listData]);

    useEffect(() => {
        getTahun();
        getBulan();
    }, []);

    return (
        <div className="container">
            {showReview ? (
                <div>
                    <button className="btn btn-danger btn-sm" onClick={() => setShowReview(false)}>LIST PERSETUJUAN</button>
                    <Realisasi selectedData={selectedKirimRealisasi} />
                </div>
            ) : (
                <div className="card card-custom mb-5 card-persetujuan">
                    <div className="card-body">
                        <div className="row mb-5">
                            <div className="col-2">
                                <select
                                    className="form-control form-control-sm"
                                    value={postData.bulan_id}
                                    onChange={(e) => {
                                        setPostData({ ...postData, bulan_id: e.target.value });
                                        refreshData();
                                    }}
                                >
                                    {listBulan.map((bulan) => (
                                        <option key={bulan.id} value={bulan.id}>
                                            {bulan.bulan}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-2">
                                <select
                                    className="form-control form-control-sm"
                                    value={postData.tahun_id}
                                    onChange={(e) => {
                                        setPostData({ ...postData, tahun_id: e.target.value });
                                        refreshData();
                                    }}
                                >
                                    {listTahun.map((tahun) => (
                                        <option key={tahun.id} value={tahun.id}>
                                            {tahun.tahun}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="col-8 text-right">
                                {listBulan.length > 0 && (
                                    <h3>{listBulan.find((bulan) => bulan.id === postData.bulan_id).bulan}</h3>
                                )}
                            </div>
                        </div>
                        <hr />
                        {showTable && (
                            <div id="myTablePersetujuan">
                                {/* Komponen Tabel (digantikan dengan mti-paginate atau lainnya) */}
                                {/* Tampilkan data dari API yang di-fetch dan implementasikan pagination */}
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Persetujuan;
