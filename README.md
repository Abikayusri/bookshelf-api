# Bookshelf API

RESTful API untuk mengelola koleksi buku (tambah, lihat, ubah, hapus). Proyek ini adalah submission kelas **Belajar Back-End Pemula dengan JavaScript** di Dicoding. Data disimpan di memori, jadi akan kosong lagi setiap kali server dijalankan ulang.

## Tech Stack

| Kategori | Teknologi |
| --- | --- |
| Runtime | Node.js (LTS, diuji di v24) |
| Bahasa | JavaScript (ES Modules) |
| Web framework | [Express](https://expressjs.com/) 5 |
| ID generator | [nanoid](https://github.com/ai/nanoid) |
| Penyimpanan | Array di memori (tanpa database) |
| Development | [nodemon](https://nodemon.io/) untuk auto-restart |
| Linting | [ESLint](https://eslint.org/) 10 + `eslint-config-dicodingacademy` |
| Pengujian API | Postman / [newman](https://github.com/postmanlabs/newman) |

## Arsitektur

Proyek memakai **arsitektur hexagonal** (ports and adapters). Logika bisnis berada di tengah dan tidak bergantung pada Express, nanoid, atau cara penyimpanan data.

```
            HTTP (Express)                          Penyimpanan / ID
   ┌──────────────────────────────┐        ┌──────────────────────────────┐
   │ adapters/in/http             │        │ adapters/out/memory          │
   │ routes → controller          │        │ inMemoryBookRepository       │
   │ errorHandler                 │        │ adapters/out/id              │
   └──────────────┬───────────────┘        │ nanoidGenerator              │
                  │ memanggil use case      └──────────────▲───────────────┘
                  ▼                                        │ mengimplementasikan port
   ┌──────────────────────────────────────────────────────┴───────────────┐
   │ application                                                           │
   │ services/bookService (use case)  ──►  ports/bookRepository (kontrak)  │
   │                                                                       │
   │ domain: book (aturan validasi, finished, create/update), errors       │
   └───────────────────────────────────────────────────────────────────────┘
```

| Lapisan | Tanggung jawab | Aturan dependensi |
| --- | --- | --- |
| `domain` | Aturan inti buku: validasi, menghitung `finished`, membuat dan memperbarui buku, serta error domain | Tidak meng-import apa pun dari luar `domain` |
| `application` | Use case (`addBook`, `getBooks`, `getBook`, `editBook`, `deleteBook`) dan kontrak port keluar (`BookRepository`, `IdGenerator`) | Hanya meng-import `domain`. Tidak boleh meng-import Express, nanoid, atau `infrastructure` |
| `infrastructure/adapters/in` | Adapter masuk HTTP: routing Express, mengubah request/response ke dan dari use case, memetakan error domain ke status HTTP | Memanggil use case, tidak mengakses penyimpanan langsung |
| `infrastructure/adapters/out` | Adapter keluar: implementasi `BookRepository` (array di memori) dan `IdGenerator` (nanoid) | Mengimplementasikan port dari `application` |
| `server.js` | Composition root: merangkai adapter ke service, lalu menjalankan server di port 9000 | Satu-satunya tempat semua lapisan dirangkai |

Untuk mengganti penyimpanan ke database, cukup buat adapter baru yang memenuhi kontrak `BookRepository`, lalu ganti satu baris di `server.js`. `domain` dan `application` tidak perlu diubah.

## Struktur Proyek

```
bookshelf-api/
├── src/
│   ├── domain/
│   │   ├── book.js                         # validasi, finished, createBook, updateBook
│   │   └── errors.js                       # InvalidBookError, BookNotFoundError
│   ├── application/
│   │   ├── ports/
│   │   │   └── bookRepository.js           # kontrak BookRepository dan IdGenerator (JSDoc)
│   │   └── services/
│   │       └── bookService.js              # use case Bookshelf API
│   ├── infrastructure/
│   │   └── adapters/
│   │       ├── in/http/
│   │       │   ├── routes.js               # definisi route Express
│   │       │   ├── bookController.js       # request/response <-> use case
│   │       │   └── errorHandler.js         # error domain -> 400/404
│   │       └── out/
│   │           ├── memory/
│   │           │   └── inMemoryBookRepository.js
│   │           └── id/
│   │               └── nanoidGenerator.js
│   └── server.js                           # composition root, port 9000
├── eslint.config.js
├── package.json
└── package-lock.json
```

## Endpoint

| Method | Path | Keterangan |
| --- | --- | --- |
| `POST` | `/books` | Menambahkan buku |
| `GET` | `/books` | Menampilkan seluruh buku (`id`, `name`, `publisher`). Mendukung query `?name=`, `?reading=0\|1`, `?finished=0\|1` |
| `GET` | `/books/{bookId}` | Menampilkan detail buku |
| `PUT` | `/books/{bookId}` | Mengubah data buku |
| `DELETE` | `/books/{bookId}` | Menghapus buku |

Contoh body untuk `POST` dan `PUT`:

```json
{
  "name": "Buku A",
  "year": 2010,
  "author": "John Doe",
  "summary": "Lorem ipsum dolor sit amet",
  "publisher": "Dicoding Indonesia",
  "pageCount": 100,
  "readPage": 25,
  "reading": false
}
```

## Menjalankan Proyek

### Prasyarat

- Node.js versi LTS (`node -v`)
- npm (ikut terpasang bersama Node.js)

### Instalasi

```bash
git clone https://github.com/Abikayusri/bookshelf-api.git
cd bookshelf-api
npm install
```

### Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm run start` | Menjalankan server di `http://localhost:9000` |
| `npm run start-dev` | Menjalankan server dengan nodemon (restart otomatis saat file berubah) |
| `npm run lint` | Memeriksa gaya kode dengan ESLint |

### Setup awal proyek (dari nol)

Perintah yang dipakai saat proyek ini pertama kali dibuat:

```bash
npm init -y
npm pkg set type=module scripts.start="node src/server.js" scripts.start-dev="nodemon src/server.js" scripts.lint="eslint ."
npm install express nanoid
npm install -D nodemon eslint @eslint/js globals eslint-config-dicodingacademy
```

## Pengujian

Pengujian memakai Postman Collection dan Environment dari Dicoding (*Bookshelf API Test*). Jalankan server dulu, lalu jalankan collection lewat Postman (**Run collection**) atau newman:

```bash
npx newman run "Bookshelf API Test.postman_collection.json" -e "Bookshelf API Test.postman_environment.json"
```

Jalankan ulang server sebelum setiap pengujian, karena beberapa test menghitung jumlah buku yang tersimpan.
