# AGENT STATE — CSCID EDIT

## TUJUAN UTAMA
Membangun EDIT sebagai private website workspace terpisah untuk mengelola konten dan desain CSCID tanpa mengganggu project production CSCID atau SERVER.

## STATUS SAAT INI
- Selesai: Repository EDIT di-bootstrap; branch fitur dibuat; fondasi Next.js dan antarmuka workspace/editor homepage ditambahkan.
- Sedang dikerjakan: Build verification, PR, integrasi project Vercel edit.
- Tertunda: Autentikasi Founder/passkey, database production, API penyimpanan/publish, revision history, koneksi design system CSS-ID, dan penggantian /server setelah seluruh uji lulus.

## KEPUTUSAN & ASUMSI PENTING
- Project Vercel `edit` tetap terpisah dari project production `44022010` dan project `1111`.
- Tidak mengubah domain/DNS atau route website utama.
- Draft editor saat ini disimpan di localStorage browser; ini bukan database dan tidak mengubah website production.
- Tidak menanam secret di repository. Autentikasi dan database baru diaktifkan setelah environment variable aman tersedia.
- Node.js runtime dipatok ke versi 22.x pada project Vercel karena versi 26.x yang terdeteksi belum didukung project settings.

## DAFTAR LANGKAH BERIKUTNYA
1. Verifikasi build aplikasi dan perbaiki error.
2. Buat PR ke main dan merge setelah verifikasi lulus.
3. Hubungkan project Vercel `edit` ke repository EDIT tanpa membuat project duplikat.
4. Deploy dan cek URL/log.
5. Rancang integrasi database/auth menggunakan environment variables tanpa membocorkan nilainya.
6. Integrasikan CSS-ID sebagai design source dan lanjutkan modul Pages, Media, Services, Integrations, Environment, Security.

## INFO TEKNIS
- Repository: `CSCID2004/EDIT`
- Branch aktif: `feat/edit-workspace-foundation`
- Base branch: `main`
- Vercel project: `edit`
- Vercel project ID: `prj_13oPzjkk5Nxmni8p2U08123k00Qs`
- Team ID: `team_HCbbgdhYjUWrfCeGx2BbhkZ8`
- Vercel URL: belum ada deployment.
- Design source: `CSCID2004/CSS-ID`

## MASALAH YANG BELUM SELESAI
- Repository EDIT sebelumnya kosong; bootstrap commit dibuat di main agar branch fitur dapat dibuat.
- Project Vercel edit belum terhubung ke GitHub dan belum memiliki deployment.
- Tidak ada environment variables pada project edit.
- Belum ada database atau mekanisme autentikasi Founder.
- Vercel project sebelumnya terdeteksi menggunakan Node 26.x; perlu disetel ke Node 22.x.
