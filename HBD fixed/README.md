# Birthday Greeting - PP + Cursor (Page Transition)

- PP dipakai sebagai background cinematic + butterfly/particle.
- Cursor dipakai untuk landing page, kue/lilin, dan surat ucapan.
- Tidak menggunakan scroll untuk berpindah bagian.
- Alur halaman: Landing -> Kue -> Surat.
- Perpindahan menggunakan animasi fade + slide.


## Perbaikan
- `style.css` dipanggil dengan path relatif `./style.css`, sehingga aman saat memakai VS Code Live Server dari folder project.
- Kode animasi pesan PP yang mencari `msgHeader`, `msgTitleGroup`, `lineA`, dll. dihapus karena PP hanya dipakai sebagai background.
- Sistem perpindahan scene tetap tanpa scroll.
