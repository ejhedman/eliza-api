'use strict';
const { customAlphabet } = require( "nanoid");
const ALPHABET = "ABCDEFGHJKLMNPRSTUVWXYZ23456789"; // remove 0, 1, O, Q, I
const LENGTH = 8;
const generateId = customAlphabet(ALPHABET, LENGTH);

const admin = require('firebase-admin');
const db = admin.firestore();

const parse = require('csv-parse')
const fs = require('fs');


const lookupOutreach = async (entityId) => {
  const COLLECTION_NAME = 'outreaches'
  const entityRef = db.collection(COLLECTION_NAME).doc(entityId)
  const entityDoc = await entityRef.get()
  if (!entityDoc.exists) {
      return(null)
  }

  const entity = await entityDoc.data()
  entity.id = entityRef.id
  return(entity)
}

const __loadOutreachResult = async (entity) => {

  const outreach = await lookupOutreach(entity.outreachId)
  if (!outreach) {
    throw new Error(`outreach not found: ${entity.outreachId}`)
  }
  if(outreach.clientId != entity.clientId) {
    throw new Error("mismatched outreach result client Id")
  }

  const parsedResponses = JSON.parse(entity.responses)

  const COLLECTION_NAME = 'outreachResults'
    const memberId = `${entity.clientId}_${entity.memberXid}`
    const entityId = generateId()
    const entityRef = db.collection(COLLECTION_NAME).doc(entityId)
    await entityRef.set({
      id: entityId,
      memberId:     memberId,
      memberXid:    entity.memberXid,
      clientId:   entity.clientId,
      status:       entity.status,
      result:       entity.result,
      resultDate:   entity.resultDate,
      jobId:        entity.jobId,
      batchId:      entity.batchId,
      outreachId:   outreach.id,
      outreachName: outreach.displayName,
      clientName: outreach.clientName,
      solutionId:   outreach.solutionId,
      solutionName: outreach.solutionName,
      programId:    outreach.programId,
      programName:  outreach.programName,
      responses:    parsedResponses
});
}

const __parseOutreachResultCsv = (filepath) => {

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
            outreachId:   record.outreachId,
            status:       record.status,
            result:       record.result,
            resultDate:   record.resultDate,
            jobId:        record.jobId,
            batchId:      record.batchId,
            responses:    record.responses
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
  const outreachResultList = await __parseOutreachResultCsv('outreachResults.csv')
  outreachResultList.forEach( (record) => {
      __loadOutreachResult( record )
  })
}

module.exports = procssCsv