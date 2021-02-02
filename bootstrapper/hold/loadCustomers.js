'use strict';

const admin = require('firebase-admin');
const db = admin.firestore();

const parse = require('csv-parse')
const fs = require('fs');


const __loadClient = async (entity) => {

    const COLLECTION_NAME = 'clients'
    const entityId = `${entity.clientTag}`
    const entityRef = db.collection(COLLECTION_NAME).doc(entityId);
    await entityRef.set({
      id: entityId,
      displayName: entity.clientName
    });
}

const __loadSolution = async (entity) => {

    const COLLECTION_NAME = 'solutions'
    const entityId = `${entity.clientTag}_${entity.solutionTag}`
    const entityRef = db.collection(COLLECTION_NAME).doc(entityId);
    await entityRef.set({
      id: entityId,
      displayName: entity.solutionName,

      clientId: `${entity.clientTag}`,
      clientName: entity.clientName
    });
}

const __loadProgram = async (entity) => {

    const COLLECTION_NAME = 'programs'
    const entityId = `${entity.clientTag}_${entity.solutionTag}_${entity.programTag}`
    const entityRef = db.collection(COLLECTION_NAME).doc(entityId);
    await entityRef.set({
      id: entityId,
      displayName: entity.programName,

      solutionId: `${entity.clientTag}_${entity.solutionTag}`,
      solutionName: entity.solutionName,
      clientId: `${entity.clientTag}`,
      clientName: entity.clientName
    });
}

const __loadOutreach = async (entity) => {

    const COLLECTION_NAME = 'outreaches'
    const entityId = `${entity.clientTag}_${entity.solutionTag}_${entity.programTag}_${entity.outreachTag}`
    const entityRef = db.collection(COLLECTION_NAME).doc(entityId);
    await entityRef.set({
      id: entityId,
      displayName: entity.outreachName,

      programId: `${entity.clientTag}_${entity.solutionTag}_${entity.programTag}`,
      programName: entity.programName,
      solutionId: `${entity.clientTag}_${entity.solutionTag}`,
      solutionName: entity.solutionName,
      clientId: `${entity.clientTag}`,
      clientName: entity.clientName,
      channel: entity.channel
    });
}

const __parseClientCsv = (filepath) => {

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
            clientTag:  record.clientTag,
            clientName: record.clientName,
            solutionTag:  record.solutionTag,
            solutionName: record.solutionName,
            programTag:   record.programTag,
            programName:  record.programName,
            outreachTag:  record.outreachTag,
            outreachName: record.outreachName,
            channel:      record.channel,
          })
        })
        resolve(records)
      });
  })
}

function __sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(resolve, ms);
  });
}

const procssCsv = async () => {
  /////////////////////////
  // file name defined here  *********************************
  /////////////////////////
  const clientList = await __parseClientCsv('clients.csv')
  clientList.forEach( (record) => {

      __loadClient( record )
      __loadSolution( record )
      __loadProgram( record )
      __loadOutreach( record )
  })
  await __sleep(3000)

}

module.exports = procssCsv