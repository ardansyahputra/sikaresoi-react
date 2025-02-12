    const downloadUrl = `${APP_URL}/report/admin/tunjangan_tambahan_gaji/${selectedMonth}/${selectedYear}?p=${taxReduction}&kiri=${leftSignature}&kanan=${rightSignature}&tk=${selectedAllowance}&persentase=${percentage}&p2murni=${isP2Pure}`;

    // Path to save the file on the device
    const filePath = `${RNFS.DownloadDirectoryPath}/Tunjangan_Tambahan_${selectedMonth}_${selectedYear}.xlsx`;