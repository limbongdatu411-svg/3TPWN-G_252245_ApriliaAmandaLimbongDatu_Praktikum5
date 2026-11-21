
// Mengambil elemen HTML
const isiTabel = document.getElementById("isiTabel");
const cari = document.getElementById("cari");
const totalBuku = document.getElementById("totalBuku");
const terpilih = document.getElementById("terpilih");
const tombolMenipis = document.getElementById("tombolMenipis");
const formBuku = document.getElementById("formBuku");

// Menghitung jumlah buku
function hitungTotal() {
    const jumlah = isiTabel.querySelectorAll("tr").length;
    totalBuku.textContent = "Total judul: " + jumlah;
}

hitungTotal();

// Fitur pencarian judul dan penulis
cari.addEventListener("keyup", function() {
    const kataKunci = cari.value.toLowerCase();
    const baris = isiTabel.querySelectorAll("tr");

    baris.forEach(function(row) {
        const judul = row.cells[0].textContent.toLowerCase();
        const penulis = row.cells[1].textContent.toLowerCase();

        if (judul.includes(kataKunci) || penulis.includes(kataKunci)) {
            row.style.display = "";
        } else {
            row.style.display = "none";
        }
    });
});

// Menyorot stok menipis
tombolMenipis.addEventListener("click", function() {
    const baris = isiTabel.querySelectorAll("tr");

    baris.forEach(function(row) {
        const stok = parseInt(row.cells[4].textContent);

        if (stok <= 2) {
            row.style.backgroundColor = "yellow";
        } else {
            row.style.backgroundColor = "";
        }
    });
});

// Memilih baris buku
isiTabel.addEventListener("click", function(event) {
    const baris = event.target.closest("tr");

    if (baris) {
        isiTabel.querySelectorAll("tr").forEach(function(row) {
            row.classList.remove("baris-terpilih");
        });

        baris.classList.add("baris-terpilih");
        terpilih.textContent = "Dipilih: " + baris.cells[0].textContent;
    }
});

// Validasi dan tambah buku
let jumlahGagal = 0;

formBuku.addEventListener("submit", function(event) {
    event.preventDefault();

    const judul = document.getElementById("judul").value.trim();
    const penulis = document.getElementById("penulis").value.trim();
    const tahun = document.getElementById("tahun").value;
    const stok = document.getElementById("stok").value;

    const errorJudul = document.getElementById("errorJudul");
    const errorPenulis = document.getElementById("errorPenulis");
    const errorTahun = document.getElementById("errorTahun");
    const errorStok = document.getElementById("errorStok");
    const pesan = document.getElementById("pesan");

    errorJudul.textContent = "";
    errorPenulis.textContent = "";
    errorTahun.textContent = "";
    errorStok.textContent = "";
    pesan.textContent = "";

    let valid = true;

    // Validasi judul
    const daftarJudul = isiTabel.querySelectorAll("tr");
    let judulSama = false;

    daftarJudul.forEach(function(row) {
        if (row.cells[0].textContent.toLowerCase() === judul.toLowerCase()) {
            judulSama = true;
        }
    });

    if (judul.length < 3) {
        errorJudul.textContent = "Judul minimal 3 karakter.";
        valid = false;
    } else if (judulSama) {
        errorJudul.textContent = "Judul buku sudah ada.";
        valid = false;
    }

    // Validasi penulis
    if (penulis.length < 3) {
        errorPenulis.textContent = "Penulis minimal 3 karakter.";
        valid = false;
    } else if (/[0-9]/.test(penulis)) {
        errorPenulis.textContent = "Nama penulis tidak boleh mengandung angka.";
        valid = false;
    }

    // Validasi tahun
    const angkaTahun = Number(tahun);
    const tahunSekarang = new Date().getFullYear();

    if (tahun === "" || !Number.isInteger(angkaTahun) ||
        angkaTahun < 1900 || angkaTahun > tahunSekarang) {
        errorTahun.textContent = "Tahun harus antara 1900 dan " + tahunSekarang + ".";
        valid = false;
    }

    // Validasi stok
    const angkaStok = Number(stok);

    if (stok === "" || !Number.isInteger(angkaStok) || angkaStok < 0) {
        errorStok.textContent = "Stok harus berupa angka nol atau lebih.";
        valid = false;
    }

    // Jika data tidak valid
    if (!valid) {
        jumlahGagal++;

        if (jumlahGagal >= 3) {
            document.getElementById("tombolTambah").disabled = true;
            pesan.textContent = "Tombol dinonaktifkan setelah 3 kali gagal.";
        }

        return;
    }

    // Membuat baris buku baru
    const barisBaru = document.createElement("tr");

    const dataBuku = [
        judul,
        penulis,
        "Umum",
        tahun,
        stok
    ];

    dataBuku.forEach(function(data) {
        const kolom = document.createElement("td");
        kolom.textContent = data;
        barisBaru.appendChild(kolom);
    });

    isiTabel.appendChild(barisBaru);

    jumlahGagal = 0;
    formBuku.reset();
    hitungTotal();

    pesan.textContent = "Buku berhasil ditambahkan!";
});
