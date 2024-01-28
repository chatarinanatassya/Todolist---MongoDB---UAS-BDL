const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 3000;

// Koneksi ke MongoDB
mongoose.connect("mongodb://127.0.0.1/todolist", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Tangani kejadian ketika koneksi berhasil
mongoose.connection.on("connected", () => {
  console.log("Connected to MongoDB");
});

// Tangani kejadian ketika koneksi gagal
mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

// Tangani kejadian ketika koneksi terputus
mongoose.connection.on("disconnected", () => {
  console.log("Disconnected from MongoDB");
});

// Membuat skema mongoose
const taskSchema = new mongoose.Schema({
  task: String,
  description: String,
  date: String,
});

// Membuat model mongoose
const Task = mongoose.model("Task", taskSchema);

// Set EJS sebagai view engine
app.set("view engine", "ejs");

// Middleware untuk mem-parsing request body
app.use(express.urlencoded({ extended: true }));

// Menyajikan file statis dari direktori 'public'
app.use(express.static("public"));

// Endpoint untuk menampilkan daftar tugas (sebagai halaman utama)
app.get("/", async (req, res) => {
  try {
    // Mengambil semua tugas dari database
    const tasks = await Task.find();

    res.render("index", { tugas: tasks });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint untuk menampilkan daftar tugas
app.get("/daftarTugas", async (req, res) => {
  try {
    // Mengambil semua tugas dari database
    const tasks = await Task.find();

    res.render("daftarTugas", { tugas: tasks });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

/// Endpoint untuk menangani penambahan task
app.post("/tambahTask", async (req, res) => {
  try {
    // Mendapatkan data dari formulir
    const { task, description, date } = req.body;

    // Menyimpan task ke database
    const newTask = new Task({ task, description, date });
    await newTask.save();

    // Mengarahkan pengguna kembali ke halaman utama atau melakukan aksi lainnya
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint untuk menangani pembaruan task
app.post("/updateTask/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    // Mendapatkan data baru dari formulir
    const { task, description, date } = req.body;

    // Mencari dan memperbarui task berdasarkan ID
    await Task.findByIdAndUpdate(taskId, { task, description, date });

    // Mengarahkan pengguna kembali ke halaman utama atau melakukan aksi lainnya
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint untuk menampilkan halaman editTask
app.get("/editTask/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    // Mencari tugas berdasarkan ID
    const task = await Task.findById(taskId);

    // Render halaman editTask dengan data tugas
    res.render("editTask", { tugas: task });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Endpoint untuk menangani penghapusan task
app.get("/hapus/:id", async (req, res) => {
  try {
    const taskId = req.params.id;
    
    // Mencari dan menghapus task berdasarkan ID
    await Task.deleteOne({ _id: taskId });

    // Mengarahkan pengguna kembali ke halaman utama atau melakukan aksi lainnya
    res.redirect("/");
  } catch (error) {
    res.status(500).send(error.message);
  }
});


// Menjalankan server
app.listen(port, () => {
  console.log(`Server berjalan di http://localhost:${port}`);
});
