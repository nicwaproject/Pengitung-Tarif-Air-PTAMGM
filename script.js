function formatRupiah(number) {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(number);
}

function hitungTarif() {
    const golongan = document.getElementById('golongan').value || '2B'; // Default golongan 2B jika tidak dipilih
    const tahun = document.getElementById('tahun').value || getTahunTertinggi(); // Tahun default jika tidak dipilih
    const pemakaian = document.getElementById('pemakaian').value;
    const tanggalPembayaran = document.getElementById('tanggalPembayaran').value || null;
    const wilayah = document.getElementById('wilayah').value || 'Mataram';

    if (!pemakaian) {
        document.getElementById('hasil').innerHTML = "<div class='result-box'>Masukkan pemakaian air!</div>";
        return;
    }

    const pembayaranDate = tanggalPembayaran ? new Date(tanggalPembayaran) : new Date();
    const pembayaranTanggal = pembayaranDate.getDate();

    const tarifDasar = {
        "2021": {
            "1A": [1300, 1300, 1300, 1300],
            "1B": [1550, 1950, 2600, 3400],
            "1C": [1900, 2350, 3000, 3850],
            "1D": [1950, 2500, 3400, 4650],
            "1E": [2200, 2800, 3650, 4850],
            "1F": [2400, 2850, 3700, 4900],
            "2A": [3050, 3750, 4850, 6400],
            "2B": [3350, 4000, 5100, 6750],
            "2C": [3850, 4700, 5950, 7800],
            "2D": [5150, 6750, 10550, 17250],
            "2E": [5250, 7800, 12050, 19550],
            "3A": [5750, 6650, 8050, 10200],
            "3B": [5950, 8250, 11600, 16700],
            "3C": [5050, 6400, 8350, 11150],
            "3D": [5100, 6700, 9200, 12750],
            "3E": [5200, 7200, 10450, 15550],
            "3F": [5950, 8350, 12050, 19200]
        },
        "2022": {
            "1A": [1350, 1350, 1350, 1350],
            "1B": [1600, 2000, 2700, 3550],
            "1C": [1950, 2450, 3150, 4000],
            "1D": [2000, 2600, 3550, 4850],
            "1E": [2300, 2900, 3800, 5050],
            "1F": [2500, 2950, 3850, 5100],
            "2A": [3350, 4100, 5300, 7000],
            "2B": [3650, 4400, 5600, 7400],
            "2C": [4200, 5150, 6500, 8550],
            "2D": [5900, 7750, 12100, 19800],
            "2E": [6000, 8950, 13850, 22450],
            "3A": [6600, 7600, 92500, 11700],
            "3B": [6800, 9450, 13300, 19200],
            "3C": [5800, 7350, 9600, 12800],
            "3D": [5850, 7700, 10550, 14650],
            "3E": [5950, 8250, 12000, 17850],
            "3F": [6800, 9600, 13850, 22050]
        },
        "2023": {
            "1A": [1400, 1400, 1400, 1400],
            "1B": [1650, 2100, 2800, 3700],
            "1C": [2000, 2550, 3300, 4200],
            "1D": [2100, 2700, 3700, 5050],
            "1E": [2400, 3000, 3950, 5300],
            "1F": [2600, 3050, 4000, 5350],
            "2A": [3650, 4500, 5800, 7700],
            "2B": [4000, 4800, 6150, 8100],
            "2C": [4600, 5650, 7150, 9400],
            "2D": [6750, 8900, 13900, 22750],
            "2E": [6900, 10250, 15900, 25800],
            "3A": [7550, 8700, 10600, 13450],
            "3B": [7800, 10850, 15250, 22050],
            "3C": [6650, 8450, 11000, 14700],
            "3D": [6700, 8850, 12100, 16800],
            "3E": [6800, 9450, 13800, 20500],
            "3F": [7800, 11000, 15900, 25350]
        }
    };

    const tarifAdministrasi = {
        "Mataram": {
            "1A": 0,
            "1B": 0,
            "1C": 0,
            "1D": 10000,
            "1E": 5000,
            "1F": 5000,
            "2A": 5000,
            "2B": 5000,
            "2C": 5000,
            "2D": 5000,
            "2E": 5000,
            "3A": 25000,
            "3B": 25000,
            "3C": 0,
            "3D": 0,
            "3E": 0,
            "3F": 50000
        },
        "Lombok Barat": {
            "1A": 0,
            "1B": 0,
            "1C": 0,
            "1D": 0,
            "1E": 3300,
            "1F": 3300,
            "2A": 3300,
            "2B": 5500,
            "2C": 5500,
            "2D": 5500,
            "2E": 5500,
            "3A": 0,
            "3B": 0,
            "3C": 0,
            "3D": 0,
            "3E": 0,
            "3F": 0
        }
    };

    const tarifDenda = {
        "1A": 5000,
        "1B": 5000,
        "1C": 5000,
        "1D": 5000,
        "1E": 5000,
        "1F": 5000,
        "2A": 10000,
        "2B": 10000,
        "2C": 10000,
        "2D": 15000,
        "2E": 25000,
        "3A": 25000,
        "3B": 25000,
        "3C": 30000,
        "3D": 30000,
        "3E": 35000,
        "3F": 35000
    };

    let tarif;
    if (tahun in tarifDasar) {
        tarif = tarifDasar[tahun][golongan];
    } else {
        // Jika tahun tidak valid, ambil tarif tahun terakhir yang tersedia
        const lastYear = Object.keys(tarifDasar).sort().reverse()[0];
        tarif = tarifDasar[lastYear][golongan];
    }

    let totalTarif = 0;

    if (pemakaian <= 10) {
        totalTarif = 10 * tarif[0];
    } else if (pemakaian <= 20) {
        totalTarif = (10 * tarif[0]) + ((pemakaian - 10) * tarif[1]);
    } else if (pemakaian <= 30) {
        totalTarif = (10 * tarif[0]) + (10 * tarif[1]) + ((pemakaian - 20) * tarif[2]);
    } else {
        totalTarif = (10 * tarif[0]) + (10 * tarif[1]) + (10 * tarif[2]) + ((pemakaian - 30) * tarif[3]);
    }

    const adminFee = tarifAdministrasi[wilayah][golongan];
    const denda = pembayaranTanggal > 25 ? tarifDenda[golongan] : 0;
    let biayaMaterai = 0;

    if (totalTarif > 10000000) {
        biayaMaterai = 10000;
    } else if (totalTarif > 5000000) {
        biayaMaterai = 10000;
    }

    totalTarif += adminFee + denda + biayaMaterai;

    const hasilDiv = document.getElementById('hasil');
    hasilDiv.innerHTML = `
        <div class="result-box">
            <strong>${formatRupiah(totalTarif)}</strong>
        </div>
    `;
}

function getTahunTertinggi() {
    const tahunOptions = document.getElementById('tahun').options;
    let highestYear = 0;
    for (let i = 0; i < tahunOptions.length; i++) {
        const year = parseInt(tahunOptions[i].value);
        if (year > highestYear) {
            highestYear = year;
        }
    }
    return highestYear.toString();
}

document.querySelectorAll('#golongan, #tahun, #pemakaian').forEach(input => {
    input.addEventListener('input', hitungTarif);
});

document.querySelectorAll('#wilayah, #tanggalPembayaran').forEach(input => {
    input.addEventListener('input', hitungTarif);
});
