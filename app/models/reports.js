'reports strict';
const dbConn = require('../db');

const SubjectUser = require('../models/subject_user')
const Subject = require('../models/subject')
const Mark = require('../models/mark')
const User = require('../models/user')

//Reports object create
var Reports = function(report) {}

Reports.generateSchoolReport = async (data) => {
    const [roles,fff] = await dbConn.query("SELECT * FROM ROLE")

    studentRole = roles.find(role => {
        return role.name === "Mokinys"
    })

    teacherRole = roles.find(role => {
        return role.name === "Mokytojas"
    })
    const students = studentRole ? await User.find({roleId: studentRole.id}) : null
    const teachers = teacherRole ? await User.find({roleId: teacherRole.id}) : null

    let report = {}

    let average
    let schoolAveragesSum = 0
    let notNullCount = 0

    for (let i = 0; i < students.length; i++) {
        const [subjectsCount,fields] = await dbConn.query("SELECT COUNT(id) as count FROM SUBJECT_USER WHERE fk_userId=?", [students[i].id])

        average = await Mark.getAverage({userId: students[i].id})
        students[i].average = average[0].average
        students[i].subjectsCount = subjectsCount[0].count

        if (average[0].average) {
            schoolAveragesSum += Number(average[0].average)
            notNullCount++
        }
    }

    const [schoolSubjects,f] = await dbConn.query("SELECT * FROM SUBJECT")

    report.schoolAverage = schoolAveragesSum/notNullCount
    report.schoolSubjects = schoolSubjects
    report.teachersData = teachers
    report.studentsData = students

    return report
}

module.exports = Reports
