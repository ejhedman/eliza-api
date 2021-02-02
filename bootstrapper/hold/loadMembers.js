'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();

const parse = require('csv-parse')
const fs = require('fs');


const __loadMember = async (entity) => {

  const COLLECTION_NAME = 'members'
  const entityId = `${entity.clientId}_${entity.memberXid}`
    const entityRef = db.collection(COLLECTION_NAME).doc(entityId)
    await entityRef.set({
      id: entityId,
      clientId:   entity.clientId,
      memberXid:    entity.memberXid,
      fullName:     entity.fullName,
      email:        entity.email,
      telephone:    entity.telephone,
});
}

const __parseMemberCsv = (filepath) => {

  return new Promise( (resolve) => {

    const parser = parse()

    const csvRows = []
    parser.on('readable', function(){
      let record
      while (record = parser.read()) {
        csvRows.push(record)
      }
    })

    parser.on('error', function(err){
      console.error(err.message)
    })

    fs.createReadStream(filepath)
      .pipe(parser)
      .on('end', () => {

        const cols = csvRows[0].length
        const heads = csvRows[0]
        const data = csvRows.slice(1)

        const csvRecords = data.map( (record) => {
          const rec = []
          for (let i = 0; i < cols; ++i) {
            rec.push([ heads[i], record[i].trim() ])
          }
          return(Object.fromEntries( rec ))
        })

        const records = csvRecords.map( (record) => {

          /////////////////////////
          // fields defined here *********************************
          /////////////////////////
          return({
            clientId:   record.clientId,
            memberXid:    record.memberXid,
            fullName:     record.fullName,
            email:        record.email,
            telephone:    record.telephone,
          })
        })
        resolve(records)
      });
  })
}

const procssCsv = async () => {
  /////////////////////////
  // file name defined here  *********************************
  /////////////////////////
  const memberList = await __parseMemberCsv('members.csv')
  memberList.forEach( (record) => {
      __loadMember( record )
  })
}

module.exports = procssCsv