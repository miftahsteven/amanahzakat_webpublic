import { FaqItem } from "@/types/faq.types";

export const initialFaqList: FaqItem[] = [
  {
    id: "faq-1",
    category: "Dasar ZIS",
    question: "Apa bedanya zakat, infak, dan shodaqoh?",
    answer:
      "Zakat adalah kewajiban yang kadarnya sudah ditentukan syariat (umumnya 2,5%), hanya boleh disalurkan kepada delapan asnaf, dan baru wajib bila harta mencapai nisab.|Infak adalah pengeluaran harta untuk kebaikan tanpa batas nominal dan tanpa ketentuan penerima yang mengikat — boleh untuk pembangunan sekolah, masjid, atau operasional program.|Shodaqoh maknanya paling luas: mencakup harta maupun non-harta seperti tenaga dan ilmu. Di AmanahZakat, donasi infak dan shodaqoh dicatat pada rekening dana terpisah dari dana zakat.",
    sourceReference: "QS. At-Taubah: 60 · UU 23/2011",
  },
  {
    id: "faq-2",
    category: "Dasar ZIS",
    question: "Siapa saja yang berhak menerima zakat?",
    answer:
      "Delapan golongan (asnaf): fakir, miskin, amil, mualaf, riqab (memerdekakan budak), gharimin (terlilit utang), fi sabilillah, dan ibnu sabil (musafir yang kehabisan bekal).|Seluruh penyaluran AmanahZakat dicatat per asnaf dan bisa Anda lihat pada halaman Laporan Dampak.",
    sourceReference: "QS. At-Taubah: 60",
  },
  {
    id: "faq-3",
    category: "Dasar ZIS",
    question: "Apa itu nisab dan haul?",
    answer:
      "Nisab adalah batas minimal harta yang membuat zakat menjadi wajib — untuk harta simpanan setara 85 gram emas murni.|Haul adalah masa kepemilikan satu tahun hijriah. Bila harta belum genap setahun atau belum mencapai nisab, belum ada kewajiban zakat, namun tetap dianjurkan berinfak.",
    sourceReference: "Fatwa MUI · Baznas",
  },
  {
    id: "faq-4",
    category: "Zakat Maal",
    question: "Bagaimana cara menghitung zakat harta simpanan?",
    answer:
      "Jumlahkan seluruh aset likuid: uang tunai, tabungan, deposito, emas dan perak, serta investasi, lalu kurangi utang yang jatuh tempo.|Bandingkan hasilnya dengan nisab, yaitu 85 gram × harga emas per gram hari ini. Bila mencapai atau melebihi nisab dan sudah genap satu tahun, zakatnya 2,5% dari harta bersih tersebut.|Menu Hitung Zakat di situs ini melakukan perhitungan itu untuk Anda secara otomatis.",
    sourceReference: "Fatwa MUI 8/2011",
  },
  {
    id: "faq-5",
    category: "Zakat Maal",
    question: "Apakah rumah yang saya tempati kena zakat?",
    answer:
      "Tidak. Rumah tinggal, kendaraan yang dipakai sehari-hari, dan perabot rumah tangga termasuk kebutuhan pokok sehingga tidak dizakati.|Namun bila properti disewakan atau diperjualbelikan sebagai usaha, hasil sewa dan nilai perdagangannya masuk hitungan zakat.",
    sourceReference: "Ijtihad ulama kontemporer",
  },
  {
    id: "faq-6",
    category: "Zakat Maal",
    question: "Bagaimana zakat emas dan perhiasan?",
    answer:
      "Emas batangan dan tabungan emas dizakati 2,5% bila mencapai 85 gram dan genap satu haul.|Perhiasan yang dipakai wajar sehari-hari menurut jumhur ulama tidak dizakati; yang disimpan sebagai investasi tetap dizakati.",
    sourceReference: "Fatwa MUI",
  },
  {
    id: "faq-7",
    category: "Zakat Profesi",
    question: "Berapa zakat dari gaji bulanan saya?",
    answer:
      "Kadarnya 2,5%. Ada dua pendekatan: bruto — langsung 2,5% dari seluruh penghasilan bulanan; atau neto — 2,5% dari penghasilan setelah dikurangi kebutuhan pokok.|Nisab bulanan setara 522 kg beras dibagi dua belas, atau sekitar penghasilan Rp 6,7 juta per bulan pada harga beras saat ini.|Contoh: gaji Rp 10.000.000 dengan pendekatan bruto menghasilkan zakat Rp 250.000 per bulan.",
    sourceReference: "Fatwa MUI 3/2003",
  },
  {
    id: "faq-8",
    category: "Zakat Profesi",
    question: "Zakat profesi dibayar bulanan atau tahunan?",
    answer:
      "Keduanya sah. Bulanan lebih ringan dan lebih tertib, tahunan lebih mudah dicocokkan dengan SPT.|Bila Anda memilih bulanan lewat UPZ kantor, potongan otomatis dilakukan dari payroll dan bukti setornya terbit setiap bulan.",
    sourceReference: "Fatwa MUI 3/2003",
  },
  {
    id: "faq-9",
    category: "Zakat Profesi",
    question: "Apakah THR dan bonus kena zakat?",
    answer:
      "Ya, THR, bonus, dan komisi termasuk penghasilan sehingga dihitung dengan kadar yang sama, yaitu 2,5% pada saat diterima.",
    sourceReference: "Fatwa MUI 3/2003",
  },
  {
    id: "faq-10",
    category: "Pertanian & Tambang",
    question: "Berapa kadar zakat hasil panen?",
    answer:
      "Nisabnya 653 kg gabah kering dan tidak menunggu haul — zakat dikeluarkan setiap kali panen.|Kadarnya 10% bila lahan diairi hujan atau mata air tanpa biaya, dan 5% bila memakai irigasi berbiaya seperti pompa atau sewa air.",
    sourceReference: "HR. Bukhari · Fatwa MUI",
  },
  {
    id: "faq-11",
    category: "Pertanian & Tambang",
    question: "Bagaimana zakat hasil tambang?",
    answer:
      "Nisabnya setara 85 gram emas, tanpa haul — dikeluarkan begitu hasil tambang diperoleh.|Kadarnya 2,5% dari nilai bersih setelah dikurangi biaya eksplorasi dan ekstraksi.",
    sourceReference: "Fatwa MUI",
  },
  {
    id: "faq-12",
    category: "Infak & Shodaqoh",
    question: "Apakah infak bisa saya arahkan ke program tertentu?",
    answer:
      "Bisa. Setiap kampanye di situs ini memiliki rekening dana tersendiri, sehingga donasi Anda hanya terpakai untuk program yang Anda pilih.|Bila program telah tuntas dan dana tersisa, penggunaannya dialihkan ke program sejenis dan diumumkan pada halaman Kabar Penyaluran.",
    sourceReference: "Kebijakan AmanahZakat",
  },
  {
    id: "faq-13",
    category: "Infak & Shodaqoh",
    question: "Apa itu wakaf pohon dan infak oksigen?",
    answer:
      "Wakaf Pohon adalah wakaf produktif: pohon ditanam dan dirawat, hasilnya dikelola untuk kemaslahatan umum secara berkelanjutan.|Infak Oksigen membiayai penghijauan kawasan kritis, termasuk Konservasi DAS Citarum, dengan laporan jumlah pohon dan titik tanam yang dapat ditelusuri.",
    sourceReference: "Program AmanahZakat",
  },
  {
    id: "faq-14",
    category: "Pajak & Bukti",
    question: "Apakah zakat mengurangi pajak penghasilan saya?",
    answer:
      "Zakat yang dibayarkan melalui lembaga amil resmi yang disahkan pemerintah dapat menjadi pengurang penghasilan bruto dalam SPT Tahunan Anda.|Syaratnya, Anda melampirkan bukti setor sah — di AmanahZakat berupa SBMZ (Surat Bukti Membayar Zakat) yang memuat QR verifikasi.|Perlu dicatat: zakat menjadi pengurang penghasilan bruto, bukan pengurang pajak terutang secara langsung.",
    sourceReference: "UU 36/2008 Pasal 9 · PP 60/2010",
  },
  {
    id: "faq-15",
    category: "Pajak & Bukti",
    question: "Bagaimana cara mendapatkan SBMZ?",
    answer:
      "SBMZ terbit otomatis setiap kali pembayaran zakat Anda berhasil, dan dapat diunduh sebagai PDF dari halaman konfirmasi maupun dari email tanda terima.|Untuk keperluan SPT, tersedia pula Rekap Tahunan Muzakki yang merangkum seluruh setoran Anda dalam satu tahun pajak.|Infak dan shodaqoh tetap mendapat bukti pembayaran, namun bukan SBMZ karena tidak diakui sebagai pengurang penghasilan bruto.",
    sourceReference: "Kebijakan AmanahZakat",
  },
  {
    id: "faq-16",
    category: "Pajak & Bukti",
    question: "Bagaimana kantor pajak memverifikasi bukti saya?",
    answer:
      "Setiap SBMZ memuat kode unik dan QR yang mengarah ke halaman Verifikasi Bukti di situs ini.|Petugas cukup memindai QR atau memasukkan kode tersebut untuk melihat status keabsahan, nominal, tanggal, dan jenis dana.",
    sourceReference: "Kebijakan AmanahZakat",
  },
  {
    id: "faq-17",
    category: "Teknis Donasi",
    question: "Metode pembayaran apa saja yang tersedia?",
    answer:
      "Tersedia QRIS, virtual account bank, transfer manual, serta e-wallet. Seluruh transaksi diproses melalui payment gateway berlisensi Bank Indonesia.|Dana masuk langsung ke rekening lembaga, bukan rekening pribadi.",
    sourceReference: "Kebijakan AmanahZakat",
  },
  {
    id: "faq-18",
    category: "Teknis Donasi",
    question: "Berapa hak amil yang diambil dari donasi saya?",
    answer:
      "Hak amil untuk operasional lembaga diambil dari porsi amil sesuai ketentuan, dan seluruh penggunaannya dilaporkan dalam laporan keuangan yang diaudit.|Rincian alokasi tiap kampanye bisa Anda lihat pada halaman detail program.",
    sourceReference: "UU 23/2011 · Fatwa MUI 8/2011",
  },
  {
    id: "faq-19",
    category: "Teknis Donasi",
    question: "Bisakah saya berdonasi anonim?",
    answer:
      "Bisa. Centang opsi hamba Allah saat mengisi formulir donasi; nama Anda tidak akan tampil di daftar donatur publik.|Namun untuk penerbitan SBMZ, identitas dan NPWP tetap diperlukan karena dokumen tersebut bersifat resmi.",
    sourceReference: "Kebijakan AmanahZakat",
  },
  {
    id: "faq-20",
    category: "Teknis Donasi",
    question: "Bagaimana perusahaan membuka UPZ karyawan?",
    answer:
      "Perusahaan dapat membentuk Unit Pengumpul Zakat internal dengan perjanjian kerja sama, lalu memotong zakat karyawan lewat payroll.|PIC perusahaan mendapat portal tersendiri untuk mengunggah batch potongan dan memantau serapan dana karyawannya, serta laporan bagi hasil pengelolaan.",
    sourceReference: "UU 23/2011",
  },
];
