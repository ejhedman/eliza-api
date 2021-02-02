'use strict';
const moment = require('moment');

const admin = require('firebase-admin');
const serviceAccount = require("./permissions.json");
if (admin.apps.length === 0) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://fantasyapp-f183c.firebaseio.com"
  });
}
const db = admin.firestore();

const faker = require('faker');
const { customAlphabet } = require( "nanoid");
const ALPHABET = "ABCDEFGHJKLMNPRSTUVWXYZ23456789"; // remove 0, 1, O, Q, I
const LENGTH = 8;
const generateId = (length = LENGTH) => { return(customAlphabet(ALPHABET, length)()) };

const clientMap = {}
const programMap = {}
const solutionMap = {}
const outreachMap = new Map()
const outreachInstanceMap = new Map()
const enrollmentMap = new Map()

const clientSet = []
const solutionSet = []
const programSet = []

const channelSet = [
    'IVR',
    'CALL',
    'EMAIL',
    'SMS',
    'LIVECALLER',
    'LIVECALLERX',
    'WEBFORM'
]

const statusSet = [
    'ACTIVATED',
    'COMPLETED',
    'ERROR',
    'EXCLUDED',
    'EXPIRED',
    'INBOUND_ONLY',
    'UNGROUPED',
]

const categorySet = [
    'REACHED',
    'TOUCHED',
    'NOT_TOUCHED',
]

const resultSet = [
    'EXPIRED',
    'REJECTED',
    'MSG_DECLINED',
    'APP_COMPLETED',
    'EARLY_OPT_OUT',
    'IGNORE',
    'APP_DECLINED',
    'FORWARDED',
    'OUTBOUND_AGENT_MSG_HUMAN',
    'AMD_HANGUP',
    'FAX',
    'OBD_HANGUP',
    'CREATED',
    'DONT_CALL',
    'MSG_MACHINE',
    'APP_POSTPONED',
    'NO_CONTINUE',
    'CORRECT_PERSON',
    'OUTBOUND_AGENT_NOANSWER',
    'MSG_UNKNOWN',
    'FORMAT_ERROR',
    'BLOCKBOUNCE',
    'HARDBOUNCE',
    'NA',
    'CLICKED',
    'MSG_EXCEPTION',
    'DIAL_ERROR',
    'INBOUND_AGENT_MSG_HUMAN',
    'MSG_HUMAN',
    'INBOUND',
    'MSG_ERROR',
    'DISCONNECTED',
    'OPENED',
    'UNSUBSCRIBED',
    'AGENT_DNC',
    'SOFTBOUNCE',
    'OUTBOUND_AGENT_CORRECT_PERSON',
    'NO_PROMPT',
    'INBOUND_AGENT_HANGUP',
    'TONE',
    'OUTBOUND_AGENT_WRONGNUMBER',
    'PENDING',
    'TECHNICALBOUNCE',
    'NOTOPENED',
    'OUTBOUND_AGENT_HANGUP',
    'OUTBOUND_AGENT_DISCONNECTED',
    'INBOUND_AGENT_COMPLETE',
    'UNKNOWN',
    'UNKNOWNBOUNCE',
    'QUEUED',
    'OUTBOUND_AGENT_BUSY',
    'NO_ANSWER',
    'APP_INCOMPLETE',
    'WRONG_NUMBER',
    'BUSY',
    'APP_SPECIFIC',
    'NO_RESULT',
    'OUTBOUND_AGENT_MSG_MACHINE',
]

function sleep(ms) {
    return new Promise((resolve) => {
      setTimeout(resolve, ms);
    });
}

/////////////////////////////////////
// clients
/////////////////////////////////////

const storeClientDef = async (data) => {

    const COLLECTION_NAME = 'clientDefs'

    const entity = {
      id: data.id,
      displayName: data.displayName
    }

    clientMap[data.id] = Object.assign({}, entity)
    clientSet.push(data.id)

    const entityRef = db.collection(COLLECTION_NAME).doc(data.id);
    await entityRef.set(entity);
}

const generateClientDefs = async (count) => {
    const clients = []

    for (let i = 0; i < count; ++i) {
        const clientName = faker.company.companyName(1)
        const short = clientName.slice(0,3).toUpperCase().replace(/[^A-Z0-9]/, '')
        const clientId = `${short}${generateId(2)}`
        const client = {
            id: clientId,
            displayName: clientName
        }
        clients.push(client)
    }

    clients.forEach( async (client) => {
        await storeClientDef(client)
    })

    clients.forEach( async (client) => {

        const solutions = generateSolutionDefs(client, SOLUTION_DEFS)
        solutions.forEach( async (solution) => {
            await storeSolutionDef(solution)

            const programs = generateProgramDefs(solution, PROGRAM_DEFS)
            programs.forEach( async (program) => {
                await storeProgramDef(program)

                const outreaches = generateOutreachDefs(program, OUTREACH_DEFS)
                outreaches.forEach( async (outreach) => {
                    await storeOutreachDef(outreach)
                })

                generateEnrollments(program, ENROLLMENTS_PER_PROGRAM)

            })
        })

    })

    return(clients)
}

/////////////////////////////////////
// solutions
/////////////////////////////////////

const storeSolutionDef = async (data) => {

    const COLLECTION_NAME = 'solutionDefs'

    const entity = {
      id: data.id,
      displayName: data.displayName,
      clientId: data.clientId,
      clientName: data.clientName
    }

    solutionMap[data.id] = Object.assign({}, entity)
    solutionSet.push(data.id)

    const entityRef = db.collection(COLLECTION_NAME).doc(data.id);
    await entityRef.set(entity);
}

const generateSolutionDefs = (client, count) => {
    const solutions = []
    for (let i = 0; i < count; ++i) {

        const solutionName = faker.company.catchPhrase()
        const short = solutionName.slice(0,3).toUpperCase().replace(/[^A-Z0-9]/, '')
        const solutionTag = `${short}${generateId(2)}`
        const id = `${client.id}_${solutionTag}`

        const solution = {
            id: id,
            displayName: solutionName,
            clientId: client.id,
            clientName: client.displayName,
        }
        solutions.push(solution)
    }
    return(solutions)
}

/////////////////////////////////////
// programs
/////////////////////////////////////

const storeProgramDef =  async (data) => {

    const COLLECTION_NAME = 'programDefs'
    const entity = {
      id: data.id,
      displayName: data.displayName,
      solutionId: data.solutionId,
      solutionName: data.solutionName,
      clientId: data.clientId,
      clientName: data.clientName
    }
    programMap[data.id] = Object.assign({}, entity)
    programSet.push(data.id)

    const entityRef = db.collection(COLLECTION_NAME).doc(data.id);
    await entityRef.set(entity);
}

const generateProgramDefs = (solution, count) => {
    const programs = []
    for (let i = 0; i < count; ++i) {

        const programName = faker.company.bs()
        const short = programName.slice(0,3).toUpperCase().replace(/[^A-Z0-9]/, '')
        const programTag = `${short}${generateId(2)}`
        const id = `${solution.id}_${programTag}`

        const program = {
            id: id,
            displayName: programName,
            solutionId: solution.id,
            solutionName: solution.displayName,
            clientId: solution.clientId,
            clientName: solution.clientName,
        }
        programs.push(program)
    }
    return(programs)
}

/////////////////////////////////////
// outreachs
/////////////////////////////////////

const storeOutreachDef =  async (data) => {

    const COLLECTION_NAME = 'outreachDefs'
    const entity = {
      id: data.id,
      displayName: data.displayName,
      programId: data.programId,
      programName: data.programName,
      solutionId: data.solutionId,
      solutionName: data.solutionName,
      clientId: data.clientId,
      clientName: data.clientName,
      channel: data.channel,
    }

    const program = programMap[data.programId]

    if (!program.outreachSet) {
        program.outreachSet = []
    }

    program.outreachSet.push(data.id)
    outreachMap.set(data.id, entity)

    const entityRef = db.collection(COLLECTION_NAME).doc(data.id);
    await entityRef.set(entity);
}

const generateOutreachDefs = (program, count) => {
    const outreaches = []
    for (let i = 0; i < count; ++i) {

        const outreachName = faker.company.bs()
        const short = outreachName.slice(0,3).toUpperCase().replace(/[^A-Z0-9]/, '')
        const outreachTag = `${short}${generateId(2)}`
        const id = `${program.id}_${outreachTag}`
        const channel = channelSet[faker.random.number(channelSet.length - 1)]

        const outreach = {
            id: id,
            displayName: outreachName,
            programId: program.id,
            programName: program.displayName,
            solutionId: program.solutionId,
            solutionName: program.solutionName,
            clientId: program.clientId,
            clientName: program.clientName,
            channel: channel,
        }
        outreaches.push(outreach)
    }
    return(outreaches)
}

/////////////////////////////////////
// enrollments
/////////////////////////////////////
const storeEnrollment = async (data) => {

    const COLLECTION_NAME = 'enrollments'

    const entity = {

        id:             data.id,
        displayName:    data.id,

        clientId:       data.clientId,
        clientName:     data.clientName,
        solutionId:     data.solutionId,
        solutionName:   data.solutionName,
        programId:      data.programId,
        programName:    data.programName,

        memberXid:      data.memberXid,
        groupXid:       data.groupXid,
        batchXid:       data.batchXid,
        transactionXid: data.transactionXid,
        firstName:      data.firstName,
        lastName:       data.lastName,
        fullName:       data.fullName,
        email:          data.email,
        telephone:      data.telephone,
        address1:       data.address1,
        city:           data.city,
        state:          data.state,
        postalCode:     data.postalCode,
        lineOfBusiness: data.lineOfBusiness,
        gender:         data.gender,
        test:           data.test,
        dob:            data.dob,
        preferredLanguage: data.preferredLanguage,
        receivedAt:     data.receivedAt,
        startedAt:      data.startedAt,
        lastContactAt:  data.lastContactAt,
        completedAt:    data.completedAt,
        scubStatus:     data.scubStatus,
        scrubReason:    data.scrubReason,
        excluded:       data.excluded,
        excludedAt:     data.excludedAt,
    }

    const program = programMap[data.programId]

    if (!program.enrollmentSet) {
        program.enrollmentSet = []
    }
    program.enrollmentSet.push(data.id)
    enrollmentMap.set(data.id, entity)

    const entityRef = db.collection(COLLECTION_NAME).doc(data.id)
    await entityRef.set(entity);

}

const generateEnrollment = (program) => {

    const fname = faker.name.firstName()
    const lname = faker.name.lastName()
    const fullname = `${lname}, ${fname}`
    const email = faker.internet.email(fname.toLowerCase(), lname.toLowerCase())
    const phone = faker.phone.phoneNumber()
    const language = 'EN'

    const address1 = '105 Jay St.'
    const city = 'Schenectady'
    const state = 'NY'
    const postalCode = '12308'

    const alphabet = "abcdefghijklmnopqrstuvwxyz"
    const gender = alphabet[Math.floor(Math.random() * alphabet.length)]
    const dob = moment(faker.date.past(55)).format('YYYY-MM-DDTHH:mm:ss.SSSZ')

    const alphabet2 = "1234567890"
    const groupLetter = alphabet2[Math.floor(Math.random() * alphabet2.length)]
    const batchLetter = alphabet2[Math.floor(Math.random() * alphabet2.length)]

    const receivedAt = moment(faker.date.past(1)).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    const startedAt = moment(faker.date.past(1)).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    const lastContactAt = moment(faker.date.past(1)).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    const completedAt = moment(faker.date.past(1)).format('YYYY-MM-DDTHH:mm:ss.SSSZ')
    const scubStatus = 'OK'
    const scrubReason = null
    const excluded = false
    const excludedAt = null

    const memberXid = generateId()
    const transactionXid = generateId()
    const enrollmentId = generateId()
    const id = `${program.id}_${enrollmentId}`

    const enrollmentData = {

        id: id,

        programId: program.id,
        programName: program.displayName,
        solutionId: program.solutionId,
        solutionName: program.solutionName,
        clientId: program.clientId,
        clientName: program.clientName,

        memberXid: memberXid,
        groupXid: `${groupLetter}-GG-${groupLetter}`,
        batchXid: `${batchLetter}-BB-${batchLetter}`,
        transactionXid: transactionXid,
        firstName: fname,
        lastName: lname,
        fullName: fullname,
        telephone: phone,
        email: email,
        preferredLanguage: language,
        address1: address1,
        city: city,
        state: state,
        postalCode: postalCode,
        lineOfBusiness: 'health',
        gender: gender,
        test: true,
        dob: dob,
        receivedAt: receivedAt,
        startedAt: startedAt,
        lastContactAt: lastContactAt,
        completedAt: completedAt,
        scubStatus: scubStatus,
        scrubReason: scrubReason,
        excluded: excluded,
        excludedAt: excludedAt,
    }
    return(enrollmentData)
}

const generateEnrollments = async (program, count) => {
    const enrollments = []
    for (let i = 0; i < count; ++i) {

        const enrollment = generateEnrollment(program)
        enrollments.push(enrollment)
    }

    for (let i = 0; i < enrollments.length; ++i) {
        const enrollment = enrollments[i]
        await storeEnrollment(enrollment)
    }

    return(enrollments)
}

/////////////////////////////////////
// outreahes
/////////////////////////////////////

const storeOutreach = async (data) => {

    const COLLECTION_NAME = 'outreaches'

    const entity = {
      id: data.id,

      enrollmentId:     data.enrollmentId,
      outreachId:       data.outreachId,
      outreachName:     data.outreachName,
      programId:        data.programId,
      programName:      data.programName,
      solutionId:       data.solutionId,
      solutionName:     data.solutionName,
      clientId:         data.clientId,
      clientName:       data.clientName,

      memberXid:        data.memberXid,
      transactionXid:   data.transactionXid,
      groupXid:         data.groupXid,

      channel:          data.channel,
      outreachStatus:   data.outreachStatus,
      firstAttemptAt:   data.firstAttemptAt,
      lasdtAttemptAt:   data.lasdtAttemptAt,
      attempts:         data.attempts,
      lastBestResult:   data.lastBestResult,
    }

    const client = clientMap[data.clientId]

    if (!client.outreachInstanceSet) {
        client.outreachInstanceSet = []
    }
    client.outreachInstanceSet.push(data.id)
    outreachInstanceMap[data.id] = Object.assign({}, entity)

    const entityRef = db.collection(COLLECTION_NAME).doc(data.id);
    await entityRef.set(entity);
}

const generateOutreachSet = (program, count) => {

    const enrollmentSet = program.enrollmentSet
    const outreachSet = program.outreachSet

    const outreaches = []
    for (let i = 0; i < count; ++i) {

        // pick a random enrollment from the program
        const enrollmentId = enrollmentSet[faker.random.number(enrollmentSet.length - 1)]
        const enrollment = enrollmentMap.get(enrollmentId)

        const outreachId = outreachSet[faker.random.number(outreachSet.length - 1)]
        const outreachDef = outreachMap.get(outreachId)

        const firstAttemptAt = faker.date.between("2018-01-01", "2020-12-31").toISOString()
        const lasdtAttemptAt = faker.date.between(firstAttemptAt, "2020-12-31").toISOString()
        const outreachStatus = statusSet[faker.random.number(statusSet.length - 1)]

        // TODO: count up outreach results
        const attempts = faker.random.number(3) + 1
        const lastBestResult = resultSet[faker.random.number(resultSet.length - 1)]

        const outreach = {

            id:             generateId(),

            outreachId:     outreachDef.id,
            outreachName:   outreachDef.displayName,
            programId:      outreachDef.id,
            programName:    outreachDef.displayName,
            solutionId:     outreachDef.solutionId,
            solutionName:   outreachDef.solutionName,
            clientId:       outreachDef.clientId,
            clientName:     outreachDef.clientName,

            enrollmentId:   enrollment.id,
            memberXid:      enrollment.memberXid,
            transactionXid: enrollment.transactionXid,
            groupXid:       enrollment.groupXid,

            channel: outreachDef.channel,
            firstAttemptAt,
            lasdtAttemptAt,
            outreachStatus,
            attempts,
            lastBestResult,

        }

        outreaches.push(outreach)
    }
    return(outreaches)
}

const storeOutreachResult = async (data) => {

    const outreach = outreachInstanceMap[data.outreachInstanceId]
    if (!outreach) {
      throw new Error(`outreach not found: ${data.outreachInstanceId}`)
    }

    const COLLECTION_NAME = 'outreachResults'
    const id = generateId()
    const entity = {
        id:             id,

        channel:        data.channel,
        outreachAt:     data.outreachAt,
        outreachResultCategory: data.outreachResultCategory,
        outreachResult: data.outreachResult,
        isLastBest:     data.isLastBest,
        responses:      data.responses,

        enrollmentId:   outreach.enrollmentId,
        memberXid:      outreach.memberXid,
        transactionXid: outreach.transactionXid,
        groupXid:       outreach.groupXid,

        outreachInstanceId: data.outreachInstanceId,
        outreachId:     outreach.outreachId,
        outreachName:   outreach.outreachName,
        programId:      outreach.programId,
        programName:    outreach.programName,
        solutionId:     outreach.solutionId,
        solutionName:   outreach.solutionName,
        clientId:       outreach.clientId,
        clientName:     outreach.clientName,
     }

    const entityRef = db.collection(COLLECTION_NAME).doc(id)
    await entityRef.set(entity);
}

const generateOutreachResultSet = async (outreach, count) => {

    const outreachResults = []
    for (let i = 0; i < count; ++i) {

        const result = resultSet[faker.random.number(resultSet.length - 1)]
        const outreachAt = faker.date.between("2018-01-01", "2020-12-31").toISOString()
        const category = categorySet[faker.random.number(categorySet.length - 1)]
        const id = generateId()

        const responses = [
            {
                ordinal: 1,
                questionCode: "a",
                description: 'how are you?',
                answer: 'good'
            },
            {
                ordinal: 2,
                questionCode: "b",
                description: 'is it noon yet?',
                answer: 'no'
            },
            {
                ordinal: 3,
                questionCode: "cc",
                description: 'are you getting a flu shot?',
                answer: 'yes'
            },
            {
                ordinal: 4,
                questionCode: "drive",
                description: 'do you need a ride?',
                answer: 'yes please'
            }
        ]

        const outreachResult = {
                                    id: id,
                                    outreachInstanceId: outreach.id,

                                    enrollmentId:     outreach.enrollmentId,
                                    outreachId:       outreach.outreachId,
                                    outreachName:     outreach.outreachName,
                                    programId:        outreach.programId,
                                    programName:      outreach.programName,
                                    solutionId:       outreach.solutionId,
                                    solutionName:     outreach.solutionName,
                                    clientId:         outreach.clientId,
                                    clientName:       outreach.clientName,

                                    memberXid:        outreach.memberXid,
                                    transactionXid:   outreach.transactionXid,
                                    groupXid:         outreach.groupXid,

                                    channel:        outreach.channel,

                                    outreachAt:     outreachAt,
                                    outreachResultCategory: category,
                                    outreachResult: result,
                                    isLastBest:     false,
                                    responses:      responses
                            }


        outreachResults.push(outreachResult)
    }

    for (let i = 0; i < outreachResults.length; ++i) {
        const outreachResult = outreachResults[i]
        await storeOutreachResult(outreachResult)
    }

}

const CLIENT_DEFS = 3
const SOLUTION_DEFS = 1
const PROGRAM_DEFS = 2
const OUTREACH_DEFS = 3 //
const ENROLLMENTS_PER_PROGRAM = 30 // 500
const OUTREACHES_PER_PROGRAM = 100 //
const RESULTS_PER_OUTREACH = 5 // 000

const fakeMembers = async () => {

    await generateClientDefs(CLIENT_DEFS)

    await sleep(5000)

    programSet.forEach( async (programId) => {

        const program = programMap[programId]
        const outreaches = generateOutreachSet(program, OUTREACHES_PER_PROGRAM)

        outreaches.forEach( async (outreach) => {
            storeOutreach(outreach)
        })

        outreaches.map( async (outreach) => {
             generateOutreachResultSet(outreach, RESULTS_PER_OUTREACH)
        })

    })


}

module.exports = fakeMembers