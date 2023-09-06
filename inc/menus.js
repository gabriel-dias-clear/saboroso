let conn = require('./db');
const path = require('path');
let connpromise = require('./promisedb')

module.exports = {
  /**
   * funcao ok okokokokok
   * @returns
   */
  async getPhotoById(fields) {

    return new Promise((s, f) => {
      let query = 'SELECT * FROM tb_menus WHERE id = ?';
      let params = [
        fields.id
      ]
      conn.query(query, params, (err, result) => {
        if (err) {
          f(err);
        }
        else {
          s(result);
        }
      })
    })
  }
  ,
  getMenus() {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM tb_menus ORDER BY id`,
        (err, results) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(results)
          }
        })
    })
  }
  ,
  getMenus() {
    return new Promise((resolve, reject) => {
      conn.query(`SELECT * FROM tb_menus ORDER BY id`,
        (err, results) => {
          if (err) {
            reject(err)
          }
          else {
            resolve(results)
          }
        })
    })
  },
  async save(fields, files) {
  
    let query, params;


    if(files === undefined){
      files = {}
    }

    if (Object.keys(files).length === 0) {

      await this.getPhotoById(fields).then(result => {

        fields.photo = result[0].photo

      })
    }
   
    else if (files.filepath) {
      fields.photo = `images/${files.newFilename}`

    }


    if (parseInt(fields.id) >= 0) {

      query = 'UPDATE tb_menus SET title = ?, description = ?, price = ?, photo = ? WHERE id = ?'

      params = [
        fields.title,
        fields.description,
        fields.price,
        fields.photo,
        fields.id
      ]

    }
    else {
      //INSERT
      query = "INSERT INTO tb_menus (title, description, price, photo) VALUES (?, ?, ? ,?)"

      params = [
        fields.title,
        fields.description,
        fields.price,
        fields.photo
      ]
    }

    
    let aux;
    await connpromise.query(query, params).then((result)=>{
      aux = result
    })
    return aux
  },
  delete(id){
    return new Promise((resolve, reject)=>{
      conn.query('DELETE FROM td_menus WHERE id = ?', [id], (err, result)=>{
        if(err){
          reject(err);
        }
        else{
          resolve(result)
        }
      })
    })
  }
}