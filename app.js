const express = require("express");
const expressLayout = require("express-ejs-layouts");
const {loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts}= require('./utils/contacts') 
const { body, validationResult, check } = require('express-validator');
const session= require('express-session')
const cookieParser= require('cookie-parser')
const flash= require('connect-flash')
const { render } = require("ejs");
const app = express();
const port = 3000;


app.set("view engine", "ejs");
app.use(expressLayout);
app.use(express.static('public'));
app.use(express.urlencoded({extended: true}));

//konfigurasi flash
app.use(cookieParser('secret'))
app.use(session({
  cookie: {maxAge: 6000},
  secret: 'secret',
  resave: true,
  saveUninitialized: true,
}))
app.use(flash())

app.get("/", (req, res) => {
  const mahasiswa = [
    {
      nama: "Muhammad",
      email: "mhm@gmail.com",
    },
    {
      nama: "Bagus",
      email: "bgs@gmail.com",
    },
    {
      nama: "Setiawan",
      email: "stw@gmail.com",
    },
  ];
  res.render("index", {
    nama: "Muhammad Bagus Setiawan",
    title: "Halaman Home",
    mahasiswa,
    layout: "layouts/main-layout",
  });
});
app.get("/about", (req, res) => {
  res.render("about", {
    title: "Halaman About",
    layout: "layouts/main-layout",
  });
});

//halaman lihat contact
app.get("/contact", (req, res) => {

  const contacts= loadContact();

  res.render("contact", {
    title: "Halaman Contact",
    layout: "layouts/main-layout",
    contacts,
    msg: req.flash('msg'),
  });
});

//halaman form tambah data
app.get("/contact/add", (req, res) => {

  res.render("add-contact", {
    title: "Form Tambah Data Contact",
    layout: "layouts/main-layout",
  });
});

//proses simpan data 
app.post('/contact', [
  body('nama').custom((value)=> {
    const duplikat= cekDuplikat(value)

    if(duplikat){

      throw new Error('Nama contact sudah terdaftar')
    }

    return true;
  }),
  check('email', 'Email tidak valid').isEmail(),
  check('nohp', 'No Hp tidak valid').isMobilePhone("id-ID")
], (req, res)=> {

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      res.render('add-contact', {
        title: 'Form Tambah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
      })
    }else{

       addContact(req.body);

       //kirimkan flash massage
       req.flash('msg', 'Data berhasil ditambahkan!')
       res.redirect('/contact')
    }   
})

//proses delete contact
app.get('/contact/delete/:nama', (req, res)=> {

  const contact= findContact(req.params.nama);
  
  //jika contact tidak ada
  if (!contact) {
    res.status(404)
    res.send('<h1>404</h1>')
  }else{
    deleteContact(req.params.nama)
    req.flash('msg', 'Data berhasil dihapus!')
    res.redirect('/contact')
  }
})

//form ubah data kontak
app.get("/contact/edit/:nama", (req, res) => {

  const contact= findContact(req.params.nama)
  res.render("edit-contact", {
    title: "Form Edit Contact",
    layout: "layouts/main-layout",
    contact
  });
});

//proses ubah data
app.post('/contact/update', [
  body('nama').custom((value, {req})=> {
    const duplikat= cekDuplikat(value)
    if(value !== req.body.oldNama && duplikat){

      throw new Error('Nama contact sudah terdaftar')
    }

    return true;
  }),
  check('email', 'Email tidak valid').isEmail(),
  check('nohp', 'No Hp tidak valid').isMobilePhone("id-ID")
], (req, res)=> {

  const errors = validationResult(req);
    if (!errors.isEmpty()) {
      
      res.render('edit-contact', {
        title: 'Form Ubah Data Contact',
        layout: 'layouts/main-layout',
        errors: errors.array(),
        contact: req.body
      })
    }else{

      updateContacts(req.body)
      //kirimkan flash masage

      req.flash('msg', 'Data contact berhasil diubah')
      res.redirect('/contact')     
    }   
})

//proses delete contact
app.get('/contact/delete/:nama', (req, res)=> {

  const contact= findContact(req.params.nama);
  
  //jika contact tidak ada
  if (!contact) {
    res.status(404)
    res.send('<h1>404</h1>')
  }else{
    deleteContact(req.params.nama)
    req.flash('msg', 'Data berhasil dihapus!')
    res.redirect('/contact')
  }
})


//halaman detail contact
app.get("/contact/:nama", (req, res) => {

  const contact= findContact(req.params.nama);

  res.render("Detail", {
    title: "Halaman Detail",
    layout: "layouts/main-layout",
    contact,
  });
});

app.use("/", (req, res) => {
  res.status(404);
  res.send("<h1>404</h1>");
});

app.listen(port, () => {
  console.log(`Server is listening on posrt ${port}...`);
});
