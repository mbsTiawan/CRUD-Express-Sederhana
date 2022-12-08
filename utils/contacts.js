const { rejects } = require('assert')
 const fs = require('fs')
 const { resolve } = require('path')
 

//membuat folder direktori jika belum ada
 const dirPath = './data'
 if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath)
 }

//membuat file jika belum ada
 const filePath = './data/contacts.json'
 if (!fs.existsSync(filePath)) {
    fs.writeFileSync(filePath, '[]', 'utf-8')
 }

 //ambil semua data dicontact.json
const loadContact= ()=> {
   const file = fs.readFileSync('data/contacts.json', 'utf-8')
   contacts = JSON.parse(file)
   return contacts;
}

//cari data di contacts.json berdasarkan nama
const findContact= (nama)=> {
    const contacts= loadContact();
    const contact= contacts.find((contact)=> contact.nama.toLowerCase() === nama.toLowerCase());
    return contact;
}

//menimpa file contacts.json dengan data yang baru
const saveContacts= (contacts)=> {
    fs.writeFileSync('data/contacts.json', JSON.stringify(contacts));
}


//nambahin data baru ke array contacts.json yang akan menimpa
const addContact= (contact)=> {
    const contacts= loadContact();
    contacts.push(contact);
    saveContacts(contacts);
}

//cek nama yang duplikat
const cekDuplikat= (nama)=> {

    const contacts= loadContact();
    return contacts.find((contact)=> contact.nama === nama);
}

//hapus contact
const deleteContact= (nama)=> {
    const contacts= loadContact();
    const filteredContacts= contacts.filter((contact)=> contact.nama !== nama)

    saveContacts(filteredContacts);
}

//mengubah contact
const updateContacts= (contactBaru)=> {
    const contacts= loadContact()
    //hilangkan contact lama yang namanya sama dengan old nama
    const filteredContacts= contacts.filter((contact)=> contact.nama !== contactBaru.oldNama)
    delete contactBaru.oldNama
    filteredContacts.push(contactBaru)
    saveContacts(filteredContacts)
}

module.exports= {loadContact, findContact, addContact, cekDuplikat, deleteContact, updateContacts}